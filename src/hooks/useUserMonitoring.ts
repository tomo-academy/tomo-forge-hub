// src/hooks/useUserMonitoring.ts
import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { userMonitoringService } from '@/services/userMonitoringService';

interface UseUserMonitoringProps {
  enabled?: boolean;
  trackPageViews?: boolean;
  trackClicks?: boolean;
}

export const useUserMonitoring = ({
  enabled = true,
  trackPageViews = true,
  trackClicks = false
}: UseUserMonitoringProps = {}) => {
  const location = useLocation();

  // Track page visits automatically
  useEffect(() => {
    if (enabled && trackPageViews) {
      userMonitoringService.recordPageVisit(location.pathname);
    }
  }, [location.pathname, enabled, trackPageViews]);

  // Set up click tracking
  useEffect(() => {
    if (!enabled || !trackClicks) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const element = target.tagName.toLowerCase();
      const id = target.id ? `#${target.id}` : '';
      const className = target.className ? `.${target.className.split(' ')[0]}` : '';
      
      userMonitoringService.recordAction('click', `Clicked ${element}${id}${className}`);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [enabled, trackClicks]);

  // Manual tracking functions
  const trackAction = useCallback((type: 'upload' | 'edit' | 'delete' | 'click', details?: string) => {
    if (enabled) {
      userMonitoringService.recordAction(type, details);
    }
  }, [enabled]);

  const trackLogin = useCallback((email: string, name: string, role: string, department: string) => {
    if (enabled) {
      return userMonitoringService.login(email, name, role, department);
    }
    return null;
  }, [enabled]);

  const trackLogout = useCallback(() => {
    if (enabled) {
      userMonitoringService.logout();
    }
  }, [enabled]);

  const getCurrentUser = useCallback(() => {
    return userMonitoringService.getCurrentUser();
  }, []);

  const getActiveSessions = useCallback(() => {
    return userMonitoringService.getActiveSessions();
  }, []);

  const getUserStats = useCallback(() => {
    return userMonitoringService.getUserStats();
  }, []);

  return {
    trackAction,
    trackLogin,
    trackLogout,
    getCurrentUser,
    getActiveSessions,
    getUserStats
  };
};

export default useUserMonitoring;