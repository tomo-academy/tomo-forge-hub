import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Database, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { sql } from '@/lib/db';

export function DatabaseStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkConnection = async () => {
    setStatus('checking');
    try {
      if (!sql) {
        setStatus('disconnected');
        setLastChecked(new Date());
        return;
      }

      // Try a simple query
      await sql`SELECT 1`;
      setStatus('connected');
      setLastChecked(new Date());
    } catch (error) {
      console.error('Database connection check failed:', error);
      setStatus('disconnected');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkConnection();
    // Check every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'disconnected':
        return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      case 'checking':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-3 h-3" />;
      case 'disconnected':
        return <XCircle className="w-3 h-3" />;
      case 'checking':
        return <Loader2 className="w-3 h-3 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Database Connected';
      case 'disconnected':
        return 'Using Mock Data';
      case 'checking':
        return 'Checking...';
    }
  };

  return (
    <Badge 
      variant="outline" 
      className={`gap-1.5 text-xs ${getStatusColor()} cursor-pointer`}
      onClick={checkConnection}
      title={lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString()}` : 'Click to refresh'}
    >
      <Database className="w-3 h-3" />
      {getStatusIcon()}
      {getStatusText()}
    </Badge>
  );
}
