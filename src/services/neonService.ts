// NeonDB Service - Replaces Firebase
import { db, sql } from '@/lib/db';

// Mock data for fallback
const mockRevenue = {
  id: 'rev-current',
  month: new Date().toLocaleString('default', { month: 'long' }),
  year: new Date().getFullYear(),
  totalRevenue: 3247,
  adRevenue: 2156,
  sponsorships: 891,
  memberships: 200,
  merchandise: 0,
  courses: 0
};

const mockActivities = [
  {
    id: 'act-1',
    userId: 'kanish-sj',
    userName: 'Kanish SJ',
    action: 'uploaded new video',
    title: 'Firebase Tutorial - Part 5',
    type: 'video' as const,
    timestamp: new Date().toISOString()
  },
  {
    id: 'act-2',
    userId: 'kamesh',
    userName: 'Kamesh AJ',
    action: 'completed design task',
    title: 'Thumbnail for Tech Review',
    type: 'task' as const,
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'act-3',
    userId: 'ajay-krithick',
    userName: 'Ajay Krithick',
    action: 'reviewed and approved',
    title: 'Script: AI in Education',
    type: 'task' as const,
    timestamp: new Date(Date.now() - 7200000).toISOString()
  }
];

const mockAnalytics = {
  id: 'analytics-today',
  date: new Date().toISOString().split('T')[0],
  subscribers: 125000,
  views: 5600000,
  watchTime: 500000,
  engagement: 87.5,
  revenue: 3247,
  videosPublished: 234,
  tasksCompleted: 89,
  teamProductivity: 92.3
};

export interface Revenue {
  id: string;
  month: string;
  year: number;
  totalRevenue: number;
  adRevenue: number;
  sponsorships: number;
  memberships: number;
  merchandise: number;
  courses: number;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  title: string;
  type: 'video' | 'task' | 'team' | 'system';
  timestamp: string;
  metadata?: any;
}

export interface Analytics {
  id: string;
  date: string;
  subscribers: number;
  views: number;
  watchTime: number;
  engagement: number;
  revenue: number;
  videosPublished: number;
  tasksCompleted: number;
  teamProductivity: number;
}

class NeonService {
  // Employee Management
  async getEmployees() {
    return await db.employees.getAll();
  }

  async getEmployee(id: string) {
    return await db.employees.getById(id);
  }

  async updateEmployee(id: string, updates: any) {
    return await db.employees.update(id, updates);
  }

  // Revenue Management
  async getCurrentMonthRevenue(): Promise<Revenue> {
    try {
      const currentMonth = new Date().toLocaleString('default', { month: 'long' });
      const currentYear = new Date().getFullYear();
      
      // Try to fetch from database
      if (!sql) {
        console.log('📊 No database connection, using fallback data');
        return mockRevenue;
      }
      
      const result = await sql`
        SELECT * FROM revenue 
        WHERE month = ${currentMonth} AND year = ${currentYear}
        ORDER BY created_at DESC 
        LIMIT 1
      `;
      
      if (result && result.length > 0) {
        const data = result[0];
        console.log('✅ Loaded real revenue data from database');
        return {
          id: data.id,
          month: data.month,
          year: data.year,
          totalRevenue: parseFloat(data.total_revenue) || 0,
          adRevenue: parseFloat(data.ad_revenue) || 0,
          sponsorships: parseFloat(data.sponsorships) || 0,
          memberships: parseFloat(data.memberships) || 0,
          merchandise: parseFloat(data.merchandise) || 0,
          courses: parseFloat(data.courses) || 0
        };
      }
      
      // If no data, create initial record
      console.log('📊 No revenue data found, creating initial record...');
      await sql`
        INSERT INTO revenue (id, month, year, total_revenue, ad_revenue, sponsorships, memberships, merchandise, courses)
        VALUES (
          ${'rev-' + Date.now()},
          ${currentMonth},
          ${currentYear},
          ${mockRevenue.totalRevenue},
          ${mockRevenue.adRevenue},
          ${mockRevenue.sponsorships},
          ${mockRevenue.memberships},
          ${mockRevenue.merchandise},
          ${mockRevenue.courses}
        )
        ON CONFLICT (month, year) DO NOTHING
      `;
      
      return mockRevenue;
    } catch (error) {
      console.error('❌ Error fetching revenue:', error);
      console.log('📊 Using fallback revenue data');
      return mockRevenue;
    }
  }

  // Activity Feed
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    try {
      if (!sql) {
        console.log('📋 No database connection, using fallback data');
        return mockActivities.slice(0, limit);
      }
      
      // Try to fetch from database
      const result = await sql`
        SELECT * FROM activities 
        ORDER BY timestamp DESC 
        LIMIT ${limit}
      `;
      
      if (result && result.length > 0) {
        console.log('✅ Loaded real activities from database:', result.length);
        return result.map((row: any) => ({
          id: row.id,
          userId: row.user_id,
          userName: row.user_name,
          action: row.action,
          title: row.title,
          type: row.type,
          timestamp: row.timestamp,
          metadata: row.metadata
        }));
      }
      
      // If no data, seed some initial activities
      console.log('📋 No activities found, creating initial activities...');
      for (const activity of mockActivities) {
        await sql`
          INSERT INTO activities (id, user_id, user_name, action, title, type, timestamp)
          VALUES (
            ${activity.id},
            ${activity.userId},
            ${activity.userName},
            ${activity.action},
            ${activity.title},
            ${activity.type},
            ${activity.timestamp}
          )
          ON CONFLICT (id) DO NOTHING
        `;
      }
      
      return mockActivities.slice(0, limit);
    } catch (error) {
      console.error('❌ Error fetching activities:', error);
      console.log('📋 Using fallback activities data');
      return mockActivities.slice(0, limit);
    }
  }

  async addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<string> {
    try {
      if (!sql) {
        console.log('📋 No database connection, activity not saved');
        return 'activity-' + Date.now();
      }
      
      const activityId = 'activity-' + Date.now();
      
      await sql`
        INSERT INTO activities (id, user_id, user_name, action, title, type, metadata)
        VALUES (
          ${activityId},
          ${activity.userId},
          ${activity.userName},
          ${activity.action},
          ${activity.title},
          ${activity.type},
          ${JSON.stringify(activity.metadata || {})}
        )
      `;
      
      console.log('✅ Activity added to database:', activity);
      return activityId;
    } catch (error) {
      console.error('❌ Error adding activity:', error);
      throw error;
    }
  }

  // Analytics
  async getTodayAnalytics(): Promise<Analytics> {
    try {
      if (!sql) {
        console.log('📈 No database connection, using fallback data');
        return mockAnalytics;
      }
      
      const today = new Date().toISOString().split('T')[0];
      
      // Try to fetch from database
      const result = await sql`
        SELECT * FROM analytics 
        WHERE date = ${today}
        LIMIT 1
      `;
      
      if (result && result.length > 0) {
        const data = result[0];
        console.log('✅ Loaded real analytics from database');
        return {
          id: data.id,
          date: data.date,
          subscribers: data.subscribers || 0,
          views: data.views || 0,
          watchTime: data.watch_time || 0,
          engagement: parseFloat(data.engagement) || 0,
          revenue: parseFloat(data.revenue) || 0,
          videosPublished: data.videos_published || 0,
          tasksCompleted: data.tasks_completed || 0,
          teamProductivity: parseFloat(data.team_productivity) || 0
        };
      }
      
      // If no data for today, create initial record
      console.log('📈 No analytics for today, creating initial record...');
      await sql`
        INSERT INTO analytics (id, date, subscribers, views, watch_time, engagement, revenue, videos_published, tasks_completed, team_productivity)
        VALUES (
          ${'analytics-' + Date.now()},
          ${today},
          ${mockAnalytics.subscribers},
          ${mockAnalytics.views},
          ${mockAnalytics.watchTime},
          ${mockAnalytics.engagement},
          ${mockAnalytics.revenue},
          ${mockAnalytics.videosPublished},
          ${mockAnalytics.tasksCompleted},
          ${mockAnalytics.teamProductivity}
        )
        ON CONFLICT (date) DO NOTHING
      `;
      
      return mockAnalytics;
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      console.log('📈 Using fallback analytics data');
      return mockAnalytics;
    }
  }

  // Initialize default data (no-op since we use SQL seed files)
  async initializeDefaultData(): Promise<void> {
    console.log('✅ Database initialization handled by SQL seed files');
  }
}

export const neonService = new NeonService();
