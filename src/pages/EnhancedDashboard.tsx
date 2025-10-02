import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { StatsCard } from "@/components/ui/stats-card";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { 
  Users, Video, CheckCircle, TrendingUp, 
  Calendar, Clock, Award, PlayCircle, Eye,
  ThumbsUp, MessageSquare, Share2, Zap,
  BarChart3, Target, Activity, Bell,
  Sparkles, Trophy, Flame, ChevronUp,
  ChevronDown, RefreshCw, Star, Globe
} from "lucide-react";
import { useState, useEffect } from "react";
import { analyticsService, type AnalyticsData } from "@/services/analytics";
import { youtubeApi } from "@/services/youtubeApi";

const EnhancedDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [channelStats, setChannelStats] = useState<any>(null);

  useEffect(() => {
    // Subscribe to real-time analytics updates
    const unsubscribe = analyticsService.subscribe((data) => {
      setAnalyticsData(data);
      setIsLoading(false);
      setLastUpdate(new Date());
    });

    // Fetch YouTube channel stats
    const fetchChannelStats = async () => {
      try {
        const stats = await youtubeApi.getChannelStats();
        setChannelStats(stats);
      } catch (error) {
        console.error('Error fetching channel stats:', error);
      }
    };

    fetchChannelStats();

    return () => {
      unsubscribe();
      analyticsService.stopRealTimeUpdates();
    };
  }, []);

  const refreshData = () => {
    setIsLoading(true);
    // Trigger a manual update
    window.location.reload();
  };

  if (isLoading || !analyticsData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const quickStats = [
    {
      icon: Users,
      label: "Subscribers",
      value: analyticsData.subscribers,
      change: `+${analyticsData.growthMetrics.subscribersGrowth}%`,
      changeType: "increase" as const,
      color: "text-accent",
      bgColor: "bg-accent/10",
      trend: [65, 78, 82, 94, 87, 95, 100],
    },
    {
      icon: Video,
      label: "Total Videos",
      value: analyticsData.totalVideos,
      change: "+8 this month",
      changeType: "increase" as const,
      color: "text-primary",
      bgColor: "bg-primary/10",
      trend: [45, 52, 68, 71, 75, 78, 82],
    },
    {
      icon: Eye,
      label: "Total Views",
      value: analyticsData.totalViews,
      change: `+${analyticsData.growthMetrics.viewsGrowth}%`,
      changeType: "increase" as const,
      color: "text-success",
      bgColor: "bg-success/10",
      trend: [120, 135, 145, 165, 178, 182, 195],
    },
    {
      icon: TrendingUp,
      label: "Engagement Rate",
      value: `${analyticsData.engagementRate}%`,
      change: `+${analyticsData.growthMetrics.engagementGrowth}%`,
      changeType: "increase" as const,
      color: "text-warning",
      bgColor: "bg-warning/10",
      trend: [3.2, 3.8, 4.1, 4.0, 4.3, 4.1, 4.2],
    },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar />
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Header with Live Updates */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold">Live Dashboard</h1>
                <Badge variant="secondary" className="animate-pulse">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg">
                Real-time analytics for TOMO Academy • Last updated: {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={refreshData}>
                <RefreshCw className="mr-2 w-4 h-4" />
                Refresh
              </Button>
              <Button className="bg-primary hover:bg-primary-hover shadow-glow">
                <Sparkles className="mr-2 w-4 h-4" />
                AI Insights
              </Button>
            </div>
          </div>

          {/* Premium Stats Cards with Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <StatsCard
                key={index}
                icon={stat.icon}
                label={stat.label}
                value={typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
                change={stat.change}
                changeType={stat.changeType}
                trend={stat.trend}
                className={`${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
              />
            ))}
          </div>

          {/* Live Activity Feed & Performance Metrics */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Real-time Activity Feed */}
            <Card className="lg:col-span-2 p-6 bg-card/50 backdrop-blur border-primary/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary animate-pulse" />
                  <h2 className="text-2xl font-bold">Live Activity Feed</h2>
                  <Badge variant="outline" className="ml-2">
                    Real-time
                  </Badge>
                </div>
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {analyticsData.recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer border border-transparent hover:border-primary/30 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {activity.type === 'video_upload' && <Video className="w-4 h-4 text-primary" />}
                      {activity.type === 'subscriber' && <Users className="w-4 h-4 text-accent" />}
                      {activity.type === 'comment' && <MessageSquare className="w-4 h-4 text-success" />}
                      {activity.type === 'like' && <ThumbsUp className="w-4 h-4 text-warning" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium mb-1">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleTimeString()} • {activity.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Activity
              </Button>
            </Card>

            {/* Performance Insights */}
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="flex items-center gap-2 mb-6">
                <Trophy className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold">Performance Insights</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Avg. Watch Time</span>
                    <Badge variant="secondary" className="bg-success/20 text-success">
                      <ChevronUp className="w-3 h-3 mr-1" />
                      {analyticsData.averageWatchTime}min
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold text-success">
                    <AnimatedCounter value={analyticsData.averageWatchTime} />min
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Channel Ranking</span>
                    <Badge variant="secondary" className="bg-primary/20 text-primary">
                      <Star className="w-3 h-3 mr-1" />
                      Top 5%
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    In Educational Technology category
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Global Reach</span>
                    <Globe className="w-4 h-4 text-accent" />
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-accent">47</span> countries
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Top Performing Content */}
          <Card className="p-6 bg-card/50 backdrop-blur border-accent/20">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="w-5 h-5 text-accent animate-pulse" />
              <h2 className="text-2xl font-bold">Top Performing Content</h2>
              <Badge className="ml-2 bg-accent/20 text-accent">Hot</Badge>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {analyticsData.topPerformingVideos.map((video, index) => (
                <Card 
                  key={video.id}
                  className="p-4 bg-gradient-to-br from-muted/30 to-muted/10 border-primary/10 hover:border-primary/30 transition-all hover:shadow-md cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        #{index + 1}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {video.engagement}% engagement
                      </Badge>
                    </div>
                    <PlayCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h4>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {formatNumber(video.views)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

          {/* Quick Actions & Analytics Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <Video className="w-5 h-5" />
                  <span className="text-xs">Upload Video</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="text-xs">Schedule Post</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-xs">View Analytics</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
                  <Target className="w-5 h-5" />
                  <span className="text-xs">Set Goals</span>
                </Button>
              </div>
            </Card>

            {/* Channel Health Score */}
            <Card className="p-6 bg-gradient-to-br from-success/5 to-primary/5">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-success" />
                Channel Health Score
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Score</span>
                    <span className="font-bold text-success">94/100</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-success to-primary w-[94%] transition-all duration-1000" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Content Quality</span>
                    <div className="font-bold text-success">Excellent</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Engagement</span>
                    <div className="font-bold text-primary">Very High</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Upload Consistency</span>
                    <div className="font-bold text-accent">Regular</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Community</span>
                    <div className="font-bold text-warning">Active</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default EnhancedDashboard;