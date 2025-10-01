import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { 
  Plus, MoreVertical, Calendar, User, Flag,
  Clock, CheckCircle, AlertCircle, Circle
} from "lucide-react";

const Tasks = () => {
  const columns = [
    { id: "backlog", title: "Backlog", color: "text-muted-foreground" },
    { id: "todo", title: "To Do", color: "text-accent" },
    { id: "in_progress", title: "In Progress", color: "text-warning" },
    { id: "review", title: "Review", color: "text-primary" },
    { id: "done", title: "Done", color: "text-success" },
  ];

  const tasks = {
    backlog: [
      {
        id: "TASK-045",
        title: "Research AI video editing tools",
        description: "Explore automation options for video production",
        assignee: "Haridharuson L.J",
        priority: "low",
        dueDate: "2025-10-20",
        tags: ["research", "ai"],
      },
      {
        id: "TASK-046",
        title: "Update brand guidelines",
        description: "Refresh color palette and typography standards",
        assignee: "Kamesh",
        priority: "medium",
        dueDate: "2025-10-18",
        tags: ["design", "branding"],
      },
    ],
    todo: [
      {
        id: "TASK-042",
        title: "Create thumbnail for TypeScript tutorial",
        description: "Design eye-catching thumbnail with code snippets",
        assignee: "Raaj Nikitaa",
        priority: "high",
        dueDate: "2025-10-03",
        tags: ["design", "thumbnail"],
      },
      {
        id: "TASK-043",
        title: "Write script for Next.js deployment video",
        description: "Cover Vercel, Netlify, and custom hosting",
        assignee: "Nithyasri",
        priority: "high",
        dueDate: "2025-10-04",
        tags: ["script", "web-dev"],
      },
      {
        id: "TASK-044",
        title: "Plan December content calendar",
        description: "Schedule videos and coordinate with team",
        assignee: "Indhumathi",
        priority: "medium",
        dueDate: "2025-10-08",
        tags: ["planning", "content"],
      },
    ],
    in_progress: [
      {
        id: "TASK-039",
        title: "Edit React Hooks video",
        description: "Add transitions, color grading, and captions",
        assignee: "Nithish",
        priority: "urgent",
        dueDate: "2025-10-02",
        tags: ["editing", "react"],
        progress: 65,
      },
      {
        id: "TASK-040",
        title: "Develop analytics dashboard",
        description: "Build real-time channel metrics view",
        assignee: "Dev",
        priority: "high",
        dueDate: "2025-10-05",
        tags: ["development", "analytics"],
        progress: 40,
      },
    ],
    review: [
      {
        id: "TASK-037",
        title: "Firebase tutorial thumbnail",
        description: "Final review before publishing",
        assignee: "Kamesh",
        priority: "high",
        dueDate: "2025-10-02",
        tags: ["design", "review"],
        reviewer: "Kanish SJ",
      },
      {
        id: "TASK-038",
        title: "Web3 explainer script",
        description: "Technical accuracy check needed",
        assignee: "Haridharuson L.J",
        priority: "medium",
        dueDate: "2025-10-03",
        tags: ["script", "review"],
        reviewer: "Prawin Krishnan",
      },
    ],
    done: [
      {
        id: "TASK-035",
        title: "Upload CSS Grid tutorial",
        description: "Published successfully with SEO optimization",
        assignee: "Ajay Krithick",
        priority: "high",
        completedDate: "2025-09-28",
        tags: ["upload", "css"],
      },
      {
        id: "TASK-036",
        title: "Create Q4 social media strategy",
        description: "Cross-platform promotion plan finalized",
        assignee: "Aditya Chaurasiya",
        priority: "medium",
        completedDate: "2025-09-27",
        tags: ["marketing", "strategy"],
      },
    ],
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
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-[1600px] mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Task Board</h1>
              <p className="text-muted-foreground text-lg">
                Manage projects and track team progress
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover shadow-glow">
              <Plus className="mr-2 w-4 h-4" />
              New Task
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-muted-foreground">{tasks.backlog.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Backlog</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-accent">{tasks.todo.length}</p>
              <p className="text-xs text-muted-foreground mt-1">To Do</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-warning">{tasks.in_progress.length}</p>
              <p className="text-xs text-muted-foreground mt-1">In Progress</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{tasks.review.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Review</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-2xl font-bold text-success">{tasks.done.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Done</p>
            </Card>
          </div>

          {/* Kanban Board */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-80">
                <Card className="p-4 h-full">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Circle className={`w-4 h-4 ${column.color}`} fill="currentColor" />
                      <h3 className="font-bold">{column.title}</h3>
                      <Badge variant="secondary" className="ml-2">
                        {tasks[column.id as keyof typeof tasks]?.length || 0}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Tasks */}
                  <div className="space-y-3">
                    {tasks[column.id as keyof typeof tasks]?.map((task) => (
                      <Card 
                        key={task.id}
                        className="p-4 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all group"
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
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
