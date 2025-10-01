import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { 
  Users, Video, CheckCircle, TrendingUp, 
  Calendar, Clock, Award, PlayCircle 
} from "lucide-react";

const Dashboard = () => {
  const quickStats = [
    {
      icon: Users,
      label: "Team Members",
      value: "14",
      change: "+2 this month",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Video,
      label: "Total Videos",
      value: "234",
      change: "+8 this week",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: CheckCircle,
      label: "Tasks Completed",
      value: "89%",
      change: "+5% vs last week",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: TrendingUp,
      label: "Channel Growth",
      value: "125K",
      change: "+3.2K subscribers",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const recentActivity = [
    {
      user: "Kanish SJ",
      action: "uploaded new video",
      title: "Firebase Tutorial - Part 5",
      time: "2 hours ago",
    },
    {
      user: "Kamesh",
      action: "completed design task",
      title: "Thumbnail for Tech Review",
      time: "4 hours ago",
    },
    {
      user: "Ajay Krithick",
      action: "reviewed and approved",
      title: "Script: AI in Education",
      time: "5 hours ago",
    },
    {
      user: "Nithish",
      action: "started working on",
      title: "Video Editing Project",
      time: "6 hours ago",
    },
  ];

  const upcomingDeadlines = [
    { task: "Edit: React Tutorial Series", due: "Today, 5:00 PM", priority: "high" },
    { task: "Thumbnail Design: Web3 Explained", due: "Tomorrow, 2:00 PM", priority: "medium" },
    { task: "Script Review: Mobile Dev Course", due: "Dec 28, 10:00 AM", priority: "low" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome back! 👋</h1>
              <p className="text-muted-foreground text-lg">
                Here's what's happening with TOMO Academy today.
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover shadow-glow">
              <PlayCircle className="mr-2 w-4 h-4" />
              Quick Actions
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <Card key={index} className="p-6 hover:border-primary/50 transition-all group cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <h2 className="text-2xl font-bold">Recent Activity</h2>
                </div>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-all cursor-pointer border border-transparent hover:border-border"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">
                        {activity.user.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-semibold">{activity.user}</span>
                        {" "}
                        <span className="text-muted-foreground">{activity.action}</span>
                      </p>
                      <p className="text-sm font-medium mt-1">{activity.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Upcoming Deadlines */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-2xl font-bold">Deadlines</h2>
              </div>
              
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      deadline.priority === 'high' 
                        ? 'border-l-primary bg-primary/5' 
                        : deadline.priority === 'medium'
                        ? 'border-l-warning bg-warning/5'
                        : 'border-l-muted bg-muted/50'
                    }`}
                  >
                    <p className="font-medium text-sm mb-2">{deadline.task}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {deadline.due}
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                View All Tasks
              </Button>
            </Card>
          </div>

          {/* Performance Overview */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="text-2xl font-bold">This Week's Performance</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-3xl font-bold text-primary mb-2">8</p>
                <p className="text-sm text-muted-foreground">Videos Published</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-3xl font-bold text-accent mb-2">47</p>
                <p className="text-sm text-muted-foreground">Tasks Completed</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/30">
                <p className="text-3xl font-bold text-success mb-2">156K</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
