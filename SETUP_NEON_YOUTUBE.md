# 🚀 Setup Guide: Neon Database & YouTube Integration

## 📋 Prerequisites

1. **Neon Account** - https://neon.tech
2. **Google Cloud Account** - https://console.cloud.google.com
3. **YouTube Channel** - For uploading videos

---

## 🗄️ Part 1: Neon Database Setup

### Step 1: Create Neon Project

1. Go to https://neon.tech and sign in
2. Click **"Create Project"**
3. Name: `tomo-academy-platform`
4. Region: Choose closest to your users
5. Click **"Create Project"**

### Step 2: Get Database URL

1. In your Neon dashboard, click **"Connection Details"**
2. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxx.neon.tech/dbname?sslmode=require
   ```
3. Save this for later

### Step 3: Initialize Database Tables

The tables will be created automatically when the app starts, but you can also run this SQL manually:

```sql
-- Employees Table
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  employee_id VARCHAR(50) UNIQUE NOT NULL,
  join_date DATE NOT NULL,
  avatar_url TEXT,
  location VARCHAR(255),
  availability VARCHAR(20) DEFAULT 'available',
  bio TEXT,
  skills JSONB,
  social_links JSONB,
  stats JSONB,
  card_color VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  youtube_id VARCHAR(100),
  youtube_url TEXT,
  thumbnail_url TEXT,
  duration VARCHAR(20),
  category VARCHAR(100),
  tags JSONB,
  uploaded_by VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'processing',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);
```

---

## 📺 Part 2: YouTube API Setup

### Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click **"Select a project"** → **"New Project"**
3. Name: `TOMO Academy Platform`
4. Click **"Create"**

### Step 2: Enable YouTube Data API

1. In your project, go to **"APIs & Services"** → **"Library"**
2. Search for **"YouTube Data API v3"**
3. Click on it and click **"Enable"**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure OAuth consent screen:
   - User Type: **External**
   - App name: `TOMO Academy Platform`
   - User support email: Your email
   - Developer contact: Your email
   - Add scope: `https://www.googleapis.com/auth/youtube.upload`
   - Add test users: Your email
4. Application type: **Web application**
5. Name: `TOMO Academy Web Client`
6. Authorized redirect URIs:
   - `http://localhost:8080/auth/callback`
   - `https://your-vercel-domain.vercel.app/auth/callback`
7. Click **"Create"**
8. **Save the Client ID and Client Secret**

### Step 4: Get API Key

1. In **"Credentials"**, click **"Create Credentials"** → **"API key"**
2. **Save the API key**
3. Click **"Restrict Key"**:
   - API restrictions: **Restrict key**
   - Select: **YouTube Data API v3**
   - Save

---

## ⚙️ Part 3: Configure Environment Variables

### On Vercel:

1. Go to your Vercel project
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables:

```
VITE_DATABASE_URL = postgresql://user:password@your-neon-host.neon.tech/dbname?sslmode=require
VITE_YOUTUBE_API_KEY = your_youtube_api_key
VITE_YOUTUBE_CLIENT_ID = your_client_id.apps.googleusercontent.com
VITE_YOUTUBE_CLIENT_SECRET = your_client_secret
```

4. Click **"Save"**
5. Redeploy your app

### Locally:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your values:
   ```env
   VITE_DATABASE_URL=postgresql://...
   VITE_YOUTUBE_API_KEY=...
   VITE_YOUTUBE_CLIENT_ID=...
   VITE_YOUTUBE_CLIENT_SECRET=...
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

---

## 🔗 Part 4: Connect Neon to Vercel (Integration)

### Option A: Vercel Integration (Easiest)

1. In Vercel dashboard, go to **"Integrations"**
2. Search for **"Neon"**
3. Click **"Add Integration"**
4. Select your project
5. Authorize
6. **Done!** Environment variables are added automatically

### Option B: Manual Connection

1. Copy your Neon connection string
2. Add to Vercel environment variables as shown above

---

## ✅ Part 5: Verify Setup

### Test Database Connection:

```bash
# Run this in your browser console on the app
fetch('/api/test-db').then(r => r.json()).then(console.log)
```

### Test YouTube Upload:

1. Go to **Videos** page
2. Click **"Upload Video"**
3. Select a video file
4. Click **"Authenticate with YouTube"**
5. Allow permissions
6. Upload should start!

---

## 📝 Features Now Available

### ✅ Employee Management
- Store employee data in Neon database
- Upload and update profile photos
- Real-time data synchronization
- Persistent storage

### ✅ Video Upload
- Upload directly to YouTube
- Real progress tracking
- Automatic thumbnail upload
- Database integration
- View uploaded videos

### ✅ ID Cards
- Store card data in database
- Update photos dynamically
- Export to vCard
- QR code generation

---

## 🔒 Security Notes

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Rotate API keys** if exposed
3. **Use environment variables** for all secrets
4. **Enable OAuth consent screen** properly
5. **Restrict API keys** to specific APIs

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Could not connect to database
```
**Solution**: Check your `VITE_DATABASE_URL` is correct and Neon project is active

### YouTube Auth Failed
```
Error: Authentication failed
```
**Solution**: 
1. Check OAuth credentials are correct
2. Verify redirect URI matches exactly
3. Add your email as test user

### Upload Stuck at 0%
```
Upload not progressing
```
**Solution**:
1. Check file size (max 256GB)
2. Verify YouTube API quota
3. Check network connection

---

## 📞 Need Help?

- **Neon Docs**: https://neon.tech/docs
- **YouTube API Docs**: https://developers.google.com/youtube/v3
- **Vercel Docs**: https://vercel.com/docs

---

**You're all set! 🎉**

Your TOMO Academy platform now has:
- ✅ Persistent database storage
- ✅ Real YouTube upload integration
- ✅ Photo upload capability
- ✅ Full data management
