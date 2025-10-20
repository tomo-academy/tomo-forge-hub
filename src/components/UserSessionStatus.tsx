// src/components/UserSessionStatus.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { userMonitoringService } from "@/services/userMonitoringService";
import LoginModal from "./LoginModal";
import { 
  User, 
  LogOut, 
  UserCheck, 
  Clock, 
  Monitor,
  Shield
} from "lucide-react";

export const UserSessionStatus = () => {
  const [currentSession, setCurrentSession] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Check for existing session
    const session = userMonitoringService.getCurrentSession();
    setCurrentSession(session);
  }, []);

  const handleLoginSuccess = (session: any) => {
    setCurrentSession(session);
  };

  const handleLogout = () => {
    userMonitoringService.logout();
    setCurrentSession(null);
  };

  const formatDuration = (startTime: string) => {
    const start = new Date(startTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}m`;
    }
  };

  if (!currentSession) {
    return (
      <>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowLoginModal(true)}
          className="gap-2"
        >
          <UserCheck className="w-4 h-4" />
          Login
        </Button>
        
        <LoginModal 
          isOpen={showLoginModal}
          onOpenChange={setShowLoginModal}
          onLoginSuccess={handleLoginSuccess}
        />
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 h-9">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
            {currentSession.userName.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="hidden md:inline">{currentSession.userName.split(' ')[0]}</span>
          <Badge variant="secondary" className="hidden lg:inline-flex text-xs">
            {currentSession.role}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
              {currentSession.userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="font-medium text-sm">{currentSession.userName}</div>
              <div className="text-xs text-muted-foreground">{currentSession.email}</div>
            </div>
          </div>
          
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>{currentSession.role}</span>
              <span>•</span>
              <span>{currentSession.department}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Active for {formatDuration(currentSession.loginTime)}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Monitor className="w-3 h-3" />
              <span>{currentSession.pageVisits?.length || 0} pages visited</span>
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive">
          <LogOut className="w-4 h-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserSessionStatus;