import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { healthMonitor, errorTracker, analyticsTracker } from "@/lib/monitoring";
import type { HealthCheckResult } from "@/lib/monitoring";
import {
  Activity, Database, Youtube, Cpu, Clock, RefreshCw,
  CheckCircle, AlertTriangle, XCircle, TrendingUp, Bug, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const HealthCheck = () => {
  const [healthData, setHealthData] = useState<HealthCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date>(new Date());

  const runHealthCheck = async () => {
    setIsLoading(true);
    try {
      const result = await healthMonitor.runHealthCheck();
      setHealthData(result);
      setLastCheck(new Date());
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runHealthCheck();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(runHealthCheck, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warn':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'warn':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'fail':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
  };

  const getOverallStatusColor = (status: 'healthy' | 'degraded' | 'unhealthy') => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'unhealthy':
        return 'bg-red-500';
    }
  };

  const errorStats = errorTracker.getErrorStats();
  const analyticsStats = analyticsTracker.getEventStats();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">System Health</h1>
            <p className="text-muted-foreground">
              Last checked: {lastCheck.toLocaleTimeString()}
            </p>
          </div>
          <Button onClick={runHealthCheck} disabled={isLoading} className="gap-2">
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>

        {/* Overall Status */}
        {healthData && (
          <Card className="p-8">
            <div className="flex items-center gap-6">
              <div className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center",
                getOverallStatusColor(healthData.status)
              )}>
                <Activity className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2 capitalize">{healthData.status}</h2>
                <p className="text-muted-foreground">
                  All systems {healthData.status === 'healthy' ? 'operational' : 
                    healthData.status === 'degraded' ? 'experiencing issues' : 'down'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold">{healthMonitor.getUptime()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="text-2xl font-bold">{healthData.version}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Individual Checks */}
        {healthData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Database Check */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  getStatusColor(healthData.checks.database.status)
                )}>
                  <Database className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">Database</h3>
                    {getStatusIcon(healthData.checks.database.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {healthData.checks.database.message}
                  </p>
                  {healthData.checks.database.responseTime && (
                    <p className="text-xs text-muted-foreground">
                      Response time: {healthData.checks.database.responseTime.toFixed(0)}ms
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* YouTube API Check */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  getStatusColor(healthData.checks.youtube.status)
                )}>
                  <Youtube className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">YouTube API</h3>
                    {getStatusIcon(healthData.checks.youtube.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {healthData.checks.youtube.message}
                  </p>
                  {healthData.checks.youtube.details && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Subscribers: {healthData.checks.youtube.details.subscribers?.toLocaleString()}</p>
                      <p>Videos: {healthData.checks.youtube.details.videos}</p>
                    </div>
                  )}
                  {healthData.checks.youtube.responseTime && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Response time: {healthData.checks.youtube.responseTime.toFixed(0)}ms
                    </p>
                  )}
                </div>
              </div>
            </Card>

            {/* Memory Check */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  getStatusColor(healthData.checks.memory.status)
                )}>
                  <Cpu className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">Memory</h3>
                    {getStatusIcon(healthData.checks.memory.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {healthData.checks.memory.message}
                  </p>
                  {healthData.checks.memory.details && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Used: {healthData.checks.memory.details.used}</p>
                      <p>Limit: {healthData.checks.memory.details.limit}</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div 
                          className={cn(
                            "rounded-full h-2",
                            healthData.checks.memory.status === 'pass' ? 'bg-green-500' :
                            healthData.checks.memory.status === 'warn' ? 'bg-yellow-500' : 'bg-red-500'
                          )}
                          style={{ width: healthData.checks.memory.details.percentage }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Performance Check */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  getStatusColor(healthData.checks.performance.status)
                )}>
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold">Performance</h3>
                    {getStatusIcon(healthData.checks.performance.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {healthData.checks.performance.message}
                  </p>
                  {healthData.checks.performance.details && (
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Load Time: {healthData.checks.performance.details.loadTime}</p>
                      <p>DOM Ready: {healthData.checks.performance.details.domContentLoaded}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Error Tracking */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bug className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold">Error Tracking</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Errors</p>
              <p className="text-3xl font-bold">{errorStats.total}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Error Types</p>
              <p className="text-3xl font-bold">{Object.keys(errorStats.byType).length}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Recent Errors</p>
              <p className="text-3xl font-bold">{errorStats.recent.length}</p>
            </div>
          </div>
          {errorStats.recent.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Recent Errors:</p>
              {errorStats.recent.map((error, index) => (
                <div key={index} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-sm">
                  <p className="font-medium text-red-500">{error.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(error.timestamp).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Analytics Tracking */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Analytics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Events</p>
              <p className="text-3xl font-bold">{analyticsStats.total}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Event Types</p>
              <p className="text-3xl font-bold">{Object.keys(analyticsStats.byName).length}</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Recent Events</p>
              <p className="text-3xl font-bold">{analyticsStats.recent.length}</p>
            </div>
          </div>
          {Object.keys(analyticsStats.byName).length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Event Breakdown:</p>
              <div className="space-y-2">
                {Object.entries(analyticsStats.byName).map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                    <span className="text-sm">{name}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default HealthCheck;
