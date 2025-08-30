import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  color?: "primary" | "secondary" | "accent" | "success";
}

export const AnalyticsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = "primary" 
}: AnalyticsCardProps) => {
  const colorClasses = {
    primary: "border-analytics-primary/20 bg-gradient-card",
    secondary: "border-analytics-secondary/20 bg-gradient-card", 
    accent: "border-analytics-accent/20 bg-gradient-card",
    success: "border-analytics-success/20 bg-gradient-card"
  };

  const iconColorClasses = {
    primary: "text-analytics-primary",
    secondary: "text-analytics-secondary",
    accent: "text-analytics-accent", 
    success: "text-analytics-success"
  };

  return (
    <Card className={`shadow-card hover:shadow-elevation transition-all duration-300 ${colorClasses[color]}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconColorClasses[color]}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
};