import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, TrendingUp, Users, Clock, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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

const mockChartData = [
  { name: 'Mon', visits: 12, uniqueVisitors: 8, avgTime: 45, bounceRate: 24, pageViews: 156, conversions: 3.2 },
  { name: 'Tue', visits: 19, uniqueVisitors: 15, avgTime: 52, bounceRate: 22, pageViews: 189, conversions: 4.1 },
  { name: 'Wed', visits: 8, uniqueVisitors: 6, avgTime: 38, bounceRate: 31, pageViews: 98, conversions: 2.8 },
  { name: 'Thu', visits: 15, uniqueVisitors: 12, avgTime: 67, bounceRate: 19, pageViews: 145, conversions: 3.6 },
  { name: 'Fri', visits: 25, uniqueVisitors: 20, avgTime: 73, bounceRate: 18, pageViews: 267, conversions: 4.8 },
  { name: 'Sat', visits: 18, uniqueVisitors: 14, avgTime: 59, bounceRate: 26, pageViews: 178, conversions: 3.4 },
  { name: 'Sun', visits: 22, uniqueVisitors: 18, avgTime: 81, bounceRate: 21, pageViews: 234, conversions: 4.2 },
];

const bounceRateData = [
  { name: 'Low (0-20%)', value: 35, fill: 'hsl(var(--analytics-success))' },
  { name: 'Medium (21-40%)', value: 45, fill: 'hsl(var(--analytics-warning))' },
  { name: 'High (41%+)', value: 20, fill: 'hsl(var(--analytics-danger))' },
];

const Insights = () => {
  const navigate = useNavigate();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

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
              <div className="text-2xl font-bold text-foreground">24.5%</div>
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
              <div className="text-2xl font-bold text-foreground">1,247</div>
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
              <div className="text-2xl font-bold text-foreground">4:23</div>
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
              <div className="text-2xl font-bold text-foreground">3.2%</div>
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
                <LineChart data={mockChartData}>
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
                <BarChart data={mockChartData}>
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
                      data={bounceRateData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {bounceRateData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
              
              {selectedMetric === 'pageViews' && (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={mockChartData}>
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
                  <LineChart data={mockChartData}>
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