// YouTube API Configuration
export const YOUTUBE_CONFIG = {
  API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY || 'YOUR_YOUTUBE_API_KEY',
  CHANNEL_ID: 'UCMTpEQrAqzibxN6gZDLIDpA', // TOMO Academy Channel ID
  BASE_URL: 'https://www.googleapis.com/youtube/v3',
  MAX_RESULTS: 50,
};

// YouTube API endpoints
export const YOUTUBE_ENDPOINTS = {
  SEARCH: '/search',
  VIDEOS: '/videos',
  CHANNELS: '/channels',
  PLAYLISTS: '/playlists',
  COMMENTS: '/commentThreads',
  ANALYTICS: '/analytics',
};

// YouTube API scopes for authenticated requests
export const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/yt-analytics.readonly',
];

// Video categories mapping
export const VIDEO_CATEGORIES = {
  'howto': 26,
  'education': 27,
  'technology': 28,
  'programming': 28,
  'tutorial': 27,
} as const;

// Analytics periods
export const ANALYTICS_PERIODS = {
  '7days': { days: 7, label: '7 Days' },
  '28days': { days: 28, label: '28 Days' },
  '90days': { days: 90, label: '90 Days' },
  '365days': { days: 365, label: '1 Year' },
} as const;

// Rate limiting configuration
export const RATE_LIMITS = {
  REQUESTS_PER_MINUTE: 60,
  REQUESTS_PER_DAY: 10000,
};