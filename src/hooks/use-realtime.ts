import { useState, useEffect, useRef } from 'react';

// Hook for real-time data updates
export function useRealtime<T>(
  fetcher: () => Promise<T>,
  interval: number = 30000, // 30 seconds default
  initialData?: T
) {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const mountedRef = useRef(true);

  const fetchData = async () => {
    try {
      setError(null);
      const result = await fetcher();
      
      if (mountedRef.current) {
        setData(result);
        setLastUpdate(new Date());
        setIsLoading(false);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err as Error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up interval for updates
    intervalRef.current = setInterval(fetchData, interval);

    // Cleanup
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [interval]);

  const refresh = () => {
    setIsLoading(true);
    fetchData();
  };

  return {
    data,
    isLoading,
    error,
    lastUpdate,
    refresh
  };
}

// Hook for WebSocket connections
export function useWebSocket<T>(url: string, options?: {
  onMessage?: (data: T) => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}) {
  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = options?.reconnectAttempts ?? 3;
  const reconnectInterval = options?.reconnectInterval ?? 5000;

  const connect = () => {
    try {
      ws.current = new WebSocket(url);
      
      ws.current.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };
      
      ws.current.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data) as T;
          setData(parsedData);
          options?.onMessage?.(parsedData);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };
      
      ws.current.onclose = () => {
        setIsConnected(false);
        
        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, reconnectInterval);
        }
      };
      
      ws.current.onerror = (error) => {
        setError('WebSocket connection error');
        options?.onError?.(error);
      };
      
    } catch (err) {
      setError('Failed to create WebSocket connection');
    }
  };

  useEffect(() => {
    connect();
    
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const send = (message: unknown) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  const disconnect = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

  return {
    data,
    isConnected,
    error,
    send,
    disconnect,
    reconnect: connect
  };
}