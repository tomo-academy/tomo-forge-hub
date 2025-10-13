import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, TrendingDown, Eye, ThumbsUp, MessageSquare, 
  Users, Clock, Target, Zap, Award, BarChart3, Activity,
  Calendar, DollarSign, Video, PlayCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyticsData {
  views: number;
  likes: number;
  comments: number;
  subscribers: number;
  watchTime: number;
  engagement: number;
  revenue: number;
  growth: {
    views: number;
    subscribers: number;
    engagement: number;
  };
}

interface AdvancedAnalyticsProps {
  data?: AnalyticsData;
  period?: "today" | "week" | "month" | "year";
}

export function AdvancedAnalytics({ 
  data = {
    views: 5600000,
    likes: 245000,
    comments: 18500,
    subscribers: 125000,
    watchTime: 500000,
    engagement: 87.5,
    revenue: 12450,
    growth: {
      views: 12.5,
      subscribers: 8.3,
      engagement: 5.2
    }
  },
  period = "month"
}: AdvancedAnalyticsProps) {
  
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const metrics = [
    {
      title: "Total Views",
      value: formatNumber(data.views),
      change: data.growth.views,
      icon: Eye,
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: data.growth.views > 0 ? "up" : "down"
    },
    {
      title: "Subscribers",
      value: formatNumber(data.subscribers),
      change: data.growth.subscribers,
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
      trend: data.growth.subscribers > 0 ? "up" : "down"
    },
    {
      title: "Engagement",
      value: `${data.engagement}%`,
      change: data.growth.engagement,
      icon: Activity,
      color: "text-success",
      bgColor: "bg-success/10",
      trend: data.growth.engagement > 0 ? "up" : "down"
    },
    {
      title: "Revenue",
      value: `$${formatNumber(data.revenue)}`,
      change: 15.2,
      icon: DollarSign,
      color: "text-warning",
      bgColor: "bg-warning/10",
      trend: "up"
    }
  ];

  const detailedStats = [
    { label: "Total Likes", value: formatNumber(data.likes), icon: ThumbsUp, color: "text-primary" },
    { label: "Comments", value: formatNumber(data.comments), icon: MessageSquare, color: "text-accent" },
    { label: "Watch Time", value: `${formatNumber(data.watchTime)}m`, icon: Clock, color: "text-success" },
    { label: "Avg View Duration", value: "8.5m", icon: PlayCircle, color: "text-warning" }
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <p className="text-sm text-muted-foreground">Real-time performance insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant={period === "today" ? "default" : "outline"} size="sm">Today</Button>
          <Button variant={period === "week" ? "default" : "outline"} size="sm">Week</Button>
          <Button variant={period === "month" ? "default" : "outline"} size="sm">Month</Button>
          <Button variant={period === "year" ? "default" : "outline"} size="sm">Year</Button>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("p-3 rounded-lg", metric.bgColor)}>
                <metric.icon className={cn("w-6 h-6", metric.color)} />
              </div>
              <Badge 
                variant={metric.trend === "up" ? "default" : "destructive"}
                className="gap-1"
              >
                {metric.trend === "up" ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(metric.change)}%
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
              <p className="text-3xl font-bold">{metric.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Detailed Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {detailedStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-2">
                <div className={cn("p-2 rounded-full bg-muted")}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            Top Performing Content
          </h3>
          <div className="space-y-3">
            {[
              { title: "Firebase Tutorial Series", views: "45.2K", engagement: "92%" },
              { title: "React Hooks Deep Dive", views: "38.7K", engagement: "88%" },
              { title: "TypeScript for Beginners", views: "34.1K", engagement: "85%" }
            ].map((content, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{content.title}</p>
                  <p className="text-xs text-muted-foreground">{content.views} views</p>
                </div>
                <Badge variant="outline">{content.engagement}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-warning" />
            Achievements
          </h3>
          <div className="space-y-3">
            {[
              { title: "100K Subscribers", date: "Achieved", icon: Users },
              { title: "5M Total Views", date: "Achieved", icon: Eye },
              { title: "1K Videos Published", date: "In Progress", icon: Video }
            ].map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <achievement.icon className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{achievement.title}</p>
                  <p className="text-xs text-muted-foreground">{achievement.date}</p>
                </div>
                <Zap className="w-4 h-4 text-warning" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Growth Chart Placeholder */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-success" />
          Growth Trends
        </h3>
        <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Chart visualization coming soon</p>
            <p className="text-sm text-muted-foreground">Integrate with Chart.js or Recharts</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
