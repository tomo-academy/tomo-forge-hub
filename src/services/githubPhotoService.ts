// GitHub Photo Service - Handles employee photos via GitHub/public folder
export interface PhotoValidation {
  valid: boolean;
  error?: string;
}

export interface PhotoUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

class GitHubPhotoService {
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  /**
   * Validate image file
   * @param file - File to validate
   * @returns Validation result
   */
  validateImage(file: File): PhotoValidation {
    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      return {
        valid: false,
        error: `Invalid file type. Allowed: JPG, PNG, WebP, GIF`
      };
    }

    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File too large. Max size: ${(this.MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB`
      };
    }

    return { valid: true };
  }

  /**
   * Get employee photo URL from public folder
   * @param employeeData - Employee data with avatar info
   * @returns Photo URL or null
   */
  getEmployeePhotoUrl(employeeData: { avatar?: string; avatar_url?: string; name: string }): string | null {
    // Check both avatar and avatar_url fields
    const avatarPath = employeeData.avatar || employeeData.avatar_url;
    
    if (!avatarPath) return null;
    
    // If it's already a full URL (http/https), return as is
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      return avatarPath;
    }
    
    // If it's a public path, remove the 'public/' prefix and add leading slash
    if (avatarPath.startsWith('public/')) {
      return avatarPath.replace('public/', '/');
    }
    
    // If it already starts with '/', return as is
    if (avatarPath.startsWith('/')) {
      return avatarPath;
    }
    
    // If it's a relative path without leading '/', add it
    return `/${avatarPath}`;
  }

  /**
   * Get fallback initials for employee
   * @param name - Employee name
   * @returns Initials string
   */
  getEmployeeInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  /**
   * Compress image for better performance
   * @param file - Image file to compress
   * @param maxWidth - Maximum width (default: 800px)
   * @param quality - Image quality (default: 0.8)
   * @returns Compressed file
   */
  async compressImage(file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
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
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Convert image to base64 (for storage when needed)
   * @param file - Image file
   * @returns Base64 string
   */
  async convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Handle photo upload - saves to public folder path format
   * @param employeeId - Employee ID
   * @param file - Image file
   * @returns Upload result with public folder path
   */
  async uploadPhoto(employeeId: string, file: File): Promise<PhotoUploadResult> {
    try {
      // Validate file
      const validation = this.validateImage(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Compress image
      const compressedFile = await this.compressImage(file);
      
      // For now, we'll use a public folder path format
      // In a real implementation, you'd upload to GitHub repo or server
      const fileName = `${employeeId}_${Date.now()}.jpg`;
      const publicPath = `/employees/${fileName}`;
      
      console.log(`📸 Photo prepared for: ${employeeId}`);
      console.log(`📁 Public path: ${publicPath}`);
      console.log(`💾 Compressed size: ${(compressedFile.size / 1024).toFixed(2)}KB`);
      
      // Return the public path format that works with GitHub Pages
      return {
        success: true,
        url: publicPath
      };
      
    } catch (error) {
      console.error('❌ Photo upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      };
    }
  }

  /**
   * Generate avatar component props
   * @param employee - Employee data
   * @returns Avatar props for rendering
   */
  getAvatarProps(employee: { avatar?: string; avatar_url?: string; name: string }) {
    const photoUrl = this.getEmployeePhotoUrl(employee);
    const initials = this.getEmployeeInitials(employee.name);
    
    return {
      src: photoUrl,
      alt: employee.name,
      fallback: initials,
      hasPhoto: !!photoUrl
    };
  }
}

export const githubPhotoService = new GitHubPhotoService();
export default githubPhotoService;