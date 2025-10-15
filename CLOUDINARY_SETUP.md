# Cloudinary Setup Guide for Employee Photo Uploads

## Why Cloudinary?

The employee photo upload feature now uses **Cloudinary** for image storage to avoid the `414 URI Too Large` error that occurs when trying to store large base64-encoded images directly in the database.

## Benefits

- ✅ **No 414 Errors**: Images are stored in the cloud, only URLs are saved in the database
- ✅ **Automatic Image Optimization**: Cloudinary optimizes images for web delivery
- ✅ **CDN Delivery**: Fast image loading from global CDN
- ✅ **Free Tier Available**: 25GB storage and 25GB bandwidth per month
- ✅ **Automatic Compression**: Images are compressed before upload to reduce size

## Setup Instructions

### 1. Create a Free Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Click "Sign Up for Free"
3. Complete the registration process

### 2. Get Your Credentials

After logging in to your Cloudinary dashboard:

1. You'll see your **Cloud Name** on the dashboard
2. Navigate to **Settings** → **Upload** → **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: `tomo-academy-employees` (or any name you prefer)
   - **Signing mode**: Select **Unsigned**
   - **Folder**: `tomo-academy/employees`
   - **Allowed formats**: `jpg, png, gif, webp`
   - **Max file size**: `5000000` (5MB)
5. Click **Save**

### 3. Configure Environment Variables

Add these to your `.env` file:

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=tomo-academy-employees
```

Replace `your_cloud_name_here` with your actual Cloud Name from the dashboard.

### 4. Test the Upload

1. Start your development server: `npm run dev`
2. Go to the Team page
3. Click on any employee card
4. Click "Edit Employee"
5. Upload a new photo
6. Click "Save Changes"

You should see:
- ✅ "Image Ready" notification after selecting the image
- 📤 "Uploading Image" notification when saving
- ✅ "Employee Updated" notification when complete

## Fallback Behavior

If Cloudinary is **not configured**, the system will:
- ⚠️ Use base64 encoding as a fallback
- ⚠️ Compress images to reduce size
- ⚠️ Still work, but may have issues with very large images

**For production use, Cloudinary configuration is highly recommended.**

## Image Compression

All images are automatically compressed before upload:
- **Max width**: 800px (maintains aspect ratio)
- **Quality**: 80% JPEG quality
- **Format**: Converted to JPEG for consistency

This ensures fast uploads and optimal storage usage.

## Troubleshooting

### Images not uploading?

1. **Check console logs** for error messages
2. **Verify credentials** in `.env` file
3. **Check upload preset** is set to "Unsigned"
4. **Verify network connection** to Cloudinary API

### Still getting 414 errors?

This means Cloudinary is not configured and base64 images are too large:
1. Set up Cloudinary following the steps above
2. Or use smaller images (< 500KB)

### Images not persisting after refresh?

1. Check that the database is properly connected
2. Verify the `avatar_url` field is being saved
3. Check browser console for database errors

## Support

For Cloudinary-specific issues, visit:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Support](https://support.cloudinary.com)

For application issues, check the main README.md file.
