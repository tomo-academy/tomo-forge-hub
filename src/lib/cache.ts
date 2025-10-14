// Advanced caching strategies for production

export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  maxSize?: number; // Maximum cache size
  staleWhileRevalidate?: boolean;
}

export class CacheManager {
  private cache: Map<string, { data: any; timestamp: number; ttl: number }> = new Map();
  private maxSize: number;

  constructor(maxSize = 100) {
    this.maxSize = maxSize;
  }

  // Set cache with TTL
  set(key: string, data: any, ttl = 5 * 60 * 1000) {
    // Remove oldest entry if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  // Get from cache
  get<T = any>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  // Check if key exists and is valid
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  // Clear specific key
  delete(key: string) {
    this.cache.delete(key);
  }

  // Clear all cache
  clear() {
    this.cache.clear();
  }

  // Get cache size
  size(): number {
    return this.cache.size;
  }

  // Get cache stats
  getStats() {
    let validEntries = 0;
    let expiredEntries = 0;

    this.cache.forEach((entry) => {
      const isExpired = Date.now() - entry.timestamp > entry.ttl;
      if (isExpired) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    });

    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
      maxSize: this.maxSize,
    };
  }

  // Clean expired entries
  cleanup() {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.cache.delete(key));
    
    return keysToDelete.length;
  }
}

// Singleton instance
export const cacheManager = new CacheManager(200);

// Auto cleanup every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    const cleaned = cacheManager.cleanup();
    if (cleaned > 0) {
      console.log(`[Cache] Cleaned ${cleaned} expired entries`);
    }
  }, 5 * 60 * 1000);
}

// IndexedDB cache for larger data
export class IndexedDBCache {
  private dbName = 'tomo-academy-cache';
  private storeName = 'cache-store';
  private db: IDBDatabase | null = null;

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async set(key: string, data: any, ttl = 24 * 60 * 60 * 1000) {
    if (!this.db) await this.init();

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const value = {
        data,
        timestamp: Date.now(),
        ttl,
      };

      const request = store.put(value, key);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T = any>(key: string): Promise<T | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        
        if (!result) {
          resolve(null);
          return;
        }

        const isExpired = Date.now() - result.timestamp > result.ttl;
        
        if (isExpired) {
          this.delete(key);
          resolve(null);
          return;
        }

        resolve(result.data as T);
      };

      request.onerror = () => reject(request.error);
    });
  }

  async delete(key: string) {
    if (!this.db) await this.init();

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear() {
    if (!this.db) await this.init();

    return new Promise<void>((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Service Worker cache (for offline support)
export const serviceWorkerCache = {
  async cacheAssets(urls: string[]) {
    if ('serviceWorker' in navigator && 'caches' in window) {
      const cache = await caches.open('tomo-academy-v1');
      await cache.addAll(urls);
    }
  },

  async getCachedResponse(url: string): Promise<Response | undefined> {
    if ('caches' in window) {
      return await caches.match(url);
    }
    return undefined;
  },

  async clearOldCaches() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      const currentCache = 'tomo-academy-v1';
      
      await Promise.all(
        cacheNames
          .filter(name => name !== currentCache)
          .map(name => caches.delete(name))
      );
    }
  },
};

// React Query cache configuration
export const reactQueryCacheConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 2,
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
};

// Cache key generators
export const cacheKeys = {
  youtube: {
    channel: () => ['youtube', 'channel'],
    videos: (maxResults: number) => ['youtube', 'videos', maxResults],
    analytics: () => ['youtube', 'analytics'],
    video: (id: string) => ['youtube', 'video', id],
  },
  
  employees: {
    all: () => ['employees', 'all'],
    byId: (id: string) => ['employees', 'by-id', id],
    byDepartment: (dept: string) => ['employees', 'by-department', dept],
  },
  
  videos: {
    all: () => ['videos', 'all'],
    byId: (id: string) => ['videos', 'by-id', id],
    byStatus: (status: string) => ['videos', 'by-status', status],
  },
};

// Prefetch utilities
export const prefetchUtils = {
  // Prefetch on hover
  onHover: (queryClient: any, queryKey: any[], queryFn: () => Promise<any>) => {
    return () => {
      queryClient.prefetchQuery(queryKey, queryFn);
    };
  },

  // Prefetch on mount
  onMount: (queryClient: any, queries: Array<{ queryKey: any[]; queryFn: () => Promise<any> }>) => {
    queries.forEach(({ queryKey, queryFn }) => {
      queryClient.prefetchQuery(queryKey, queryFn);
    });
  },
};
