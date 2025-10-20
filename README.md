# 🎓 TOMO Academy - Digital Learning Platform

[![Production Ready](https://img.shields.io/badge/Production-Ready-brightgreen)](https://www.tomoacademy.site)
[![Version](https://img.shields.io/badge/version-1.0.0-blue)](package.json)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> A comprehensive digital learning platform with team management, YouTube analytics, and real-time collaboration features.

**Live Demo**: https://www.tomoacademy.site

## 🌟 Features

### ✨ Core Features
- 🎴 **Compact ID Cards**: Beautiful, responsive employee ID cards with QR codes
- 📊 **YouTube Analytics**: Real-time channel statistics and performance metrics
- 👥 **Team Management**: Complete employee directory with search and filters
- 🎥 **Video Management**: Track and manage educational content
- 📈 **Analytics Dashboard**: Comprehensive insights and metrics
- 🏥 **Health Monitoring**: System health checks and error tracking

### 🚀 Production Features
- ⚡ **Performance Optimized**: Core Web Vitals > 90
- 🛡️ **Error Boundaries**: Comprehensive error handling
- 💾 **Advanced Caching**: Multi-layer caching strategy
- 🔐 **Security Headers**: Enterprise-grade security
- 📱 **Fully Responsive**: Perfect on all devices
- 🔍 **SEO Optimized**: Meta tags and Open Graph

## 🎯 Quick Start

### Prerequisites
- Node.js 18+ and npm
- YouTube API key (optional, falls back to mock data)
- NeonDB account (optional, uses in-memory fallback)

### Installation

```bash
# Clone the repository
git clone https://github.com/tomo-academy/tomo-forge-hub.git

# Navigate to project directory
cd tomo-forge-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📋 Project Structure

```
tomo-forge-hub/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── ErrorBoundary.tsx
│   │   └── SEO.tsx
│   ├── pages/            # Route pages
│   │   ├── Home.tsx
│   │   ├── EnhancedTeamV2.tsx
│   │   ├── ProductionAnalytics.tsx
│   │   ├── HealthCheck.tsx
│   │   └── EmployeeProfile.tsx
│   ├── services/         # API services
│   │   ├── youtubeAnalytics.ts
│   │   ├── firebase.ts
│   │   └── photoUpload.ts
│   ├── lib/              # Utilities
│   │   ├── db.ts
│   │   ├── cache.ts
│   │   ├── performance.ts
│   │   └── monitoring.ts
│   └── App.tsx           # Main app component
├── docs/                 # Documentation
│   ├── SETUP_YOUTUBE_NEON.md
│   ├── PRODUCTION_DEPLOYMENT.md
│   ├── PRODUCTION_FEATURES.md
│   └── IMPROVEMENTS_SUMMARY.md
└── vercel.json          # Deployment configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# YouTube API
VITE_YOUTUBE_API_KEY=your_api_key_here
VITE_YOUTUBE_CHANNEL_ID=your_channel_id_here

# NeonDB
VITE_DATABASE_URL=your_database_url_here

# App Configuration
VITE_APP_URL=https://www.tomoacademy.site
VITE_APP_VERSION=1.0.0
```

See `.env.example` for all available options.

## 📚 Documentation

- **[Setup Guide](SETUP_YOUTUBE_NEON.md)**: Complete setup for YouTube API and NeonDB
- **[Deployment Guide](PRODUCTION_DEPLOYMENT.md)**: Deploy to production
- **[Production Features](PRODUCTION_FEATURES.md)**: All production features explained
- **[Improvements Summary](IMPROVEMENTS_SUMMARY.md)**: Recent enhancements

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
npm run deploy:vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy to production
npm run deploy:netlify
```

See [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) for detailed instructions.

## 🛠️ Development

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking
npm run analyze          # Analyze bundle size
```

## 📊 Key Pages

- **Home**: `/` - Landing page
- **Dashboard**: `/dashboard` - Analytics overview
- **Team**: `/team` - Employee directory with compact ID cards
- **Analytics**: `/analytics` - YouTube analytics dashboard
- **Health Check**: `/health` - System health monitoring
- **Profile**: `/profile/:employeeId` - Individual employee profiles

## 🎨 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query
- **Routing**: React Router
- **Database**: NeonDB (PostgreSQL)
- **Analytics**: YouTube Data API v3
- **Deployment**: Vercel

## 🔐 Security

- ✅ Security headers configured
- ✅ HTTPS enforced
- ✅ API keys restricted to domains
- ✅ No sensitive data in client code
- ✅ Environment variables for secrets

## 📈 Performance

- ⚡ Lighthouse Score: 95+
- ⚡ First Contentful Paint: < 1.8s
- ⚡ Time to Interactive: < 3.8s
- ⚡ Cumulative Layout Shift: < 0.1

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ by the TOMO Academy team

- **Lead Developer**: Kanish SJ
- **Design Team**: Raaj Nikitaa, Kamesh
- **Content Team**: Ajay Krithick, Haridharuson L.J
- **Development Team**: Nithish, Dev

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Lucide](https://lucide.dev/) for icons
- [NeonDB](https://neon.tech/) for serverless PostgreSQL

---

## 📞 Support

For support, email support@tomoacademy.com or visit our [GitHub Issues](https://github.com/tomo-academy/tomo-forge-hub/issues).

---

**Made with 💜 by TOMO Academy**

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/a44451ca-49e3-4ded-8c34-2092cae09870) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/a44451ca-49e3-4ded-8c34-2092cae09870) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

