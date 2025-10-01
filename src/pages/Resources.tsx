import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { 
  FolderOpen, FileText, Image, Video, Music, 
  Download, Upload, Search, Filter, MoreVertical,
  File, Calendar, User
} from "lucide-react";
import { useState } from "react";

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const folders = [
    { name: "Scripts", icon: FileText, count: 45, color: "text-accent" },
    { name: "Thumbnails", icon: Image, count: 234, color: "text-primary" },
    { name: "B-Roll", icon: Video, count: 156, color: "text-warning" },
    { name: "Music", icon: Music, count: 89, color: "text-success" },
    { name: "Templates", icon: File, count: 23, color: "text-muted-foreground" },
    { name: "Assets", icon: FolderOpen, count: 67, color: "text-accent" },
  ];

  const recentFiles = [
    {
      id: "RES-001",
      name: "React-Hooks-Thumbnail-Final.psd",
      type: "image",
      size: "15.2 MB",
      uploadedBy: "Raaj Nikitaa",
      uploadedDate: "2025-09-28",
      category: "Thumbnails",
      downloads: 12,
    },
    {
      id: "RES-002",
      name: "Firebase-Tutorial-Script-v3.docx",
      type: "document",
      size: "245 KB",
      uploadedBy: "Nithyasri",
      uploadedDate: "2025-09-27",
      category: "Scripts",
      downloads: 8,
    },
    {
      id: "RES-003",
      name: "Tech-Background-Loop.mp4",
      type: "video",
      size: "128 MB",
      uploadedBy: "Nithish",
      uploadedDate: "2025-09-26",
      category: "B-Roll",
      downloads: 23,
    },
    {
      id: "RES-004",
      name: "Intro-Music-Upbeat.mp3",
      type: "audio",
      size: "4.8 MB",
      uploadedBy: "Dev",
      uploadedDate: "2025-09-25",
      category: "Music",
      downloads: 34,
    },
    {
      id: "RES-005",
      name: "Thumbnail-Template-Tech.fig",
      type: "design",
      size: "8.9 MB",
      uploadedBy: "Kamesh",
      uploadedDate: "2025-09-24",
      category: "Templates",
      downloads: 45,
    },
    {
      id: "RES-006",
      name: "Brand-Style-Guide-2025.pdf",
      type: "document",
      size: "12.5 MB",
      uploadedBy: "Kamesh",
      uploadedDate: "2025-09-23",
      category: "Assets",
      downloads: 28,
    },
  ];

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4" />;
      case "document":
        return <FileText className="w-4 h-4" />;
      case "video":
        return <Video className="w-4 h-4" />;
      case "audio":
        return <Music className="w-4 h-4" />;
      case "design":
        return <File className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      image: "bg-primary/10 text-primary",
      document: "bg-accent/10 text-accent",
      video: "bg-warning/10 text-warning",
      audio: "bg-success/10 text-success",
      design: "bg-muted text-muted-foreground",
    };
    return colors[type as keyof typeof colors] || colors.design;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Resource Library</h1>
              <p className="text-muted-foreground text-lg">
                Centralized hub for all creative assets and templates
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover shadow-glow">
              <Upload className="mr-2 w-4 h-4" />
              Upload Files
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">614</p>
              <p className="text-sm text-muted-foreground mt-1">Total Files</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-accent">23.4 GB</p>
              <p className="text-sm text-muted-foreground mt-1">Storage Used</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-success">156</p>
              <p className="text-sm text-muted-foreground mt-1">This Month</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-warning">6</p>
              <p className="text-sm text-muted-foreground mt-1">Categories</p>
            </Card>
          </div>

          {/* Folders */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Folders</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {folders.map((folder, index) => (
                <Card 
                  key={index}
                  className="p-6 text-center hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-lg bg-${folder.color.split('-')[1]}/10 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <folder.icon className={`w-6 h-6 ${folder.color}`} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{folder.name}</h3>
                  <p className="text-xs text-muted-foreground">{folder.count} files</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search files by name, type, or uploader..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>

          {/* Recent Files */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recent Files</h2>
            <div className="space-y-3">
              {recentFiles.map((file) => (
                <Card 
                  key={file.id}
                  className="p-4 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-lg ${getTypeBadge(file.type)} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      {getFileIcon(file.type)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">{file.name}</h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="font-mono">{file.id}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs">
                              {file.category}
                            </Badge>
                            <span>•</span>
                            <span>{file.size}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {file.uploadedBy}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(file.uploadedDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {file.downloads} downloads
                          </div>
                        </div>

                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="w-3 h-3" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
