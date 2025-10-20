// src/hooks/useAdminMonitoring.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteMonitoringService } from '@/services/siteMonitoringService';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminMonitoring = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    // Track all page visits (both admin and visitor)
    try {
      if (siteMonitoringService?.trackPageVisit) {
        siteMonitoringService.trackPageVisit(location.pathname);
      }
    } catch (error) {
      console.warn('Error tracking page visit:', error);
    }
  }, [location.pathname]);

  const trackAction = (action: string, details?: Record<string, unknown>) => {
    if (isAdmin) {
      console.log(`Admin action tracked: ${action}`, details);
      // You can extend this to track specific admin actions
    }
  };

  return {
    trackAction,
    getCurrentSession: () => {
      try {
        return siteMonitoringService?.getCurrentSession?.() || null;
      } catch (error) {
        console.warn('Error getting current session:', error);
        return null;
      }
    },
    getVisitorStats: () => {
      try {
        return siteMonitoringService?.getVisitorStats?.() || {};
      } catch (error) {
        console.warn('Error getting visitor stats:', error);
        return {};
      }
    }
  };
};