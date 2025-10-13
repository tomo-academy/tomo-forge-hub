# TOMO Academy Platform - Automatic Deployment Setup

## 🚀 Overview
This repository contains the **TOMO Academy Internal Digital Platform** - a comprehensive React/TypeScript application for YouTube channel management, team collaboration, and content operations.

## 📋 Features
- **Team Management**: Employee profiles, ID cards, and collaboration tools
- **YouTube Integration**: Channel management and video operations
- **Task Management**: Project tracking and team coordination
- **Resource Hub**: Centralized knowledge and asset management
- **QR Code Generation**: Employee ID cards and quick access
- **Responsive Design**: Modern, mobile-friendly interface
- **Automatic Deployment**: GitHub Actions + Vercel/Netlify integration

## 🔧 Setup Instructions

### 1. Repository Connection
Your repository is connected to GitHub: `tomo-academy/tomo-forge-hub`

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# YouTube API (if needed)
VITE_YOUTUBE_API_KEY=your_youtube_api_key

# Development
NODE_ENV=development
```

### 3. GitHub Secrets Setup
Add these secrets to your GitHub repository:

#### For Vercel Deployment:
- `VERCEL_TOKEN`: Your Vercel API token
- `ORG_ID`: Your Vercel organization ID
- `PROJECT_ID`: Your Vercel project ID

#### For Netlify Deployment (Alternative):
- `NETLIFY_AUTH_TOKEN`: Your Netlify API token
- `NETLIFY_SITE_ID`: Your Netlify site ID

### 4. Hosting Platform Setup

#### Option A: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

#### Option B: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

## 🔄 Automatic Deployment Workflow

### GitHub Actions
The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. **Triggers** on push to main/master branch
2. **Installs** Node.js dependencies
3. **Builds** the React application
4. **Deploys** to Vercel (primary) or Netlify (fallback)
5. **Notifies** on deployment status

### Deployment Process
1. **Make changes** to your code
2. **Commit and push** to the main branch
3. **GitHub Actions** automatically triggers
4. **Deployment** happens automatically
5. **Live site** updates within minutes

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ installed
- Git configured

### Setup
```bash
# Clone the repository
git clone https://github.com/tomo-academy/tomo-forge-hub.git
cd tomo-forge-hub

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Available Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint
- `npm run type-check`: TypeScript type checking
- `npm run deploy`: Build and prepare for deployment

## 📁 Project Structure
```
tomo-forge-hub/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment
├── api/                        # Backend API routes
├── public/                     # Static assets
├── src/
│   ├── components/             # React components
│   │   ├── ui/                # Reusable UI components
│   │   └── ...                # Feature components
│   ├── pages/                 # Page components
│   ├── services/              # API services
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions
│   └── config/                # Configuration files
├── package.json               # Dependencies and scripts
├── vercel.json               # Vercel configuration
├── netlify.toml              # Netlify configuration
├── vite.config.ts            # Vite configuration
└── tailwind.config.ts        # Tailwind CSS configuration
```

## 🔐 Security Features
- **Content Security Policy**: XSS protection
- **Security Headers**: Enhanced security headers
- **Environment Variables**: Secure configuration storage
- **Firebase Security**: Authentication and authorization

## 🌐 API Endpoints

### Backend API (if using server)
- `POST /api/ai/chat` - AI chat functionality
- `POST /api/upload/single` - File upload
- `GET /api/website/templates` - Website templates

### Frontend Routes
- `/` - Home/Dashboard
- `/team` - Team management
- `/videos` - YouTube video management
- `/tasks` - Task management
- `/resources` - Resource hub
- `/profile/:id` - Employee profiles

## 🚀 Making Changes

### For Code Changes:
1. Edit files in your local environment
2. Test locally with `npm run dev`
3. Commit changes: `git add . && git commit -m "Your changes"`
4. Push to GitHub: `git push origin main`
5. Deployment happens automatically!

### For Configuration Changes:
1. Update environment variables in GitHub Secrets
2. Modify deployment configs (`vercel.json`, `netlify.toml`)
3. Push changes to trigger redeployment

## 📊 Monitoring
- **GitHub Actions**: Check deployment status in repository Actions tab
- **Vercel Dashboard**: Monitor deployments and performance
- **Netlify Dashboard**: Alternative monitoring if using Netlify
- **Firebase Console**: Monitor authentication and database

## 🆘 Troubleshooting

### Common Issues:
1. **Build Fails**: Check for TypeScript errors with `npm run type-check`
2. **Deployment Fails**: Verify GitHub Secrets are set correctly
3. **Environment Variables**: Ensure all required env vars are configured
4. **Firebase Issues**: Check Firebase configuration and rules

### Support:
- Check GitHub Issues for known problems
- Review deployment logs in GitHub Actions
- Verify Firebase configuration and API keys

## 🎯 Next Steps
1. **Set up your hosting platform** (Vercel recommended)
2. **Configure GitHub Secrets** with your API tokens
3. **Add your Firebase configuration** to environment variables
4. **Test the deployment** by making a small change
5. **Monitor the automatic deployment** workflow

Your TOMO Academy Platform is now ready for automatic deployment! 🎉

## 📞 Support
For issues or questions:
- Check the GitHub Issues tab
- Review the deployment logs
- Contact the development team

---
**Built with ❤️ for TOMO Academy**
