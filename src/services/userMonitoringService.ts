// src/services/userMonitoringService.ts
interface UserSession {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  department: string;
  loginTime: string;
  lastActivity: string;
  currentPage: string;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  sessionDuration: number;
  pagesVisited: string[];
  actions: UserAction[];
}

interface UserAction {
  id: string;
  type: 'login' | 'logout' | 'page_visit' | 'click' | 'upload' | 'edit' | 'delete';
  page: string;
  timestamp: string;
  details?: string;
}

interface LoginAttempt {
  id: string;
  email: string;
  success: boolean;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  errorReason?: string;
}

class UserMonitoringService {
  private sessions: Map<string, UserSession> = new Map();
  private loginAttempts: LoginAttempt[] = [];
  private currentUser: UserSession | null = null;

  // Initialize monitoring
  init() {
    // Load existing sessions from localStorage
    this.loadSessions();
    
    // Set up page visibility change detection
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updateLastActivity();
      } else {
        this.recordPageVisit(window.location.pathname);
      }
    });

    // Set up beforeunload to track session end
    window.addEventListener('beforeunload', () => {
      this.updateLastActivity();
    });

    // Update activity every 30 seconds
    setInterval(() => {
      this.updateLastActivity();
      this.cleanupInactiveSessions();
    }, 30000);
  }

  // User login
  login(userEmail: string, userName: string, userRole: string, userDepartment: string): UserSession {
    const sessionId = this.generateSessionId();
    const now = new Date().toISOString();
    
    // Record login attempt
    const loginAttempt: LoginAttempt = {
      id: this.generateId(),
      email: userEmail,
      success: true,
      timestamp: now,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };
    this.loginAttempts.push(loginAttempt);

    // Create new session
    const session: UserSession = {
      id: sessionId,
      userId: this.generateUserId(userEmail),
      userName,
      email: userEmail,
      role: userRole,
      department: userDepartment,
      loginTime: now,
      lastActivity: now,
      currentPage: window.location.pathname,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      isActive: true,
      sessionDuration: 0,
      pagesVisited: [window.location.pathname],
      actions: [{
        id: this.generateId(),
        type: 'login',
        page: window.location.pathname,
        timestamp: now,
        details: 'User logged in successfully'
      }]
    };

    this.sessions.set(sessionId, session);
    this.currentUser = session;
    this.saveSessions();

    // Store session ID in localStorage for persistence
    localStorage.setItem('currentSessionId', sessionId);
    
    console.log('🔐 User login tracked:', { userName, userEmail, sessionId });
    return session;
  }

  // User logout
  logout(): void {
    if (this.currentUser) {
      const now = new Date().toISOString();
      const session = this.currentUser;
      
      // Record logout action
      session.actions.push({
        id: this.generateId(),
        type: 'logout',
        page: window.location.pathname,
        timestamp: now,
        details: 'User logged out'
      });

      session.isActive = false;
      session.lastActivity = now;
      session.sessionDuration = new Date(now).getTime() - new Date(session.loginTime).getTime();

      this.sessions.set(session.id, session);
      this.currentUser = null;
      this.saveSessions();

      // Clear session storage
      localStorage.removeItem('currentSessionId');
      
      console.log('🔓 User logout tracked:', { sessionId: session.id, duration: session.sessionDuration });
    }
  }

  // Record page visit
  recordPageVisit(page: string): void {
    if (this.currentUser) {
      const now = new Date().toISOString();
      const session = this.currentUser;

      session.currentPage = page;
      session.lastActivity = now;
      
      if (!session.pagesVisited.includes(page)) {
        session.pagesVisited.push(page);
      }

      session.actions.push({
        id: this.generateId(),
        type: 'page_visit',
        page,
        timestamp: now,
        details: `Visited page: ${page}`
      });

      this.sessions.set(session.id, session);
      this.saveSessions();
      
      console.log('📄 Page visit tracked:', { page, user: session.userName });
    }
  }

  // Record user action
  recordAction(type: UserAction['type'], details?: string): void {
    if (this.currentUser) {
      const now = new Date().toISOString();
      const session = this.currentUser;

      session.actions.push({
        id: this.generateId(),
        type,
        page: window.location.pathname,
        timestamp: now,
        details
      });

      session.lastActivity = now;
      this.sessions.set(session.id, session);
      this.saveSessions();
      
      console.log('🎯 User action tracked:', { type, details, user: session.userName });
    }
  }

  // Update last activity
  updateLastActivity(): void {
    if (this.currentUser) {
      const now = new Date().toISOString();
      this.currentUser.lastActivity = now;
      this.currentUser.sessionDuration = new Date(now).getTime() - new Date(this.currentUser.loginTime).getTime();
      this.sessions.set(this.currentUser.id, this.currentUser);
      this.saveSessions();
    }
  }

  // Get all active sessions
  getActiveSessions(): UserSession[] {
    return Array.from(this.sessions.values()).filter(session => session.isActive);
  }

  // Get all sessions (active and inactive)
  getAllSessions(): UserSession[] {
    return Array.from(this.sessions.values());
  }

  // Get current user session
  getCurrentUser(): UserSession | null {
    return this.currentUser;
  }

  // Get login attempts
  getLoginAttempts(): LoginAttempt[] {
    return this.loginAttempts;
  }

  // Get user statistics
  getUserStats() {
    const allSessions = this.getAllSessions();
    const activeSessions = this.getActiveSessions();
    
    return {
      totalUsers: new Set(allSessions.map(s => s.email)).size,
      activeSessions: activeSessions.length,
      totalSessions: allSessions.length,
      totalLoginAttempts: this.loginAttempts.length,
      successfulLogins: this.loginAttempts.filter(a => a.success).length,
      failedLogins: this.loginAttempts.filter(a => !a.success).length,
      averageSessionDuration: this.calculateAverageSessionDuration(),
      mostVisitedPages: this.getMostVisitedPages(),
      usersByDepartment: this.getUsersByDepartment(),
      recentActivity: this.getRecentActivity()
    };
  }

  // Restore session on page load
  restoreSession(): UserSession | null {
    const sessionId = localStorage.getItem('currentSessionId');
    if (sessionId && this.sessions.has(sessionId)) {
      const session = this.sessions.get(sessionId)!;
      
      // Check if session is still valid (less than 24 hours old)
      const sessionAge = new Date().getTime() - new Date(session.loginTime).getTime();
      const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge < maxSessionAge && session.isActive) {
        this.currentUser = session;
        this.recordPageVisit(window.location.pathname);
        console.log('🔄 Session restored:', { user: session.userName, sessionId });
        return session;
      } else {
        // Session expired
        this.logout();
      }
    }
    return null;
  }

  // Clean up inactive sessions (older than 24 hours)
  private cleanupInactiveSessions(): void {
    const now = new Date().getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [sessionId, session] of this.sessions.entries()) {
      const sessionAge = now - new Date(session.loginTime).getTime();
      if (sessionAge > maxAge && !session.isActive) {
        this.sessions.delete(sessionId);
      }
    }
    this.saveSessions();
  }

  // Helper methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateUserId(email: string): string {
    return `user_${email.replace('@', '_').replace('.', '_')}`;
  }

  private getClientIP(): string {
    // In a real application, you would get this from the server
    return 'localhost';
  }

  private calculateAverageSessionDuration(): number {
    const sessions = this.getAllSessions().filter(s => s.sessionDuration > 0);
    if (sessions.length === 0) return 0;
    
    const totalDuration = sessions.reduce((sum, s) => sum + s.sessionDuration, 0);
    return totalDuration / sessions.length;
  }

  private getMostVisitedPages(): { page: string; visits: number }[] {
    const pageVisits: Record<string, number> = {};
    
    this.getAllSessions().forEach(session => {
      session.pagesVisited.forEach(page => {
        pageVisits[page] = (pageVisits[page] || 0) + 1;
      });
    });

    return Object.entries(pageVisits)
      .map(([page, visits]) => ({ page, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 10);
  }

  private getUsersByDepartment(): Record<string, number> {
    const departments: Record<string, number> = {};
    
    this.getActiveSessions().forEach(session => {
      departments[session.department] = (departments[session.department] || 0) + 1;
    });

    return departments;
  }

  private getRecentActivity(): UserAction[] {
    const allActions: UserAction[] = [];
    
    this.getAllSessions().forEach(session => {
      allActions.push(...session.actions);
    });

    return allActions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);
  }

  private saveSessions(): void {
    const sessionsData = Array.from(this.sessions.entries());
    localStorage.setItem('userSessions', JSON.stringify(sessionsData));
    localStorage.setItem('loginAttempts', JSON.stringify(this.loginAttempts));
  }

  private loadSessions(): void {
    try {
      const sessionsData = localStorage.getItem('userSessions');
      if (sessionsData) {
        const sessions = JSON.parse(sessionsData);
        this.sessions = new Map(sessions);
      }

      const attemptsData = localStorage.getItem('loginAttempts');
      if (attemptsData) {
        this.loginAttempts = JSON.parse(attemptsData);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  }
}

// Create singleton instance
export const userMonitoringService = new UserMonitoringService();

// Auto-initialize
if (typeof window !== 'undefined') {
  userMonitoringService.init();
  
  // Try to restore session on load
  userMonitoringService.restoreSession();
}

export default userMonitoringService;