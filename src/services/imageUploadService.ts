// Image Upload Service - Handles employee photo uploads
// Uses Cloudinary for cloud storage (can be replaced with other services)

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface UploadResult {
  url: string;
  publicId: string;
}

class ImageUploadService {
  /**
   * Upload image to Cloudinary
   * @param file - Image file to upload
   * @returns Promise with uploaded image URL
   */
  async uploadImage(file: File): Promise<string> {
    // If Cloudinary is not configured, use base64 as fallback (temporary solution)
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      console.warn('⚠️ Cloudinary not configured, using base64 fallback');
      return this.convertToBase64(file);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'tomo-academy/employees');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload image to Cloudinary');
      }

      const data = await response.json();
      console.log('✅ Image uploaded to Cloudinary:', data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error('❌ Error uploading to Cloudinary:', error);
      console.log('📦 Falling back to base64 encoding');
      return this.convertToBase64(file);
    }
  }

  /**
   * Convert image file to base64 (fallback method)
   * @param file - Image file to convert
   * @returns Promise with base64 string
   */
  private convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Compress image before upload to reduce size
   * @param file - Image file to compress
   * @param maxWidth - Maximum width in pixels
   * @param quality - JPEG quality (0-1)
   * @returns Promise with compressed file
   */
  async compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              console.log(`📦 Compressed image: ${(file.size / 1024).toFixed(2)}KB → ${(compressedFile.size / 1024).toFixed(2)}KB`);
              resolve(compressedFile);
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Validate image file
   * @param file - File to validate
   * @param maxSizeMB - Maximum file size in MB
   * @returns Validation result
   */
  validateImage(file: File, maxSizeMB: number = 5): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'File must be an image' };
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return { valid: false, error: `Image must be under ${maxSizeMB}MB` };
    }

    return { valid: true };
  }
}

export const imageUploadService = new ImageUploadService();
