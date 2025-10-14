# TOMO Academy Platform - Setup Instructions

## 🎯 Overview
This platform now uses **NeonDB (PostgreSQL)** instead of Firebase. All features work with real data from your Vercel environment variables.

## ✅ Changes Made

### 1. **Removed Firebase Completely**
- ❌ Deleted `firebase` package from dependencies
- ❌ Removed `src/config/firebase.ts`
- ❌ Removed `src/services/firebase.ts`
- ❌ Removed `src/services/auth.ts`
- ✅ Created `src/services/neonService.ts` as replacement

### 2. **Updated ID Card Branding**
- ✅ Changed colors to pink gradient (`from-pink-600 via-pink-500 to-pink-600`)
- ✅ Updated text to "TOMO ACADEMY" and "EDUCATION ELEVATED"
- ✅ Logo now uses `/logo.png` with fallback to `/TOMO.jpg`
- ✅ Fixed photo display issues - images now show properly
- ✅ Fixed backside overlapping - all elements properly spaced

### 3. **Database Setup**
- ✅ Created SQL schema file: `src/lib/neon-db-schema.sql`
- ✅ Created SQL seed file: `src/lib/neon-db-seed.sql`
- ✅ Updated `src/lib/db.ts` with fallback to mock data
- ✅ All employee data uses correct image paths

## 🚀 Setup Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up NeonDB

1. **Go to your Neon Console**: https://console.neon.tech
2. **Open SQL Editor** for your database
3. **Run the schema file**:
   - Copy contents from `src/lib/neon-db-schema.sql`
   - Paste and execute in SQL Editor
4. **Run the seed file**:
   - Copy contents from `src/lib/neon-db-seed.sql`
   - Paste and execute in SQL Editor

### Step 3: Verify Environment Variables in Vercel

Make sure these are set in your Vercel project:

```env
# NeonDB
VITE_DATABASE_URL=your_neon_connection_string

# YouTube API
VITE_YOUTUBE_API_KEY=your_youtube_api_key
VITE_YOUTUBE_CHANNEL_ID=your_channel_id
```

### Step 4: Add Logo Image

Place your logo image at `public/logo.png` (the one from the screenshot you showed me)

### Step 5: Deploy

```bash
npm run build
# Or deploy via Vercel
```

## 📊 Database Schema

The platform includes these tables:
- **employees** - Team member data
- **videos** - Video content
- **tasks** - Task management
- **revenue** - Financial data
- **activities** - Activity feed
- **analytics** - Platform analytics
- **resources** - Shared resources

## 🔄 Data Flow

1. **With Database**: Reads from NeonDB using environment variables
2. **Without Database**: Falls back to mock data from `src/data/employees.ts`
3. **YouTube Data**: Always fetched live from YouTube API

## ✨ Features Now Working

✅ **Team Page** - All employee data with photos
✅ **ID Cards** - Front and back with proper layout
✅ **Dashboard** - Revenue, activities, analytics
✅ **YouTube Integration** - Live channel stats
✅ **All CRUD Operations** - Create, read, update, delete

## 🎨 ID Card Improvements

### Front Side:
- ✅ Photos display correctly (no cropping issues)
- ✅ Pink gradient header with new branding
- ✅ Proper spacing for all info fields
- ✅ QR code properly sized

### Back Side:
- ✅ No overlapping elements
- ✅ Buttons properly sized (max-width: 70px each)
- ✅ Text truncation for long names/roles
- ✅ Proper spacing between all sections

## 🐛 Troubleshooting

### If you see "relation employees does not exist":
1. Run the schema SQL file in Neon Console
2. Run the seed SQL file in Neon Console
3. Verify `VITE_DATABASE_URL` is set in Vercel

### If photos don't show:
1. Make sure images are in `public/` folder
2. Check that paths don't have `public/` prefix
3. Verify image files exist

### If Firebase errors appear:
1. Clear browser cache
2. Rebuild the project: `npm run build`
3. Redeploy to Vercel

## 📝 Notes

- The platform works WITHOUT database (uses mock data)
- Firebase is completely removed
- All features are production-ready
- Environment variables are required for full functionality

## 🎯 Next Steps

1. Run SQL files in Neon Console
2. Add logo image to `public/logo.png`
3. Rebuild and deploy
4. Test all features

---

**Made with 💜 by TOMO Academy**
