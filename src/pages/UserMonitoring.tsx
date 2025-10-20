// src/pages/UserMonitoring.tsx
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/ui/stats-card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { userMonitoringService } from "@/services/userMonitoringService";
import { 
  Users, 
  Activity, 
  Eye, 
  Clock, 
  Shield, 
  UserCheck, 
  UserX,
  RefreshCw,
  Search,
  Filter,
  Download,
  AlertTriangle,
  CheckCircle,
  Globe,
  Smartphone,
  Monitor,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart
} from "lucide-react";

const UserMonitoring = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadData();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    setRefreshInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const loadData = () => {
    try {
      const allSessions = userMonitoringService.getAllSessions();
      const attempts = userMonitoringService.getLoginAttempts();
      const statistics = userMonitoringService.getUserStats();

      setSessions(allSessions);
      setLoginAttempts(attempts);
      setStats(statistics);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading monitoring data:', error);
      setIsLoading(false);
    }
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = 
      session.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && session.isActive) ||
      (filterStatus === 'inactive' && !session.isActive);

    return matchesSearch && matchesStatus;
  });

  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
        <UserCheck className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="secondary">
        <UserX className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <Monitor className="w-4 h-4" />;
    
    if (userAgent.includes('Mobile')) {
      return <Smartphone className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const exportData = () => {
    const dataToExport = {
      sessions: filteredSessions,
      loginAttempts,
      stats,
      exportTime: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-monitoring-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <LoadingSpinnerOverlay isLoading={isLoading}>
        <div className="pt-24 px-4 pb-12 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  User Monitoring Dashboard
                </h1>
                <p className="text-muted-foreground text-lg">
                  Real-time tracking of user sessions, logins, and platform activity
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={loadData} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button variant="outline" onClick={exportData} className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Users"
                value={stats.totalUsers || 0}
                icon={<Users className="w-5 h-5" />}
                description="Unique users registered"
                trend={12}
              />
              <StatsCard
                title="Active Sessions"
                value={stats.activeSessions || 0}
                icon={<Activity className="w-5 h-5" />}
                description="Currently online"
                trend={8}
              />
              <StatsCard
                title="Total Sessions"
                value={stats.totalSessions || 0}
                icon={<Eye className="w-5 h-5" />}
                description="All-time sessions"
                trend={15}
              />
              <StatsCard
                title="Avg Session Time"
                value={formatDuration(stats.averageSessionDuration || 0)}
                icon={<Clock className="w-5 h-5" />}
                description="Average duration"
                trend={-5}
              />
            </div>

            {/* Login Success Rate */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <AnimatedCard className="p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Login Analytics</h3>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {stats.successfulLogins || 0} Success
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <AlertTriangle className="w-3 h-3 text-red-500" />
                      {stats.failedLogins || 0} Failed
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Success Rate</span>
                      <span>{stats.totalLoginAttempts ? Math.round((stats.successfulLogins / stats.totalLoginAttempts) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ 
                          width: `${stats.totalLoginAttempts ? (stats.successfulLogins / stats.totalLoginAttempts) * 100 : 0}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </AnimatedCard>

              <AnimatedCard className="p-6">
                <h3 className="text-lg font-semibold mb-4">Users by Department</h3>
                <div className="space-y-3">
                  {Object.entries(stats.usersByDepartment || {}).map(([dept, count]) => (
                    <div key={dept} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{dept}</span>
                      <Badge variant="secondary">{count as number}</Badge>
                    </div>
                  ))}
                </div>
              </AnimatedCard>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or department..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sessions</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Sessions Table */}
            <Card className="overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Sessions ({filteredSessions.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">User</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Department</th>
                      <th className="text-left p-4 font-medium">Login Time</th>
                      <th className="text-left p-4 font-medium">Last Activity</th>
                      <th className="text-left p-4 font-medium">Duration</th>
                      <th className="text-left p-4 font-medium">Current Page</th>
                      <th className="text-left p-4 font-medium">Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSessions.map((session) => (
                      <tr key={session.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{session.userName}</div>
                            <div className="text-sm text-muted-foreground">{session.email}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(session.isActive)}
                        </td>
                        <td className="p-4">
                          <Badge variant="outline">{session.department}</Badge>
                        </td>
                        <td className="p-4 text-sm">
                          {formatTime(session.loginTime)}
                        </td>
                        <td className="p-4 text-sm">
                          {formatTime(session.lastActivity)}
                        </td>
                        <td className="p-4 text-sm">
                          {formatDuration(session.sessionDuration)}
                        </td>
                        <td className="p-4">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {session.currentPage}
                          </code>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(session.userAgent)}
                            <span className="text-xs text-muted-foreground">
                              {session.ipAddress}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {(stats.recentActivity || []).slice(0, 10).map((action: any) => (
                    <div key={action.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {action.type === 'login' && <UserCheck className="w-4 h-4 text-primary" />}
                          {action.type === 'logout' && <UserX className="w-4 h-4 text-muted-foreground" />}
                          {action.type === 'page_visit' && <Eye className="w-4 h-4 text-blue-500" />}
                          {action.type === 'click' && <Activity className="w-4 h-4 text-green-500" />}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{action.details}</div>
                          <div className="text-xs text-muted-foreground">{action.page}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatTime(action.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Most Visited Pages */}
            <Card className="overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Most Visited Pages
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {(stats.mostVisitedPages || []).map((page: any, index: number) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {page.page}
                        </code>
                      </div>
                      <Badge variant="secondary">{page.visits} visits</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </LoadingSpinnerOverlay>
    </div>
  );
};

export default UserMonitoring;