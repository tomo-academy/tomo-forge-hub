import { YOUTUBE_CONFIG, YOUTUBE_ENDPOINTS, VIDEO_CATEGORIES } from '@/config/youtube';

// Types for YouTube API responses
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  duration: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  channelId: string;
  channelTitle: string;
  tags: string[];
  categoryId: string;
  defaultAudioLanguage?: string;
  status: 'published' | 'private' | 'unlisted';
}

export interface YouTubeChannelStats {
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  country: string;
  customUrl: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
}

export interface YouTubeAnalytics {
  views: number;
  estimatedMinutesWatched: number;
  averageViewDuration: number;
  subscribersGained: number;
  subscribersLost: number;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  sharesCount: number;
  date: string;
}

class YouTubeApiService {
  private baseUrl = YOUTUBE_CONFIG.BASE_URL;
  private apiKey = YOUTUBE_CONFIG.API_KEY;
  private channelId = YOUTUBE_CONFIG.CHANNEL_ID;

  // Build URL with common parameters
  private buildUrl(endpoint: string, params: Record<string, string | number> = {}): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // Add API key
    url.searchParams.set('key', this.apiKey);
    
    // Add other parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value.toString());
    });

    return url.toString();
  }

  // Fetch wrapper with error handling
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('YouTube API quota exceeded or invalid API key');
        } else if (response.status === 404) {
          throw new Error('Resource not found');
        }
        throw new Error(`YouTube API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('YouTube API fetch error:', error);
      throw error;
    }
  }

  // Get channel statistics
  async getChannelStats(): Promise<YouTubeChannelStats> {
    try {
      const url = this.buildUrl(YOUTUBE_ENDPOINTS.CHANNELS, {
        part: 'statistics,snippet,brandingSettings',
        id: this.channelId,
      });

      const data = await this.fetchWithErrorHandling<any>(url);
      
      if (!data.items || data.items.length === 0) {
        throw new Error('Channel not found');
      }

      const channel = data.items[0];
      const stats = channel.statistics;
      const snippet = channel.snippet;

      return {
        subscriberCount: parseInt(stats.subscriberCount) || 0,
        videoCount: parseInt(stats.videoCount) || 0,
        viewCount: parseInt(stats.viewCount) || 0,
        country: snippet.country || 'Unknown',
        customUrl: snippet.customUrl || '',
        description: snippet.description || '',
        publishedAt: snippet.publishedAt,
        thumbnails: {
          default: snippet.thumbnails?.default?.url || '',
          medium: snippet.thumbnails?.medium?.url || '',
          high: snippet.thumbnails?.high?.url || '',
        },
      };
    } catch (error) {
      console.error('Error fetching channel stats:', error);
      
      // Return mock data as fallback
      return {
        subscriberCount: 125000,
        videoCount: 234,
        viewCount: 5600000,
        country: 'IN',
        customUrl: '@tomoacademy',
        description: 'TOMO Academy - Learn Technology with Expert Guidance',
        publishedAt: '2020-01-15T10:00:00Z',
        thumbnails: {
          default: '/placeholder.svg',
          medium: '/placeholder.svg',
          high: '/placeholder.svg',
        },
      };
    }
  }

  // Get channel videos
  async getChannelVideos(maxResults: number = YOUTUBE_CONFIG.MAX_RESULTS): Promise<YouTubeVideo[]> {
    try {
      // First, get the uploads playlist ID
      const channelUrl = this.buildUrl(YOUTUBE_ENDPOINTS.CHANNELS, {
        part: 'contentDetails',
        id: this.channelId,
      });

      const channelData = await this.fetchWithErrorHandling<any>(channelUrl);
      const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;

      if (!uploadsPlaylistId) {
        throw new Error('Unable to find uploads playlist');
      }

      // Get videos from uploads playlist
      const playlistUrl = this.buildUrl('/playlistItems', {
        part: 'snippet,contentDetails',
        playlistId: uploadsPlaylistId,
        maxResults,
      });

      const playlistData = await this.fetchWithErrorHandling<any>(playlistUrl);
      
      // Get video IDs for detailed information
      const videoIds = playlistData.items.map((item: any) => item.contentDetails.videoId).join(',');

      // Get detailed video information
      const videosUrl = this.buildUrl(YOUTUBE_ENDPOINTS.VIDEOS, {
        part: 'snippet,statistics,contentDetails,status',
        id: videoIds,
      });

      const videosData = await this.fetchWithErrorHandling<any>(videosUrl);

      return videosData.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url || '/placeholder.svg',
        publishedAt: video.snippet.publishedAt,
        duration: this.parseDuration(video.contentDetails.duration),
        viewCount: parseInt(video.statistics.viewCount) || 0,
        likeCount: parseInt(video.statistics.likeCount) || 0,
        commentCount: parseInt(video.statistics.commentCount) || 0,
        channelId: video.snippet.channelId,
        channelTitle: video.snippet.channelTitle,
        tags: video.snippet.tags || [],
        categoryId: video.snippet.categoryId,
        defaultAudioLanguage: video.snippet.defaultAudioLanguage,
        status: video.status.privacyStatus === 'public' ? 'published' : video.status.privacyStatus as 'published' | 'private' | 'unlisted',
      }));

    } catch (error) {
      console.error('Error fetching videos:', error);
      
      // Return mock data as fallback
      return this.getMockVideos();
    }
  }

  // Get video analytics (requires OAuth)
  async getVideoAnalytics(videoId: string, startDate: string, endDate: string): Promise<YouTubeAnalytics[]> {
    // Note: This requires YouTube Analytics API and OAuth authentication
    // For now, return mock data
    console.warn('Video analytics requires OAuth authentication. Returning mock data.');
    
    return [
      {
        views: 15420,
        estimatedMinutesWatched: 154200,
        averageViewDuration: 600,
        subscribersGained: 45,
        subscribersLost: 12,
        likesCount: 892,
        dislikesCount: 23,
        commentsCount: 134,
        sharesCount: 67,
        date: new Date().toISOString().split('T')[0],
      }
    ];
  }

  // Parse ISO 8601 duration to readable format
  private parseDuration(duration: string): string {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';

    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Mock data for development/fallback
  private getMockVideos(): YouTubeVideo[] {
    return [
      {
        id: "dQw4w9WgXcQ",
        title: "Complete Firebase Tutorial - Authentication & Firestore",
        description: "Learn Firebase from scratch with authentication and Firestore database integration",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
        publishedAt: "2025-09-28T10:00:00Z",
        duration: "15:34",
        viewCount: 15420,
        likeCount: 892,
        commentCount: 134,
        channelId: this.channelId,
        channelTitle: "TOMO Academy",
        tags: ["firebase", "tutorial", "javascript", "web development"],
        categoryId: "27",
        status: "published",
      },
      {
        id: "abc123xyz",
        title: "React Hooks Deep Dive - useState, useEffect, Custom Hooks",
        description: "Master React hooks with practical examples and best practices",
        thumbnail: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800&h=450&fit=crop",
        publishedAt: "2025-09-25T14:30:00Z",
        duration: "22:18",
        viewCount: 23150,
        likeCount: 1245,
        commentCount: 289,
        channelId: this.channelId,
        channelTitle: "TOMO Academy",
        tags: ["react", "hooks", "javascript", "frontend"],
        categoryId: "27",
        status: "published",
      },
    ];
  }

  // Real-time subscriber count (polling)
  async getRealtimeSubscriberCount(): Promise<number> {
    try {
      const stats = await this.getChannelStats();
      return stats.subscriberCount;
    } catch (error) {
      console.error('Error fetching realtime subscriber count:', error);
      return 125000; // Fallback
    }
  }

  // Search videos by query
  async searchVideos(query: string, maxResults: number = 10): Promise<YouTubeVideo[]> {
    try {
      const url = this.buildUrl(YOUTUBE_ENDPOINTS.SEARCH, {
        part: 'snippet',
        channelId: this.channelId,
        q: query,
        type: 'video',
        order: 'relevance',
        maxResults,
      });

      const data = await this.fetchWithErrorHandling<any>(url);
      
      // Get video IDs for detailed information
      const videoIds = data.items.map((item: any) => item.id.videoId).join(',');

      return await this.getVideosByIds(videoIds);
    } catch (error) {
      console.error('Error searching videos:', error);
      return [];
    }
  }

  // Get videos by IDs
  async getVideosByIds(videoIds: string): Promise<YouTubeVideo[]> {
    try {
      const url = this.buildUrl(YOUTUBE_ENDPOINTS.VIDEOS, {
        part: 'snippet,statistics,contentDetails,status',
        id: videoIds,
      });

      const data = await this.fetchWithErrorHandling<any>(url);

      return data.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnail: video.snippet.thumbnails?.high?.url || video.snippet.thumbnails?.medium?.url || '/placeholder.svg',
        publishedAt: video.snippet.publishedAt,
        duration: this.parseDuration(video.contentDetails.duration),
        viewCount: parseInt(video.statistics.viewCount) || 0,
        likeCount: parseInt(video.statistics.likeCount) || 0,
        commentCount: parseInt(video.statistics.commentCount) || 0,
        channelId: video.snippet.channelId,
        channelTitle: video.snippet.channelTitle,
        tags: video.snippet.tags || [],
        categoryId: video.snippet.categoryId,
        status: video.status.privacyStatus === 'public' ? 'published' : video.status.privacyStatus as 'published' | 'private' | 'unlisted',
      }));
    } catch (error) {
      console.error('Error fetching videos by IDs:', error);
      return [];
    }
  }
}

// Export singleton instance
export const youtubeApi = new YouTubeApiService();
export default youtubeApi;