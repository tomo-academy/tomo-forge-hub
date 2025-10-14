import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, Video, Database, Mail, Settings, Activity, 
  TrendingUp, Clock, Shield, AlertCircle, CheckCircle,
  Edit, Trash2, Plus, Upload, Eye, BarChart3
} from 'lucide-react';
import { db } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { isAdmin, adminEmail } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalVideos: 0,
    recentLogins: 0,
    pendingTasks: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadDashboardData();
  }, [isAdmin, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load employees
      const employees = await db.employees.getAll();
      
      // Load videos (from localStorage for now)
      const videos = JSON.parse(localStorage.getItem('videos') || '[]');
      
      setStats({
        totalEmployees: employees.length,
        totalVideos: videos.length,
        recentLogins: 1, // Current session
        pendingTasks: 0
      });

      // Create recent activity log
      const activity = [
        {
          id: 1,
          type: 'login',
          message: 'Admin logged in',
          time: new Date().toLocaleString(),
          icon: Shield,
          color: 'text-green-500'
        },
        {
          id: 2,
          type: 'view',
          message: 'Viewed dashboard',
          time: new Date().toLocaleString(),
          icon: Eye,
          color: 'text-blue-500'
        }
      ];
      
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground">
              Welcome back, {adminEmail}. Manage your entire platform from here.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge variant="secondary">{stats.totalEmployees}</Badge>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Employees</h3>
              <p className="text-2xl font-bold">{stats.totalEmployees}</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Video className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge variant="secondary">{stats.totalVideos}</Badge>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Videos</h3>
              <p className="text-2xl font-bold">{stats.totalVideos}</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">Active</Badge>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Recent Logins</h3>
              <p className="text-2xl font-bold">{stats.recentLogins}</p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <Database className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Database Status</h3>
              <p className="text-2xl font-bold">Connected</p>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="employees">Employees</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <Button 
                      className="w-full justify-start gap-2"
                      onClick={() => navigate('/team')}
                    >
                      <Plus className="w-4 h-4" />
                      Add New Employee
                    </Button>
                    <Button 
                      className="w-full justify-start gap-2"
                      variant="outline"
                      onClick={() => navigate('/videos')}
                    >
                      <Upload className="w-4 h-4" />
                      Upload Video
                    </Button>
                    <Button 
                      className="w-full justify-start gap-2"
                      variant="outline"
                      onClick={() => navigate('/team')}
                    >
                      <Users className="w-4 h-4" />
                      Manage Team
                    </Button>
                    <Button 
                      className="w-full justify-start gap-2"
                      variant="outline"
                      onClick={() => navigate('/analytics')}
                    >
                      <BarChart3 className="w-4 h-4" />
                      View Analytics
                    </Button>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <activity.icon className={`w-5 h-5 mt-0.5 ${activity.color}`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* System Status */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  System Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/10">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Database</p>
                      <p className="text-xs text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/10">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Email Service</p>
                      <p className="text-xs text-muted-foreground">Configured</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/10">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Authentication</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Employees Tab */}
            <TabsContent value="employees">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Employee Management</h3>
                  <Button onClick={() => navigate('/team')}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
                <p className="text-muted-foreground mb-4">
                  Total Employees: {stats.totalEmployees}
                </p>
                <Button variant="outline" onClick={() => navigate('/team')}>
                  Go to Team Page
                </Button>
              </Card>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Video Management</h3>
                  <Button onClick={() => navigate('/videos')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                </div>
                <p className="text-muted-foreground mb-4">
                  Total Videos: {stats.totalVideos}
                </p>
                <Button variant="outline" onClick={() => navigate('/videos')}>
                  Go to Videos Page
                </Button>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">Activity Log</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border">
                      <activity.icon className={`w-6 h-6 ${activity.color}`} />
                      <div className="flex-1">
                        <p className="font-medium">{activity.message}</p>
                        <p className="text-sm text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-6">Admin Settings</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Receive email notifications for admin activities
                    </p>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enabled
                    </Badge>
                  </div>
                  
                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Admin Email</h4>
                    <p className="text-sm text-muted-foreground">
                      {adminEmail}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border">
                    <h4 className="font-medium mb-2">Session Duration</h4>
                    <p className="text-sm text-muted-foreground">
                      24 hours (auto-logout after inactivity)
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
