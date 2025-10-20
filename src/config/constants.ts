// Application Constants
export const APP_CONFIG = {
  // Domain Configuration
  DOMAIN: 'https://www.tomoacademy.site',
  APP_NAME: 'TOMO Academy',
  
  // API Endpoints
  API_BASE_URL: process.env.VITE_API_BASE_URL || 'https://api.tomoacademy.site',
  
  // Social Media
  SOCIAL_LINKS: {
    youtube: 'https://www.youtube.com/@tomoacademy',
    twitter: 'https://twitter.com/tomo_academy',
    linkedin: 'https://www.linkedin.com/company/tomo-academy',
    github: 'https://github.com/tomo-academy'
  },
  
  // SEO Configuration
  DEFAULT_META: {
    title: 'TOMO Academy - Digital Learning Platform',
    description: 'TOMO Academy is a comprehensive digital learning platform offering high-quality educational content, tutorials, and resources for technology enthusiasts and learners.',
    keywords: ['TOMO Academy', 'online learning', 'tutorials', 'education', 'technology', 'programming', 'web development'],
    image: '/TOMO.jpg'
  }
};

// Helper function to generate profile URLs
export const generateProfileUrl = (employeeId: string): string => {
  return `${APP_CONFIG.DOMAIN}/profile/${employeeId}`;
};

// Helper function to generate absolute URLs
export const generateAbsoluteUrl = (path: string): string => {
  return path.startsWith('http') ? path : `${APP_CONFIG.DOMAIN}${path}`;
};

export default APP_CONFIG;