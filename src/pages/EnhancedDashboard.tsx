import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import { AnimatedCard, GlowCard } from "@/components/ui/animated-card";
import { LoadingSpinner, LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import Navbar from "@/components/Navbar";
import { 
  Users, Video, CheckCircle, TrendingUp, 
  Calendar, Clock, Award, PlayCircle, Eye,
  ThumbsUp, MessageSquare, DollarSign,
  BarChart3, Zap, Target, Activity
} from "lucide-react";
import { useChannelInfo, useYouTubeAnalytics, youtubeService } from "@/services/youtube";

const EnhancedDashboard = () => {
  // Fetch live YouTube data
  const { data: channelInfo, isLoading: channelLoading } = useQuery(useChannelInfo());
  const { data: analytics, isLoading: analyticsLoading } = useQuery(useYouTubeAnalytics());

  const isLoading = channelLoading || analyticsLoading;

  // Mock real-time data for team activities
  const recentActivity = [
    {
      user: "Kanish SJ",
      action: "uploaded new video",
      title: "Firebase Tutorial - Part 5",
      time: "2 hours ago",
      avatar: "KS",
    },
    {
      user: "Kamesh",
      action: "completed design task",
      title: "Thumbnail for Tech Review",
      time: "4 hours ago",
      avatar: "K",
    },
    {
      user: "Ajay Krithick",
      action: "reviewed and approved",
      title: "Script: AI in Education",
      time: "5 hours ago",
      avatar: "AK",
    },
    {
      user: "Nithish",
      action: "started working on",
      title: "Video Editing Project",
      time: "6 hours ago",
      avatar: "N",
    },
  ];

  const upcomingDeadlines = [
    { task: "Edit: React Tutorial Series", due: "Today, 5:00 PM", priority: "high" },
    { task: "Thumbnail Design: Web3 Explained", due: "Tomorrow, 2:00 PM", priority: "medium" },
    { task: "Script Review: Mobile Dev Course", due: "Dec 28, 10:00 AM", priority: "low" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <LoadingSpinnerOverlay isLoading={isLoading}>
        <div className="pt-24 px-4 pb-12">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Welcome back! 👋
                </h1>
                <p className="text-muted-foreground text-lg">
                  Here's what's happening with TOMO Academy today.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Activity className="w-4 h-4" />
                  Live Data
                </Button>
                <Button className="bg-primary hover:bg-primary-hover shadow-glow gap-2">
                  <PlayCircle className="w-4 h-4" />
                  Quick Actions
                </Button>
              </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Subscribers"
                value={channelInfo?.subscriberCount || 125000}
                change={{ value: 3200, label: "this month", isPositive: true }}
                icon={Users}
                iconColor="text-accent"
                iconBgColor="bg-accent/10"
                formatValue={youtubeService.formatNumber}
              />
              
              <StatsCard
                title="Total Views"
                value={channelInfo?.viewCount || 5600000}
                change={{ value: 156000, label: "this week", isPositive: true }}
                icon={Eye}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
                formatValue={youtubeService.formatNumber}
              />
              
              <StatsCard
                title="Videos Published"
                value={channelInfo?.videoCount || 234}
                change={{ value: 8, label: "this month", isPositive: true }}
                icon={Video}
                iconColor="text-success"
                iconBgColor="bg-success/10"
              />
              
              <StatsCard
                title="Engagement Rate"
                value={analytics?.engagement || 87.5}
                change={{ value: 2.3, label: "vs last month", isPositive: true }}
                icon={TrendingUp}
                iconColor="text-warning"
                iconBgColor="bg-warning/10"
                suffix="%"
              />
            </div>

            {/* Revenue & Performance */}
            <div className="grid lg:grid-cols-3 gap-6">
              <GlowCard className="lg:col-span-1" glowColor="success">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-success/10 rounded-lg">
                      <DollarSign className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Monthly Revenue</h3>
                      <p className="text-sm text-muted-foreground">Live tracking</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-success">
                      ${analytics?.revenue?.toLocaleString() || '3,247'}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Ad Revenue</span>
                        <span className="font-medium">$2,156</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Sponsorships</span>
                        <span className="font-medium">$891</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Memberships</span>
                        <span className="font-medium">$200</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlowCard>

              <AnimatedCard className="lg:col-span-2" hoverEffect="glow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold">Performance Metrics</h2>
                    <div className="ml-auto flex items-center gap-2 text-xs text-success">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      Live
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {analytics?.topVideos?.length || 8}
                      </div>
                      <p className="text-sm text-muted-foreground">Videos This Week</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/10 to-success/10">
                      <div className="text-3xl font-bold text-accent mb-2">47</div>
                      <p className="text-sm text-muted-foreground">Tasks Completed</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-success/10 to-warning/10">
                      <div className="text-3xl font-bold text-success mb-2">
                        {youtubeService.formatNumber(analytics?.watchTime || 156000)}
                      </div>
                      <p className="text-sm text-muted-foreground">Watch Time (mins)</p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <AnimatedCard className="lg:col-span-2" hoverEffect="lift">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <h2 className="text-2xl font-bold">Live Activity Feed</h2>
                    </div>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <AnimatedCard 
                        key={index}
                        className="p-4 border-l-4 border-l-primary/20 hover:border-l-primary transition-all"
                        hoverEffect="border"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-white">
                              {activity.avatar}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              <span className="font-semibold">{activity.user}</span>
                              {" "}
                              <span className="text-muted-foreground">{activity.action}</span>
                            </p>
                            <p className="text-sm font-medium mt-1">{activity.title}</p>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <div className="w-1 h-1 bg-success rounded-full" />
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                </div>
              </AnimatedCard>

              {/* Upcoming Deadlines */}
              <AnimatedCard hoverEffect="glow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Target className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold">Deadlines</h2>
                  </div>
                  
                  <div className="space-y-3">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg border-l-4 transition-all hover:shadow-md ${
                          deadline.priority === 'high' 
                            ? 'border-l-destructive bg-destructive/5 hover:bg-destructive/10' 
                            : deadline.priority === 'medium'
                            ? 'border-l-warning bg-warning/5 hover:bg-warning/10'
                            : 'border-l-muted bg-muted/50 hover:bg-muted/70'
                        }`}
                      >
                        <p className="font-medium text-sm mb-2">{deadline.task}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {deadline.due}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4">
                    View All Tasks
                  </Button>
                </div>
              </AnimatedCard>
            </div>

            {/* Top Videos Performance */}
            {analytics?.topVideos && (
              <GlowCard glowColor="primary">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Award className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold">Top Performing Videos</h2>
                    <div className="ml-auto text-xs text-muted-foreground">
                      Updated {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {analytics.topVideos.slice(0, 3).map((video, index) => (
                      <AnimatedCard key={video.id} hoverEffect="scale">
                        <div className="relative aspect-video overflow-hidden bg-muted rounded-t-lg">
                          <img 
                            src={video.thumbnails.medium} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                            #{index + 1}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                            {video.title}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {youtubeService.formatNumber(video.statistics.viewCount)}
                            </div>
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3" />
                              {youtubeService.formatNumber(video.statistics.likeCount)}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {youtubeService.formatNumber(video.statistics.commentCount)}
                            </div>
                          </div>
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                </div>
              </GlowCard>
            )}
          </div>
        </div>
      </LoadingSpinnerOverlay>
    </div>
  );
};

export default EnhancedDashboard;