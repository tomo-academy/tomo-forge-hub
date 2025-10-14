// NeonDB Service - Replaces Firebase
import { db } from '@/lib/db';

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
      // In a real implementation, this would query the revenue table
      console.log('📊 Using mock revenue data');
      return mockRevenue;
    } catch (error) {
      console.error('Error fetching revenue:', error);
      return mockRevenue;
    }
  }

  // Activity Feed
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    try {
      // In a real implementation, this would query the activities table
      console.log('📋 Using mock activities data');
      return mockActivities.slice(0, limit);
    } catch (error) {
      console.error('Error fetching activities:', error);
      return mockActivities.slice(0, limit);
    }
  }

  async addActivity(activity: Omit<Activity, 'id' | 'timestamp'>): Promise<string> {
    try {
      // In a real implementation, this would insert into activities table
      console.log('➕ Activity added:', activity);
      return 'activity-' + Date.now();
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  }

  // Analytics
  async getTodayAnalytics(): Promise<Analytics> {
    try {
      // In a real implementation, this would query the analytics table
      console.log('📈 Using mock analytics data');
      return mockAnalytics;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return mockAnalytics;
    }
  }

  // Initialize default data (no-op since we use SQL seed files)
  async initializeDefaultData(): Promise<void> {
    console.log('✅ Database initialization handled by SQL seed files');
  }
}

export const neonService = new NeonService();
