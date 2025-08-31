import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  overview: {
    totalSessions: number;
    uniqueVisitors: number;
    avgSessionTime: string;
    bounceRate: string;
    totalPageViews: number;
    conversionRate: string;
  };
  chartData: Array<{
    name: string;
    visits: number;
    uniqueVisitors: number;
    avgTime: number;
    bounceRate: number;
    pageViews: number;
    conversions: number;
  }>;
  bounceRateData: Array<{
    name: string;
    value: number;
    fill: string;
  }>;
  recentSessions: Array<{
    id: string;
    visitor: string;
    pageViews: number;
    duration: string;
    bounceRate: string;
    timestamp: string;
  }>;
}

export const useAnalytics = (timeRange: string = '7d') => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data: result, error: funcError } = await supabase.functions.invoke('get-analytics', {
          body: { timeRange }
        });

        if (funcError) throw funcError;
        if (result.error) throw new Error(result.error);

        setData(result);
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: result, error: funcError } = await supabase.functions.invoke('get-analytics', {
        body: { timeRange }
      });

      if (funcError) throw funcError;
      if (result.error) throw new Error(result.error);

      setData(result);
    } catch (err) {
      console.error('Analytics fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};