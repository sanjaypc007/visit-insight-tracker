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
    const { sessionId, action, timestamp, pageUrl, userAgent } = await req.json();
    
    const mongoUri = Deno.env.get('MONGODB_URI');
    if (!mongoUri) {
      throw new Error('MongoDB URI not configured');
    }

    const client = new MongoClient();
    await client.connect(mongoUri);
    
    const db = client.database('webtraffic');
    const sessions = db.collection('sessions');

    if (action === 'start') {
      // Create new session
      await sessions.insertOne({
        sessionId,
        startTime: new Date(timestamp),
        lastActivity: new Date(timestamp),
        pageUrl,
        userAgent,
        isActive: true,
        duration: 0,
        pageViews: 1,
        bounced: false
      });
    } else if (action === 'update') {
      // Update existing session
      const session = await sessions.findOne({ sessionId });
      if (session) {
        const duration = Math.floor((timestamp - session.startTime.getTime()) / 1000);
        const hasNavigated = pageUrl !== session.pageUrl;
        
        await sessions.updateOne(
          { sessionId },
          {
            $set: {
              lastActivity: new Date(timestamp),
              duration,
              bounced: duration < 30 && !hasNavigated,
              pageViews: hasNavigated ? session.pageViews + 1 : session.pageViews
            }
          }
        );
      }
    } else if (action === 'end') {
      // End session
      await sessions.updateOne(
        { sessionId },
        {
          $set: {
            isActive: false,
            endTime: new Date(timestamp)
          }
        }
      );
    }

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in track-session function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});