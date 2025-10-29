import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import { VideoUploadModal } from "@/components/VideoUploadModal";
import { SEO } from "@/components/SEO";
import Navbar from "@/components/Navbar";
import MiniVideoPlayer from "@/components/MiniVideoPlayer";
import { useChannelVideos, useChannelInfo, youtubeService, YouTubeVideo } from "@/services/youtube";
import { 
  Video, Search, Upload, Calendar, Eye, ThumbsUp, 
  MessageSquare, Play, Clock, User, TrendingUp, ExternalLink,
  Filter, MoreVertical, Edit, Trash2, Share2, Download
} from "lucide-react";

const RealYouTubeVideos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  
  const queryClient = useQueryClient();

  // Fetch real YouTube channel data
  const channelQuery = useQuery(useChannelInfo());
  const videosQuery = useQuery(useChannelVideos(50)); // Get up to 50 videos

  // Filter videos based on search and category
  const filteredVideos = videosQuery.data?.filter(video => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedCategory === "all") return matchesSearch;
    
    // Filter by category based on tags or title
    const categoryMap: { [key: string]: string[] } = {
      tutorial: ["tutorial", "guide", "how to", "learn"],
      react: ["react", "reactjs", "hooks"],
      javascript: ["javascript", "js", "es6"],
      typescript: ["typescript", "ts"],
      web: ["web", "html", "css", "frontend"],
      backend: ["backend", "api", "server", "node"],
      database: ["database", "sql", "mongodb", "firebase"]
    };

    const keywords = categoryMap[selectedCategory] || [];
    const matchesCategory = keywords.some(keyword => 
      video.title.toLowerCase().includes(keyword) ||
      video.tags.some(tag => tag.toLowerCase().includes(keyword))
    );

    return matchesSearch && matchesCategory;
  }) || [];

  // Get unique categories from video tags
  const availableCategories = videosQuery.data ? 
    Array.from(new Set(
      videosQuery.data.flatMap(video => 
        video.tags.map(tag => tag.toLowerCase())
      ).filter(tag => 
        ["tutorial", "react", "javascript", "typescript", "web", "backend", "database"].includes(tag)
      )
    )) : [];

  const formatDuration = (duration: string): string => {
    return youtubeService.formatDuration(duration);
  };

  const formatNumber = (num: number): string => {
    return youtubeService.formatNumber(num);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleVideoUploaded = (newVideo: YouTubeVideo) => {
    // Refresh the videos list after upload
    queryClient.invalidateQueries({ queryKey: ['youtube', 'videos'] });
    setIsUploadModalOpen(false);
  };

  const openYouTubeVideo = (videoId: string) => {
    const video = videosQuery.data?.find(v => v.id === videoId);
    if (video) {
      setSelectedVideo(video);
      setShowVideoPlayer(true);
    }
  };

  const closeVideoPlayer = () => {
    setShowVideoPlayer(false);
    setSelectedVideo(null);
  };

  const openYouTubeInNewTab = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const openYouTubeStudio = () => {
    window.open('https://studio.youtube.com/', '_blank');
  };

  if (videosQuery.isLoading || channelQuery.isLoading) {
    return <LoadingSpinnerOverlay message="Loading your YouTube channel..." />;
  }

  if (videosQuery.error || channelQuery.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <Video className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              YouTube API Error
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Unable to load YouTube channel data. Please check your API configuration.
            </p>
            <Button 
              onClick={() => {
                videosQuery.refetch();
                channelQuery.refetch();
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const channelData = channelQuery.data;
  const totalVideos = videosQuery.data?.length || 0;
  const totalViews = videosQuery.data?.reduce((sum, v) => sum + v.statistics.viewCount, 0) || 0;
  const totalLikes = videosQuery.data?.reduce((sum, v) => sum + v.statistics.likeCount, 0) || 0;
  const totalComments = videosQuery.data?.reduce((sum, v) => sum + v.statistics.commentCount, 0) || 0;

  return (
    <>
      <SEO 
        title={`Videos - ${channelData?.title || 'TOMO Academy'}`}
        description={`Explore ${channelData?.title || 'TOMO Academy'} educational video content and tutorials`}
        canonical="/videos"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        
        <div className="container mx-auto px-4 py-6 pt-20 max-w-7xl">
          {/* Channel Header */}
          {channelData && (
            <div className="mb-8 p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border-0 shadow-lg">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                <img
                  src={channelData.thumbnails.high}
                  alt={channelData.title}
                  className="w-24 h-24 rounded-full object-cover shadow-lg"
                />
                <div className="flex-1 text-center lg:text-left">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {channelData.title}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-2xl">
                    {channelData.description}
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      <User className="w-3 h-3 mr-1" />
                      {formatNumber(channelData.subscriberCount)} subscribers
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <Video className="w-3 h-3 mr-1" />
                      {formatNumber(channelData.videoCount)} videos
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                      <Eye className="w-3 h-3 mr-1" />
                      {formatNumber(channelData.viewCount)} views
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                  <Button
                    variant="outline"
                    onClick={openYouTubeStudio}
                    className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    YouTube Studio
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Controls Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search videos by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="flex border rounded-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <div className="grid grid-cols-2 gap-0.5 w-4 h-4">
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                      <div className="bg-current rounded-sm"></div>
                    </div>
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none border-l"
                  >
                    <div className="flex flex-col gap-0.5 w-4 h-4">
                      <div className="bg-current h-1 rounded-sm"></div>
                      <div className="bg-current h-1 rounded-sm"></div>
                      <div className="bg-current h-1 rounded-sm"></div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Videos</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalVideos}</p>
                    </div>
                    <Video className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(totalViews)}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Likes</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(totalLikes)}
                      </p>
                    </div>
                    <ThumbsUp className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Comments</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {formatNumber(totalComments)}
                      </p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Video Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                  <div className="relative" onClick={() => openYouTubeVideo(video.id)}>
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                      <img
                        src={video.thumbnails.maxres || video.thumbnails.high}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = video.thumbnails.medium || video.thumbnails.default;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                      {video.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(video.publishedAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1 text-gray-400" />
                          {formatNumber(video.statistics.viewCount)}
                        </div>
                        <div className="flex items-center">
                          <ThumbsUp className="w-4 h-4 mr-1 text-gray-400" />
                          {formatNumber(video.statistics.likeCount)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            openYouTubeVideo(video.id);
                          }}
                          className="text-xs"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Play
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            openYouTubeInNewTab(video.id);
                          }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Tags */}
                    {video.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {video.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {video.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{video.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex gap-4" onClick={() => openYouTubeVideo(video.id)}>
                      <div className="relative flex-shrink-0">
                        <div className="w-40 aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden rounded-lg">
                          <img
                            src={video.thumbnails.medium}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 rounded text-xs flex items-center">
                            <Clock className="w-2 h-2 mr-1" />
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                          {video.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                              {formatDate(video.publishedAt)}
                            </div>
                            <div className="flex items-center">
                              <Eye className="w-4 h-4 mr-1 text-gray-400" />
                              {formatNumber(video.statistics.viewCount)}
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="w-4 h-4 mr-1 text-gray-400" />
                              {formatNumber(video.statistics.likeCount)}
                            </div>
                            <div className="flex items-center">
                              <MessageSquare className="w-4 h-4 mr-1 text-gray-400" />
                              {formatNumber(video.statistics.commentCount)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                openYouTubeVideo(video.id);
                              }}
                              className="text-xs"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Play
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                openYouTubeInNewTab(video.id);
                              }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery ? "No videos found" : "No videos available"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {searchQuery 
                  ? "Try adjusting your search terms or category filter" 
                  : "Upload your first video to get started"
                }
              </p>
              {!searchQuery && (
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Video
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Video Upload Modal */}
        <VideoUploadModal
          isOpen={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onVideoUploaded={handleVideoUploaded}
        />

        {/* Mini Video Player */}
        {showVideoPlayer && selectedVideo && (
          <MiniVideoPlayer
            videoId={selectedVideo.id}
            title={selectedVideo.title}
            description={selectedVideo.description}
            onClose={closeVideoPlayer}
          />
        )}
      </div>
    </>
  );
};

export default RealYouTubeVideos;