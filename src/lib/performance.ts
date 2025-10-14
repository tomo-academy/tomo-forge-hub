// Performance monitoring and optimization utilities for production

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  private constructor() {
    this.initializeObservers();
  }

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    // Observe Long Tasks
    try {
      const longTaskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn('Long Task detected:', entry.duration, 'ms');
          this.recordMetric('longTask', entry.duration);
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (e) {
      // Long Task API not supported
    }

    // Observe Layout Shifts
    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            this.recordMetric('cls', (entry as any).value);
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      // Layout Shift API not supported
    }

    // Observe Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.recordMetric('lcp', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      // LCP API not supported
    }

    // Observe First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric('fid', (entry as any).processingStart - entry.startTime);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      // FID API not supported
    }
  }

  private recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);

    // Send to analytics in production
    if (import.meta.env.PROD) {
      this.sendToAnalytics(name, value);
    }
  }

  private sendToAnalytics(name: string, value: number) {
    // Placeholder for analytics service
    console.log(`[Analytics] ${name}:`, value);
    
    // TODO: Send to your analytics service
    // Example: Google Analytics, Mixpanel, etc.
  }

  // Measure component render time
  measureRender(componentName: string, callback: () => void) {
    const start = performance.now();
    callback();
    const duration = performance.now() - start;
    this.recordMetric(`render_${componentName}`, duration);
    
    if (duration > 16) { // Longer than one frame (60fps)
      console.warn(`Slow render detected in ${componentName}:`, duration, 'ms');
    }
  }

  // Measure API call duration
  async measureApiCall<T>(name: string, apiCall: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await apiCall();
      const duration = performance.now() - start;
      this.recordMetric(`api_${name}`, duration);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      this.recordMetric(`api_${name}_error`, duration);
      throw error;
    }
  }

  // Get Core Web Vitals
  getCoreWebVitals() {
    return {
      lcp: this.getMetricAverage('lcp'),
      fid: this.getMetricAverage('fid'),
      cls: this.getMetricAverage('cls'),
    };
  }

  private getMetricAverage(name: string): number | null {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return null;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  // Get all metrics
  getAllMetrics() {
    const result: Record<string, any> = {};
    this.metrics.forEach((values, name) => {
      result[name] = {
        count: values.length,
        average: values.reduce((a, b) => a + b, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
      };
    });
    return result;
  }

  // Clean up observers
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Image optimization utilities
export const imageOptimization = {
  // Lazy load images
  lazyLoadImage(img: HTMLImageElement) {
    if ('loading' in HTMLImageElement.prototype) {
      img.loading = 'lazy';
    } else {
      // Fallback for browsers that don't support lazy loading
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLImageElement;
            target.src = target.dataset.src || '';
            observer.unobserve(target);
          }
        });
      });
      observer.observe(img);
    }
  },

  // Get optimized image URL (for services like Cloudinary, Imgix, etc.)
  getOptimizedUrl(url: string, width?: number, quality?: number): string {
    // If using Unsplash, add optimization parameters
    if (url.includes('unsplash.com')) {
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (quality) params.set('q', quality.toString());
      params.set('auto', 'format');
      return `${url}?${params.toString()}`;
    }
    return url;
  },

  // Preload critical images
  preloadImage(url: string) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  },
};

// Code splitting utilities
export const codeSplitting = {
  // Prefetch component
  prefetchComponent(importFn: () => Promise<any>) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => importFn());
    } else {
      setTimeout(() => importFn(), 1);
    }
  },

  // Preload component
  preloadComponent(importFn: () => Promise<any>) {
    importFn();
  },
};

// Bundle size optimization
export const bundleOptimization = {
  // Dynamic import with retry
  async dynamicImport<T>(
    importFn: () => Promise<T>,
    retries = 3
  ): Promise<T> {
    try {
      return await importFn();
    } catch (error) {
      if (retries > 0) {
        console.warn(`Import failed, retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.dynamicImport(importFn, retries - 1);
      }
      throw error;
    }
  },
};

// Memory leak detection
export const memoryMonitor = {
  checkMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      const usedMemory = memory.usedJSHeapSize / 1048576; // Convert to MB
      const totalMemory = memory.totalJSHeapSize / 1048576;
      const limit = memory.jsHeapSizeLimit / 1048576;

      console.log('Memory Usage:', {
        used: `${usedMemory.toFixed(2)} MB`,
        total: `${totalMemory.toFixed(2)} MB`,
        limit: `${limit.toFixed(2)} MB`,
        percentage: `${((usedMemory / limit) * 100).toFixed(2)}%`,
      });

      if (usedMemory / limit > 0.9) {
        console.warn('High memory usage detected!');
      }
    }
  },

  // Monitor memory leaks
  startMemoryMonitoring(intervalMs = 30000) {
    return setInterval(() => {
      this.checkMemoryUsage();
    }, intervalMs);
  },
};

// Network optimization
export const networkOptimization = {
  // Check connection quality
  getConnectionQuality(): 'slow' | 'medium' | 'fast' {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      const effectiveType = conn.effectiveType;
      
      if (effectiveType === '4g') return 'fast';
      if (effectiveType === '3g') return 'medium';
      return 'slow';
    }
    return 'medium'; // Default
  },

  // Adapt quality based on connection
  shouldLoadHighQuality(): boolean {
    return this.getConnectionQuality() === 'fast';
  },

  // Prefetch on hover
  prefetchOnHover(url: string) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  },
};

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  return {
    measureRender: (name: string, callback: () => void) => 
      performanceMonitor.measureRender(name, callback),
    measureApiCall: <T,>(name: string, apiCall: () => Promise<T>) => 
      performanceMonitor.measureApiCall(name, apiCall),
    getCoreWebVitals: () => performanceMonitor.getCoreWebVitals(),
    getAllMetrics: () => performanceMonitor.getAllMetrics(),
  };
};
