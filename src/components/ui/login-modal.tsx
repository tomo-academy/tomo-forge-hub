import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  Shield,
  Loader2
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const ADMIN_EMAIL = 'tomoacademyofficial@gmail.com';
  
  const [loginData, setLoginData] = useState({
    password: ''
  });

  const resetForm = () => {
    setLoginData({ password: '' });
    setError(null);
    setSuccess(false);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const success = await login(ADMIN_EMAIL, loginData.password);
      
      if (success) {
        setSuccess(true);
        setTimeout(() => {
          onLoginSuccess();
          handleClose();
        }, 1500);
      } else {
        setError('Invalid credentials. Only admin can login.');
      }
    } catch (err: any) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">Admin Login</DialogTitle>
          <DialogDescription>
            Only administrators can access this system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4 mt-4">
          {/* Admin Email Display */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Admin Email
            </Label>
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg border">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">{ADMIN_EMAIL}</span>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                disabled={isLoading}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg text-success text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <p>Login successful! Redirecting...</p>
            </div>
          )}

          {/* Login Button */}
          <Button
            type="submit"
            disabled={isLoading || success}
            className="w-full bg-primary hover:bg-primary-hover gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Login as Admin
              </>
            )}
          </Button>

          {/* Info */}
          <div className="text-center text-xs text-muted-foreground pt-2">
            <p>🔒 Secure admin-only access</p>
            <p className="mt-1">Contact system administrator for credentials</p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
