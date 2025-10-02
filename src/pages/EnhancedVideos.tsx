import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import Navbar from "@/components/Navbar";
import { 
  Video, Search, Upload, Calendar, Eye, ThumbsUp, 
  MessageSquare, TrendingUp, Filter, MoreVertical,
  Play, Clock, CheckCircle, AlertCircle, Globe,
  Share2, Download, Star, Zap, BarChart3,
  RefreshCw, ExternalLink, Youtube, Activity
} from "lucide-react";
import { useState, useEffect } from "react";
import { youtubeApi, type YouTubeVideo, type YouTubeChannelStats } from "@/services/youtubeApi";

const EnhancedVideos = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [channelStats, setChannelStats] = useState<YouTubeChannelStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVideos, setFilteredVideos] = useState<YouTubeVideo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'published' | 'private' | 'unlisted'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'views' | 'engagement'>('date');
  
  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Filter and search videos
    let filtered = videos;
    
    // Apply status filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(video => video.status === selectedFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.viewCount - a.viewCount;
        case 'engagement': {
          const aEngagement = (a.likeCount + a.commentCount) / Math.max(a.viewCount, 1);
          const bEngagement = (b.likeCount + b.commentCount) / Math.max(b.viewCount, 1);
          return bEngagement - aEngagement;
        }
        case 'date':
        default:
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
    });
    
    setFilteredVideos(filtered);
  }, [videos, searchQuery, selectedFilter, sortBy]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load videos and channel stats in parallel
      const [videosData, statsData] = await Promise.all([
        youtubeApi.getChannelVideos(20),
        youtubeApi.getChannelStats()
      ]);
      
      setVideos(videosData);
      setChannelStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="w-3 h-3 mr-1" />Published</Badge>;
      case "private":
        return <Badge variant="secondary"><Eye className="w-3 h-3 mr-1" />Private</Badge>;
      case "unlisted":
        return <Badge variant="outline"><Globe className="w-3 h-3 mr-1" />Unlisted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const calculateEngagement = (video: YouTubeVideo) => {
    if (video.viewCount === 0) return 0;
    return ((video.likeCount + video.commentCount) / video.viewCount * 100).toFixed(2);
  };

  const getPerformanceColor = (engagement: number) => {
    if (engagement > 5) return "text-success";
    if (engagement > 2) return "text-warning";
    return "text-muted-foreground";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-muted-foreground">Loading YouTube data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <Navbar />
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold">Video Analytics</h1>
                <Badge variant="secondary" className="animate-pulse">
                  <Activity className="w-3 h-3 mr-1" />
                  Live Data
                </Badge>
              </div>
              <p className="text-muted-foreground text-lg">
                Real-time YouTube channel analytics and content management
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadData}>
                <RefreshCw className="mr-2 w-4 h-4" />
                Refresh
              </Button>
              <Button className="bg-primary hover:bg-primary-hover shadow-glow">
                <Upload className="mr-2 w-4 h-4" />
                Upload Video
              </Button>
            </div>
          </div>

          {/* Channel Stats Overview */}
          {channelStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-200/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Youtube className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(channelStats.subscriberCount)}</p>
                    <p className="text-xs text-muted-foreground">Subscribers</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Video className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{channelStats.videoCount}</p>
                    <p className="text-xs text-muted-foreground">Total Videos</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <Eye className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{formatNumber(channelStats.viewCount)}</p>
                    <p className="text-xs text-muted-foreground">Total Views</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-success/20 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">+12.3%</p>
                    <p className="text-xs text-muted-foreground">Growth Rate</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search videos by title, description, or tags..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <select 
                className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value as any)}
              >
                <option value="all">All Videos</option>
                <option value="published">Published</option>
                <option value="private">Private</option>
                <option value="unlisted">Unlisted</option>
              </select>
              
              <select 
                className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="date">Sort by Date</option>
                <option value="views">Sort by Views</option>
                <option value="engagement">Sort by Engagement</option>
              </select>
              
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredVideos.length} of {videos.length} videos
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-4 h-4" />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => {
              const engagement = parseFloat(calculateEngagement(video));
              
              return (
                <Card 
                  key={video.id}
                  className="overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer bg-card/50 backdrop-blur"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                    <div className="absolute top-2 right-2">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="h-8 w-8 bg-black/50 hover:bg-black/70"
                        onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Status & Performance */}
                    <div className="flex items-center justify-between">
                      {getStatusBadge(video.status)}
                      <Badge 
                        variant="outline" 
                        className={getPerformanceColor(engagement)}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {engagement}% engagement
                      </Badge>
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-sm line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(video.viewCount)}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {formatNumber(video.likeCount)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {formatNumber(video.commentCount)}
                      </div>
                    </div>

                    {/* Date & Tags */}
                    <div className="text-xs text-muted-foreground">
                      <p className="mb-1">
                        Published: {new Date(video.publishedAt).toLocaleDateString()}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {video.tags.slice(0, 3).map((tag, idx) => (
                          <Badge 
                            key={idx} 
                            variant="outline" 
                            className="text-xs px-1 py-0 h-4"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {video.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                            +{video.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <BarChart3 className="w-3 h-3 mr-1" />
                        Analytics
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Load More */}
          {filteredVideos.length > 0 && (
            <div className="text-center">
              <Button variant="outline" size="lg">
                Load More Videos
              </Button>
            </div>
          )}

          {/* No Results */}
          {filteredVideos.length === 0 && searchQuery && (
            <div className="text-center py-12">
              <Video className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No videos found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedVideos;