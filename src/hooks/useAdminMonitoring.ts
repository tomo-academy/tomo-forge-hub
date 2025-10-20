// src/hooks/useAdminMonitoring.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { adminMonitoringService } from '@/services/adminMonitoringService';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminMonitoring = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    // Only track admin pages if user is admin
    if (isAdmin) {
      adminMonitoringService.trackPageVisit(location.pathname);
    }
  }, [location.pathname, isAdmin]);

  const trackAction = (action: string, details?: any) => {
    if (isAdmin) {
      console.log(`Admin action tracked: ${action}`, details);
      // You can extend this to track specific admin actions
    }
  };

  return {
    trackAction,
    getCurrentSession: () => adminMonitoringService.getCurrentSession(),
    getSessionStats: () => adminMonitoringService.getSessionStats()
  };
};