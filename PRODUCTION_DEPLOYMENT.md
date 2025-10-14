# 🚀 Production Deployment Guide

Complete guide for deploying TOMO Academy to production with all features enabled.

## 📋 Pre-Deployment Checklist

### 1. Environment Variables Setup

Create environment variables in your deployment platform (Vercel/Netlify):

```bash
# Required Variables
VITE_DATABASE_URL=postgresql://neondb_owner:npg_6lrwd9UOGQLi@ep-ancient-cloud-ads7mnd4-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
VITE_YOUTUBE_API_KEY=your_actual_youtube_api_key
VITE_YOUTUBE_CHANNEL_ID=your_actual_channel_id
VITE_APP_URL=https://tomo-forge-hub.vercel.app
VITE_APP_VERSION=1.0.0

# Optional Variables
VITE_YOUTUBE_CLIENT_ID=your_client_id.apps.googleusercontent.com
VITE_YOUTUBE_CLIENT_SECRET=your_client_secret
```

### 2. API Configuration

#### YouTube API Setup:
1. ✅ Enable YouTube Data API v3 in Google Cloud Console
2. ✅ Enable YouTube Analytics API
3. ✅ Create and restrict API key
4. ✅ Add service account to YouTube channel:
   - Email: `tomo-academy@upheld-acumen-474017-f9.iam.gserviceaccount.com`
   - Role: Viewer or Editor

#### NeonDB Setup:
1. ✅ Database is already configured
2. ✅ Tables will auto-initialize on first run
3. ✅ Connection pooling enabled

### 3. Build Verification

Test the production build locally:

```bash
# Install dependencies
npm install

# Run production build
npm run build

# Preview production build
npm run preview

# Run tests (if available)
npm test
```

---

## 🌐 Deployment Platforms

### Option 1: Vercel (Recommended)

#### Quick Deploy:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

#### Set Environment Variables:
```bash
vercel env add VITE_DATABASE_URL production
vercel env add VITE_YOUTUBE_API_KEY production
vercel env add VITE_YOUTUBE_CHANNEL_ID production
vercel env add VITE_APP_URL production
```

#### Vercel Configuration:
The `vercel.json` file is already configured with:
- ✅ SPA routing (all routes redirect to index.html)
- ✅ Security headers (X-Frame-Options, XSS Protection, etc.)
- ✅ Cache control for dynamic routes

### Option 2: Netlify

#### Deploy via CLI:
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

#### Set Environment Variables:
```bash
netlify env:set VITE_DATABASE_URL "your_value"
netlify env:set VITE_YOUTUBE_API_KEY "your_value"
netlify env:set VITE_YOUTUBE_CHANNEL_ID "your_value"
```

#### Netlify Configuration:
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### Option 3: Custom Server (VPS/Cloud)

#### Using Docker:
```bash
# Build Docker image
docker build -t tomo-academy .

# Run container
docker run -p 80:80 \
  -e VITE_DATABASE_URL="your_value" \
  -e VITE_YOUTUBE_API_KEY="your_value" \
  tomo-academy
```

#### Using PM2:
```bash
# Install PM2
npm i -g pm2

# Build the app
npm run build

# Serve with PM2
pm2 serve dist 3000 --spa --name tomo-academy

# Save PM2 configuration
pm2 save
pm2 startup
```

---

## 🔒 Security Configuration

### 1. Environment Variables Security
- ✅ Never commit `.env` files to Git
- ✅ Use platform-specific secret management
- ✅ Rotate API keys regularly
- ✅ Restrict API keys to production domains

### 2. CORS Configuration
If using custom backend:
```javascript
// Allow only production domain
const allowedOrigins = ['https://tomo-forge-hub.vercel.app'];
```

### 3. Rate Limiting
YouTube API has quotas:
- Daily quota: 10,000 units
- Channel statistics: 1 unit per request
- Video list: 1 unit per request
- App caches data for 5 minutes to minimize API calls

---

## 📊 Monitoring & Analytics

### 1. Health Check Endpoint
Access system health at: `/health`

Monitors:
- ✅ Database connectivity
- ✅ YouTube API status
- ✅ Memory usage
- ✅ Performance metrics

### 2. Error Tracking
The app includes built-in error tracking:
- Errors are logged to console in production
- Ready for integration with Sentry/LogRocket
- Error boundary catches React errors

### 3. Performance Monitoring
Built-in performance monitoring tracks:
- Core Web Vitals (LCP, FID, CLS)
- API response times
- Component render times
- Memory usage

### 4. Analytics Integration
Ready for integration with:
- Google Analytics 4
- Mixpanel
- Amplitude
- Custom analytics service

---

## 🚀 Post-Deployment Steps

### 1. Verify Deployment

Check these URLs:
- ✅ Homepage: `https://your-domain.com/`
- ✅ Dashboard: `https://your-domain.com/dashboard`
- ✅ Team: `https://your-domain.com/team`
- ✅ Analytics: `https://your-domain.com/analytics`
- ✅ Health Check: `https://your-domain.com/health`
- ✅ Profile Pages: `https://your-domain.com/profile/kanish-sj`

### 2. Test Core Features

- [ ] ID cards display correctly
- [ ] QR codes work and lead to profiles
- [ ] YouTube data loads (or falls back gracefully)
- [ ] Database operations work
- [ ] Photo upload works
- [ ] Search and filters work
- [ ] Mobile responsive design works
- [ ] All routes are accessible

### 3. Performance Testing

Use these tools:
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [WebPageTest](https://www.webpagetest.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

Target scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 95
- SEO: > 90

### 4. SEO Verification

- [ ] Meta tags are correct
- [ ] Open Graph tags work (test with Facebook Debugger)
- [ ] Twitter Cards work
- [ ] Sitemap is accessible
- [ ] Robots.txt is configured
- [ ] Canonical URLs are set

### 5. Security Audit

- [ ] HTTPS is enabled
- [ ] Security headers are set
- [ ] No sensitive data in client-side code
- [ ] API keys are restricted
- [ ] CORS is properly configured

---

## 🔄 CI/CD Setup

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test --if-present
      
      - name: Build
        run: npm run build
        env:
          VITE_DATABASE_URL: ${{ secrets.VITE_DATABASE_URL }}
          VITE_YOUTUBE_API_KEY: ${{ secrets.VITE_YOUTUBE_API_KEY }}
          VITE_YOUTUBE_CHANNEL_ID: ${{ secrets.VITE_YOUTUBE_CHANNEL_ID }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📈 Performance Optimization

### Already Implemented:
- ✅ Code splitting with React.lazy
- ✅ Image lazy loading
- ✅ React Query caching (5-minute stale time)
- ✅ IndexedDB for large data caching
- ✅ Service Worker ready
- ✅ Gzip/Brotli compression (via Vercel/Netlify)
- ✅ CDN distribution (via Vercel/Netlify)

### Additional Optimizations:
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for unused dependencies
npx depcheck

# Update dependencies
npm update
```

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Environment Variables Not Working

**Solution:**
- Ensure variables start with `VITE_`
- Restart dev server after adding variables
- Check deployment platform has variables set
- Verify no typos in variable names

### Issue: YouTube API Not Working

**Solution:**
1. Verify API key is correct
2. Check API is enabled in Google Cloud Console
3. Ensure API key restrictions allow your domain
4. Check daily quota hasn't been exceeded
5. App will gracefully fall back to mock data

### Issue: Database Connection Fails

**Solution:**
1. Verify connection string is correct
2. Ensure `sslmode=require` is in connection string
3. Check NeonDB is active (free tier may sleep)
4. Try the unpooled connection URL for debugging

### Issue: QR Codes Don't Work

**Solution:**
- Ensure `VITE_APP_URL` is set to production URL
- Check profile routes are accessible
- Verify employee data includes all required fields
- Test QR code with multiple scanners

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks:

**Daily:**
- Monitor error logs
- Check health endpoint
- Review analytics

**Weekly:**
- Review performance metrics
- Check API quota usage
- Update content as needed

**Monthly:**
- Update dependencies
- Review security advisories
- Backup database
- Rotate API keys (if needed)

### Getting Help:

- **Documentation**: Check all `.md` files in project root
- **Health Check**: Visit `/health` endpoint
- **Error Logs**: Check deployment platform logs
- **Community**: GitHub Issues

---

## ✅ Production Checklist

Before going live:

**Code:**
- [ ] All features tested locally
- [ ] Production build succeeds
- [ ] No console errors in production build
- [ ] All routes work correctly
- [ ] Error boundaries in place

**Configuration:**
- [ ] Environment variables set
- [ ] API keys configured and restricted
- [ ] Database connection verified
- [ ] Domain configured
- [ ] SSL certificate active

**Performance:**
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] Caching configured
- [ ] CDN enabled

**Security:**
- [ ] Security headers set
- [ ] HTTPS enforced
- [ ] API keys restricted
- [ ] No sensitive data exposed

**SEO:**
- [ ] Meta tags configured
- [ ] Sitemap created
- [ ] Robots.txt configured
- [ ] Analytics integrated

**Monitoring:**
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] Health checks working
- [ ] Analytics tracking events

---

## 🎉 You're Ready for Production!

Your TOMO Academy platform is production-ready with:
- ✅ Compact, responsive ID cards
- ✅ Real YouTube Analytics integration
- ✅ NeonDB persistence
- ✅ Error boundaries and monitoring
- ✅ Performance optimizations
- ✅ SEO optimization
- ✅ Security headers
- ✅ Health check endpoint
- ✅ Comprehensive caching

Deploy with confidence! 🚀
