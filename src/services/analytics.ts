// Analytics Service for Real-time Data
export interface AnalyticsData {
  totalViews: number;
  totalVideos: number;
  subscribers: number;
  engagementRate: number;
  averageWatchTime: number;
  topPerformingVideos: Array<{
    id: string;
    title: string;
    views: number;
    engagement: number;
  }>;
  recentActivity: Array<{
    timestamp: Date;
    type: 'video_upload' | 'comment' | 'subscriber' | 'like';
    description: string;
    metadata?: Record<string, unknown>;
  }>;
  growthMetrics: {
    viewsGrowth: number;
    subscribersGrowth: number;
    engagementGrowth: number;
  };
}

export interface TeamPerformanceData {
  memberId: string;
  name: string;
  videosCreated: number;
  totalViews: number;
  averageRating: number;
  tasksCompleted: number;
  efficiency: number;
  contributions: Array<{
    date: Date;
    type: string;
    description: string;
    impact: number;
  }>;
}

class AnalyticsService {
  private readonly UPDATE_INTERVAL = 30000; // 30 seconds
  private subscribers: Set<(data: AnalyticsData) => void> = new Set();
  private currentData: AnalyticsData | null = null;
  private updateTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.startRealTimeUpdates();
  }

  // Subscribe to real-time analytics updates
  subscribe(callback: (data: AnalyticsData) => void): () => void {
    this.subscribers.add(callback);
    
    // Send current data if available
    if (this.currentData) {
      callback(this.currentData);
    }

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Start real-time updates
  private startRealTimeUpdates() {
    this.updateData();
    
    this.updateTimer = setInterval(() => {
      this.updateData();
    }, this.UPDATE_INTERVAL);
  }

  // Stop real-time updates
  stopRealTimeUpdates() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  }

  // Fetch and update analytics data
  private async updateData() {
    try {
      const data = await this.fetchAnalyticsData();
      this.currentData = data;
      
      // Notify all subscribers
      this.subscribers.forEach(callback => callback(data));
    } catch (error) {
      console.error('Error updating analytics data:', error);
    }
  }

  // Fetch analytics data (integrate with YouTube API and other sources)
  private async fetchAnalyticsData(): Promise<AnalyticsData> {
    try {
      // In a real implementation, this would fetch from multiple sources:
      // - YouTube Analytics API
      // - Custom backend API
      // - Database queries
      
      // For now, we'll simulate real-time data with some variation
      const baseData = await this.getBaseAnalytics();
      
      return {
        ...baseData,
        // Add some real-time variation
        totalViews: baseData.totalViews + Math.floor(Math.random() * 100),
        subscribers: baseData.subscribers + Math.floor(Math.random() * 5),
        engagementRate: Math.round((baseData.engagementRate + (Math.random() - 0.5) * 0.1) * 100) / 100,
        recentActivity: await this.getRecentActivity(),
        growthMetrics: {
          viewsGrowth: 12.3 + (Math.random() - 0.5) * 2,
          subscribersGrowth: 3.2 + (Math.random() - 0.5) * 1,
          engagementGrowth: 5.7 + (Math.random() - 0.5) * 3,
        },
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return this.getMockAnalytics();
    }
  }

  // Get base analytics data
  private async getBaseAnalytics(): Promise<Omit<AnalyticsData, 'recentActivity' | 'growthMetrics'>> {
    return {
      totalViews: 5600000,
      totalVideos: 234,
      subscribers: 125000,
      engagementRate: 4.2,
      averageWatchTime: 8.5,
      topPerformingVideos: [
        {
          id: 'video1',
          title: 'Complete Firebase Tutorial',
          views: 45230,
          engagement: 8.9,
        },
        {
          id: 'video2',
          title: 'React Hooks Deep Dive',
          views: 38940,
          engagement: 7.6,
        },
        {
          id: 'video3',
          title: 'TypeScript for Beginners',
          views: 34280,
          engagement: 9.1,
        },
      ],
    };
  }

  // Get recent activity with real-time simulation
  private async getRecentActivity() {
    const activities = [
      {
        timestamp: new Date(Date.now() - Math.random() * 3600000),
        type: 'video_upload' as const,
        description: 'New video uploaded: "Advanced React Patterns"',
      },
      {
        timestamp: new Date(Date.now() - Math.random() * 7200000),
        type: 'subscriber' as const,
        description: '+12 new subscribers in the last hour',
      },
      {
        timestamp: new Date(Date.now() - Math.random() * 1800000),
        type: 'comment' as const,
        description: 'High engagement on "Firebase Tutorial" - 25 new comments',
      },
      {
        timestamp: new Date(Date.now() - Math.random() * 900000),
        type: 'like' as const,
        description: '"+156 likes on recent videos"',
      },
    ];

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 6);
  }

  // Get mock analytics for fallback
  private getMockAnalytics(): AnalyticsData {
    return {
      totalViews: 5600000,
      totalVideos: 234,
      subscribers: 125000,
      engagementRate: 4.2,
      averageWatchTime: 8.5,
      topPerformingVideos: [
        { id: 'v1', title: 'Complete Firebase Tutorial', views: 45230, engagement: 8.9 },
        { id: 'v2', title: 'React Hooks Deep Dive', views: 38940, engagement: 7.6 },
        { id: 'v3', title: 'TypeScript for Beginners', views: 34280, engagement: 9.1 },
      ],
      recentActivity: [
        {
          timestamp: new Date(),
          type: 'video_upload',
          description: 'New video uploaded',
        },
      ],
      growthMetrics: {
        viewsGrowth: 12.3,
        subscribersGrowth: 3.2,
        engagementGrowth: 5.7,
      },
    };
  }

  // Get team performance data
  async getTeamPerformance(): Promise<TeamPerformanceData[]> {
    return [
      {
        memberId: '1',
        name: 'Kanish SJ',
        videosCreated: 28,
        totalViews: 458230,
        averageRating: 4.9,
        tasksCompleted: 165,
        efficiency: 94.5,
        contributions: [
          {
            date: new Date('2025-09-28'),
            type: 'Video Creation',
            description: 'Firebase Tutorial Series',
            impact: 95,
          },
        ],
      },
      {
        memberId: '2',
        name: 'Nithish',
        videosCreated: 34,
        totalViews: 523940,
        averageRating: 4.8,
        tasksCompleted: 189,
        efficiency: 92.1,
        contributions: [
          {
            date: new Date('2025-09-27'),
            type: 'Video Editing',
            description: 'React Hooks Tutorial',
            impact: 88,
          },
        ],
      },
    ];
  }

  // Get current analytics data
  getCurrentData(): AnalyticsData | null {
    return this.currentData;
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;