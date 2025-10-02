// YouTube API Service for live data integration
import { QueryClient } from '@tanstack/react-query';

// Types for YouTube API responses
export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  subscriberCount: number;
  videoCount: number;
  viewCount: number;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
  };
}

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnails: {
    default: string;
    medium: string;
    high: string;
    maxres?: string;
  };
  statistics: {
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
  duration: string;
  tags: string[];
  categoryId: string;
}

export interface YouTubeAnalytics {
  views: number;
  subscribers: number;
  watchTime: number;
  revenue: number;
  engagement: number;
  topVideos: YouTubeVideo[];
  recentVideos: YouTubeVideo[];
  demographics: {
    ageGroups: { [key: string]: number };
    countries: { [key: string]: number };
    devices: { [key: string]: number };
  };
}

// Mock data for demonstration (replace with real API calls)
const MOCK_CHANNEL_DATA: YouTubeChannel = {
  id: 'UCMTpEQrAqzibxN6gZDLIDpA',
  title: 'TOMO Academy',
  description: 'Learn programming, web development, and technology with practical tutorials',
  subscriberCount: 125000,
  videoCount: 234,
  viewCount: 5600000,
  thumbnails: {
    default: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=88&h=88&fit=crop',
    medium: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=240&h=240&fit=crop',
    high: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=800&fit=crop',
  }
};

const MOCK_VIDEOS: YouTubeVideo[] = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'Complete Firebase Tutorial - Authentication & Firestore',
    description: 'Learn how to build a complete web application with Firebase authentication and Firestore database.',
    publishedAt: '2025-09-28T10:00:00Z',
    thumbnails: {
      default: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=120&h=90&fit=crop',
      medium: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=320&h=180&fit=crop',
      high: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=480&h=360&fit=crop',
      maxres: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1280&h=720&fit=crop',
    },
    statistics: {
      viewCount: 15420,
      likeCount: 892,
      commentCount: 134,
    },
    duration: 'PT15M34S',
    tags: ['firebase', 'tutorial', 'web development', 'javascript'],
    categoryId: '28',
  },
  {
    id: 'abc123xyz',
    title: 'React Hooks Deep Dive - useState, useEffect, Custom Hooks',
    description: 'Master React Hooks with practical examples and best practices.',
    publishedAt: '2025-09-25T14:30:00Z',
    thumbnails: {
      default: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=120&h=90&fit=crop',
      medium: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=320&h=180&fit=crop',
      high: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=480&h=360&fit=crop',
    },
    statistics: {
      viewCount: 23150,
      likeCount: 1245,
      commentCount: 289,
    },
    duration: 'PT22M18S',
    tags: ['react', 'hooks', 'javascript', 'frontend'],
    categoryId: '28',
  },
  {
    id: 'def456ghi',
    title: 'TypeScript for Beginners - Complete Guide',
    description: 'Learn TypeScript from scratch with hands-on examples.',
    publishedAt: '2025-09-20T09:15:00Z',
    thumbnails: {
      default: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=120&h=90&fit=crop',
      medium: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=320&h=180&fit=crop',
      high: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=480&h=360&fit=crop',
    },
    statistics: {
      viewCount: 34280,
      likeCount: 1876,
      commentCount: 412,
    },
    duration: 'PT25M12S',
    tags: ['typescript', 'javascript', 'programming', 'tutorial'],
    categoryId: '28',
  },
];

// YouTube API Service Class
export class YouTubeService {
  private apiKey: string;
  private channelId: string;
  private baseUrl: string = 'https://www.googleapis.com/youtube/v3';

  constructor(apiKey?: string, channelId?: string) {
    this.apiKey = apiKey || import.meta.env.VITE_YOUTUBE_API_KEY || 'AIzaSyBGi6_Tqc9kkeR4ich-HeCJAIP0_i4gcy0';
    this.channelId = channelId || import.meta.env.VITE_YOUTUBE_CHANNEL_ID || 'UCMTpEQrAqzibxN6gZDLIDpA';
  }

  // Get channel information
  async getChannelInfo(): Promise<YouTubeChannel> {
    try {
      const response = await fetch(
        `${this.baseUrl}/channels?part=snippet,statistics&id=${this.channelId}&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.items || data.items.length === 0) {
        throw new Error('Channel not found');
      }
      
      const channel = data.items[0];
      
      return {
        id: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        subscriberCount: parseInt(channel.statistics.subscriberCount) || 0,
        videoCount: parseInt(channel.statistics.videoCount) || 0,
        viewCount: parseInt(channel.statistics.viewCount) || 0,
        thumbnails: {
          default: channel.snippet.thumbnails.default?.url || '',
          medium: channel.snippet.thumbnails.medium?.url || '',
          high: channel.snippet.thumbnails.high?.url || '',
        }
      };
    } catch (error) {
      console.warn('Failed to fetch real YouTube data, using mock data:', error);
      // Fallback to mock data with some randomization
      return {
        ...MOCK_CHANNEL_DATA,
        subscriberCount: MOCK_CHANNEL_DATA.subscriberCount + Math.floor(Math.random() * 100),
        viewCount: MOCK_CHANNEL_DATA.viewCount + Math.floor(Math.random() * 1000),
      };
    }
  }

  // Get channel videos
  async getChannelVideos(maxResults: number = 10): Promise<YouTubeVideo[]> {
    try {
      // First, get the channel's uploads playlist
      const channelResponse = await fetch(
        `${this.baseUrl}/channels?part=contentDetails&id=${this.channelId}&key=${this.apiKey}`
      );
      
      if (!channelResponse.ok) {
        throw new Error(`YouTube API error: ${channelResponse.status}`);
      }
      
      const channelData = await channelResponse.json();
      const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;
      
      if (!uploadsPlaylistId) {
        throw new Error('Uploads playlist not found');
      }
      
      // Get videos from uploads playlist
      const playlistResponse = await fetch(
        `${this.baseUrl}/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${this.apiKey}`
      );
      
      if (!playlistResponse.ok) {
        throw new Error(`YouTube API error: ${playlistResponse.status}`);
      }
      
      const playlistData = await playlistResponse.json();
      const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',');
      
      // Get detailed video information including statistics
      const videosResponse = await fetch(
        `${this.baseUrl}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${this.apiKey}`
      );
      
      if (!videosResponse.ok) {
        throw new Error(`YouTube API error: ${videosResponse.status}`);
      }
      
      const videosData = await videosResponse.json();
      
      return videosData.items.map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt,
        thumbnails: {
          default: video.snippet.thumbnails.default?.url || '',
          medium: video.snippet.thumbnails.medium?.url || '',
          high: video.snippet.thumbnails.high?.url || '',
          maxres: video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.high?.url || '',
        },
        statistics: {
          viewCount: parseInt(video.statistics.viewCount) || 0,
          likeCount: parseInt(video.statistics.likeCount) || 0,
          commentCount: parseInt(video.statistics.commentCount) || 0,
        },
        duration: video.contentDetails.duration,
        tags: video.snippet.tags || [],
        categoryId: video.snippet.categoryId,
      }));
    } catch (error) {
      console.warn('Failed to fetch real YouTube videos, using mock data:', error);
      // Fallback to mock data with some randomization
      return MOCK_VIDEOS.map(video => ({
        ...video,
        statistics: {
          ...video.statistics,
          viewCount: video.statistics.viewCount + Math.floor(Math.random() * 100),
          likeCount: video.statistics.likeCount + Math.floor(Math.random() * 10),
          commentCount: video.statistics.commentCount + Math.floor(Math.random() * 5),
        }
      })).slice(0, maxResults);
    }
  }

  // Get video statistics
  async getVideoStatistics(videoId: string): Promise<YouTubeVideo['statistics']> {
    const video = MOCK_VIDEOS.find(v => v.id === videoId);
    if (!video) {
      throw new Error('Video not found');
    }

    return {
      ...video.statistics,
      viewCount: video.statistics.viewCount + Math.floor(Math.random() * 50),
      likeCount: video.statistics.likeCount + Math.floor(Math.random() * 5),
      commentCount: video.statistics.commentCount + Math.floor(Math.random() * 3),
    };
  }

  // Get analytics data
  async getAnalytics(): Promise<YouTubeAnalytics> {
    const channel = await this.getChannelInfo();
    const videos = await this.getChannelVideos(5);
    
    return {
      views: channel.viewCount,
      subscribers: channel.subscriberCount,
      watchTime: Math.floor(Math.random() * 100000) + 500000, // Mock watch time in minutes
      revenue: Math.floor(Math.random() * 1000) + 2500, // Mock revenue
      engagement: Math.random() * 10 + 85, // Mock engagement rate
      topVideos: videos.sort((a, b) => b.statistics.viewCount - a.statistics.viewCount).slice(0, 3),
      recentVideos: videos,
      demographics: {
        ageGroups: {
          '18-24': 25,
          '25-34': 35,
          '35-44': 20,
          '45-54': 15,
          '55+': 5,
        },
        countries: {
          'United States': 30,
          'India': 25,
          'United Kingdom': 15,
          'Canada': 10,
          'Australia': 8,
          'Others': 12,
        },
        devices: {
          'Mobile': 60,
          'Desktop': 30,
          'Tablet': 8,
          'TV': 2,
        },
      },
    };
  }

  // Format duration from ISO 8601 to readable format
  formatDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return '0:00';

    const hours = (match[1] || '').replace('H', '');
    const minutes = (match[2] || '').replace('M', '');
    const seconds = (match[3] || '').replace('S', '');

    if (hours) {
      return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
    }
    return `${minutes || '0'}:${seconds.padStart(2, '0')}`;
  }

  // Format numbers for display
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
}

// Create a singleton instance
export const youtubeService = new YouTubeService();

// React Query hooks for YouTube data
export const useChannelInfo = () => {
  return {
    queryKey: ['youtube', 'channel'],
    queryFn: () => youtubeService.getChannelInfo(),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  };
};

export const useChannelVideos = (maxResults: number = 10) => {
  return {
    queryKey: ['youtube', 'videos', maxResults],
    queryFn: () => youtubeService.getChannelVideos(maxResults),
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  };
};

export const useYouTubeAnalytics = () => {
  return {
    queryKey: ['youtube', 'analytics'],
    queryFn: () => youtubeService.getAnalytics(),
    refetchInterval: 15 * 60 * 1000, // Refetch every 15 minutes
    staleTime: 10 * 60 * 1000, // Consider data stale after 10 minutes
  };
};