import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, Users, Clock, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useAnalytics } from "@/hooks/useAnalytics";

const Insights = () => {
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const { data: analytics, loading, refetch } = useAnalytics('7d', refreshTrigger);
  
  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshTrigger(prev => prev + 1);
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-xl text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-xl text-muted-foreground">Failed to load analytics data</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/')}
            className="border-analytics-primary/20 hover:bg-analytics-primary/5"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Detailed Insights</h1>
            <p className="text-muted-foreground">Advanced analytics and performance metrics</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className={`shadow-card bg-gradient-card border-analytics-primary/20 cursor-pointer transition-all duration-200 hover:shadow-elevation ${selectedMetric === 'bounceRate' ? 'ring-2 ring-analytics-primary' : ''}`}
            onClick={() => setSelectedMetric(selectedMetric === 'bounceRate' ? null : 'bounceRate')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bounce Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-analytics-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.overview.bounceRate}</div>
              <p className="text-xs text-analytics-success">-2.1% from last week</p>
            </CardContent>
          </Card>

          <Card 
            className={`shadow-card bg-gradient-card border-analytics-secondary/20 cursor-pointer transition-all duration-200 hover:shadow-elevation ${selectedMetric === 'pageViews' ? 'ring-2 ring-analytics-secondary' : ''}`}
            onClick={() => setSelectedMetric(selectedMetric === 'pageViews' ? null : 'pageViews')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Page Views
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-analytics-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.overview.totalPageViews}</div>
              <p className="text-xs text-analytics-success">+15.3% from last week</p>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card border-analytics-accent/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Session Duration
              </CardTitle>
              <Clock className="h-4 w-4 text-analytics-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.overview.avgSessionTime}</div>
              <p className="text-xs text-analytics-success">+8.2% from last week</p>
            </CardContent>
          </Card>

          <Card 
            className={`shadow-card bg-gradient-card border-analytics-success/20 cursor-pointer transition-all duration-200 hover:shadow-elevation ${selectedMetric === 'conversions' ? 'ring-2 ring-analytics-success' : ''}`}
            onClick={() => setSelectedMetric(selectedMetric === 'conversions' ? null : 'conversions')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Conversion Rate
              </CardTitle>
              <Users className="h-4 w-4 text-analytics-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{analytics.overview.conversionRate}</div>
              <p className="text-xs text-analytics-warning">-0.5% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Default Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-card bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Traffic Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="hsl(var(--analytics-primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--analytics-primary))" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="uniqueVisitors" 
                    stroke="hsl(var(--analytics-secondary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--analytics-secondary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                Average Session Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="avgTime" 
                    fill="hsl(var(--analytics-accent))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Metric Charts */}
        {selectedMetric && (
          <Card className="shadow-card bg-gradient-card">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
                {selectedMetric === 'bounceRate' && 'Bounce Rate Analysis'}
                {selectedMetric === 'pageViews' && 'Page Views Trend'}
                {selectedMetric === 'conversions' && 'Conversion Rate Trend'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedMetric === 'bounceRate' && (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={analytics.bounceRateData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {analytics.bounceRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
              
              {selectedMetric === 'pageViews' && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                      dataKey="pageViews" 
                      fill="hsl(var(--analytics-secondary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
              
              {selectedMetric === 'conversions' && (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={analytics.chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="conversions" 
                      stroke="hsl(var(--analytics-success))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--analytics-success))", r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Insights;