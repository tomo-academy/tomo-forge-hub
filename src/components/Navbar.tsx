import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { NotificationDropdown } from "@/components/ui/notifications";
import UserSessionStatus from "./UserSessionStatus";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, Youtube, Shield, LogOut, User, Monitor } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAdmin } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all p-1">
              <img 
                src="/logo.png" 
                alt="TOMO Academy" 
                className="w-full h-full object-cover rounded-full" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<div class="w-6 h-6 text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg></div>';
                  }
                }} 
              />
            </div>
            <span className="text-xl font-bold">TOMO Academy</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {isAdmin && (
              <>
                <Link to="/admin" className="text-primary hover:text-primary/80 transition-fast font-semibold flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
                <Link to="/admin/site-monitoring" className="text-primary hover:text-primary/80 transition-fast font-semibold flex items-center gap-1">
                  <Monitor className="w-4 h-4" />
                  Site Visitors
                </Link>
                <Link to="/admin/monitoring" className="text-primary hover:text-primary/80 transition-fast font-semibold flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  Admin Security
                </Link>
              </>
            )}
            <Link to="/monitoring" className="text-muted-foreground hover:text-foreground transition-fast flex items-center gap-1">
              <Monitor className="w-4 h-4" />
              User Monitoring
            </Link>
            <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-fast">
              Dashboard
            </Link>
            <Link to="/team" className="text-muted-foreground hover:text-foreground transition-fast">
              Team
            </Link>
            <Link to="/videos" className="text-muted-foreground hover:text-foreground transition-fast">
              Videos
            </Link>
            <Link to="/creator-pulse" className="text-muted-foreground hover:text-foreground transition-fast flex items-center gap-1">
              <Youtube className="w-4 h-4" />
              Creator Pulse
              <Badge variant="secondary" className="text-xs">AI</Badge>
            </Link>
            <Link to="/tasks" className="text-muted-foreground hover:text-foreground transition-fast">
              Tasks
            </Link>
            <Link to="/resources" className="text-muted-foreground hover:text-foreground transition-fast">
              Resources
            </Link>
            <NotificationDropdown />
            <ThemeToggle />
            <UserSessionStatus />
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-3 border-t border-border">
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className="block px-4 py-2 text-primary hover:text-primary/80 hover:bg-muted rounded-lg transition-fast flex items-center gap-2 font-semibold"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
                <Link
                  to="/admin/site-monitoring"
                  className="block px-4 py-2 text-primary hover:text-primary/80 hover:bg-muted rounded-lg transition-fast flex items-center gap-2 font-semibold"
                >
                  <Monitor className="w-4 h-4" />
                  Site Visitors
                </Link>
                <Link
                  to="/admin/monitoring"
                  className="block px-4 py-2 text-primary hover:text-primary/80 hover:bg-muted rounded-lg transition-fast flex items-center gap-2 font-semibold"
                >
                  <Shield className="w-4 h-4" />
                  Admin Security
                </Link>
              </>
            )}
            <Link
              to="/monitoring"
              className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-fast flex items-center gap-2"
            >
              <Monitor className="w-4 h-4" />
              User Monitoring
            </Link>
            <Link
              to="/dashboard"
              className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-fast"
            >
              Dashboard
            </Link>
            <Link
              to="/team"
              className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-fast"
            >
              Team
            </Link>
            <Link
              to="/videos"
              className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-fast"
            >
              Videos
            </Link>
            <Link
              to="/creator-pulse"
              className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-fast flex items-center gap-2"
            >
              <Youtube className="w-4 h-4" />
              Creator Pulse
              <Badge variant="secondary" className="text-xs">AI</Badge>
            </Link>
            <Link
              to="/tasks"
              className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-fast"
            >
              Tasks
            </Link>
            <Link
              to="/resources"
              className="block px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-fast"
            >
              Resources
            </Link>
            <div className="px-4 space-y-2">
              <UserSessionStatus />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
