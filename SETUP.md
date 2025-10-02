# TOMO Academy Platform Setup Guide

This is a premium internal platform for TOMO Academy YouTube channel management. The application includes real-time analytics, live data integration, and premium UI features.

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd tomo-academy-platform
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🔑 API Configuration

### YouTube Data API v3

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create API credentials (API Key)
5. Add to `.env`:
   ```
   VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
   ```

### Optional: Firebase Integration

For advanced team management and real-time features:

1. Create Firebase project
2. Enable Authentication and Firestore
3. Add configuration to `.env`:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=your-app-id
   ```

## 🎯 Features Overview

### ✅ Implemented
- **Real-time Dashboard** with live analytics
- **YouTube API Integration** for channel data
- **Premium UI Components** with animations
- **Dark/Light Theme Support**
- **Task Management System** with Kanban board
- **Team Member Profiles** with digital ID cards
- **Video Analytics** with performance metrics
- **Responsive Design** for all devices
- **Live Data Updates** every 30 seconds
- **Professional Navigation** with status indicators

### 🔄 Live Data Sources
- YouTube Channel Statistics
- Video Performance Metrics
- Real-time Subscriber Count
- Engagement Analytics
- Team Activity Feed
- Task Progress Tracking

### 🎨 Premium Features
- Animated counters and statistics
- Glassmorphism UI effects
- Smooth transitions and hover effects
- Custom scrollbars and loading states
- Professional color scheme
- Real-time status indicators
- Advanced data visualization

## 📊 Dashboard Features

### Enhanced Dashboard (`/dashboard`)
- Live analytics with real-time updates
- Animated statistics cards
- Activity feed with live updates
- Performance insights
- Channel health score
- Quick actions panel

### Enhanced Videos (`/videos`)
- YouTube API integration
- Live video statistics
- Advanced filtering and search
- Performance analytics
- Engagement metrics
- Direct YouTube links

### Team Management (`/team`)
- Digital employee profiles
- QR code generation for IDs
- Skills and performance tracking
- Team statistics
- Professional contact system

### Task Board (`/tasks`)
- Kanban-style project management
- Real-time task updates
- Priority and status tracking
- Team assignment
- Progress monitoring
- Due date management

## 🛠️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + ShadCN UI
- **State Management**: React Query
- **Routing**: React Router v6
- **Build Tool**: Vite
- **API Integration**: YouTube Data API v3
- **Theme System**: Next Themes
- **Animations**: Custom CSS + Framer Motion ready

## 🔧 Customization

### Updating Channel ID
Update the channel ID in `src/config/youtube.ts`:
```typescript
export const YOUTUBE_CONFIG = {
  CHANNEL_ID: 'YOUR_YOUTUBE_CHANNEL_ID',
  // ... other config
};
```

### Adding Team Members
Update team data in `src/pages/Team.tsx` or integrate with your backend API.

### Custom Branding
- Update logo and branding in `src/components/Navbar.tsx`
- Modify color scheme in `src/index.css`
- Replace hero background in `src/assets/hero-bg.jpg`

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deploy to Vercel/Netlify
The project is ready for deployment to any static hosting platform.

## 📈 Performance Features

- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components and images
- **Caching**: API responses cached locally
- **Optimized Images**: WebP support with fallbacks
- **Bundle Analysis**: Use `npm run build` to see bundle size

## 🔒 Security Features

- **Environment Variables**: Sensitive data protected
- **API Key Management**: Client-side API keys properly configured
- **CORS Handling**: Proper cross-origin request handling
- **Input Validation**: All forms and inputs validated

## 📱 Mobile Responsiveness

The platform is fully responsive and optimized for:
- Desktop (1920px+)
- Tablet (768px - 1919px)  
- Mobile (320px - 767px)

## 🆘 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify API key in Google Cloud Console
   - Check if YouTube Data API v3 is enabled
   - Ensure no billing issues

2. **Build Failures**
   - Check Node.js version (16+)
   - Clear `node_modules` and reinstall
   - Verify all environment variables

3. **Styling Issues**
   - Run `npm run build` to check for CSS conflicts
   - Verify Tailwind configuration
   - Check for missing dependencies

## 🔄 Updates and Maintenance

- **Regular Updates**: Keep dependencies updated monthly
- **API Monitoring**: Monitor YouTube API quota usage
- **Performance**: Regular lighthouse audits
- **Security**: Update environment variables quarterly

## 📞 Support

For technical support or feature requests:
- Create issues in the repository
- Contact development team
- Check documentation updates

---

**Built with ❤️ for TOMO Academy**

This platform represents a professional, premium solution for YouTube channel management with real-time data integration and modern UI/UX design principles.