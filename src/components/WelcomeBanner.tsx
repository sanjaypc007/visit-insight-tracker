import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

interface WelcomeBannerProps {
  userId: string;
  firstVisit: string;
}

export const WelcomeBanner = ({ userId, firstVisit }: WelcomeBannerProps) => {
  return (
    <Card className="bg-gradient-primary text-primary-foreground shadow-elevation border-0">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              👋 Welcome! Your visitor ID: <span className="font-mono">{userId}</span>
            </h3>
            <p className="text-primary-foreground/90 text-sm">
              First visit: {firstVisit}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};