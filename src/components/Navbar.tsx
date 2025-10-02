import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Menu, X, Youtube, Zap, Bell, User } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary p-2 rounded-lg group-hover:shadow-glow transition-all">
              <Youtube className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">TOMO Academy</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-fast font-medium relative group">
                Dashboard
                <Badge variant="secondary" className="absolute -top-2 -right-8 text-xs animate-pulse">
                  Live
                </Badge>
              </Link>
              <Link to="/team" className="text-muted-foreground hover:text-foreground transition-fast font-medium">
                Team
              </Link>
              <Link to="/videos" className="text-muted-foreground hover:text-foreground transition-fast font-medium relative group">
                Videos
                <Badge variant="outline" className="absolute -top-2 -right-6 text-xs bg-primary/10">
                  Pro
                </Badge>
              </Link>
              <Link to="/tasks" className="text-muted-foreground hover:text-foreground transition-fast font-medium">
                Tasks
              </Link>
              <Link to="/resources" className="text-muted-foreground hover:text-foreground transition-fast font-medium">
                Resources
              </Link>
            </div>
            
            <div className="flex items-center gap-3 ml-4 border-l border-border pl-4">
              <ThemeToggle />
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-4 h-4" />
                <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 rounded-full text-xs bg-primary text-primary-foreground">
                  3
                </Badge>
              </Button>
              
              <Button variant="ghost" size="icon">
                <User className="w-4 h-4" />
              </Button>
              
              <Button variant="default" size="sm" className="bg-primary hover:bg-primary-hover shadow-glow">
                <Zap className="w-3 h-3 mr-1" />
                Premium
              </Button>
            </div>
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
            <div className="px-4">
              <Button variant="default" className="w-full bg-primary hover:bg-primary-hover">
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
