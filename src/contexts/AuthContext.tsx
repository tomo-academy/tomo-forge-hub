import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { emailService } from '@/services/emailService';

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
      
      // Store in localStorage
      localStorage.setItem('adminAuth', JSON.stringify({
        email,
        timestamp: Date.now()
      }));
      
      // Send email notification
      emailService.notifyLogin().catch(err => 
        console.error('Failed to send login notification:', err)
      );
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
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
