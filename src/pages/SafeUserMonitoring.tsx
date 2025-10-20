import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import { SEO } from "@/components/SEO";
import Navbar from "@/components/Navbar";
import { 
  Users, Search, UserPlus, Activity, Shield, 
  Clock, MapPin, Monitor, Smartphone, Tablet, 
  Globe, Eye, TrendingUp, Calendar
} from "lucide-react";

interface UserData {
  id: string;
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  location: {
    country: string;
    city: string;
    region: string;
  };
  device: {
    type: string;
    os: string;
    browser: string;
  };
  visitedPages: string[];
  firstVisit: string;
  lastActivity: string;
  totalSessions: number;
  isActive: boolean;
}

const SafeUserMonitoring = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState("all");

  // Mock user data for demonstration
  const mockUsers: UserData[] = [
    {
      id: "1",
      sessionId: "sess_abc123",
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: {
        country: "United States",
        city: "New York",
        region: "NY"
      },
      device: {
        type: "Desktop",
        os: "Windows 10",
        browser: "Chrome"
      },
      visitedPages: ["/", "/dashboard", "/profile"],
      firstVisit: "2025-01-19T10:00:00Z",
      lastActivity: "2025-01-19T14:30:00Z",
      totalSessions: 5,
      isActive: true
    },
    {
      id: "2",
      sessionId: "sess_def456",
      ipAddress: "10.0.0.50",
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      location: {
        country: "Canada",
        city: "Toronto",
        region: "ON"
      },
      device: {
        type: "Mobile",
        os: "iOS 17",
        browser: "Safari"
      },
      visitedPages: ["/", "/videos"],
      firstVisit: "2025-01-19T09:15:00Z",
      lastActivity: "2025-01-19T13:45:00Z",
      totalSessions: 2,
      isActive: false
    },
    {
      id: "3",
      sessionId: "sess_ghi789",
      ipAddress: "172.16.0.25",
      userAgent: "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15",
      location: {
        country: "United Kingdom",
        city: "London",
        region: "England"
      },
      device: {
        type: "Tablet",
        os: "iPadOS 17",
        browser: "Safari"
      },
      visitedPages: ["/", "/dashboard", "/videos", "/profile"],
      firstVisit: "2025-01-19T08:30:00Z",
      lastActivity: "2025-01-19T12:20:00Z",
      totalSessions: 8,
      isActive: true
    }
  ];

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.location.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.device.os.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.ipAddress.includes(searchQuery);

    if (timeFilter === "active") return user.isActive && matchesSearch;
    if (timeFilter === "today") {
      const today = new Date().toDateString();
      return new Date(user.lastActivity).toDateString() === today && matchesSearch;
    }
    return matchesSearch;
  });

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  const getDeviceColor = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'tablet': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.isActive).length,
    totalSessions: users.reduce((sum, u) => sum + u.totalSessions, 0),
    uniqueCountries: new Set(users.map(u => u.location.country)).size
  };

  if (isLoading) {
    return <LoadingSpinnerOverlay message="Loading user data..." />;
  }

  return (
    <>
      <SEO 
        title="User Monitoring - TOMO Academy"
        description="Monitor user activity and analytics"
        canonical="/user-monitoring"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Navbar />
        
        <div className="container mx-auto px-4 py-6 pt-20 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                  <Users className="w-8 h-8 mr-3 text-blue-500" />
                  User Monitoring
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Real-time user activity tracking and analytics dashboard
                </p>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 w-full lg:w-auto">
                <UserPlus className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by location, device, or IP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={timeFilter === "all" ? "default" : "outline"}
                  onClick={() => setTimeFilter("all")}
                  size="sm"
                >
                  All Users
                </Button>
                <Button
                  variant={timeFilter === "active" ? "default" : "outline"}
                  onClick={() => setTimeFilter("active")}
                  size="sm"
                >
                  Active Now
                </Button>
                <Button
                  variant={timeFilter === "today" ? "default" : "outline"}
                  onClick={() => setTimeFilter("today")}
                  size="sm"
                >
                  Today
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Active Now</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeUsers}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Sessions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSessions}</p>
                  </div>
                  <Eye className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Countries</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.uniqueCountries}</p>
                  </div>
                  <Globe className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* User Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge className={`${getDeviceColor(user.device.type)} flex items-center gap-1`}>
                          {getDeviceIcon(user.device.type)}
                          {user.device.type}
                        </Badge>
                        {user.isActive && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex items-center gap-1 animate-pulse">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            Active
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                          {user.sessionId}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {user.location.city}, {user.location.country}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white font-mono">
                            {user.ipAddress}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {formatTimeAgo(user.lastActivity)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Device:</span> {user.device.os} • {user.device.browser}
                      </div>
                      
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">Pages visited:</span> {user.visitedPages.join(", ")}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex flex-row lg:flex-col gap-4 lg:gap-2 lg:text-right">
                      <div className="text-center lg:text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{user.totalSessions}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Sessions</p>
                      </div>
                      <div className="text-center lg:text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{user.visitedPages.length}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pages</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No users found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {searchQuery ? "Try adjusting your search terms" : "No user activity detected"}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SafeUserMonitoring;