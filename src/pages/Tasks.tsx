import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import Navbar from "@/components/Navbar";
import { taskService, Task, TaskStats } from "@/services/tasks";
import { 
  Plus, MoreVertical, Calendar, User, Flag,
  Clock, CheckCircle, AlertCircle, Circle,
  Filter, Search, BarChart3, TrendingUp,
  Target, Activity
} from "lucide-react";

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const columns = [
    { id: "backlog", title: "Backlog", color: "text-muted-foreground" },
    { id: "todo", title: "To Do", color: "text-accent" },
    { id: "in_progress", title: "In Progress", color: "text-warning" },
    { id: "review", title: "Review", color: "text-primary" },
    { id: "done", title: "Done", color: "text-success" },
  ];

  // Load tasks and stats
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await taskService.initializeDefaultTasks();
        const [tasksData, statsData] = await Promise.all([
          taskService.getTasks(),
          taskService.getTaskStats()
        ]);
        setTasks(tasksData);
        setTaskStats(statsData);
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Group tasks by status
  const tasksByStatus = tasks.reduce((acc, task) => {
    if (!acc[task.status]) {
      acc[task.status] = [];
    }
    acc[task.status].push(task);
    return acc;
  }, {} as { [key: string]: Task[] });

  // Filter tasks based on search
  const filteredTasksByStatus = Object.keys(tasksByStatus).reduce((acc, status) => {
    acc[status] = tasksByStatus[status].filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    return acc;
  }, {} as { [key: string]: Task[] });

  // Create new task
  const handleCreateTask = async () => {
    // This would open a create task modal
    console.log('Create new task');
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-destructive text-destructive-foreground"><AlertCircle className="w-3 h-3 mr-1" />Urgent</Badge>;
      case "high":
        return <Badge className="bg-primary text-primary-foreground"><Flag className="w-3 h-3 mr-1" />High</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
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
                  Task Management
                </h1>
                <p className="text-muted-foreground text-lg">
                  Manage projects and track team progress with real-time data
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Activity className="w-4 h-4" />
                  Live Data
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary-hover shadow-glow gap-2"
                  onClick={handleCreateTask}
                >
                  <Plus className="w-4 h-4" />
                  New Task
                </Button>
              </div>
            </div>

            {/* Real-time Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <StatsCard
                title="Backlog"
                value={taskStats?.backlog || 0}
                icon={Circle}
                iconColor="text-muted-foreground"
                iconBgColor="bg-muted/10"
              />
              <StatsCard
                title="To Do"
                value={taskStats?.todo || 0}
                change={{ value: 3, label: "new this week", isPositive: true }}
                icon={Target}
                iconColor="text-accent"
                iconBgColor="bg-accent/10"
              />
              <StatsCard
                title="In Progress"
                value={taskStats?.inProgress || 0}
                icon={Activity}
                iconColor="text-warning"
                iconBgColor="bg-warning/10"
              />
              <StatsCard
                title="Review"
                value={taskStats?.review || 0}
                icon={CheckCircle}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
              />
              <StatsCard
                title="Completed"
                value={taskStats?.done || 0}
                change={{ value: taskStats?.completedThisWeek || 0, label: "this week", isPositive: true }}
                icon={CheckCircle}
                iconColor="text-success"
                iconBgColor="bg-success/10"
              />
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tasks by title, assignee, or tags..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>

            {/* Kanban Board */}
            <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-5 md:overflow-x-visible">
              {columns.map((column) => (
                <div key={column.id} className="flex-shrink-0 w-72 md:w-auto md:flex-shrink">
                  <AnimatedCard className="p-4 h-full">
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Circle className={`w-4 h-4 ${column.color}`} fill="currentColor" />
                        <h3 className="font-bold">{column.title}</h3>
                        <Badge variant="secondary" className="ml-2">
                          {filteredTasksByStatus[column.id]?.length || 0}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="icon" onClick={handleCreateTask}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {filteredTasksByStatus[column.id]?.map((task) => (
                        <AnimatedCard 
                          key={task.id}
                          hoverEffect="border"
                          className="p-4 cursor-pointer group"
                        >
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-mono text-muted-foreground">{task.id}</span>
                          <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Title & Description */}
                        <h4 className="font-semibold text-sm mb-2">{task.title}</h4>
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {task.description}
                        </p>

                        {/* Progress Bar (for in-progress tasks) */}
                        {task.progress !== undefined && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{task.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-warning transition-all"
                                style={{ width: `${task.progress}%` }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {task.tags.map((tag, idx) => (
                            <Badge 
                              key={idx} 
                              variant="outline" 
                              className="text-xs px-2 py-0"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                              {getInitials(task.assignee)}
                            </div>
                            {task.reviewer && (
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-success flex items-center justify-center text-white text-xs font-bold">
                                {getInitials(task.reviewer)}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {getPriorityBadge(task.priority)}
                            {task.dueDate && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="w-3 h-3" />
                                {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                            )}
                            {task.completedDate && (
                              <div className="flex items-center gap-1 text-xs text-success">
                                <CheckCircle className="w-3 h-3" />
                                {new Date(task.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                            )}
                          </div>
                          </div>
                        </AnimatedCard>
                      ))}
                    </div>
                  </AnimatedCard>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LoadingSpinnerOverlay>
    </div>
  );
};

export default Tasks;
