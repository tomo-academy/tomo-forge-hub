import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import { AnimatedCard, GlowCard } from "@/components/ui/animated-card";
import { LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import Navbar from "@/components/Navbar";
import { resourceService, Resource, ResourceStats } from "@/services/resources";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, Filter, Plus, Download, Eye, Share2, 
  Star, Clock, FileText, Video, Wrench, BookOpen,
  MoreVertical, ExternalLink, Copy, Archive,
  TrendingUp, Users, BarChart3, Activity,
  File, Image, Play, Settings, Globe
} from "lucide-react";

const EnhancedResources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourceStats, setResourceStats] = useState<ResourceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  const categories = ["all", "design", "development", "content", "marketing", "business", "general"];
  const types = ["all", "document", "video", "tool", "template", "guide", "course"];

  // Load resources and stats
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await resourceService.initializeDefaultResources();
        const [resourcesData, statsData] = await Promise.all([
          resourceService.getResources(),
          resourceService.getResourceStats()
        ]);
        setResources(resourcesData);
        setResourceStats(statsData);
      } catch (error) {
        console.error('Failed to load resources:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         resource.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesType = selectedType === "all" || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document':
        return FileText;
      case 'video':
        return Video;
      case 'tool':
        return Wrench;
      case 'template':
        return File;
      case 'guide':
        return BookOpen;
      case 'course':
        return Play;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: Resource['type']) => {
    switch (type) {
      case 'document':
        return 'text-primary';
      case 'video':
        return 'text-accent';
      case 'tool':
        return 'text-success';
      case 'template':
        return 'text-warning';
      case 'guide':
        return 'text-info';
      case 'course':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleDownload = async (resource: Resource) => {
    if (resource.fileUrl) {
      // Increment download count
      await resourceService.incrementDownloadCount(resource.id);
      
      // Download file
      const link = document.createElement('a');
      link.href = resource.fileUrl;
      link.download = resource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  const handleView = async (resource: Resource) => {
    // Increment view count
    await resourceService.incrementViewCount(resource.id);
    
    if (resource.url) {
      window.open(resource.url, '_blank');
    } else if (resource.fileUrl) {
      window.open(resource.fileUrl, '_blank');
    }
  };

  const handleShare = async (resource: Resource) => {
    const shareData = {
      title: resource.title,
      text: resource.description,
      url: resource.url || `https://tomoacademy.com/resources/${resource.id}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(shareData.url);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

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
                  Resource Library
                </h1>
                <p className="text-muted-foreground text-lg">
                  Access tools, templates, guides, and learning materials
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Activity className="w-4 h-4" />
                  Live Data
                </Button>
                <Button className="bg-primary hover:bg-primary-hover shadow-glow gap-2">
                  <Plus className="w-4 h-4" />
                  Add Resource
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard
                title="Total Resources"
                value={resourceStats?.total || 0}
                change={{ value: 5, label: "this month", isPositive: true }}
                icon={Archive}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
              />
              
              <StatsCard
                title="Total Downloads"
                value={resourceStats?.totalDownloads || 0}
                change={{ value: 45, label: "this week", isPositive: true }}
                icon={Download}
                iconColor="text-accent"
                iconBgColor="bg-accent/10"
              />
              
              <StatsCard
                title="Total Views"
                value={resourceStats?.totalViews || 0}
                change={{ value: 123, label: "this week", isPositive: true }}
                icon={Eye}
                iconColor="text-success"
                iconBgColor="bg-success/10"
              />
              
              <StatsCard
                title="Avg Rating"
                value={resourceStats?.averageRating || 0}
                change={{ value: 0.2, label: "vs last month", isPositive: true }}
                icon={Star}
                iconColor="text-warning"
                iconBgColor="bg-warning/10"
                suffix="/5"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources by title, author, or tags..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                
                <select
                  className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Resources Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources.map((resource) => {
                const TypeIcon = getTypeIcon(resource.type);
                
                return (
                  <AnimatedCard key={resource.id} hoverEffect="lift" className="overflow-hidden">
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-muted overflow-hidden">
                      {resource.thumbnailUrl ? (
                        <img 
                          src={resource.thumbnailUrl} 
                          alt={resource.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                          <TypeIcon className={cn("w-12 h-12", getTypeColor(resource.type))} />
                        </div>
                      )}
                      
                      <div className="absolute top-2 left-2">
                        <Badge className="text-xs capitalize">
                          {resource.type}
                        </Badge>
                      </div>
                      
                      <div className="absolute top-2 right-2">
                        <Badge variant="outline" className="text-xs">
                          {resource.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-3">
                      {/* Title and Description */}
                      <div>
                        <h3 className="font-bold text-sm line-clamp-2 mb-1">
                          {resource.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {resource.description}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          {resource.downloadCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {resource.viewCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-warning text-warning" />
                          {resource.rating.toFixed(1)}
                        </div>
                        {resource.size && (
                          <div className="ml-auto">
                            {resource.size}
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {resource.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            +{resource.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Author and Date */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                        <span>by {resource.author}</span>
                        <span>{new Date(resource.lastUpdated).toLocaleDateString()}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleView(resource)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownload(resource)}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(resource)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Resource
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownload(resource)}>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleShare(resource)}>
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(resource.url || `https://tomoacademy.com/resources/${resource.id}`)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                            {resource.url && (
                              <DropdownMenuItem onClick={() => window.open(resource.url, '_blank')}>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Open External
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </AnimatedCard>
                );
              })}
            </div>

            {/* Resource Categories Overview */}
            <GlowCard glowColor="primary">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Resource Categories</h2>
                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(resourceStats?.byCategory || {}).map(([category, count]) => (
                    <AnimatedCard key={category} hoverEffect="glow" className="text-center p-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Archive className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm capitalize">{category}</h3>
                      <p className="text-2xl font-bold text-primary">{count}</p>
                      <p className="text-xs text-muted-foreground">Resources</p>
                    </AnimatedCard>
                  ))}
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      </LoadingSpinnerOverlay>
    </div>
  );
};

export default EnhancedResources;