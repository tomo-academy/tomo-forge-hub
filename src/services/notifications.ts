// Notification Service for TOMO Academy Platform
import { API_CONFIG } from '@/config/api';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
  avatar?: string;
  category: 'video' | 'team' | 'task' | 'system' | 'analytics';
}

export interface NotificationSettings {
  enablePush: boolean;
  enableEmail: boolean;
  enableInApp: boolean;
  categories: {
    video: boolean;
    team: boolean;
    task: boolean;
    system: boolean;
    analytics: boolean;
  };
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private settings: NotificationSettings = API_CONFIG.notifications;

  constructor() {
    this.loadMockNotifications();
    this.startRealTimeUpdates();
  }

  // Load mock notifications for demonstration
  private loadMockNotifications() {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'New Video Published',
        message: 'Firebase Tutorial - Part 5 has been published successfully',
        type: 'success',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        category: 'video',
        action: {
          label: 'View Video',
          url: '/videos'
        },
        avatar: 'KS'
      },
      {
        id: '2',
        title: 'Task Deadline Approaching',
        message: 'React Tutorial Series editing is due in 3 hours',
        type: 'warning',
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        read: false,
        category: 'task',
        action: {
          label: 'View Task',
          url: '/tasks'
        }
      },
      {
        id: '3',
        title: 'New Team Member Added',
        message: 'Welcome Dev to the TOMO Academy team!',
        type: 'info',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: true,
        category: 'team',
        action: {
          label: 'View Team',
          url: '/team'
        }
      },
      {
        id: '4',
        title: 'Channel Milestone Reached',
        message: 'Congratulations! You\'ve reached 125K subscribers',
        type: 'success',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        read: true,
        category: 'analytics',
        action: {
          label: 'View Analytics',
          url: '/dashboard'
        }
      },
      {
        id: '5',
        title: 'System Update',
        message: 'Platform updated with new features and improvements',
        type: 'info',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        category: 'system'
      }
    ];

    this.notifications = mockNotifications;
    this.notifyListeners();
  }

  // Start real-time updates (mock implementation)
  private startRealTimeUpdates() {
    // Simulate real-time notifications
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every interval
        this.addRandomNotification();
      }
    }, 30000); // Check every 30 seconds
  }

  // Add a random notification for demonstration
  private addRandomNotification() {
    const randomNotifications = [
      {
        title: 'New Comment',
        message: 'Someone commented on your latest video',
        type: 'info' as const,
        category: 'video' as const
      },
      {
        title: 'Task Completed',
        message: 'Thumbnail design task has been completed',
        type: 'success' as const,
        category: 'task' as const
      },
      {
        title: 'Analytics Update',
        message: 'Your channel gained 50 new subscribers today',
        type: 'success' as const,
        category: 'analytics' as const
      }
    ];

    const template = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
    const notification: Notification = {
      id: Date.now().toString(),
      ...template,
      timestamp: new Date(),
      read: false,
      action: {
        label: 'View Details',
        url: '/dashboard'
      }
    };

    this.notifications.unshift(notification);
    this.notifyListeners();

    // Show browser notification if enabled
    if (this.settings.enablePush && 'Notification' in window) {
      this.showBrowserNotification(notification);
    }
  }

  // Show browser notification
  private showBrowserNotification(notification: Notification) {
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        tag: notification.id
      });
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Get all notifications
  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // Get unread notifications
  getUnreadNotifications(): Notification[] {
    return this.notifications.filter(n => !n.read);
  }

  // Get unread count
  getUnreadCount(): number {
    return this.getUnreadNotifications().length;
  }

  // Mark notification as read
  markAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.notifyListeners();
  }

  // Delete notification
  deleteNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  // Clear all notifications
  clearAll(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  // Add notification listener
  addListener(callback: (notifications: Notification[]) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notify all listeners
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.getNotifications()));
  }

  // Update settings
  updateSettings(settings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...settings };
  }

  // Get settings
  getSettings(): NotificationSettings {
    return { ...this.settings };
  }

  // Add custom notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();

    // Show browser notification if enabled
    if (this.settings.enablePush && 'Notification' in window) {
      this.showBrowserNotification(newNotification);
    }
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// React hook for notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    // Initial load
    setNotifications(notificationService.getNotifications());
    setUnreadCount(notificationService.getUnreadCount());

    // Subscribe to updates
    const unsubscribe = notificationService.addListener((newNotifications) => {
      setNotifications(newNotifications);
      setUnreadCount(notificationService.getUnreadCount());
    });

    return unsubscribe;
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead: (id: string) => notificationService.markAsRead(id),
    markAllAsRead: () => notificationService.markAllAsRead(),
    deleteNotification: (id: string) => notificationService.deleteNotification(id),
    clearAll: () => notificationService.clearAll(),
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => 
      notificationService.addNotification(notification),
    requestPermission: () => notificationService.requestPermission(),
  };
};

// Import React for the hook
import React from 'react';