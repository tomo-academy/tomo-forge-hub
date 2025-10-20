// src/services/siteMonitoringService.ts
interface LocationInfo {
  country: string;
  region: string;
  city: string;
  timezone: string;
  latitude?: number;
  longitude?: number;
  ipAddress: string;
  isp?: string;
  org?: string;
}

interface DeviceInfo {
  userAgent: string;
  browser: string;
  browserVersion: string;
  os: string;
  device: string;
  platform: string;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
  };
  language: string;
  cookieEnabled: boolean;
  onlineStatus: boolean;
  touchSupport: boolean;
  webGLSupport: boolean;
}

interface PageVisit {
  page: string;
  timestamp: string;
  duration?: number;
  scrollDepth?: number;
  interactions?: number;
  referrer?: string;
  exitPage?: boolean;
}

interface VisitorSession {
  id: string;
  sessionType: 'visitor' | 'admin';
  visitorId: string;
  email?: string;
  firstVisit: string;
  lastVisit: string;
  ipAddress: string;
  location: LocationInfo;
  deviceInfo: DeviceInfo;
  pageVisits: PageVisit[];
  behaviorInfo: {
    totalVisits: number;
    bounceRate: number;
    avgSessionDuration: number;
    pagesPerSession: number;
    returningVisitor: boolean;
    engagementScore: number;
  };
  sessionStats: {
    totalPages: number;
    totalTimeSpent: number;
    lastActivity: string;
    isActive: boolean;
    activityScore: number;
    entryPage: string;
    exitPage?: string;
  };
  technicalInfo: {
    javascriptEnabled: boolean;
    cookiesEnabled: boolean;
    localStorageEnabled: boolean;
    sessionStorageEnabled: boolean;
    doNotTrack: boolean;
    adBlockerDetected: boolean;
  };
}

interface AdminSession extends VisitorSession {
  sessionType: 'admin';
  email: string;
  securityInfo: {
    suspiciousActivity: boolean;
    failedLoginAttempts: number;
    lastFailedLogin?: string;
    loginMethod: string;
    twoFactorEnabled: boolean;
  };
}

interface LoginAttempt {
  id: string;
  email: string;
  timestamp: string;
  success: boolean;
  ipAddress: string;
  location: LocationInfo;
  deviceInfo: DeviceInfo;
  reason?: string;
}

class SiteMonitoringService {
  private currentSession: VisitorSession | null = null;
  private readonly VISITORS_KEY = 'allVisitorSessions';
  private readonly ADMIN_SESSIONS_KEY = 'adminSessions';
  private readonly LOGIN_ATTEMPTS_KEY = 'adminLoginAttempts';
  private activityTimer: NodeJS.Timeout | null = null;
  private pageStartTime: number = Date.now();
  private visitorId: string;

  constructor() {
    // Only initialize if we're in a browser environment
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.visitorId = this.getOrCreateVisitorId();
      this.initializeTracking();
      this.startActivityTracking();
      this.trackVisitorSession();
    }
  }

  private getOrCreateVisitorId(): string {
    if (typeof localStorage === 'undefined') {
      return `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('visitorId', visitorId);
    }
    return visitorId;
  }

  private initializeTracking() {
    if (typeof document === 'undefined') return;
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (this.currentSession) {
        this.updateSessionActivity();
      }
    });

    // Track user interactions
    ['click', 'keydown', 'scroll', 'mousemove'].forEach(event => {
      document.addEventListener(event, () => {
        this.trackInteraction();
      }, { passive: true });
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.saveCurrentPageDuration();
    });
  }

  private startActivityTracking() {
    this.activityTimer = setInterval(() => {
      if (this.currentSession) {
        this.updateSessionActivity();
      }
    }, 30000); // Update every 30 seconds
  }

  private async trackVisitorSession(): Promise<void> {
    if (this.currentSession?.sessionType === 'admin') return; // Don't track admin as visitor

    const existingVisitor = this.getExistingVisitorSession(this.visitorId);
    const locationInfo = await this.getLocationInfo();
    const deviceInfo = this.getDeviceInfo();

    if (existingVisitor) {
      // Update existing visitor
      existingVisitor.lastVisit = new Date().toISOString();
      existingVisitor.behaviorInfo.totalVisits++;
      existingVisitor.sessionStats.lastActivity = new Date().toISOString();
      existingVisitor.sessionStats.isActive = true;
      this.currentSession = existingVisitor;
    } else {
      // Create new visitor session
      const visitorSession: VisitorSession = {
        id: `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        sessionType: 'visitor',
        visitorId: this.visitorId,
        firstVisit: new Date().toISOString(),
        lastVisit: new Date().toISOString(),
        ipAddress: locationInfo.ipAddress,
        location: locationInfo,
        deviceInfo,
        pageVisits: [{
          page: window.location.pathname,
          timestamp: new Date().toISOString(),
          scrollDepth: 0,
          interactions: 0,
          referrer: document.referrer || 'Direct'
        }],
        behaviorInfo: {
          totalVisits: 1,
          bounceRate: 0,
          avgSessionDuration: 0,
          pagesPerSession: 1,
          returningVisitor: false,
          engagementScore: 50
        },
        sessionStats: {
          totalPages: 1,
          totalTimeSpent: 0,
          lastActivity: new Date().toISOString(),
          isActive: true,
          activityScore: 100,
          entryPage: window.location.pathname
        },
        technicalInfo: {
          javascriptEnabled: true,
          cookiesEnabled: navigator.cookieEnabled,
          localStorageEnabled: this.isLocalStorageEnabled(),
          sessionStorageEnabled: this.isSessionStorageEnabled(),
          doNotTrack: navigator.doNotTrack === '1',
          adBlockerDetected: this.detectAdBlocker()
        }
      };

      this.currentSession = visitorSession;
    }

    this.saveVisitorSession(this.currentSession);
    this.pageStartTime = Date.now();
  }

  async trackAdminLogin(email: string): Promise<AdminSession> {
    const sessionId = `admin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const locationInfo = await this.getLocationInfo();
    const deviceInfo = this.getDeviceInfo();

    const adminSession: AdminSession = {
      id: sessionId,
      sessionType: 'admin',
      visitorId: this.visitorId,
      email,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      ipAddress: locationInfo.ipAddress,
      location: locationInfo,
      deviceInfo,
      pageVisits: [{
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        scrollDepth: 0,
        interactions: 0,
        referrer: document.referrer || 'Direct'
      }],
      behaviorInfo: {
        totalVisits: 1,
        bounceRate: 0,
        avgSessionDuration: 0,
        pagesPerSession: 1,
        returningVisitor: false,
        engagementScore: 100
      },
      sessionStats: {
        totalPages: 1,
        totalTimeSpent: 0,
        lastActivity: new Date().toISOString(),
        isActive: true,
        activityScore: 100,
        entryPage: window.location.pathname
      },
      technicalInfo: {
        javascriptEnabled: true,
        cookiesEnabled: navigator.cookieEnabled,
        localStorageEnabled: this.isLocalStorageEnabled(),
        sessionStorageEnabled: this.isSessionStorageEnabled(),
        doNotTrack: navigator.doNotTrack === '1',
        adBlockerDetected: this.detectAdBlocker()
      },
      securityInfo: {
        suspiciousActivity: false,
        failedLoginAttempts: 0,
        loginMethod: 'password',
        twoFactorEnabled: false
      }
    };

    this.currentSession = adminSession;
    this.saveAdminSession(adminSession);
    this.trackLoginAttempt(email, true, locationInfo, deviceInfo);
    this.pageStartTime = Date.now();

    return adminSession;
  }

  trackAdminLogout(): void {
    if (this.currentSession?.sessionType === 'admin') {
      this.saveCurrentPageDuration();
      this.currentSession.sessionStats.isActive = false;
      this.currentSession.sessionStats.lastActivity = new Date().toISOString();
      this.currentSession.sessionStats.exitPage = window.location.pathname;
      this.saveAdminSession(this.currentSession as AdminSession);
      
      // Start tracking as visitor again
      this.trackVisitorSession();
    }
  }

  trackPageVisit(page: string): void {
    if (!this.currentSession) return;

    this.saveCurrentPageDuration();

    const visit: PageVisit = {
      page,
      timestamp: new Date().toISOString(),
      scrollDepth: 0,
      interactions: 0,
      referrer: document.referrer || 'Direct'
    };

    this.currentSession.pageVisits.push(visit);
    this.currentSession.sessionStats.totalPages++;
    this.currentSession.sessionStats.lastActivity = new Date().toISOString();
    this.pageStartTime = Date.now();
    
    if (this.currentSession.sessionType === 'admin') {
      this.saveAdminSession(this.currentSession as AdminSession);
    } else {
      this.saveVisitorSession(this.currentSession);
    }
  }

  private async getLocationInfo(): Promise<LocationInfo> {
    try {
      // Try to get IP and location from multiple sources
      const responses = await Promise.allSettled([
        fetch('https://ipapi.co/json/'),
        fetch('https://ip-api.com/json/'),
        fetch('https://ipinfo.io/json')
      ]);

      for (const response of responses) {
        if (response.status === 'fulfilled' && response.value.ok) {
          const data = await response.value.json();
          return {
            country: data.country || data.country_name || 'Unknown',
            region: data.region || data.regionName || 'Unknown',
            city: data.city || 'Unknown',
            timezone: data.timezone || 'Unknown',
            latitude: data.latitude || data.lat,
            longitude: data.longitude || data.lon,
            ipAddress: data.ip || 'Unknown',
            isp: data.isp || data.org,
            org: data.org || data.as
          };
        }
      }
    } catch (error) {
      console.warn('Could not fetch location info:', error);
    }

    // Fallback to basic info
    return {
      country: 'Unknown',
      region: 'Unknown', 
      city: 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      ipAddress: 'Unknown'
    };
  }

  private getDeviceInfo(): DeviceInfo {
    const ua = navigator.userAgent;
    const screen = window.screen;
    
    return {
      userAgent: ua,
      browser: this.getBrowserName(ua),
      browserVersion: this.getBrowserVersion(ua),
      os: this.getOSName(ua),
      device: this.getDeviceType(ua),
      platform: navigator.platform,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onlineStatus: navigator.onLine,
      touchSupport: 'ontouchstart' in window,
      webGLSupport: this.detectWebGL()
    };
  }

  private getBrowserName(ua: string): string {
    if (ua.includes('Chrome') && !ua.includes('Chromium')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera')) return 'Opera';
    return 'Unknown';
  }

  private getBrowserVersion(ua: string): string {
    const browser = this.getBrowserName(ua);
    const match = ua.match(new RegExp(`${browser}\\/(\\d+\\.\\d+)`));
    return match ? match[1] : 'Unknown';
  }

  private getOSName(ua: string): string {
    if (ua.includes('Windows NT 10.0')) return 'Windows 10/11';
    if (ua.includes('Windows NT 6.3')) return 'Windows 8.1';
    if (ua.includes('Windows NT 6.2')) return 'Windows 8';
    if (ua.includes('Windows NT 6.1')) return 'Windows 7';
    if (ua.includes('Mac OS X')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
    return 'Unknown';
  }

  private getDeviceType(ua: string): string {
    if (/tablet/i.test(ua)) return 'Tablet';
    if (/mobile/i.test(ua)) return 'Mobile';
    return 'Desktop';
  }

  private detectWebGL(): boolean {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  }

  private isLocalStorageEnabled(): boolean {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  }

  private isSessionStorageEnabled(): boolean {
    try {
      sessionStorage.setItem('test', 'test');
      sessionStorage.removeItem('test');
      return true;
    } catch {
      return false;
    }
  }

  private detectAdBlocker(): boolean {
    try {
      const adElement = document.createElement('div');
      adElement.innerHTML = '&nbsp;';
      adElement.className = 'adsbox';
      adElement.style.position = 'absolute';
      adElement.style.left = '-10000px';
      document.body.appendChild(adElement);
      const adBlocked = adElement.offsetHeight === 0;
      document.body.removeChild(adElement);
      return adBlocked;
    } catch {
      return false;
    }
  }

  private saveCurrentPageDuration(): void {
    if (!this.currentSession || this.currentSession.pageVisits.length === 0) return;

    const currentVisit = this.currentSession.pageVisits[this.currentSession.pageVisits.length - 1];
    const duration = Date.now() - this.pageStartTime;
    currentVisit.duration = duration;
    this.currentSession.sessionStats.totalTimeSpent += duration;
  }

  private trackInteraction(): void {
    if (!this.currentSession || this.currentSession.pageVisits.length === 0) return;

    const currentVisit = this.currentSession.pageVisits[this.currentSession.pageVisits.length - 1];
    currentVisit.interactions = (currentVisit.interactions || 0) + 1;
    this.updateSessionActivity();
  }

  private updateSessionActivity(): void {
    if (!this.currentSession) return;

    this.currentSession.sessionStats.lastActivity = new Date().toISOString();
    this.currentSession.sessionStats.isActive = !document.hidden;
    
    // Calculate activity score based on interactions and time
    const totalInteractions = this.currentSession.pageVisits.reduce((sum, visit) => sum + (visit.interactions || 0), 0);
    const sessionDuration = Date.now() - new Date(this.currentSession.firstVisit).getTime();
    this.currentSession.sessionStats.activityScore = Math.min(100, Math.floor((totalInteractions / (sessionDuration / 60000)) * 10));

    if (this.currentSession.sessionType === 'admin') {
      this.saveAdminSession(this.currentSession as AdminSession);
    } else {
      this.saveVisitorSession(this.currentSession);
    }
  }

  private trackLoginAttempt(email: string, success: boolean, locationInfo: LocationInfo, deviceInfo: DeviceInfo, reason?: string): void {
    const attempt: LoginAttempt = {
      id: `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      timestamp: new Date().toISOString(),
      success,
      ipAddress: locationInfo.ipAddress,
      location: locationInfo,
      deviceInfo,
      reason
    };

    const attempts = this.getLoginAttempts();
    attempts.unshift(attempt);
    
    // Keep only last 100 attempts
    if (attempts.length > 100) {
      attempts.splice(100);
    }

    localStorage.setItem(this.LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
  }

  private getExistingVisitorSession(visitorId: string): VisitorSession | null {
    const visitors = this.getAllVisitorSessions();
    return visitors.find(v => v.visitorId === visitorId && v.sessionStats.isActive) || null;
  }

  private saveVisitorSession(session: VisitorSession): void {
    const visitors = this.getAllVisitorSessions();
    const existingIndex = visitors.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      visitors[existingIndex] = session;
    } else {
      visitors.unshift(session);
    }

    // Keep only last 200 visitor sessions
    if (visitors.length > 200) {
      visitors.splice(200);
    }

    localStorage.setItem(this.VISITORS_KEY, JSON.stringify(visitors));
  }

  private saveAdminSession(session: AdminSession): void {
    const admins = this.getAllAdminSessions();
    const existingIndex = admins.findIndex(s => s.id === session.id);
    
    if (existingIndex >= 0) {
      admins[existingIndex] = session;
    } else {
      admins.unshift(session);
    }

    // Keep only last 50 admin sessions
    if (admins.length > 50) {
      admins.splice(50);
    }

    localStorage.setItem(this.ADMIN_SESSIONS_KEY, JSON.stringify(admins));
  }

  // Public methods for accessing data
  getCurrentSession(): VisitorSession | null {
    if (typeof window === 'undefined') return null;
    return this.currentSession;
  }

  getAllVisitorSessions(): VisitorSession[] {
    try {
      const data = localStorage.getItem(this.VISITORS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getAllAdminSessions(): AdminSession[] {
    try {
      const data = localStorage.getItem(this.ADMIN_SESSIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getLoginAttempts(): LoginAttempt[] {
    try {
      const data = localStorage.getItem(this.LOGIN_ATTEMPTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  getVisitorStats() {
    const visitors = this.getAllVisitorSessions();
    const admins = this.getAllAdminSessions();
    const attempts = this.getLoginAttempts();
    
    const totalVisitors = visitors.length;
    const activeVisitors = visitors.filter(v => v.sessionStats.isActive).length;
    const totalAdmins = admins.length;
    const activeAdmins = admins.filter(a => a.sessionStats.isActive).length;
    const successfulLogins = attempts.filter(a => a.success).length;
    const failedLogins = attempts.filter(a => !a.success).length;
    
    const avgVisitorDuration = visitors.length > 0 
      ? visitors.reduce((sum, v) => sum + v.sessionStats.totalTimeSpent, 0) / visitors.length 
      : 0;

    const topLocations = this.getTopLocations([...visitors, ...admins]);
    const topDevices = this.getTopDevices([...visitors, ...admins]);
    const topBrowsers = this.getTopBrowsers([...visitors, ...admins]);

    return {
      totalVisitors,
      activeVisitors,
      totalAdmins,
      activeAdmins,
      successfulLogins,
      failedLogins,
      avgVisitorDuration,
      topLocations,
      topDevices,
      topBrowsers,
      recentActivity: [...visitors, ...admins].slice(0, 20)
    };
  }

  private getTopLocations(sessions: VisitorSession[]) {
    const locationCounts = sessions.reduce((acc, session) => {
      const location = `${session.location.city}, ${session.location.country}`;
      acc[location] = (acc[location] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({ location, count }));
  }

  private getTopDevices(sessions: VisitorSession[]) {
    const deviceCounts = sessions.reduce((acc, session) => {
      const device = `${session.deviceInfo.os} - ${session.deviceInfo.browser}`;
      acc[device] = (acc[device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(deviceCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([device, count]) => ({ device, count }));
  }

  private getTopBrowsers(sessions: VisitorSession[]) {
    const browserCounts = sessions.reduce((acc, session) => {
      const browser = session.deviceInfo.browser;
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(browserCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([browser, count]) => ({ browser, count }));
  }

  trackFailedLogin(email: string, reason: string): void {
    this.getLocationInfo().then(locationInfo => {
      const deviceInfo = this.getDeviceInfo();
      this.trackLoginAttempt(email, false, locationInfo, deviceInfo, reason);
    });
  }
}

export const siteMonitoringService = new SiteMonitoringService();
export type { VisitorSession, AdminSession, LoginAttempt };