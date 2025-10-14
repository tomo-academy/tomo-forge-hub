import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { youtubeAnalyticsService, useYouTubeAnalytics } from "@/services/youtubeAnalytics";
import {
  TrendingUp, Users, Eye, ThumbsUp, MessageSquare, DollarSign,
  Video, Clock, Globe, Smartphone, Monitor, Tv, RefreshCw,
  Download, Calendar, BarChart3, PieChart, Activity, Target
} from "lucide-react";
import { cn } from "@/lib/utils";

const ProductionAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  
  const { data: analytics, isLoading, isError, refetch, isFetching } = useQuery(useYouTubeAnalytics());

  const formatNumber = (num: number) => youtubeAnalyticsService.formatNumber(num);
  const formatCurrency = (num: number) => youtubeAnalyticsService.formatCurrency(num);

  const exportData = () => {
    if (!analytics) return;
    
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tomo-analytics-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 px-4 pb-12">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Unable to Load Analytics</h2>
            <p className="text-muted-foreground mb-6">
              There was an error loading the analytics data. Please try again.
            </p>
            <Button onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <LoadingSpinnerOverlay isLoading={isLoading}>
        <div className="pt-24 px-4 pb-12">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  YouTube Analytics
                </h1>
                <p className="text-muted-foreground text-lg">
                  Real-time performance metrics and insights
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="gap-2"
                >
                  <RefreshCw className={cn("w-4 h-4", isFetching && "animate-spin")} />
                  Refresh
                </Button>
                <Button onClick={exportData} variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>

            {/* Period Selector */}
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Time Period:</span>
                <div className="flex gap-2 ml-auto">
                  {(['7d', '30d', '90d', '1y'] as const).map((period) => (
                    <Button
                      key={period}
                      variant={selectedPeriod === period ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedPeriod(period)}
                    >
                      {period === '7d' && '7 Days'}
                      {period === '30d' && '30 Days'}
                      {period === '90d' && '90 Days'}
                      {period === '1y' && '1 Year'}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Views"
                value={formatNumber(analytics?.viewCount || 0)}
                icon={Eye}
                trend="+12.5%"
                trendUp={true}
                color="blue"
              />
              <MetricCard
                title="Subscribers"
                value={formatNumber(analytics?.subscriberCount || 0)}
                icon={Users}
                trend="+8.3%"
                trendUp={true}
                color="green"
              />
              <MetricCard
                title="Total Videos"
                value={analytics?.videoCount || 0}
                icon={Video}
                trend="+2"
                trendUp={true}
                color="purple"
              />
              <MetricCard
                title="Est. Revenue"
                value={formatCurrency(analytics?.estimatedRevenue || 0)}
                icon={DollarSign}
                trend="+15.2%"
                trendUp={true}
                color="yellow"
              />
            </div>

            {/* Engagement Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Total Likes</h3>
                  <ThumbsUp className="w-5 h-5 text-primary" />
                </div>
                <p className="text-3xl font-bold">{formatNumber(analytics?.likes || 0)}</p>
                <p className="text-sm text-muted-foreground mt-1">Across all videos</p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Total Comments</h3>
                  <MessageSquare className="w-5 h-5 text-accent" />
                </div>
                <p className="text-3xl font-bold">{formatNumber(analytics?.comments || 0)}</p>
                <p className="text-sm text-muted-foreground mt-1">Community engagement</p>
              </Card>
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Watch Time</h3>
                  <Clock className="w-5 h-5 text-success" />
                </div>
                <p className="text-3xl font-bold">
                  {formatNumber(analytics?.estimatedMinutesWatched || 0)}m
                </p>
                <p className="text-sm text-muted-foreground mt-1">Total minutes watched</p>
              </Card>
            </div>

            {/* Tabs for Different Views */}
            <Tabs defaultValue="videos" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="videos">Top Videos</TabsTrigger>
                <TabsTrigger value="demographics">Demographics</TabsTrigger>
                <TabsTrigger value="devices">Devices</TabsTrigger>
                <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
              </TabsList>

              {/* Top Videos */}
              <TabsContent value="videos" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Top Performing Videos</h3>
                  <div className="space-y-4">
                    {analytics?.topVideos?.map((video, index) => (
                      <div key={video.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                          #{index + 1}
                        </div>
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-32 h-18 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{video.title}</h4>
                          <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {formatNumber(video.views)}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-4 h-4" />
                              {formatNumber(video.likes)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Demographics */}
              <TabsContent value="demographics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Age Groups
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analytics?.demographics?.ageGroups || {}).map(([age, percentage]) => (
                        <div key={age}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{age}</span>
                            <span className="text-sm text-muted-foreground">{percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary rounded-full h-2 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Top Countries
                    </h3>
                    <div className="space-y-3">
                      {Object.entries(analytics?.demographics?.countries || {}).map(([country, percentage]) => (
                        <div key={country}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{country}</span>
                            <span className="text-sm text-muted-foreground">{percentage}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-accent rounded-full h-2 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </TabsContent>

              {/* Devices */}
              <TabsContent value="devices">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-6">Device Breakdown</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(analytics?.demographics?.devices || {}).map(([device, percentage]) => (
                      <Card key={device} className="p-6 text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                          {device === 'Mobile' && <Smartphone className="w-6 h-6 text-primary" />}
                          {device === 'Desktop' && <Monitor className="w-6 h-6 text-primary" />}
                          {device === 'Tablet' && <Monitor className="w-6 h-6 text-primary" />}
                          {device === 'TV' && <Tv className="w-6 h-6 text-primary" />}
                        </div>
                        <p className="font-semibold">{device}</p>
                        <p className="text-2xl font-bold text-primary mt-2">{percentage}%</p>
                      </Card>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              {/* Traffic Sources */}
              <TabsContent value="traffic">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Traffic Sources</h3>
                  <div className="space-y-3">
                    {Object.entries(analytics?.trafficSources || {}).map(([source, percentage]) => (
                      <div key={source}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{source}</span>
                          <span className="text-sm text-muted-foreground">{percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-primary to-accent rounded-full h-2 transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Recent Videos */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Recent Uploads</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics?.recentVideos?.slice(0, 6).map((video) => (
                  <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-semibold line-clamp-2 mb-2">{video.title}</h4>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {formatNumber(video.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {formatNumber(video.likes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {formatNumber(video.comments)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </LoadingSpinnerOverlay>
    </div>
  );
};

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'yellow';
}

const MetricCard = ({ title, value, icon: Icon, trend, trendUp, color = 'blue' }: MetricCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
    purple: 'bg-purple-500/10 text-purple-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", colorClasses[color])}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <p className="text-3xl font-bold mb-2">{value}</p>
      {trend && (
        <div className="flex items-center gap-1">
          <TrendingUp className={cn("w-4 h-4", trendUp ? "text-green-500" : "text-red-500")} />
          <span className={cn("text-sm font-medium", trendUp ? "text-green-500" : "text-red-500")}>
            {trend}
          </span>
          <span className="text-sm text-muted-foreground ml-1">vs last period</span>
        </div>
      )}
    </Card>
  );
};

export default ProductionAnalytics;
