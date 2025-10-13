// Photo Upload Service - Handles employee photo uploads
import { db } from '@/lib/db';

export interface PhotoUploadOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  quality?: number; // 0-1 for compression
}

const DEFAULT_OPTIONS: PhotoUploadOptions = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
  quality: 0.9
};

class PhotoUploadService {
  // Compress and resize image
  async compressImage(file: File, options: PhotoUploadOptions = DEFAULT_OPTIONS): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Resize if too large
          const maxDimension = 1200;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Draw and compress
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Could not compress image'));
              }
            },
            'image/jpeg',
            options.quality || 0.9
          );
        };
        
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  }

  // Validate file
  validateFile(file: File, options: PhotoUploadOptions = DEFAULT_OPTIONS): { valid: boolean; error?: string } {
    // Check type
    if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: ${options.allowedTypes.join(', ')}`
      };
    }
    
    // Check size
    if (options.maxSize && file.size > options.maxSize) {
      return {
        valid: false,
        error: `File too large. Max size: ${(options.maxSize / 1024 / 1024).toFixed(1)}MB`
      };
    }
    
    return { valid: true };
  }

  // Upload to server/storage
  async uploadPhoto(
    employeeId: string,
    file: File,
    options: PhotoUploadOptions = DEFAULT_OPTIONS
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      // Validate
      const validation = this.validateFile(file, options);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Compress
      const compressedBlob = await this.compressImage(file, options);
      
      // Convert to base64 for storage (in production, upload to cloud storage)
      const base64 = await this.blobToBase64(compressedBlob);
      
      // In production, upload to cloud storage (Firebase, S3, etc.)
      // For now, store in localStorage and database
      const photoUrl = base64;
      
      // Update database
      const success = await db.employees.updateAvatar(employeeId, photoUrl);
      
      if (success) {
        return { success: true, url: photoUrl };
      } else {
        return { success: false, error: 'Failed to update database' };
      }
    } catch (error) {
      console.error('Photo upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  // Convert blob to base64
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Generate thumbnail
  async generateThumbnail(file: File, size: number = 150): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          // Calculate crop
          const scale = Math.max(size / img.width, size / img.height);
          const x = (size / 2) - (img.width / 2) * scale;
          const y = (size / 2) - (img.height / 2) * scale;
          
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  }

  // Delete photo
  async deletePhoto(employeeId: string): Promise<boolean> {
    try {
      return await db.employees.updateAvatar(employeeId, '');
    } catch (error) {
      console.error('Photo delete error:', error);
      return false;
    }
  }
}

export const photoUploadService = new PhotoUploadService();
