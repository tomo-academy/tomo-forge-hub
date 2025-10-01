import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { 
  Video, Search, Upload, Calendar, Eye, ThumbsUp, 
  MessageSquare, TrendingUp, Filter, MoreVertical,
  Play, Clock, CheckCircle, AlertCircle
} from "lucide-react";
import { useState } from "react";

const Videos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const videos = [
    {
      id: "VID001",
      title: "Complete Firebase Tutorial - Authentication & Firestore",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
      status: "published",
      publishedDate: "2025-09-28",
      duration: "15:34",
      views: 15420,
      likes: 892,
      comments: 134,
      editor: "Nithish",
      thumbnail_designer: "Raaj Nikitaa",
    },
    {
      id: "VID002",
      title: "React Hooks Deep Dive - useState, useEffect, Custom Hooks",
      thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=450&fit=crop",
      status: "published",
      publishedDate: "2025-09-25",
      duration: "22:18",
      views: 23150,
      likes: 1245,
      comments: 289,
      editor: "Nithish",
      thumbnail_designer: "Kamesh",
    },
    {
      id: "VID003",
      title: "Building a Full-Stack App with Next.js 14",
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop",
      status: "scheduled",
      scheduledDate: "2025-10-05",
      duration: "18:45",
      editor: "Ajay Krithick",
      thumbnail_designer: "Raaj Nikitaa",
    },
    {
      id: "VID004",
      title: "CSS Grid vs Flexbox - When to Use What",
      thumbnail: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=450&fit=crop",
      status: "in_progress",
      progress: 65,
      editor: "Nithish",
      thumbnail_designer: "Kamesh",
    },
    {
      id: "VID005",
      title: "TypeScript for Beginners - Complete Guide",
      thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop",
      status: "published",
      publishedDate: "2025-09-20",
      duration: "25:12",
      views: 34280,
      likes: 1876,
      comments: 412,
      editor: "Ajay Krithick",
      thumbnail_designer: "Raaj Nikitaa",
    },
    {
      id: "VID006",
      title: "AI & Machine Learning Basics for Web Developers",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
      status: "planned",
      plannedDate: "2025-10-15",
      scriptWriter: "Haridharuson L.J",
    },
  ];

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

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Video Management</h1>
              <p className="text-muted-foreground text-lg">
                Track, schedule, and analyze all YouTube content
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover shadow-glow">
              <Upload className="mr-2 w-4 h-4" />
              Upload Video
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Video className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">234</p>
                  <p className="text-xs text-muted-foreground">Total Videos</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Eye className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">5.6M</p>
                  <p className="text-xs text-muted-foreground">Total Views</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-success/10 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">+12%</p>
                  <p className="text-xs text-muted-foreground">Growth Rate</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">8m 45s</p>
                  <p className="text-xs text-muted-foreground">Avg Duration</p>
                </div>
              </div>
            </Card>
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
          </div>

          {/* Videos Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card 
                key={video.id}
                className="overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  )}
                  {video.status === "in_progress" && video.progress && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${video.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Status & ID */}
                  <div className="flex items-center justify-between">
                    {getStatusBadge(video.status)}
                    <span className="text-xs text-muted-foreground font-mono">{video.id}</span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm line-clamp-2 min-h-[40px]">
                    {video.title}
                  </h3>

                  {/* Stats (for published videos) */}
                  {video.status === "published" && (
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {formatNumber(video.views || 0)}
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {formatNumber(video.likes || 0)}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {formatNumber(video.comments || 0)}
                      </div>
                    </div>
                  )}

                  {/* Date Info */}
                  <div className="text-xs text-muted-foreground">
                    {video.publishedDate && (
                      <p>Published: {new Date(video.publishedDate).toLocaleDateString()}</p>
                    )}
                    {video.scheduledDate && (
                      <p>Scheduled: {new Date(video.scheduledDate).toLocaleDateString()}</p>
                    )}
                    {video.plannedDate && (
                      <p>Planned: {new Date(video.plannedDate).toLocaleDateString()}</p>
                    )}
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
                    {video.scriptWriter && (
                      <p className="text-muted-foreground">
                        Writer: <span className="text-foreground font-medium">{video.scriptWriter}</span>
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos;
