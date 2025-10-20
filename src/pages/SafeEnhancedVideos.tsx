import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import { SEO } from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { 
  Video, Search, Upload, Calendar, Eye, ThumbsUp, 
  MessageSquare, Play, Clock, User, TrendingUp
} from "lucide-react";

interface VideoData {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnail: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
}

const SafeEnhancedVideos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock video data for demonstration
  const mockVideos: VideoData[] = [
    {
      id: "1",
      title: "Advanced React Patterns and Best Practices",
      description: "Learn modern React patterns including hooks, context, and performance optimization techniques.",
      publishedAt: "2025-10-15T10:00:00Z",
      thumbnail: "/api/placeholder/320/180",
      duration: "15:30",
      viewCount: 12500,
      likeCount: 890,
      commentCount: 145
    },
    {
      id: "2", 
      title: "TypeScript for Modern Web Development",
      description: "Master TypeScript fundamentals and advanced features for building robust applications.",
      publishedAt: "2025-10-12T14:30:00Z",
      thumbnail: "/api/placeholder/320/180",
      duration: "22:15",
      viewCount: 8200,
      likeCount: 654,
      commentCount: 89
    },
    {
      id: "3",
      title: "Building Responsive UI with Tailwind CSS",
      description: "Create beautiful, responsive user interfaces using Tailwind CSS utility classes.",
      publishedAt: "2025-10-08T09:15:00Z",
      thumbnail: "/api/placeholder/320/180",
      duration: "18:45",
      viewCount: 15600,
      likeCount: 1200,
      commentCount: 203
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setVideos(mockVideos);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <LoadingSpinnerOverlay message="Loading videos..." />;
  }

  return (
    <>
      <SEO 
        title="Videos - TOMO Academy"
        description="Explore our educational video content and tutorials"
        canonical="/videos"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        
        <div className="container mx-auto px-4 py-6 pt-20 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Video className="w-8 h-8 mr-3 text-blue-500" />
                  Educational Videos
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Explore our comprehensive video library of tutorials and educational content
                </p>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full lg:w-auto">
                <Upload className="w-4 h-4 mr-2" />
                Upload Video
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                />
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
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{videos.length}</p>
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
                      {formatNumber(videos.reduce((sum, v) => sum + v.viewCount, 0))}
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
                      {formatNumber(videos.reduce((sum, v) => sum + v.likeCount, 0))}
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
                      {formatNumber(videos.reduce((sum, v) => sum + v.commentCount, 0))}
                    </p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative">
                  <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                          <svg width="320" height="180" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="100%" fill="#e5e7eb"/>
                            <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#6b7280" font-family="Arial, sans-serif" font-size="16">Video Thumbnail</text>
                          </svg>
                        `)}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {video.duration}
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
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1 text-gray-400" />
                        {formatNumber(video.viewCount)}
                      </div>
                      <div className="flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-1 text-gray-400" />
                        {formatNumber(video.likeCount)}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1 text-gray-400" />
                        {formatNumber(video.commentCount)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No videos found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchQuery ? "Try adjusting your search terms" : "No videos available at the moment"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SafeEnhancedVideos;