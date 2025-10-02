// API Configuration for TOMO Academy Platform

export const API_CONFIG = {
  // YouTube API Configuration
  youtube: {
    apiKey: process.env.VITE_YOUTUBE_API_KEY || 'demo_api_key',
    channelId: 'UCMTpEQrAqzibxN6gZDLIDpA', // TOMO Academy Channel ID
    baseUrl: 'https://www.googleapis.com/youtube/v3',
  },

  // Analytics Configuration
  analytics: {
    refreshInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 2 * 60 * 1000, // 2 minutes
  },

  // Real-time Updates Configuration
  realtime: {
    websocketUrl: process.env.VITE_WEBSOCKET_URL || 'ws://localhost:3001',
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
  },

  // Notification Configuration
  notifications: {
    enablePush: true,
    enableEmail: true,
    enableInApp: true,
  },

  // Feature Flags
  features: {
    liveData: true,
    premiumUI: true,
    darkMode: true,
    analytics: true,
    notifications: true,
    teamManagement: true,
    videoManagement: true,
    taskManagement: true,
  },
};

// Environment-specific configurations
export const ENV_CONFIG = {
  development: {
    apiUrl: 'http://localhost:3000/api',
    debug: true,
    mockData: true,
  },
  production: {
    apiUrl: 'https://api.tomoacademy.com',
    debug: false,
    mockData: false,
  },
  test: {
    apiUrl: 'http://localhost:3000/api',
    debug: true,
    mockData: true,
  },
};

// Get current environment configuration
export const getCurrentEnvConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  return ENV_CONFIG[env as keyof typeof ENV_CONFIG] || ENV_CONFIG.development;
};

// Team roles and permissions
export const TEAM_ROLES = {
  admin: {
    name: 'Administrator',
    permissions: ['all'],
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  lead: {
    name: 'Team Lead',
    permissions: ['manage_team', 'manage_projects', 'view_analytics'],
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  developer: {
    name: 'Developer',
    permissions: ['manage_projects', 'view_analytics'],
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
  editor: {
    name: 'Video Editor',
    permissions: ['manage_videos', 'view_analytics'],
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  designer: {
    name: 'Designer',
    permissions: ['manage_design', 'view_analytics'],
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  content: {
    name: 'Content Creator',
    permissions: ['manage_content', 'view_analytics'],
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  member: {
    name: 'Team Member',
    permissions: ['view_analytics'],
    color: 'text-muted-foreground',
    bgColor: 'bg-muted/10',
  },
};

// Task priorities and statuses
export const TASK_CONFIG = {
  priorities: {
    urgent: {
      name: 'Urgent',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      value: 4,
    },
    high: {
      name: 'High',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      value: 3,
    },
    medium: {
      name: 'Medium',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      value: 2,
    },
    low: {
      name: 'Low',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/10',
      value: 1,
    },
  },
  statuses: {
    backlog: {
      name: 'Backlog',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/10',
    },
    todo: {
      name: 'To Do',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    in_progress: {
      name: 'In Progress',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    review: {
      name: 'Review',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    done: {
      name: 'Done',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  },
};

// Video statuses and categories
export const VIDEO_CONFIG = {
  statuses: {
    published: {
      name: 'Published',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    scheduled: {
      name: 'Scheduled',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    in_progress: {
      name: 'In Progress',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    planned: {
      name: 'Planned',
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/10',
    },
    draft: {
      name: 'Draft',
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
  },
  categories: {
    tutorial: 'Tutorial',
    course: 'Course',
    live: 'Live Stream',
    shorts: 'Shorts',
    review: 'Review',
    news: 'News',
    interview: 'Interview',
  },
};

export default API_CONFIG;