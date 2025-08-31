import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.32.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { timeRange = '7d' } = await req.json();
    
    const mongoUri = Deno.env.get('MONGODB_URI');
    if (!mongoUri) {
      console.error('MONGODB_URI environment variable not found');
      throw new Error('MongoDB URI not configured');
    }
    
    console.log('Attempting to connect to MongoDB for analytics...');

    const client = new MongoClient();
    await client.connect(mongoUri);
    
    const db = client.database('webtraffic');
    const sessions = db.collection('sessions');

    // Calculate date range
    const now = new Date();
    const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 1;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));

    // Get all sessions in range
    const allSessions = await sessions.find({
      startTime: { $gte: startDate }
    }).toArray();

    // Calculate metrics
    const totalSessions = allSessions.length;
    const uniqueVisitors = new Set(allSessions.map(s => s.sessionId.split('-')[0])).size;
    const totalDuration = allSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    const avgSessionTime = totalSessions > 0 ? Math.round(totalDuration / totalSessions) : 0;
    const bouncedSessions = allSessions.filter(s => s.bounced).length;
    const bounceRate = totalSessions > 0 ? Math.round((bouncedSessions / totalSessions) * 100) : 0;
    const totalPageViews = allSessions.reduce((sum, s) => sum + (s.pageViews || 1), 0);
    const conversionRate = Math.random() * 5; // Mock conversion rate for now

    // Daily breakdown for charts
    const dailyData = [];
    for (let i = daysBack - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const daySessions = allSessions.filter(s => 
        s.startTime >= dayStart && s.startTime < dayEnd
      );
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayUnique = new Set(daySessions.map(s => s.sessionId.split('-')[0])).size;
      const dayDuration = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      const dayAvgTime = daySessions.length > 0 ? Math.round(dayDuration / daySessions.length) : 0;
      const dayBounced = daySessions.filter(s => s.bounced).length;
      const dayBounceRate = daySessions.length > 0 ? Math.round((dayBounced / daySessions.length) * 100) : 0;
      const dayPageViews = daySessions.reduce((sum, s) => sum + (s.pageViews || 1), 0);
      
      dailyData.push({
        name: dayName,
        visits: daySessions.length,
        uniqueVisitors: dayUnique,
        avgTime: dayAvgTime,
        bounceRate: dayBounceRate,
        pageViews: dayPageViews,
        conversions: Math.random() * 5
      });
    }

    // Bounce rate distribution
    const bounceRateData = [
      { 
        name: 'Low (0-20%)', 
        value: allSessions.filter(s => !s.bounced && s.duration > 120).length,
        fill: 'hsl(var(--analytics-success))'
      },
      { 
        name: 'Medium (21-40%)', 
        value: allSessions.filter(s => !s.bounced && s.duration <= 120 && s.duration > 30).length,
        fill: 'hsl(var(--analytics-warning))'
      },
      { 
        name: 'High (41%+)', 
        value: bouncedSessions,
        fill: 'hsl(var(--analytics-danger))'
      }
    ];

    // Recent sessions for table
    const recentSessions = allSessions
      .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
      .slice(0, 10)
      .map(session => ({
        id: session.sessionId,
        visitor: session.sessionId.split('-')[0].substring(0, 8),
        pageViews: session.pageViews || 1,
        duration: `${Math.floor((session.duration || 0) / 60)}:${String((session.duration || 0) % 60).padStart(2, '0')}`,
        bounceRate: session.bounced ? 'Yes' : 'No',
        timestamp: session.startTime.toISOString()
      }));

    await client.close();

    return new Response(JSON.stringify({
      overview: {
        totalSessions,
        uniqueVisitors,
        avgSessionTime: `${Math.floor(avgSessionTime / 60)}:${String(avgSessionTime % 60).padStart(2, '0')}`,
        bounceRate: `${bounceRate}%`,
        totalPageViews,
        conversionRate: `${conversionRate.toFixed(1)}%`
      },
      chartData: dailyData,
      bounceRateData,
      recentSessions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-analytics function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});