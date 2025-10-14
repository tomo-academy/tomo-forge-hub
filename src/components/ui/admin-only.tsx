import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface AdminOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Component that only renders children if user is admin
 * Usage: <AdminOnly><EditButton /></AdminOnly>
 */
export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Hook to check if user is admin
 * Usage: const canEdit = useIsAdmin();
 */
export function useIsAdmin() {
  const { isAdmin } = useAuth();
  return isAdmin;
}
