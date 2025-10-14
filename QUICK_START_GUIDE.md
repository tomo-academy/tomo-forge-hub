# 🚀 Quick Start Guide - TOMO Academy Platform

## ✨ New Features Ready to Use!

### 1️⃣ Add Employee with Photo (Complete ID Card)

**Steps:**
1. Navigate to **Team** page (`/team`)
2. Click **"Add Member"** button (top right)
3. **Upload Photo:**
   - Click the camera icon or "Upload Photo" button
   - Select image (JPG, PNG, GIF)
   - See instant preview
   - Click X to remove/change
4. **Fill Details:**
   ```
   Name: Kamesh
   Role: Developer
   Department: Technology
   Email: kamesh14151@gmail.com
   Phone: 9385718659
   Location: Chennai, India
   Skills: React, TypeScript, Node.js, Video Editing
   Bio: Full-stack developer specializing in modern web technologies
   Availability: Available
   ```
5. Click **"Add Employee"**
6. ✅ **Done!** Employee appears with complete ID card

**Result:**
- Auto-generated ID: `TOMO-XXXX`
- Profile photo displayed
- Complete front/back ID card
- QR code for profile
- All stats initialized (0 videos, 5.0 rating, etc.)

---

### 2️⃣ Upload Video (YouTube Style)

**Steps:**
1. Navigate to **Videos** page (`/videos`)
2. Click **"Upload Video"** button
3. **Select Video:**
   - Drag & drop video file OR
   - Click "Select File"
   - Supported: MP4, MOV, AVI, WMV, FLV, 3GP, WebM
4. **Wait for Upload:**
   - Progress bar shows upload status
   - Processing message appears
5. **Add Details:**
   ```
   Title: React Tutorial - Complete Guide
   Description: Learn React from scratch...
   Category: Education
   Tags: react, javascript, tutorial, web development
   Visibility: Public
   ```
6. **Upload Thumbnail (Optional):**
   - Click thumbnail area
   - Select image
   - Preview appears
7. **Schedule (Optional):**
   - Select date and time
   - Video will publish automatically
8. Click **"Publish"** or **"Schedule"**
9. ✅ **Done!** Video uploaded

---

### 3️⃣ View Real YouTube Analytics

**Automatic - Just Set API Key:**

1. **Set Environment Variables in Vercel:**
   ```env
   VITE_YOUTUBE_API_KEY=your_actual_youtube_api_key
   VITE_YOUTUBE_CHANNEL_ID=your_channel_id
   ```

2. **Dashboard Shows Real Data:**
   - Live subscriber count
   - Total views (real-time)
   - Video count
   - Recent videos with thumbnails
   - Top performing videos
   - Engagement metrics

3. **Analytics Page:**
   - Detailed statistics
   - Revenue tracking
   - Watch time
   - Demographics
   - Traffic sources

**No API Key?**
- Platform still works!
- Uses mock data as fallback
- No errors or crashes

---

## 🗄️ Database Setup (Optional but Recommended)

### Run SQL in Neon Console:

1. **Go to:** https://console.neon.tech
2. **Open SQL Editor**
3. **Run Schema:**
   - Copy from `src/lib/neon-db-schema.sql`
   - Paste and execute
4. **Run Seed Data:**
   - Copy from `src/lib/neon-db-seed.sql`
   - Paste and execute
5. ✅ **Database Ready!**

### Without Database:
- Platform works with mock data
- Add employee creates in-memory records
- All features functional

---

## 🎨 Customization

### Change Logo:
1. Place your logo at `public/logo.png`
2. Recommended size: 512x512px
3. Format: PNG with transparent background
4. Fallback: Uses `/TOMO.jpg`

### Change Branding Colors:
Edit `src/components/ui/compact-id-card.tsx`:
```tsx
// Change pink gradient to your color
from-pink-600 via-pink-500 to-pink-600
// to
from-blue-600 via-blue-500 to-blue-600
```

### Change Text:
```tsx
TOMO ACADEMY → YOUR BRAND
EDUCATION ELEVATED → YOUR TAGLINE
```

---

## 🧪 Testing Features

### Test Add Employee:
```bash
# Run dev server
npm run dev

# Navigate to http://localhost:5173/team
# Click "Add Member"
# Upload photo and fill form
# Check ID card appears correctly
```

### Test Video Upload:
```bash
# Navigate to /videos
# Click "Upload Video"
# Select any video file
# Fill details and publish
# Check success message
```

### Test Analytics:
```bash
# Add YouTube API key to .env
# Navigate to /dashboard
# Check if real data loads
# If no API key, mock data appears
```

---

## 📱 Mobile Testing

### Responsive Design:
- ✅ ID cards stack properly
- ✅ Modals scroll on mobile
- ✅ Forms are touch-friendly
- ✅ Photos upload on mobile
- ✅ All features work

### Test On:
- iPhone Safari
- Android Chrome
- iPad
- Desktop browsers

---

## 🐛 Troubleshooting

### Employee Photo Not Showing?
- Check file size (max 5MB)
- Use JPG, PNG, or GIF
- Clear browser cache
- Try different image

### Video Upload Stuck?
- Check file size
- Verify video format
- Check internet connection
- Try smaller file first

### Analytics Not Loading?
- Verify API key is correct
- Check channel ID
- Look at browser console
- Fallback to mock data works

### Database Errors?
- Run SQL schema first
- Check connection string
- Verify Vercel env vars
- Platform works without DB

---

## 🎯 Production Checklist

Before deploying:

- [ ] Add logo image to `public/logo.png`
- [ ] Set YouTube API key in Vercel
- [ ] Set YouTube Channel ID
- [ ] Run NeonDB schema SQL
- [ ] Run NeonDB seed SQL
- [ ] Test add employee
- [ ] Test video upload
- [ ] Test on mobile
- [ ] Check all pages load
- [ ] Verify analytics work

---

## 🔑 Environment Variables

### Required for Full Features:
```env
# Database (Optional - has fallback)
VITE_DATABASE_URL=postgresql://...

# YouTube (Optional - has fallback)
VITE_YOUTUBE_API_KEY=AIza...
VITE_YOUTUBE_CHANNEL_ID=UC...

# App Config
VITE_APP_URL=https://tomo-forge-hub.vercel.app
```

### Get YouTube API Key:
1. Go to: https://console.cloud.google.com
2. Create project
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Restrict to your domain
6. Copy key to Vercel

---

## 💡 Pro Tips

### Photo Upload:
- Use square images (1:1 ratio)
- Minimum 200x200px
- Maximum 5MB
- Clear background works best

### Video Upload:
- Use descriptive titles
- Add relevant tags
- Write detailed descriptions
- Upload custom thumbnails
- Schedule for peak times

### ID Cards:
- Click card to flip
- Scan QR code for profile
- Download vCard button
- Share profile button

---

## 📞 Need Help?

### Check These First:
1. Browser console for errors
2. Network tab for API calls
3. Vercel logs for backend
4. This guide for solutions

### Common Issues:
- **"Failed to Add Employee"** → Fixed! Now works without DB
- **"Photo not showing"** → Check image format/size
- **"Analytics not loading"** → Add API key or use mock data
- **"Database error"** → Run SQL files or use fallback

---

## 🎉 You're All Set!

Everything is ready to use:
- ✅ Add employees with photos
- ✅ Generate ID cards
- ✅ Upload videos
- ✅ View analytics
- ✅ Mobile ready
- ✅ Production ready

**Start by adding your first employee with a photo!**

---

**Made with 💜 by TOMO Academy**
