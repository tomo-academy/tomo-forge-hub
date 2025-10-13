// YouTube Upload Service - Real YouTube API Integration
import { db } from '@/lib/db';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const YOUTUBE_CLIENT_ID = import.meta.env.VITE_YOUTUBE_CLIENT_ID;
const YOUTUBE_CLIENT_SECRET = import.meta.env.VITE_YOUTUBE_CLIENT_SECRET;

export interface YouTubeUploadOptions {
  title: string;
  description: string;
  category: string;
  tags: string[];
  privacyStatus: 'public' | 'private' | 'unlisted';
  thumbnailFile?: File;
}

export interface UploadProgress {
  status: 'preparing' | 'uploading' | 'processing' | 'complete' | 'error';
  progress: number;
  message: string;
  videoId?: string;
  error?: string;
}

class YouTubeUploadService {
  private accessToken: string | null = null;

  // Initialize Google OAuth2
  async initAuth(): Promise<boolean> {
    try {
      // Check if already authenticated
      if (this.accessToken) return true;

      // Try to get token from localStorage
      const storedToken = localStorage.getItem('youtube_access_token');
      if (storedToken) {
        this.accessToken = storedToken;
        return true;
      }

      // Need to authenticate
      return false;
    } catch (error) {
      console.error('Auth initialization error:', error);
      return false;
    }
  }

  // Authenticate with Google OAuth2
  async authenticate(): Promise<boolean> {
    try {
      // Create OAuth2 URL
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', YOUTUBE_CLIENT_ID || '');
      authUrl.searchParams.set('redirect_uri', window.location.origin + '/auth/callback');
      authUrl.searchParams.set('response_type', 'token');
      authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube');

      // Open authentication window
      const authWindow = window.open(authUrl.toString(), 'YouTube Auth', 'width=600,height=600');

      // Wait for authentication
      return new Promise((resolve) => {
        const checkAuth = setInterval(() => {
          try {
            if (authWindow?.closed) {
              clearInterval(checkAuth);
              const token = localStorage.getItem('youtube_access_token');
              if (token) {
                this.accessToken = token;
                resolve(true);
              } else {
                resolve(false);
              }
            }
          } catch (error) {
            // Ignore cross-origin errors
          }
        }, 500);
      });
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  // Upload video to YouTube
  async uploadVideo(
    videoFile: File,
    options: YouTubeUploadOptions,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<{ success: boolean; videoId?: string; error?: string }> {
    try {
      // Check authentication
      const isAuthenticated = await this.initAuth();
      if (!isAuthenticated) {
        const authSuccess = await this.authenticate();
        if (!authSuccess) {
          return { success: false, error: 'Authentication failed' };
        }
      }

      onProgress?.({
        status: 'preparing',
        progress: 10,
        message: 'Preparing video upload...'
      });

      // Create metadata
      const metadata = {
        snippet: {
          title: options.title,
          description: options.description,
          tags: options.tags,
          categoryId: this.getCategoryId(options.category)
        },
        status: {
          privacyStatus: options.privacyStatus,
          selfDeclaredMadeForKids: false
        }
      };

      onProgress?.({
        status: 'uploading',
        progress: 20,
        message: 'Uploading to YouTube...'
      });

      // Upload video using resumable upload
      const videoId = await this.resumableUpload(videoFile, metadata, (progress) => {
        onProgress?.({
          status: 'uploading',
          progress: 20 + (progress * 0.6), // 20-80%
          message: `Uploading: ${Math.round(progress)}%`
        });
      });

      if (!videoId) {
        return { success: false, error: 'Upload failed' };
      }

      onProgress?.({
        status: 'processing',
        progress: 85,
        message: 'Processing video on YouTube...',
        videoId
      });

      // Upload thumbnail if provided
      if (options.thumbnailFile) {
        await this.uploadThumbnail(videoId, options.thumbnailFile);
      }

      // Save to database
      await db.videos.create({
        title: options.title,
        description: options.description,
        youtube_id: videoId,
        youtube_url: `https://www.youtube.com/watch?v=${videoId}`,
        thumbnail_url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        category: options.category,
        tags: options.tags,
        uploaded_by: 'current_user', // Replace with actual user
        status: 'published',
        uploaded_at: new Date().toISOString(),
        published_at: new Date().toISOString()
      });

      onProgress?.({
        status: 'complete',
        progress: 100,
        message: 'Upload complete!',
        videoId
      });

      return { success: true, videoId };
    } catch (error) {
      console.error('Upload error:', error);
      onProgress?.({
        status: 'error',
        progress: 0,
        message: 'Upload failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      return { success: false, error: error instanceof Error ? error.message : 'Upload failed' };
    }
  }

  // Resumable upload implementation
  private async resumableUpload(
    file: File,
    metadata: any,
    onProgress?: (progress: number) => void
  ): Promise<string | null> {
    try {
      // Initialize resumable upload
      const initResponse = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'X-Upload-Content-Length': file.size.toString(),
          'X-Upload-Content-Type': file.type
        },
        body: JSON.stringify(metadata)
      });

      const uploadUrl = initResponse.headers.get('Location');
      if (!uploadUrl) throw new Error('Failed to get upload URL');

      // Upload file in chunks
      const chunkSize = 256 * 1024 * 1024; // 256MB chunks
      let start = 0;

      while (start < file.size) {
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);

        const uploadResponse = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Content-Length': chunk.size.toString(),
            'Content-Range': `bytes ${start}-${end - 1}/${file.size}`
          },
          body: chunk
        });

        if (uploadResponse.status === 200 || uploadResponse.status === 201) {
          // Upload complete
          const result = await uploadResponse.json();
          return result.id;
        }

        start = end;
        onProgress?.(Math.round((start / file.size) * 100));
      }

      return null;
    } catch (error) {
      console.error('Resumable upload error:', error);
      return null;
    }
  }

  // Upload custom thumbnail
  private async uploadThumbnail(videoId: string, thumbnailFile: File): Promise<boolean> {
    try {
      const formData = new FormData();
      formData.append('file', thumbnailFile);

      const response = await fetch(`https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${videoId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: formData
      });

      return response.ok;
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      return false;
    }
  }

  // Get YouTube category ID
  private getCategoryId(category: string): string {
    const categories: Record<string, string> = {
      'education': '27',
      'tutorial': '27',
      'programming': '28',
      'web-development': '28',
      'design': '26',
      'technology': '28',
      'other': '22'
    };
    return categories[category.toLowerCase()] || '22';
  }

  // Check upload status
  async checkUploadStatus(videoId: string): Promise<{
    status: string;
    processingProgress?: number;
  }> {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=status,processingDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        return {
          status: video.status.uploadStatus,
          processingProgress: video.processingDetails?.processingProgress?.partsProcessed
        };
      }
      
      return { status: 'unknown' };
    } catch (error) {
      console.error('Status check error:', error);
      return { status: 'error' };
    }
  }
}

export const youtubeUploadService = new YouTubeUploadService();
