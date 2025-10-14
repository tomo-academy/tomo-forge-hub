// Resources Management Service for TOMO Academy

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'tool' | 'template' | 'guide' | 'course';
  category: 'design' | 'development' | 'content' | 'marketing' | 'business' | 'general';
  url?: string;
  fileUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  author: string;
  authorId: string;
  isPublic: boolean;
  downloadCount: number;
  viewCount: number;
  rating: number;
  ratingCount: number;
  size?: string;
  duration?: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceStats {
  total: number;
  byType: { [key: string]: number };
  byCategory: { [key: string]: number };
  totalDownloads: number;
  totalViews: number;
  averageRating: number;
}

class ResourceService {
  // Get all resources
  async getResources(): Promise<Resource[]> {
    console.log('📚 Using mock resource data');
    return this.getMockResources();
  }

  // Get resources by type
  async getResourcesByType(type: Resource['type']): Promise<Resource[]> {
    const resources = await this.getResources();
    return resources.filter(resource => resource.type === type);
  }

  // Get resources by category
  async getResourcesByCategory(category: Resource['category']): Promise<Resource[]> {
    const resources = await this.getResources();
    return resources.filter(resource => resource.category === category);
  }

  // Create new resource
  async createResource(resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    console.log('➕ Creating resource:', resource.title);
    return `resource-${Date.now()}`;
  }

  // Update resource
  async updateResource(id: string, updates: Partial<Resource>): Promise<void> {
    console.log('✏️ Updating resource:', id, updates);
  }

  // Delete resource
  async deleteResource(id: string): Promise<void> {
    console.log('🗑️ Deleting resource:', id);
  }

  // Increment download count
  async incrementDownload(id: string): Promise<void> {
    console.log('📥 Download count incremented for:', id);
  }

  // Increment view count
  async incrementView(id: string): Promise<void> {
    console.log('👁️ View count incremented for:', id);
  }

  // Get resource statistics
  async getResourceStats(): Promise<ResourceStats> {
    const resources = await this.getResources();
    
    const byType: { [key: string]: number } = {};
    const byCategory: { [key: string]: number } = {};
    let totalDownloads = 0;
    let totalViews = 0;
    let totalRating = 0;
    let ratingCount = 0;

    resources.forEach(resource => {
      byType[resource.type] = (byType[resource.type] || 0) + 1;
      byCategory[resource.category] = (byCategory[resource.category] || 0) + 1;
      totalDownloads += resource.downloadCount;
      totalViews += resource.viewCount;
      if (resource.rating > 0) {
        totalRating += resource.rating;
        ratingCount++;
      }
    });

    return {
      total: resources.length,
      byType,
      byCategory,
      totalDownloads,
      totalViews,
      averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
    };
  }

  // Mock resources for fallback
  private getMockResources(): Resource[] {
    const now = new Date().toISOString();
    return [
      {
        id: "res-001",
        title: "Thumbnail Design Templates",
        description: "Professional YouTube thumbnail templates for tech content",
        type: "template",
        category: "design",
        fileUrl: "/resources/thumbnail-templates.zip",
        thumbnailUrl: "/resources/thumbnails/thumb-templates.jpg",
        tags: ["design", "thumbnail", "youtube", "template"],
        author: "Raaj Nikitaa",
        authorId: "raaj-nikitaa",
        isPublic: true,
        downloadCount: 145,
        viewCount: 523,
        rating: 4.8,
        ratingCount: 32,
        size: "12.5 MB",
        lastUpdated: "2025-09-15",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "res-002",
        title: "Video Editing Workflow Guide",
        description: "Step-by-step guide for efficient video editing workflow",
        type: "guide",
        category: "content",
        url: "https://docs.tomoacademy.com/video-editing-guide",
        thumbnailUrl: "/resources/thumbnails/editing-guide.jpg",
        tags: ["editing", "workflow", "guide", "tutorial"],
        author: "Kamesh AJ",
        authorId: "kamesh",
        isPublic: true,
        downloadCount: 89,
        viewCount: 312,
        rating: 4.9,
        ratingCount: 28,
        lastUpdated: "2025-09-20",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "res-003",
        title: "React Component Library",
        description: "Reusable React components for web development",
        type: "tool",
        category: "development",
        url: "https://github.com/tomo-academy/react-components",
        thumbnailUrl: "/resources/thumbnails/react-lib.jpg",
        tags: ["react", "components", "development", "library"],
        author: "Kanish SJ",
        authorId: "kanish-sj",
        isPublic: true,
        downloadCount: 234,
        viewCount: 678,
        rating: 4.7,
        ratingCount: 45,
        lastUpdated: "2025-10-01",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "res-004",
        title: "Content Calendar Template",
        description: "Monthly content planning template for YouTube channels",
        type: "template",
        category: "marketing",
        fileUrl: "/resources/content-calendar.xlsx",
        thumbnailUrl: "/resources/thumbnails/calendar.jpg",
        tags: ["planning", "content", "calendar", "marketing"],
        author: "Indhumathi",
        authorId: "indhumathi",
        isPublic: true,
        downloadCount: 167,
        viewCount: 445,
        rating: 4.6,
        ratingCount: 38,
        size: "2.1 MB",
        lastUpdated: "2025-09-10",
        createdAt: now,
        updatedAt: now
      },
      {
        id: "res-005",
        title: "YouTube SEO Course",
        description: "Complete course on optimizing videos for YouTube search",
        type: "course",
        category: "marketing",
        url: "https://learn.tomoacademy.com/youtube-seo",
        thumbnailUrl: "/resources/thumbnails/seo-course.jpg",
        tags: ["seo", "youtube", "course", "marketing"],
        author: "Ajay Krithick",
        authorId: "ajay-krithick",
        isPublic: true,
        downloadCount: 0,
        viewCount: 892,
        rating: 4.9,
        ratingCount: 67,
        duration: "3.5 hours",
        lastUpdated: "2025-09-25",
        createdAt: now,
        updatedAt: now
      }
    ];
  }
}

export const resourceService = new ResourceService();
