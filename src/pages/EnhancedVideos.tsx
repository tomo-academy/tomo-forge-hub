import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import { AnimatedCard, GlowCard } from "@/components/ui/animated-card";
import { LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import Navbar from "@/components/Navbar";
import { 
  Video, Search, Upload, Calendar, Eye, ThumbsUp, 
  MessageSquare, TrendingUp, Filter, MoreVertical,
  Play, Clock, CheckCircle, AlertCircle, Activity,
  BarChart3, Zap, Target, DollarSign, Copy, Share2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChannelVideos, useYouTubeAnalytics, youtubeService } from "@/services/youtube";

const EnhancedVideos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [maxResults, setMaxResults] = useState(20);
  
  // Fetch live YouTube data
  const { data: videos, isLoading: videosLoading, refetch } = useQuery(useChannelVideos(maxResults));
  const { data: analytics, isLoading: analyticsLoading } = useQuery(useYouTubeAnalytics());

  const isLoading = videosLoading || analyticsLoading;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Published</Badge>;
      case "scheduled":
        return <Badge className="bg-accent text-accent-foreground"><Clock className="w-3 h-3 mr-1" />Scheduled</Badge>;
      case "in_progress":
        return <Badge className="bg-warning text-warning-foreground"><Play className="w-3 h-3 mr-1" />In Progress</Badge>;
      case "planned":
        return <Badge variant="outline"><Calendar className="w-3 h-3 mr-1" />Planned</Badge>;
      default:
        return null;
    }
  };

  // Mock additional data for videos not in API response
  const enhancedVideos = videos?.map((video, index) => ({
    ...video,
    status: "published",
    editor: ["Nithish", "Ajay Krithick", "Dev"][index % 3],
    thumbnail_designer: ["Raaj Nikitaa", "Kamesh", "Raaj Nikitaa"][index % 3],
    duration: youtubeService.formatDuration(video.duration),
  })) || [];

  const filteredVideos = enhancedVideos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.editor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.thumbnail_designer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  Video Management
                </h1>
                <p className="text-muted-foreground text-lg">
                  Track, schedule, and analyze all YouTube content with live data
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Activity className="w-4 h-4" />
                  Live Analytics
                </Button>
                <Button className="bg-primary hover:bg-primary-hover shadow-glow gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Video
                </Button>
              </div>
            </div>

            {/* Live Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Videos"
                value={videos?.length || 234}
                change={{ value: 8, label: "this month", isPositive: true }}
                icon={Video}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
              />
              
              <StatsCard
                title="Total Views"
                value={analytics?.views || 5600000}
                change={{ value: 156000, label: "this week", isPositive: true }}
                icon={Eye}
                iconColor="text-accent"
                iconBgColor="bg-accent/10"
                formatValue={youtubeService.formatNumber}
              />
              
              <StatsCard
                title="Engagement Rate"
                value={analytics?.engagement || 87.5}
                change={{ value: 2.3, label: "vs last month", isPositive: true }}
                icon={TrendingUp}
                iconColor="text-success"
                iconBgColor="bg-success/10"
                suffix="%"
              />
              
              <StatsCard
                title="Avg Duration"
                value={8.75}
                change={{ value: 0.5, label: "minutes", isPositive: true }}
                icon={Clock}
                iconColor="text-warning"
                iconBgColor="bg-warning/10"
                suffix="m"
              />
            </div>

            {/* Performance Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <GlowCard className="lg:col-span-2" glowColor="primary">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <h2 className="text-2xl font-bold">Performance Analytics</h2>
                    <div className="ml-auto flex items-center gap-2 text-xs text-success">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      Live Data
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-accent/10">
                      <div className="text-3xl font-bold text-primary mb-2">
                        {youtubeService.formatNumber(analytics?.views || 5600000)}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/10 to-success/10">
                      <div className="text-3xl font-bold text-accent mb-2">
                        {youtubeService.formatNumber(analytics?.watchTime || 500000)}
                      </div>
                      <p className="text-sm text-muted-foreground">Watch Time (mins)</p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-gradient-to-br from-success/10 to-warning/10">
                      <div className="text-3xl font-bold text-success mb-2">
                        {analytics?.engagement?.toFixed(1) || '87.5'}%
                      </div>
                      <p className="text-sm text-muted-foreground">Engagement</p>
                    </div>
                  </div>
                </div>
              </GlowCard>

              <AnimatedCard hoverEffect="glow">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-success/10 rounded-lg">
                      <DollarSign className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Video Revenue</h3>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="text-3xl font-bold text-success">
                      ${analytics?.revenue?.toLocaleString() || '3,247'}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Top Video</span>
                        <span className="font-medium">$892</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Average/Video</span>
                        <span className="font-medium">$13.87</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Growth</span>
                        <span className="font-medium text-success">+12.3%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search videos by title, ID, or team member..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Schedule
              </Button>
              <Button variant="outline" className="gap-2">
                <Target className="w-4 h-4" />
                Analytics
              </Button>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredVideos.map((video, index) => (
                <AnimatedCard 
                  key={video.id}
                  hoverEffect="lift"
                  className="overflow-hidden group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img 
                      src={video.thumbnails.high || video.thumbnails.medium} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded">
                      Live Data
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Status & Published Date */}
                    <div className="flex items-center justify-between">
                      {getStatusBadge(video.status)}
                      <span className="text-xs text-muted-foreground">
                        {new Date(video.publishedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm line-clamp-2 min-h-[40px]">
                      {video.title}
                    </h3>

                    {/* Live Stats */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span className="font-medium">
                          {youtubeService.formatNumber(video.statistics.viewCount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span className="font-medium">
                          {youtubeService.formatNumber(video.statistics.likeCount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span className="font-medium">
                          {youtubeService.formatNumber(video.statistics.commentCount)}
                        </span>
                      </div>
                    </div>

                    {/* Team */}
                    <div className="pt-2 border-t border-border text-xs">
                      {video.editor && (
                        <p className="text-muted-foreground">
                          Editor: <span className="text-foreground font-medium">{video.editor}</span>
                        </p>
                      )}
                      {video.thumbnail_designer && (
                        <p className="text-muted-foreground">
                          Designer: <span className="text-foreground font-medium">{video.thumbnail_designer}</span>
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, '_blank')}
                      >
                        View Analytics
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, '_blank')}>
                            <Eye className="w-4 h-4 mr-2" />
                            Watch Video
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.open(`https://studio.youtube.com/video/${video.id}/analytics`, '_blank')}>
                            <BarChart3 className="w-4 h-4 mr-2" />
                            YouTube Analytics
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(`https://youtube.com/watch?v=${video.id}`)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigator.share?.({ 
                            title: video.title, 
                            url: `https://youtube.com/watch?v=${video.id}` 
                          })}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Video
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {/* Load More */}
            {filteredVideos.length > 0 && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                  onClick={() => {
                    setMaxResults(prev => prev + 10);
                    refetch();
                  }}
                >
                  <Zap className="w-4 h-4" />
                  Load More Videos
                </Button>
              </div>
            )}
          </div>
        </div>
      </LoadingSpinnerOverlay>
    </div>
  );
};

export default EnhancedVideos;