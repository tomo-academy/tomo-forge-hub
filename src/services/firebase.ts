// Firebase Real-time Data Service for TOMO Academy
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// Types for Firebase data
export interface FirebaseEmployee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  employeeId: string;
  joinDate: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  location?: string;
  availability: 'available' | 'busy' | 'offline';
  stats: {
    videos: number;
    tasks: number;
    rating: number;
    projects: number;
  };
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
  qrCode?: string;
  cardColor?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface FirebaseRevenue {
  id: string;
  month: string;
  year: number;
  totalRevenue: number;
  adRevenue: number;
  sponsorships: number;
  memberships: number;
  merchandise: number;
  courses: number;
  createdAt: Timestamp;
}

export interface FirebaseActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  title: string;
  type: 'video' | 'task' | 'team' | 'system';
  timestamp: Timestamp;
  metadata?: any;
}

export interface FirebaseAnalytics {
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
  createdAt: Timestamp;
}

class FirebaseService {
  // Employee Management
  async getEmployees(): Promise<FirebaseEmployee[]> {
    try {
      const employeesRef = collection(db, 'employees');
      const snapshot = await getDocs(query(employeesRef, orderBy('name')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseEmployee));
    } catch (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
  }

  async getEmployee(id: string): Promise<FirebaseEmployee | null> {
    try {
      const employeeRef = doc(db, 'employees', id);
      const snapshot = await getDoc(employeeRef);
      return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as FirebaseEmployee : null;
    } catch (error) {
      console.error('Error fetching employee:', error);
      return null;
    }
  }

  async createEmployee(employee: Omit<FirebaseEmployee, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const employeesRef = collection(db, 'employees');
      const docRef = await addDoc(employeesRef, {
        ...employee,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  }

  async updateEmployee(id: string, updates: Partial<FirebaseEmployee>): Promise<void> {
    try {
      const employeeRef = doc(db, 'employees', id);
      await updateDoc(employeeRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  }

  // Revenue Management
  async getRevenue(): Promise<FirebaseRevenue[]> {
    try {
      const revenueRef = collection(db, 'revenue');
      const snapshot = await getDocs(query(revenueRef, orderBy('year', 'desc'), orderBy('month', 'desc')));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseRevenue));
    } catch (error) {
      console.error('Error fetching revenue:', error);
      return [];
    }
  }

  async getCurrentMonthRevenue(): Promise<FirebaseRevenue | null> {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
      const currentYear = currentDate.getFullYear();
      
      const revenueRef = collection(db, 'revenue');
      const snapshot = await getDocs(query(revenueRef, orderBy('createdAt', 'desc'), limit(1)));
      
      if (snapshot.empty) {
        // Create mock current month data if none exists
        const mockRevenue: Omit<FirebaseRevenue, 'id'> = {
          month: currentMonth,
          year: currentYear,
          totalRevenue: 3247,
          adRevenue: 2156,
          sponsorships: 891,
          memberships: 200,
          merchandise: 0,
          courses: 0,
          createdAt: Timestamp.now()
        };
        
        const docRef = await addDoc(revenueRef, mockRevenue);
        return { id: docRef.id, ...mockRevenue };
      }
      
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as FirebaseRevenue;
    } catch (error) {
      console.error('Error fetching current month revenue:', error);
      return null;
    }
  }

  // Activity Feed
  async getRecentActivities(limitCount: number = 10): Promise<FirebaseActivity[]> {
    try {
      const activitiesRef = collection(db, 'activities');
      const snapshot = await getDocs(query(activitiesRef, orderBy('timestamp', 'desc'), limit(limitCount)));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseActivity));
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  async addActivity(activity: Omit<FirebaseActivity, 'id' | 'timestamp'>): Promise<string> {
    try {
      const activitiesRef = collection(db, 'activities');
      const docRef = await addDoc(activitiesRef, {
        ...activity,
        timestamp: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding activity:', error);
      throw error;
    }
  }

  // Analytics
  async getAnalytics(): Promise<FirebaseAnalytics[]> {
    try {
      const analyticsRef = collection(db, 'analytics');
      const snapshot = await getDocs(query(analyticsRef, orderBy('date', 'desc'), limit(30)));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseAnalytics));
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return [];
    }
  }

  async getTodayAnalytics(): Promise<FirebaseAnalytics | null> {
    try {
      const today = new Date().toISOString().split('T')[0];
      const analyticsRef = collection(db, 'analytics');
      const snapshot = await getDocs(query(analyticsRef, orderBy('createdAt', 'desc'), limit(1)));
      
      if (snapshot.empty) {
        // Create mock today's data if none exists
        const mockAnalytics: Omit<FirebaseAnalytics, 'id'> = {
          date: today,
          subscribers: 125000,
          views: 5600000,
          watchTime: 500000,
          engagement: 87.5,
          revenue: 3247,
          videosPublished: 234,
          tasksCompleted: 89,
          teamProductivity: 92.3,
          createdAt: Timestamp.now()
        };
        
        const docRef = await addDoc(analyticsRef, mockAnalytics);
        return { id: docRef.id, ...mockAnalytics };
      }
      
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as FirebaseAnalytics;
    } catch (error) {
      console.error('Error fetching today analytics:', error);
      return null;
    }
  }

  // Real-time listeners
  onEmployeesChange(callback: (employees: FirebaseEmployee[]) => void): () => void {
    const employeesRef = collection(db, 'employees');
    return onSnapshot(query(employeesRef, orderBy('name')), (snapshot) => {
      const employees = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseEmployee));
      callback(employees);
    });
  }

  onActivitiesChange(callback: (activities: FirebaseActivity[]) => void): () => void {
    const activitiesRef = collection(db, 'activities');
    return onSnapshot(query(activitiesRef, orderBy('timestamp', 'desc'), limit(10)), (snapshot) => {
      const activities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirebaseActivity));
      callback(activities);
    });
  }

  onAnalyticsChange(callback: (analytics: FirebaseAnalytics | null) => void): () => void {
    const analyticsRef = collection(db, 'analytics');
    return onSnapshot(query(analyticsRef, orderBy('createdAt', 'desc'), limit(1)), (snapshot) => {
      const analytics = snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as FirebaseAnalytics;
      callback(analytics);
    });
  }

  // Initialize default data
  async initializeDefaultData(): Promise<void> {
    try {
      // Check if data already exists
      const employeesSnapshot = await getDocs(collection(db, 'employees'));
      if (!employeesSnapshot.empty) {
        console.log('Data already initialized');
        return;
      }

      console.log('Initializing default data...');
      
      // Initialize employees, revenue, activities, and analytics
      await this.createDefaultEmployees();
      await this.createDefaultRevenue();
      await this.createDefaultActivities();
      await this.createDefaultAnalytics();
      
      console.log('Default data initialized successfully');
    } catch (error) {
      console.error('Error initializing default data:', error);
    }
  }

  private async createDefaultEmployees(): Promise<void> {
    // This will be implemented with the actual employee data
  }

  private async createDefaultRevenue(): Promise<void> {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    
    const revenueData: Omit<FirebaseRevenue, 'id'> = {
      month: currentMonth,
      year: currentYear,
      totalRevenue: 3247,
      adRevenue: 2156,
      sponsorships: 891,
      memberships: 200,
      merchandise: 0,
      courses: 0,
      createdAt: Timestamp.now()
    };
    
    await addDoc(collection(db, 'revenue'), revenueData);
  }

  private async createDefaultActivities(): Promise<void> {
    const activities = [
      {
        userId: 'kanish-sj',
        userName: 'Kanish SJ',
        action: 'uploaded new video',
        title: 'Firebase Tutorial - Part 5',
        type: 'video' as const
      },
      {
        userId: 'kamesh',
        userName: 'Kamesh',
        action: 'completed design task',
        title: 'Thumbnail for Tech Review',
        type: 'task' as const
      },
      {
        userId: 'ajay-krithick',
        userName: 'Ajay Krithick',
        action: 'reviewed and approved',
        title: 'Script: AI in Education',
        type: 'task' as const
      }
    ];

    for (const activity of activities) {
      await addDoc(collection(db, 'activities'), {
        ...activity,
        timestamp: Timestamp.now()
      });
    }
  }

  private async createDefaultAnalytics(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    
    const analyticsData: Omit<FirebaseAnalytics, 'id'> = {
      date: today,
      subscribers: 125000,
      views: 5600000,
      watchTime: 500000,
      engagement: 87.5,
      revenue: 3247,
      videosPublished: 234,
      tasksCompleted: 89,
      teamProductivity: 92.3,
      createdAt: Timestamp.now()
    };
    
    await addDoc(collection(db, 'analytics'), analyticsData);
  }
}

export const firebaseService = new FirebaseService();