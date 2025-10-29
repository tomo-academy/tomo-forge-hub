import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import { AnimatedCard, GlowCard } from "@/components/ui/animated-card";
import { LoadingSpinner, LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import { ProgressRing, DonutChart, TrendLine } from "@/components/ui/charts";
import Navbar from "@/components/Navbar";
import { 
  Users, Video, CheckCircle, TrendingUp, 
  Calendar, Clock, Award, PlayCircle, Eye,
  ThumbsUp, MessageSquare, DollarSign,
  BarChart3, Zap, Target, Activity as ActivityIcon, Database,
  Wifi, RefreshCw, Youtube, Brain
} from "lucide-react";
import { useChannelInfo, useYouTubeAnalytics, youtubeService } from "@/services/youtube";
import { neonService, Revenue, Activity, Analytics } from "@/services/neonService";

const EnhancedDashboard = () => {
  // State for NeonDB data
  const [revenue, setRevenue] = useState<Revenue | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [neonAnalytics, setNeonAnalytics] = useState<Analytics | null>(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Fetch live YouTube data
  const { data: channelInfo, isLoading: channelLoading } = useQuery(useChannelInfo());
  const { data: analytics, isLoading: analyticsLoading } = useQuery(useYouTubeAnalytics());

  const isLoading = channelLoading || analyticsLoading || isDataLoading;

  // Initialize NeonDB data
  useEffect(() => {
    const initializeData = async () => {
      try {
        const [revenueData, activitiesData, analyticsData] = await Promise.all([
          neonService.getCurrentMonthRevenue(),
          neonService.getRecentActivities(10),
          neonService.getTodayAnalytics()
        ]);

        setRevenue(revenueData);
        setActivities(activitiesData);
        setNeonAnalytics(analyticsData);
      } catch (error) {
        console.error('Failed to initialize data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    initializeData();
  }, []);

  // Format activities for display
  const formatActivities = (activities: Activity[]) => {
    return activities.map(activity => ({
      user: activity.userName,
      action: activity.action,
      title: activity.title,
      time: formatTimeAgo(new Date(activity.timestamp)),
      avatar: activity.userName.split(' ').map(n => n[0]).join(''),
      type: activity.type
    }));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const recentActivity = formatActivities(activities);

  const upcomingDeadlines = [
    { task: "Edit: React Tutorial Series", due: "Today, 5:00 PM", priority: "high" },
    { task: "Thumbnail Design: Web3 Explained", due: "Tomorrow, 2:00 PM", priority: "medium" },
    { task: "Script Review: Mobile Dev Course", due: "Dec 28, 10:00 AM", priority: "low" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <LoadingSpinnerOverlay isLoading={isLoading}>
        <div className="pt-24 px-4 pb-12 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
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
                  <ActivityIcon className="w-4 h-4" />
                  Live Data
                </Button>
                <Button className="bg-primary hover:bg-primary-hover shadow-glow gap-2">
                  <PlayCircle className="w-4 h-4" />
                  Quick Actions
                </Button>
              </div>
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <GlowCard className="lg:col-span-1" glowColor="success">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-success/10 rounded-lg">
                      <DollarSign className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Monthly Revenue</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Database className="w-3 h-3" />
                        NeonDB Data
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-success">
                      ${revenue?.totalRevenue?.toLocaleString() || '3,247'}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Ad Revenue</span>
                        <span className="font-medium">${revenue?.adRevenue?.toLocaleString() || '2,156'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Sponsorships</span>
                        <span className="font-medium">${revenue?.sponsorships?.toLocaleString() || '891'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Memberships</span>
                        <span className="font-medium">${revenue?.memberships?.toLocaleString() || '200'}</span>
                      </div>
                      {revenue?.courses && revenue.courses > 0 && (
                        <div className="flex justify-between text-sm">
                          <span>Courses</span>
                          <span className="font-medium">${revenue.courses.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Revenue Chart */}
                    <div className="pt-4 border-t border-border">
                      <DonutChart
                        data={[
                          { label: 'Ad Revenue', value: revenue?.adRevenue || 2156, color: 'hsl(var(--success))' },
                          { label: 'Sponsorships', value: revenue?.sponsorships || 891, color: 'hsl(var(--primary))' },
                          { label: 'Memberships', value: revenue?.memberships || 200, color: 'hsl(var(--accent))' },
                          { label: 'Courses', value: revenue?.courses || 0, color: 'hsl(var(--warning))' }
                        ]}
                        size={120}
                        showLabels={false}
                      />
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
                      <Wifi className="w-3 h-3 animate-pulse" />
                      Live Data
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10 relative overflow-hidden">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {neonAnalytics?.videosPublished || channelInfo?.videoCount || 234}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Videos</p>
                      <div className="absolute top-2 right-2">
                        <ProgressRing 
                          value={neonAnalytics?.videosPublished || 234} 
                          max={300} 
                          size={40} 
                          strokeWidth={3}
                        />
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/10 to-success/10 relative overflow-hidden">
                      <div className="text-3xl font-bold text-accent mb-2">
                        {neonAnalytics?.tasksCompleted || 89}
                      </div>
                      <p className="text-sm text-muted-foreground">Tasks Completed</p>
                      <div className="absolute top-2 right-2">
                        <ProgressRing 
                          value={neonAnalytics?.tasksCompleted || 89} 
                          max={100} 
                          size={40} 
                          strokeWidth={3}
                        />
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-success/10 to-warning/10 relative overflow-hidden">
                      <div className="text-3xl font-bold text-success mb-2">
                        {neonAnalytics?.teamProductivity?.toFixed(1) || '92.3'}%
                      </div>
                      <p className="text-sm text-muted-foreground">Team Productivity</p>
                      <div className="absolute top-2 right-2">
                        <ProgressRing 
                          value={neonAnalytics?.teamProductivity || 92.3} 
                          max={100} 
                          size={40} 
                          strokeWidth={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Analytics Trend */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">Weekly Trend</h3>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <RefreshCw className="w-3 h-3" />
                        Refresh
                      </Button>
                    </div>
                    <TrendLine 
                      data={[65, 72, 68, 85, 89, 92, neonAnalytics?.teamProductivity || 92]} 
                      width={400} 
                      height={60}
                      color="hsl(var(--primary))"
                    />
                  </div>
                </div>
              </AnimatedCard>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
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

            {/* Creator Pulse Integration */}
            <GlowCard glowColor="secondary">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Youtube className="w-5 h-5 text-secondary" />
                  <h2 className="text-2xl font-bold">Creator Pulse Analytics</h2>
                  <div className="ml-auto">
                    <Button 
                      size="sm" 
                      onClick={() => window.location.href = '/creator-pulse'}
                      className="bg-gradient-to-r from-secondary to-primary text-white"
                    >
                      Open Full Dashboard
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <AnimatedCard hoverEffect="scale">
                    <div className="p-4 text-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <BarChart3 className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-sm">AI Analytics</h3>
                      <p className="text-xs text-muted-foreground">8+ Analysis Types</p>
                    </div>
                  </AnimatedCard>
                  
                  <AnimatedCard hoverEffect="scale">
                    <div className="p-4 text-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Video className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-sm">Video Projects</h3>
                      <p className="text-xs text-muted-foreground">Team Management</p>
                    </div>
                  </AnimatedCard>
                  
                  <AnimatedCard hoverEffect="scale">
                    <div className="p-4 text-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Brain className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-sm">AI Content</h3>
                      <p className="text-xs text-muted-foreground">GPT-4 Powered</p>
                    </div>
                  </AnimatedCard>
                  
                  <AnimatedCard hoverEffect="scale">
                    <div className="p-4 text-center">
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-sm">Growth Tracking</h3>
                      <p className="text-xs text-muted-foreground">Real-time Updates</p>
                    </div>
                  </AnimatedCard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Latest AI Insights</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Engagement up 23% this month</li>
                      <li>• Optimal upload time: Tuesday 2PM</li>
                      <li>• Trending: React tutorials +89%</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Growth Predictions</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>3 Month Target:</span>
                        <span className="font-medium">450K subs</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Success Rate:</span>
                        <span className="font-medium text-green-600">87%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlowCard>

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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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