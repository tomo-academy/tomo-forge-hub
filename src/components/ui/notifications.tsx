import { useState } from "react";
import { Bell, X, Check, CheckCheck, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuHeader,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications, Notification } from "@/services/notifications";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-success bg-success/5';
      case 'warning':
        return 'border-l-warning bg-warning/5';
      case 'error':
        return 'border-l-destructive bg-destructive/5';
      default:
        return 'border-l-primary bg-primary/5';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div
      className={cn(
        "p-4 border-l-4 transition-all hover:bg-muted/50 group",
        getTypeColor(notification.type),
        !notification.read && "bg-opacity-100"
      )}
    >
      <div className="flex items-start gap-3">
        {notification.avatar && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-white">
              {notification.avatar}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn(
              "text-sm font-medium",
              !notification.read && "font-semibold"
            )}>
              {notification.title}
            </h4>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-destructive hover:text-destructive"
                onClick={() => onDelete(notification.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formatTime(notification.timestamp)}
            </span>
            
            {notification.action && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2"
                onClick={() => window.location.href = notification.action!.url}
              >
                {notification.action.label}
              </Button>
            )}
          </div>
          
          {!notification.read && (
            <div className="w-2 h-2 bg-primary rounded-full absolute top-4 right-4" />
          )}
        </div>
      </div>
    </div>
  );
}

export function NotificationDropdown() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    requestPermission
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-6 text-xs"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleRequestPermission}
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="w-full text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3 mr-2" />
              Clear all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function NotificationBadge() {
  const { unreadCount } = useNotifications();
  
  if (unreadCount === 0) return null;
  
  return (
    <Badge 
      variant="destructive" 
      className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-xs animate-pulse"
    >
      {unreadCount > 9 ? '9+' : unreadCount}
    </Badge>
  );
}