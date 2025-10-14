# Complete Setup Guide: YouTube Analytics API & NeonDB

This guide will help you configure YouTube Analytics API with service account credentials and set up NeonDB for the TOMO Academy platform.

## 📋 Table of Contents
1. [YouTube Analytics API Setup](#youtube-analytics-api-setup)
2. [NeonDB Configuration](#neondb-configuration)
3. [Environment Variables](#environment-variables)
4. [Testing the Setup](#testing-the-setup)

---

## 🎥 YouTube Analytics API Setup

### Service Account Details
- **Email**: `tomo-academy@upheld-acumen-474017-f9.iam.gserviceaccount.com`
- **Unique ID**: `110389869951772038624`
- **Project**: `upheld-acumen-474017-f9`

### Step 1: Enable YouTube APIs in Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `upheld-acumen-474017-f9`
3. Navigate to **APIs & Services** > **Library**
4. Enable the following APIs:
   - **YouTube Data API v3** ✅
   - **YouTube Analytics API** ✅
   - **YouTube Reporting API** (optional)

### Step 2: Create API Key

1. Go to **APIs & Services** > **Credentials**
2. Click **+ CREATE CREDENTIALS** > **API Key**
3. Copy the API key
4. Click **Edit API key** to restrict it:
   - **Application restrictions**: HTTP referrers (websites)
   - Add your domains:
     - `https://tomo-forge-hub.vercel.app/*`
     - `http://localhost:*` (for development)
   - **API restrictions**: Restrict key
     - Select: YouTube Data API v3, YouTube Analytics API
5. Save the restrictions

### Step 3: Grant Channel Access to Service Account

**IMPORTANT**: The service account needs access to your YouTube channel to fetch analytics data.

1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Navigate to **Settings** > **Permissions**
3. Click **INVITE** and add the service account email:
   ```
   tomo-academy@upheld-acumen-474017-f9.iam.gserviceaccount.com
   ```
4. Grant permissions:
   - **Viewer** (minimum - for read-only analytics access)
   - **Editor** (if you want to manage content via API)
5. Send the invitation

### Step 4: Get Your Channel ID

1. Go to [YouTube Studio](https://studio.youtube.com/)
2. Click on your profile picture > **Settings**
3. Navigate to **Channel** > **Advanced settings**
4. Copy your **Channel ID** (starts with `UC`)

---

## 🗄️ NeonDB Configuration

### Current Database Details
- **Host**: `ep-ancient-cloud-ads7mnd4-pooler.c-2.us-east-1.aws.neon.tech`
- **Database**: `neondb`
- **User**: `neondb_owner`
- **Region**: `us-east-1` (AWS)

### Step 1: Verify Database Connection

The database is already configured in `.env.example`. The connection uses:
- **Pooled connection** (recommended for serverless): Uses pgbouncer
- **Direct connection** (for migrations): Direct PostgreSQL connection

### Step 2: Initialize Database Tables

The application will automatically create tables on first run:
- `employees` - Team member data
- `videos` - Video content and metadata

Tables are created by the `initializeDatabase()` function in `src/lib/db.ts`.

### Step 3: Test Database Connection

Run this command to test the connection:
```bash
npm run dev
```

Check the browser console for:
- ✅ "Database tables initialized successfully"
- ❌ "Error initializing database" (if there's an issue)

---

## ⚙️ Environment Variables

### Step 1: Create `.env` File

Copy the example file:
```bash
cp .env.example .env
```

### Step 2: Configure Variables

Edit `.env` and add your actual values:

```env
# ============================================
# NEON DATABASE (Primary Backend)
# ============================================
VITE_DATABASE_URL=postgresql://neondb_owner:npg_6lrwd9UOGQLi@ep-ancient-cloud-ads7mnd4-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# ============================================
# YOUTUBE API CONFIGURATION
# ============================================
VITE_YOUTUBE_API_KEY=YOUR_ACTUAL_API_KEY_HERE
VITE_YOUTUBE_CHANNEL_ID=YOUR_CHANNEL_ID_HERE

# Optional (for OAuth flows)
VITE_YOUTUBE_CLIENT_ID=your_client_id.apps.googleusercontent.com
VITE_YOUTUBE_CLIENT_SECRET=your_client_secret_here

# ============================================
# APPLICATION SETTINGS
# ============================================
VITE_APP_NAME=TOMO Academy
VITE_APP_URL=https://tomo-forge-hub.vercel.app
```

### Step 3: Deploy Environment Variables

#### For Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add environment variables
vercel env add VITE_YOUTUBE_API_KEY
vercel env add VITE_YOUTUBE_CHANNEL_ID
vercel env add VITE_DATABASE_URL
```

#### For Netlify:
1. Go to **Site settings** > **Environment variables**
2. Add each variable:
   - `VITE_YOUTUBE_API_KEY`
   - `VITE_YOUTUBE_CHANNEL_ID`
   - `VITE_DATABASE_URL`

---

## 🧪 Testing the Setup

### Test 1: YouTube API Connection

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to the Dashboard page
3. Open browser DevTools Console
4. Look for:
   - ✅ Real subscriber count, video count, and view count
   - ✅ Recent videos with thumbnails
   - ❌ "Failed to fetch real YouTube data, using mock data" (if API key is invalid)

### Test 2: NeonDB Connection

1. Navigate to the Team page
2. Try adding a new team member
3. Check if the data persists after page refresh
4. Open browser console and look for:
   - ✅ No database errors
   - ❌ "Error loading team members" (if database connection fails)

### Test 3: ID Cards & QR Codes

1. Navigate to the Team page
2. Verify all ID cards display correctly:
   - ✅ Employee photos
   - ✅ QR codes
   - ✅ Stats (videos, projects, rating)
   - ✅ Responsive on mobile and desktop
3. Click on a QR code or "View Profile" button
4. Verify the profile page loads with:
   - ✅ All employee data visible
   - ✅ Skills section populated
   - ✅ Contact information
   - ✅ QR code for sharing

### Test 4: Mobile Responsiveness

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test on different screen sizes:
   - **Mobile** (375px): Cards should stack vertically
   - **Tablet** (768px): 2 cards per row
   - **Desktop** (1024px+): 3-4 cards per row

---

## 🔧 Troubleshooting

### Issue: "YouTube API quota exceeded"

**Solution**: 
- YouTube Data API has a daily quota of 10,000 units
- Each channel statistics request = 1 unit
- Each video list request = 1 unit
- The app caches data for 5 minutes to reduce API calls

### Issue: "Database connection failed"

**Solution**:
1. Verify the connection string in `.env`
2. Check if NeonDB is active (free tier may sleep after inactivity)
3. Ensure `sslmode=require` is in the connection string
4. Try the unpooled connection URL for debugging

### Issue: "QR code leads to blank page"

**Solution**:
- This was fixed in the latest update
- Ensure all employee data includes the `skills` array
- Check browser console for JavaScript errors
- Verify the route `/profile/:employeeId` is configured in `App.tsx`

### Issue: "Service account can't access analytics"

**Solution**:
1. Verify the service account email was added to YouTube Studio
2. Wait 24-48 hours for permissions to propagate
3. Ensure the service account has at least "Viewer" role
4. Check that YouTube Analytics API is enabled in Google Cloud Console

---

## 📚 Additional Resources

- [YouTube Data API Documentation](https://developers.google.com/youtube/v3)
- [YouTube Analytics API Documentation](https://developers.google.com/youtube/analytics)
- [NeonDB Documentation](https://neon.tech/docs)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

---

## ✅ Checklist

Before deploying to production, ensure:

- [ ] YouTube Data API v3 is enabled
- [ ] YouTube Analytics API is enabled
- [ ] API key is created and restricted
- [ ] Service account has channel access
- [ ] Channel ID is correct
- [ ] NeonDB connection string is valid
- [ ] All environment variables are set in production
- [ ] Database tables are initialized
- [ ] ID cards display correctly on mobile and desktop
- [ ] QR codes work and lead to profile pages
- [ ] Profile pages show all employee data
- [ ] YouTube analytics data is fetching (or gracefully falling back to mock data)

---

## 🎉 Success!

If all tests pass, your TOMO Academy platform is fully configured with:
- ✅ Real-time YouTube Analytics
- ✅ Persistent database storage
- ✅ Beautiful, responsive ID cards
- ✅ Working QR code profile sharing
- ✅ Mobile and desktop optimized

For support, contact the development team or check the project documentation.
