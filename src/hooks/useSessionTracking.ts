import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useSessionTracking = (onSessionUpdate?: () => void) => {
  const sessionIdRef = useRef<string>('');
  const startTimeRef = useRef<number>(0);
  const lastActivityRef = useRef<number>(0);

  useEffect(() => {
    // Generate unique session ID
    const visitorId = localStorage.getItem('visitorId') || 
      Math.random().toString(36).substring(2, 15);
    localStorage.setItem('visitorId', visitorId);
    
    sessionIdRef.current = `${visitorId}-${Date.now()}`;
    startTimeRef.current = Date.now();
    lastActivityRef.current = Date.now();

    // Track session start
    const trackSession = async (action: string, timestamp: number = Date.now()) => {
      try {
        await supabase.functions.invoke('track-session', {
          body: {
            sessionId: sessionIdRef.current,
            action,
            timestamp,
            pageUrl: window.location.href,
            userAgent: navigator.userAgent
          }
        });
      } catch (error) {
        console.error('Session tracking error:', error);
      }
    };

    // Start session
    trackSession('start');

    // Track activity
    const updateActivity = () => {
      lastActivityRef.current = Date.now();
      trackSession('update', lastActivityRef.current);
      onSessionUpdate?.();
    };

    // Track user interactions
    const events = ['click', 'scroll', 'keypress', 'mousemove'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackSession('end', Date.now());
      } else {
        trackSession('start', Date.now());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Track page unload
    const handleBeforeUnload = () => {
      trackSession('end', Date.now());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Update session every 30 seconds
    const interval = setInterval(() => {
      trackSession('update');
    }, 30000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearInterval(interval);
      trackSession('end');
    };
  }, []);

  return {
    sessionId: sessionIdRef.current,
    startTime: startTimeRef.current
  };
};