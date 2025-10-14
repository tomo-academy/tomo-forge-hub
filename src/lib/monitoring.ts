// Production monitoring and health checks

export interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  checks: {
    database: CheckStatus;
    youtube: CheckStatus;
    memory: CheckStatus;
    performance: CheckStatus;
  };
  uptime: number;
  version: string;
}

interface CheckStatus {
  status: 'pass' | 'warn' | 'fail';
  message: string;
  responseTime?: number;
  details?: any;
}

class HealthMonitor {
  private startTime = Date.now();
  private version = import.meta.env.VITE_APP_VERSION || '1.0.0';

  // Check database health
  async checkDatabase(): Promise<CheckStatus> {
    const start = Date.now();
    
    try {
      // Try to query database
      const { db } = await import('@/lib/db');
      
      if (!db.sql) {
        return {
          status: 'warn',
          message: 'Database not configured',
          responseTime: Date.now() - start,
        };
      }

      // Simple health check query
      await db.sql`SELECT 1`;
      
      return {
        status: 'pass',
        message: 'Database connection successful',
        responseTime: Date.now() - start,
      };
    } catch (error) {
      return {
        status: 'fail',
        message: `Database error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        responseTime: Date.now() - start,
      };
    }
  }

  // Check YouTube API health
  async checkYouTube(): Promise<CheckStatus> {
    const start = Date.now();
    
    try {
      const { youtubeAnalyticsService } = await import('@/services/youtubeAnalytics');
      const stats = await youtubeAnalyticsService.getChannelStatistics();
      
      if (stats.subscriberCount && stats.subscriberCount > 0) {
        return {
          status: 'pass',
          message: 'YouTube API responding',
          responseTime: Date.now() - start,
          details: {
            subscribers: stats.subscriberCount,
            videos: stats.videoCount,
          },
        };
      }
      
      return {
        status: 'warn',
        message: 'YouTube API returned no data (using fallback)',
        responseTime: Date.now() - start,
      };
    } catch (error) {
      return {
        status: 'warn',
        message: 'YouTube API unavailable (using fallback)',
        responseTime: Date.now() - start,
      };
    }
  }

  // Check memory usage
  checkMemory(): CheckStatus {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMemory = memory.usedJSHeapSize / 1048576; // MB
      const limit = memory.jsHeapSizeLimit / 1048576;
      const percentage = (usedMemory / limit) * 100;

      if (percentage > 90) {
        return {
          status: 'fail',
          message: `Critical memory usage: ${percentage.toFixed(1)}%`,
          details: {
            used: `${usedMemory.toFixed(2)} MB`,
            limit: `${limit.toFixed(2)} MB`,
            percentage: `${percentage.toFixed(1)}%`,
          },
        };
      }

      if (percentage > 70) {
        return {
          status: 'warn',
          message: `High memory usage: ${percentage.toFixed(1)}%`,
          details: {
            used: `${usedMemory.toFixed(2)} MB`,
            limit: `${limit.toFixed(2)} MB`,
            percentage: `${percentage.toFixed(1)}%`,
          },
        };
      }

      return {
        status: 'pass',
        message: `Memory usage normal: ${percentage.toFixed(1)}%`,
        details: {
          used: `${usedMemory.toFixed(2)} MB`,
          limit: `${limit.toFixed(2)} MB`,
          percentage: `${percentage.toFixed(1)}%`,
        },
      };
    }

    return {
      status: 'warn',
      message: 'Memory API not available',
    };
  }

  // Check performance metrics
  checkPerformance(): CheckStatus {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (!navigation) {
      return {
        status: 'warn',
        message: 'Performance API not available',
      };
    }

    const loadTime = navigation.loadEventEnd - navigation.fetchStart;
    const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.fetchStart;

    if (loadTime > 5000) {
      return {
        status: 'fail',
        message: `Slow page load: ${loadTime.toFixed(0)}ms`,
        details: {
          loadTime: `${loadTime.toFixed(0)}ms`,
          domContentLoaded: `${domContentLoaded.toFixed(0)}ms`,
        },
      };
    }

    if (loadTime > 3000) {
      return {
        status: 'warn',
        message: `Moderate page load: ${loadTime.toFixed(0)}ms`,
        details: {
          loadTime: `${loadTime.toFixed(0)}ms`,
          domContentLoaded: `${domContentLoaded.toFixed(0)}ms`,
        },
      };
    }

    return {
      status: 'pass',
      message: `Good page load: ${loadTime.toFixed(0)}ms`,
      details: {
        loadTime: `${loadTime.toFixed(0)}ms`,
        domContentLoaded: `${domContentLoaded.toFixed(0)}ms`,
      },
    };
  }

  // Run all health checks
  async runHealthCheck(): Promise<HealthCheckResult> {
    const [database, youtube] = await Promise.all([
      this.checkDatabase(),
      this.checkYouTube(),
    ]);

    const memory = this.checkMemory();
    const performance = this.checkPerformance();

    const checks = { database, youtube, memory, performance };
    
    // Determine overall status
    const hasFailure = Object.values(checks).some(check => check.status === 'fail');
    const hasWarning = Object.values(checks).some(check => check.status === 'warn');
    
    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (hasFailure) {
      status = 'unhealthy';
    } else if (hasWarning) {
      status = 'degraded';
    } else {
      status = 'healthy';
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      checks,
      uptime: Date.now() - this.startTime,
      version: this.version,
    };
  }

  // Get uptime in human-readable format
  getUptime(): string {
    const uptime = Date.now() - this.startTime;
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }
}

// Singleton instance
export const healthMonitor = new HealthMonitor();

// Error tracking
export class ErrorTracker {
  private errors: Array<{
    message: string;
    stack?: string;
    timestamp: string;
    url: string;
    userAgent: string;
  }> = [];

  private maxErrors = 100;

  trackError(error: Error, context?: any) {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      context,
    };

    // Add to local storage
    this.errors.push(errorData);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console in development
    if (!import.meta.env.PROD) {
      console.error('[Error Tracker]', errorData);
    }

    // Send to error tracking service in production
    if (import.meta.env.PROD) {
      this.sendToService(errorData);
    }
  }

  private async sendToService(errorData: any) {
    try {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
      console.log('[Error Tracker] Would send to service:', errorData);
      
      // Example: Sentry
      // Sentry.captureException(error, { extra: context });
    } catch (e) {
      console.error('Failed to send error to tracking service:', e);
    }
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }

  getErrorStats() {
    const errorsByType: Record<string, number> = {};
    
    this.errors.forEach(error => {
      const type = error.message.split(':')[0] || 'Unknown';
      errorsByType[type] = (errorsByType[type] || 0) + 1;
    });

    return {
      total: this.errors.length,
      byType: errorsByType,
      recent: this.errors.slice(-10),
    };
  }
}

// Singleton instance
export const errorTracker = new ErrorTracker();

// Analytics tracking
export class AnalyticsTracker {
  private events: Array<{
    name: string;
    properties?: any;
    timestamp: string;
  }> = [];

  trackEvent(name: string, properties?: any) {
    const event = {
      name,
      properties,
      timestamp: new Date().toISOString(),
    };

    this.events.push(event);

    // Send to analytics service
    if (import.meta.env.PROD) {
      this.sendToService(event);
    } else {
      console.log('[Analytics]', event);
    }
  }

  trackPageView(path: string, title?: string) {
    this.trackEvent('page_view', {
      path,
      title: title || document.title,
      referrer: document.referrer,
    });
  }

  trackClick(element: string, properties?: any) {
    this.trackEvent('click', {
      element,
      ...properties,
    });
  }

  trackSearch(query: string, results: number) {
    this.trackEvent('search', {
      query,
      results,
    });
  }

  trackError(error: Error, context?: any) {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  private async sendToService(event: any) {
    try {
      // TODO: Send to analytics service (Google Analytics, Mixpanel, etc.)
      console.log('[Analytics] Would send to service:', event);
      
      // Example: Google Analytics 4
      // gtag('event', event.name, event.properties);
      
      // Example: Mixpanel
      // mixpanel.track(event.name, event.properties);
    } catch (e) {
      console.error('Failed to send analytics event:', e);
    }
  }

  getEvents() {
    return this.events;
  }

  getEventStats() {
    const eventsByName: Record<string, number> = {};
    
    this.events.forEach(event => {
      eventsByName[event.name] = (eventsByName[event.name] || 0) + 1;
    });

    return {
      total: this.events.length,
      byName: eventsByName,
      recent: this.events.slice(-20),
    };
  }
}

// Singleton instance
export const analyticsTracker = new AnalyticsTracker();

// Setup global error handlers
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    errorTracker.trackError(event.error, {
      type: 'window.error',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.trackError(
      new Error(`Unhandled Promise Rejection: ${event.reason}`),
      { type: 'unhandledrejection' }
    );
  });
}
