import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, Check, X, Video, Users, MessageSquare, 
  TrendingUp, Award, Calendar, AlertCircle, Info,
  CheckCircle, Clock, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: any;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "success",
    title: "New Video Published",
    message: "Firebase Tutorial Series is now live with 1.2K views",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    icon: Video
  },
  {
    id: "2",
    type: "info",
    title: "Team Member Added",
    message: "Kanish SJ joined the Technology department",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    icon: Users
  },
  {
    id: "3",
    type: "success",
    title: "Milestone Achieved",
    message: "Congratulations! You've reached 100K subscribers",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    icon: Award
  },
  {
    id: "4",
    type: "warning",
    title: "Upcoming Deadline",
    message: "Video editing for React Hooks tutorial due in 2 hours",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: true,
    icon: Clock
  },
  {
    id: "5",
    type: "info",
    title: "New Comment",
    message: "Someone commented on your TypeScript tutorial",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    icon: MessageSquare
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (notification: Notification) => {
    if (notification.icon) return notification.icon;
    
    switch (notification.type) {
      case "success": return CheckCircle;
      case "error": return AlertCircle;
      case "warning": return AlertCircle;
      case "info": return Info;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success": return "text-success bg-success/10";
      case "error": return "text-destructive bg-destructive/10";
      case "warning": return "text-warning bg-warning/10";
      case "info": return "text-accent bg-accent/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read)
    : notifications;

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Card className="w-full max-w-md">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="rounded-full">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Check className="w-4 h-4 mr-1" />
            Mark all read
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="flex-1"
          >
            All ({notifications.length})
          </Button>
          <Button
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("unread")}
            className="flex-1"
          >
            Unread ({unreadCount})
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="h-[400px]">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredNotifications.map((notification) => {
              const Icon = getIcon(notification);
              
              return (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                    !notification.read && "bg-primary/5"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className={cn("p-2 rounded-lg flex-shrink-0 h-fit", getTypeColor(notification.type))}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className={cn(
                          "font-semibold text-sm",
                          !notification.read && "text-foreground"
                        )}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={clearAll}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All Notifications
          </Button>
        </div>
      )}
    </Card>
  );
}
