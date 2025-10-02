// Real Resources Management Service for TOMO Academy
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query, 
  orderBy, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/config/firebase';

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
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  private collectionName = 'resources';

  // Get all resources
  async getResources(): Promise<Resource[]> {
    try {
      const resourcesRef = collection(db, this.collectionName);
      const snapshot = await getDocs(query(resourcesRef, orderBy('createdAt', 'desc')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
    } catch (error) {
      console.error('Error fetching resources:', error);
      return this.getMockResources();
    }
  }

  // Get resources by category
  async getResourcesByCategory(category: Resource['category']): Promise<Resource[]> {
    try {
      const resourcesRef = collection(db, this.collectionName);
      const snapshot = await getDocs(query(resourcesRef, where('category', '==', category), orderBy('createdAt', 'desc')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
    } catch (error) {
      console.error('Error fetching resources by category:', error);
      return this.getMockResources().filter(resource => resource.category === category);
    }
  }

  // Create new resource
  async createResource(resource: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount' | 'viewCount' | 'rating' | 'ratingCount'>): Promise<string> {
    try {
      const resourcesRef = collection(db, this.collectionName);
      const docRef = await addDoc(resourcesRef, {
        ...resource,
        downloadCount: 0,
        viewCount: 0,
        rating: 0,
        ratingCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    }
  }

  // Update resource
  async updateResource(id: string, updates: Partial<Resource>): Promise<void> {
    try {
      const resourceRef = doc(db, this.collectionName, id);
      await updateDoc(resourceRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  }

  // Delete resource
  async deleteResource(id: string): Promise<void> {
    try {
      const resourceRef = doc(db, this.collectionName, id);
      await deleteDoc(resourceRef);
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  }

  // Increment view count
  async incrementViewCount(id: string): Promise<void> {
    try {
      const resourceRef = doc(db, this.collectionName, id);
      const resource = await this.getResource(id);
      if (resource) {
        await updateDoc(resourceRef, {
          viewCount: resource.viewCount + 1,
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }

  // Increment download count
  async incrementDownloadCount(id: string): Promise<void> {
    try {
      const resourceRef = doc(db, this.collectionName, id);
      const resource = await this.getResource(id);
      if (resource) {
        await updateDoc(resourceRef, {
          downloadCount: resource.downloadCount + 1,
          updatedAt: Timestamp.now()
        });
      }
    } catch (error) {
      console.error('Error incrementing download count:', error);
    }
  }

  // Get single resource
  private async getResource(id: string): Promise<Resource | null> {
    try {
      const resources = await this.getResources();
      return resources.find(r => r.id === id) || null;
    } catch (error) {
      console.error('Error fetching single resource:', error);
      return null;
    }
  }

  // Get resource statistics
  async getResourceStats(): Promise<ResourceStats> {
    try {
      const resources = await this.getResources();
      
      const byType = resources.reduce((acc, resource) => {
        acc[resource.type] = (acc[resource.type] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const byCategory = resources.reduce((acc, resource) => {
        acc[resource.category] = (acc[resource.category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });

      const totalDownloads = resources.reduce((sum, r) => sum + r.downloadCount, 0);
      const totalViews = resources.reduce((sum, r) => sum + r.viewCount, 0);
      const totalRating = resources.reduce((sum, r) => sum + (r.rating * r.ratingCount), 0);
      const totalRatingCount = resources.reduce((sum, r) => sum + r.ratingCount, 0);

      return {
        total: resources.length,
        byType,
        byCategory,
        totalDownloads,
        totalViews,
        averageRating: totalRatingCount > 0 ? totalRating / totalRatingCount : 0
      };
    } catch (error) {
      console.error('Error getting resource stats:', error);
      return {
        total: 0,
        byType: {},
        byCategory: {},
        totalDownloads: 0,
        totalViews: 0,
        averageRating: 0
      };
    }
  }

  // Initialize default resources
  async initializeDefaultResources(): Promise<void> {
    try {
      const existingResources = await this.getResources();
      if (existingResources.length > 0) {
        console.log('Resources already initialized');
        return;
      }

      const defaultResources = this.getMockResources();
      for (const resource of defaultResources) {
        await this.createResource({
          ...resource,
          author: resource.author,
          authorId: resource.authorId || 'system'
        });
      }
      
      console.log('Default resources initialized');
    } catch (error) {
      console.error('Error initializing default resources:', error);
    }
  }

  // Mock resources for fallback
  private getMockResources(): Omit<Resource, 'createdAt' | 'updatedAt'>[] {
    return [
      {
        id: "res-001",
        title: "React Development Best Practices",
        description: "Comprehensive guide covering React hooks, performance optimization, and modern patterns",
        type: "document",
        category: "development",
        url: "https://docs.tomoacademy.com/react-best-practices",
        thumbnailUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=300&fit=crop",
        tags: ["react", "javascript", "best-practices", "hooks"],
        author: "Kanish SJ",
        authorId: "kanish-sj",
        isPublic: true,
        downloadCount: 245,
        viewCount: 1250,
        rating: 4.8,
        ratingCount: 32,
        lastUpdated: "2025-09-28"
      },
      {
        id: "res-002",
        title: "Video Editing Workflow Template",
        description: "Step-by-step workflow template for consistent video production quality",
        type: "template",
        category: "content",
        fileUrl: "/templates/video-editing-workflow.pdf",
        thumbnailUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=300&fit=crop",
        tags: ["video-editing", "workflow", "template", "production"],
        author: "Nithish",
        authorId: "nithish",
        isPublic: true,
        downloadCount: 189,
        viewCount: 890,
        rating: 4.6,
        ratingCount: 28,
        size: "2.3 MB",
        lastUpdated: "2025-09-25"
      },
      {
        id: "res-003",
        title: "Thumbnail Design Guidelines",
        description: "Brand guidelines and templates for creating consistent YouTube thumbnails",
        type: "guide",
        category: "design",
        fileUrl: "/guides/thumbnail-guidelines.pdf",
        thumbnailUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
        tags: ["design", "thumbnails", "branding", "guidelines"],
        author: "Raaj Nikitaa",
        authorId: "raaj-nikitaa",
        isPublic: true,
        downloadCount: 156,
        viewCount: 678,
        rating: 4.9,
        ratingCount: 21,
        size: "5.1 MB",
        lastUpdated: "2025-09-22"
      },
      {
        id: "res-004",
        title: "Content Strategy Masterclass",
        description: "Advanced strategies for educational content creation and audience engagement",
        type: "course",
        category: "content",
        url: "https://course.tomoacademy.com/content-strategy",
        thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop",
        tags: ["content-strategy", "marketing", "engagement", "course"],
        author: "Ajay Krithick",
        authorId: "ajay-krithick",
        isPublic: false,
        downloadCount: 67,
        viewCount: 234,
        rating: 4.7,
        ratingCount: 15,
        duration: "2h 30m",
        lastUpdated: "2025-09-20"
      },
      {
        id: "res-005",
        title: "Firebase Integration Toolkit",
        description: "Complete toolkit with code examples, templates, and best practices for Firebase",
        type: "tool",
        category: "development",
        fileUrl: "/tools/firebase-toolkit.zip",
        thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop",
        tags: ["firebase", "toolkit", "development", "templates"],
        author: "Kanish SJ",
        authorId: "kanish-sj",
        isPublic: true,
        downloadCount: 312,
        viewCount: 1456,
        rating: 4.9,
        ratingCount: 45,
        size: "15.7 MB",
        lastUpdated: "2025-09-18"
      },
      {
        id: "res-006",
        title: "Social Media Marketing Playbook",
        description: "Comprehensive playbook for cross-platform social media marketing",
        type: "guide",
        category: "marketing",
        fileUrl: "/guides/social-media-playbook.pdf",
        thumbnailUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop",
        tags: ["social-media", "marketing", "strategy", "playbook"],
        author: "Nithyasri",
        authorId: "nithyasri",
        isPublic: true,
        downloadCount: 198,
        viewCount: 876,
        rating: 4.5,
        ratingCount: 33,
        size: "8.2 MB",
        lastUpdated: "2025-09-15"
      }
    ];
  }
}

export const resourceService = new ResourceService();