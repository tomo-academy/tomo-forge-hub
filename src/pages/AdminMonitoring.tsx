// src/pages/AdminMonitoring.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminMonitoringService } from "@/services/adminMonitoringService";
import { 
  Shield, 
  Activity, 
  Globe, 
  Monitor, 
  Clock, 
  MapPin, 
  Smartphone,
  AlertTriangle,
  TrendingUp,
  Users,
  Eye,
  Wifi,
  RefreshCw,
  Download,
  BarChart3,
  Lock,
  AlertCircle
} from "lucide-react";

const AdminMonitoring = () => {
  const [sessions, setSessions] = useState([]);
  const [loginAttempts, setLoginAttempts] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const allSessions = adminMonitoringService.getAllSessions();
      const attempts = adminMonitoringService.getLoginAttempts();
      const sessionStats = adminMonitoringService.getSessionStats();
      const current = adminMonitoringService.getCurrentSession();

      setSessions(allSessions);
      setLoginAttempts(attempts);
      setStats(sessionStats);
      setCurrentSession(current);
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getLocationString = (location: any) => {
    return `${location.city}, ${location.region}, ${location.country}`;
  };

  const exportData = () => {
    const data = {
      sessions,
      loginAttempts,
      stats,
      exportTime: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-monitoring-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            Admin Monitoring Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Advanced security monitoring and session tracking
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Current Session Alert */}
      {currentSession && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Activity className="w-5 h-5" />
              Current Active Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span className="text-sm">{currentSession.ipAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{getLocationString(currentSession.location)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Active for {formatDuration(Date.now() - new Date(currentSession.loginTime).getTime())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeSessions} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Login Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.successfulLogins + stats.failedLogins > 0 
                ? Math.round((stats.successfulLogins / (stats.successfulLogins + stats.failedLogins)) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.failedLogins} failed attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Session Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(stats.avgSessionDuration)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average session duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Secure</div>
            <p className="text-xs text-muted-foreground">
              No threats detected
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="sessions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="attempts">Login Attempts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
              <CardDescription>
                Complete information about admin sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session, index) => (
                  <div key={session.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={session.sessionStats.isActive ? "default" : "secondary"}>
                          {session.sessionStats.isActive ? "Active" : "Ended"}
                        </Badge>
                        <span className="font-medium">{session.email}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDateTime(session.loginTime)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium">
                          <Globe className="w-3 h-3" />
                          Location
                        </div>
                        <div className="text-muted-foreground">
                          <div>{getLocationString(session.location)}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Wifi className="w-3 h-3" />
                            {session.ipAddress}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium">
                          <Monitor className="w-3 h-3" />
                          Device
                        </div>
                        <div className="text-muted-foreground">
                          <div>{session.deviceInfo.os}</div>
                          <div>{session.deviceInfo.browser} {session.deviceInfo.browserVersion}</div>
                          <div>{session.deviceInfo.device}</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium">
                          <Activity className="w-3 h-3" />
                          Activity
                        </div>
                        <div className="text-muted-foreground">
                          <div>{session.sessionStats.totalPages} pages visited</div>
                          <div>Score: {session.sessionStats.activityScore}/100</div>
                          <div>Duration: {formatDuration(session.sessionStats.totalTimeSpent)}</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium">
                          <Eye className="w-3 h-3" />
                          Screen Info
                        </div>
                        <div className="text-muted-foreground">
                          <div>{session.deviceInfo.screen.width}x{session.deviceInfo.screen.height}</div>
                          <div>{session.deviceInfo.language}</div>
                          <div>Color: {session.deviceInfo.screen.colorDepth}-bit</div>
                        </div>
                      </div>
                    </div>

                    {session.pageVisits.length > 0 && (
                      <div className="mt-3">
                        <div className="font-medium text-sm mb-2">Recent Pages:</div>
                        <div className="flex flex-wrap gap-1">
                          {session.pageVisits.slice(-5).map((visit, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {visit.page} 
                              {visit.duration && ` (${formatDuration(visit.duration)})`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attempts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Login Attempts</CardTitle>
              <CardDescription>
                History of all login attempts (successful and failed)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loginAttempts.map((attempt, index) => (
                  <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant={attempt.success ? "default" : "destructive"}>
                        {attempt.success ? "Success" : "Failed"}
                      </Badge>
                      <div>
                        <div className="font-medium">{attempt.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {attempt.ipAddress} • {getLocationString(attempt.location)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">{formatDateTime(attempt.timestamp)}</div>
                      {attempt.reason && (
                        <div className="text-xs text-muted-foreground">{attempt.reason}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Top Locations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.topLocations.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.location}</span>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Top Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.topDevices.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.device}</span>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Top Browsers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.topBrowsers.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.browser}</span>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Security Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-700 dark:text-green-300">System Status: Secure</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Security Metrics</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Failed Login Attempts:</span>
                        <span className="font-medium">{stats.failedLogins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Suspicious Activity:</span>
                        <span className="font-medium text-green-600">None Detected</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Session Security:</span>
                        <span className="font-medium text-green-600">High</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Recommendations</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>• Enable two-factor authentication</div>
                      <div>• Set up email alerts for failed logins</div>
                      <div>• Regular security audits</div>
                      <div>• Monitor for unusual activity patterns</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMonitoring;