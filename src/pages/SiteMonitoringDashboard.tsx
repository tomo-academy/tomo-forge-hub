// src/pages/SiteMonitoringDashboard.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { siteMonitoringService } from "@/services/siteMonitoringService";
import type { VisitorSession, AdminSession, LoginAttempt } from "@/services/siteMonitoringService";
import { 
  Shield, 
  Activity, 
  Globe, 
  Monitor, 
  Clock, 
  MapPin, 
  Users,
  Eye,
  Wifi,
  RefreshCw,
  Download,
  BarChart3,
  AlertCircle,
  UserCheck,
  Globe2,
  Smartphone,
  TrendingUp,
  MousePointer,
  Navigation,
  Calendar
} from "lucide-react";

const SiteMonitoringDashboard = () => {
  const [visitors, setVisitors] = useState<VisitorSession[]>([]);
  const [admins, setAdmins] = useState<AdminSession[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const allVisitors = siteMonitoringService.getAllVisitorSessions();
      const allAdmins = siteMonitoringService.getAllAdminSessions();
      const attempts = siteMonitoringService.getLoginAttempts();
      const visitorStats = siteMonitoringService.getVisitorStats();

      setVisitors(allVisitors);
      setAdmins(allAdmins);
      setLoginAttempts(attempts);
      setStats(visitorStats);
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

  const getSessionDuration = (session: VisitorSession) => {
    const start = new Date(session.firstVisit);
    const end = session.sessionStats.isActive ? new Date() : new Date(session.lastVisit);
    return end.getTime() - start.getTime();
  };

  const exportData = () => {
    const data = {
      visitors,
      admins,
      loginAttempts,
      stats,
      exportTime: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-monitoring-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading site monitoring data...</p>
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
            <Globe2 className="w-8 h-8 text-primary" />
            Site Monitoring Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete tracking of all website visitors and admin activity
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisitors}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeVisitors} currently browsing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Sessions</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeAdmins} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Visit Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(stats.avgVisitorDuration)}
            </div>
            <p className="text-xs text-muted-foreground">
              Average session duration
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
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="visitors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visitors">All Visitors</TabsTrigger>
          <TabsTrigger value="admins">Admin Sessions</TabsTrigger>
          <TabsTrigger value="attempts">Login Attempts</TabsTrigger>
          <TabsTrigger value="analytics">Site Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="visitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Website Visitors</CardTitle>
              <CardDescription>
                Complete tracking of all users who enter the site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {visitors.map((visitor, index) => (
                  <div key={visitor.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={visitor.sessionStats.isActive ? "default" : "secondary"}>
                          {visitor.sessionStats.isActive ? "Active" : "Left"}
                        </Badge>
                        <Badge variant="outline">{visitor.sessionType}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Visitor #{visitor.visitorId.split('_')[1]?.substring(0, 6)}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <div>First visit: {formatDateTime(visitor.firstVisit)}</div>
                        <div>Last activity: {formatDateTime(visitor.lastVisit)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium">
                          <Globe className="w-3 h-3" />
                          Location & IP
                        </div>
                        <div className="text-muted-foreground">
                          <div>{getLocationString(visitor.location)}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Wifi className="w-3 h-3" />
                            {visitor.ipAddress}
                          </div>
                          {visitor.location.isp && (
                            <div className="text-xs">ISP: {visitor.location.isp}</div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium">
                          <Monitor className="w-3 h-3" />
                          Device & Browser
                        </div>
                        <div className="text-muted-foreground">
                          <div>{visitor.deviceInfo.os}</div>
                          <div>{visitor.deviceInfo.browser} {visitor.deviceInfo.browserVersion}</div>
                          <div>{visitor.deviceInfo.device}</div>
                          <div className="text-xs">{visitor.deviceInfo.screen.width}x{visitor.deviceInfo.screen.height}</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium">
                          <Activity className="w-3 h-3" />
                          Activity
                        </div>
                        <div className="text-muted-foreground">
                          <div>{visitor.sessionStats.totalPages} pages visited</div>
                          <div>Duration: {formatDuration(getSessionDuration(visitor))}</div>
                          <div>Score: {visitor.sessionStats.activityScore}/100</div>
                          <div className="text-xs">
                            Interactions: {visitor.pageVisits.reduce((sum, visit) => sum + (visit.interactions || 0), 0)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium">
                          <Eye className="w-3 h-3" />
                          Technical Info
                        </div>
                        <div className="text-muted-foreground">
                          <div>JS: {visitor.technicalInfo.javascriptEnabled ? '✓' : '✗'}</div>
                          <div>Cookies: {visitor.technicalInfo.cookiesEnabled ? '✓' : '✗'}</div>
                          <div>Touch: {visitor.deviceInfo.touchSupport ? '✓' : '✗'}</div>
                          <div>WebGL: {visitor.deviceInfo.webGLSupport ? '✓' : '✗'}</div>
                        </div>
                      </div>
                    </div>

                    {visitor.pageVisits.length > 0 && (
                      <div className="mt-3">
                        <div className="font-medium text-sm mb-2 flex items-center gap-1">
                          <Navigation className="w-3 h-3" />
                          Navigation Path:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {visitor.pageVisits.slice(-8).map((visit, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {visit.page} 
                              {visit.duration && ` (${formatDuration(visit.duration)})`}
                            </Badge>
                          ))}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Entry: {visitor.sessionStats.entryPage} | 
                          Referrer: {visitor.pageVisits[0]?.referrer || 'Direct'} |
                          Total visits: {visitor.behaviorInfo.totalVisits}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {visitors.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No visitors tracked yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Sessions</CardTitle>
              <CardDescription>
                Detailed tracking of admin logins and activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {admins.map((admin, index) => (
                  <div key={admin.id} className="border rounded-lg p-4 space-y-3 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={admin.sessionStats.isActive ? "default" : "secondary"}>
                          {admin.sessionStats.isActive ? "Active" : "Ended"}
                        </Badge>
                        <Badge variant="destructive">Admin</Badge>
                        <span className="font-medium">{admin.email}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDateTime(admin.firstVisit)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium">
                          <Globe className="w-3 h-3" />
                          Location & Security
                        </div>
                        <div className="text-muted-foreground">
                          <div>{getLocationString(admin.location)}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <Wifi className="w-3 h-3" />
                            {admin.ipAddress}
                          </div>
                          <div className="text-xs text-green-600">
                            Security: {admin.securityInfo.suspiciousActivity ? 'Alert' : 'Normal'}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium">
                          <Monitor className="w-3 h-3" />
                          Device
                        </div>
                        <div className="text-muted-foreground">
                          <div>{admin.deviceInfo.os}</div>
                          <div>{admin.deviceInfo.browser} {admin.deviceInfo.browserVersion}</div>
                          <div>{admin.deviceInfo.device}</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium">
                          <Activity className="w-3 h-3" />
                          Activity
                        </div>
                        <div className="text-muted-foreground">
                          <div>{admin.sessionStats.totalPages} pages visited</div>
                          <div>Duration: {formatDuration(getSessionDuration(admin))}</div>
                          <div>Score: {admin.sessionStats.activityScore}/100</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1 font-medium">
                          <Shield className="w-3 h-3" />
                          Security Info
                        </div>
                        <div className="text-muted-foreground">
                          <div>Login: {admin.securityInfo.loginMethod}</div>
                          <div>2FA: {admin.securityInfo.twoFactorEnabled ? '✓' : '✗'}</div>
                          <div>Failed: {admin.securityInfo.failedLoginAttempts}</div>
                        </div>
                      </div>
                    </div>

                    {admin.pageVisits.length > 0 && (
                      <div className="mt-3">
                        <div className="font-medium text-sm mb-2">Admin Pages Visited:</div>
                        <div className="flex flex-wrap gap-1">
                          {admin.pageVisits.slice(-5).map((visit, i) => (
                            <Badge key={i} variant="outline" className="text-xs bg-primary/10">
                              {visit.page} 
                              {visit.duration && ` (${formatDuration(visit.duration)})`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {admins.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No admin sessions recorded</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attempts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Login Attempts</CardTitle>
              <CardDescription>
                All admin login attempts (successful and failed)
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
                        <div className="text-xs text-muted-foreground">
                          {attempt.deviceInfo.browser} on {attempt.deviceInfo.os}
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

                {loginAttempts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No login attempts recorded</p>
                  </div>
                )}
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
                  {stats.topLocations.map((item: any, index: number) => (
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
                  <Smartphone className="w-4 h-4" />
                  Top Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.topDevices.map((item: any, index: number) => (
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
                  {stats.topBrowsers.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{item.browser}</span>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest visitor and admin activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.recentActivity.slice(0, 10).map((session: VisitorSession, index: number) => (
                  <div key={session.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Badge variant={session.sessionType === 'admin' ? 'destructive' : 'secondary'}>
                        {session.sessionType}
                      </Badge>
                      <span className="text-sm">
                        {session.sessionType === 'admin' ? (session as AdminSession).email : `Visitor #${session.visitorId.split('_')[1]?.substring(0, 6)}`}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {getLocationString(session.location)}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(session.lastVisit)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteMonitoringDashboard;