import { Button } from "@/components/ui/button";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { TrafficTable } from "@/components/TrafficTable";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { Eye, Users, Clock, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [startTime] = useState(Date.now());
  const [sessionTime, setSessionTime] = useState(0);

  // Generate or retrieve user ID
  useEffect(() => {
    let storedUserId = localStorage.getItem("analyticsUserId");
    if (!storedUserId) {
      storedUserId = generateUserId();
      localStorage.setItem("analyticsUserId", storedUserId);
      localStorage.setItem("firstVisit", new Date().toLocaleString());
    }
    setUserId(storedUserId);

    // Track session time
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const generateUserId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const firstVisit = localStorage.getItem("firstVisit") || new Date().toLocaleString();

  // Mock data - in real app this would come from your backend
  const mockTrafficData = [];

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
        <WelcomeBanner userId={userId} firstVisit={firstVisit} />

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnalyticsCard
            title="Today's Visits"
            value="0"
            subtitle="Total page loads"
            icon={Eye}
            color="primary"
          />
          <AnalyticsCard
            title="Unique Visitors"
            value="0"
            subtitle="Distinct users today"
            icon={Users}
            color="secondary"
          />
          <AnalyticsCard
            title="Avg. View Time"
            value="0s"
            subtitle="Per visit"
            icon={Clock}
            color="accent"
          />
          <AnalyticsCard
            title="New Visitors"
            value="0"
            subtitle="First-time users"
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
              <p className="font-mono text-sm">{userId}</p>
            </div>
          </div>
        </div>

        {/* Traffic Table */}
        <TrafficTable data={mockTrafficData} />

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
