import { Button } from "@/components/ui/button";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { TrafficTable } from "@/components/TrafficTable";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { Eye, Users, Clock, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSessionTracking } from "@/hooks/useSessionTracking";
import { useAnalytics } from "@/hooks/useAnalytics";

const Index = () => {
  const navigate = useNavigate();
  const [sessionTime, setSessionTime] = useState(0);
  
  // Start session tracking
  const { sessionId, startTime } = useSessionTracking();
  
  // Get analytics data
  const { data: analytics, loading: analyticsLoading } = useAnalytics('7d');

  useEffect(() => {
    // Update session time every second
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Website Traffic Analytics
          </h1>
          <p className="text-xl text-muted-foreground">
            Real-time visitor tracking and analysis
          </p>
        </div>

        {/* Welcome Banner */}
        <WelcomeBanner 
          userId={sessionId.split('-')[0]?.substring(0, 8) || 'Loading...'} 
          firstVisit={new Date().toLocaleString()} 
        />

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsCard
            title="Total Sessions"
            value={analyticsLoading ? "Loading..." : analytics?.overview.totalSessions.toString() || "0"}
            subtitle="Total sessions today"
            icon={Eye}
            color="primary"
          />
          <AnalyticsCard
            title="Unique Visitors"
            value={analyticsLoading ? "Loading..." : analytics?.overview.uniqueVisitors.toString() || "0"}
            subtitle="Distinct users"
            icon={Users}
            color="secondary"
          />
          <AnalyticsCard
            title="Avg. Session"
            value={analyticsLoading ? "Loading..." : analytics?.overview.avgSessionTime || "0:00"}
            subtitle="Per session"
            icon={Clock}
            color="accent"
          />
          <AnalyticsCard
            title="Page Views"
            value={analyticsLoading ? "Loading..." : analytics?.overview.totalPageViews.toString() || "0"}
            subtitle="Total page views"
            icon={UserPlus}
            color="success"
          />
        </div>

        {/* Current Session Info */}
        <div className="bg-gradient-secondary rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Current Session</h3>
              <p className="text-sm text-muted-foreground">Time on site: {formatTime(sessionTime)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Session ID</p>
              <p className="font-mono text-sm">{sessionId.substring(0, 8)}...</p>
            </div>
          </div>
        </div>

        {/* Traffic Table */}
        <TrafficTable 
          data={analytics?.recentSessions.map(session => ({
            date: new Date(session.timestamp).toLocaleDateString(),
            visits: session.pageViews,
            uniqueVisitors: 1,
            avgViewTime: session.duration
          })) || []} 
        />

        {/* Show Detailed Insights Button */}
        <div className="text-center">
          <Button 
            className="bg-gradient-primary hover:opacity-90 text-primary-foreground px-8 py-3 text-lg shadow-elevation"
            onClick={() => navigate('/insights')}
          >
            Show Detailed Insights
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
