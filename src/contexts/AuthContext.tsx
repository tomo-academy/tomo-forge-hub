import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { emailService } from '@/services/emailService';
import { siteMonitoringService } from '@/services/siteMonitoringService';

interface AuthContextType {
  isAdmin: boolean;
  isAuthenticated: boolean;
  adminEmail: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'tomoacademyofficial@gmail.com';
const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

// Helper functions to get browser and device info
function getBrowserInfo(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  return 'Unknown Browser';
}

function getDeviceInfo(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'Mobile Device';
  if (/tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if admin is already logged in (from localStorage)
    const storedAdmin = localStorage.getItem('adminAuth');
    if (storedAdmin) {
      const { email, timestamp } = JSON.parse(storedAdmin);
      // Session expires after 24 hours
      if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
        setIsAdmin(true);
        setIsAuthenticated(true);
        setAdminEmail(email);
      } else {
        localStorage.removeItem('adminAuth');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check if it's the admin email
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setIsAuthenticated(true);
      setAdminEmail(email);
      
      // Get browser and device info
      const userAgent = navigator.userAgent;
      const browserInfo = getBrowserInfo(userAgent);
      const deviceInfo = getDeviceInfo(userAgent);
      
      // Store in localStorage
      localStorage.setItem('adminAuth', JSON.stringify({
        email,
        timestamp: Date.now(),
        browserInfo,
        deviceInfo
      }));
      
      // Track admin login with enhanced monitoring
      try {
        await siteMonitoringService.trackAdminLogin(email);
        console.log('Admin login tracked successfully');
      } catch (error) {
        console.error('Failed to track admin login:', error);
      }
      
      // Email notification temporarily disabled to avoid 414/422 errors
      // Will be re-enabled after EmailJS template is properly configured
      // emailService.notifyLogin(email, browserInfo, deviceInfo).catch(err => 
      //   console.error('Failed to send login notification:', err)
      // );
      
      return true;
    } else {
      // Track failed login attempt
      try {
        if (siteMonitoringService?.trackFailedLogin) {
          siteMonitoringService.trackFailedLogin(email, 'Invalid credentials');
        }
      } catch (error) {
        console.error('Failed to track failed login:', error);
      }
    }
    
    return false;
  };

  const logout = () => {
    // Track admin logout
    try {
      if (siteMonitoringService?.trackAdminLogout) {
        siteMonitoringService.trackAdminLogout();
      }
    } catch (error) {
      console.error('Failed to track admin logout:', error);
    }
    
    setIsAdmin(false);
    setIsAuthenticated(false);
    setAdminEmail(null);
    localStorage.removeItem('adminAuth');
  };

  return (
    <AuthContext.Provider value={{ isAdmin, isAuthenticated, adminEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
