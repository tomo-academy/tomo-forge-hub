// src/components/LoginModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserMonitoring } from "@/hooks/useUserMonitoring";
import { employees } from "@/data/employees";
import { 
  User, 
  Mail, 
  Lock, 
  Building2, 
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess?: (user: any) => void;
}

export const LoginModal = ({ isOpen, onOpenChange, onLoginSuccess }: LoginModalProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { trackLogin } = useUserMonitoring();

  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Find selected employee
      const employee = employees.find(emp => emp.id === selectedEmployee);
      if (!employee) {
        setError("Please select a valid employee");
        return;
      }

      // Validate email matches employee
      if (email.toLowerCase() !== employee.email.toLowerCase()) {
        setError("Email doesn't match selected employee");
        return;
      }

      // Simple password validation (in real app, this would be secure authentication)
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }

      // Simulate login delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Track successful login
      const session = trackLogin(
        employee.email,
        employee.name,
        employee.role,
        employee.department
      );

      // Reset form
      setEmail("");
      setPassword("");
      setSelectedEmployee("");
      
      // Call success callback
      onLoginSuccess?.(session);
      
      // Close modal
      onOpenChange(false);

    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmployeeChange = (employeeId: string) => {
    setSelectedEmployee(employeeId);
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setEmail(employee.email);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="w-5 h-5" />
            Login to TOMO Academy
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Employee Selection */}
          <div className="space-y-2">
            <Label htmlFor="employee">Select Employee</Label>
            <Select value={selectedEmployee} onValueChange={handleEmployeeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Choose your profile..." />
              </SelectTrigger>
              <SelectContent>
                {employees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-xs text-muted-foreground">{employee.role}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="pl-10"
                disabled={!selectedEmployee}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password..."
                className="pl-10 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">{error}</span>
            </div>
          )}

          {/* Selected Employee Info */}
          {selectedEmployee && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-medium">
                  {employees.find(emp => emp.id === selectedEmployee)?.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-medium">{employees.find(emp => emp.id === selectedEmployee)?.name}</div>
                  <div className="text-sm text-muted-foreground">{employees.find(emp => emp.id === selectedEmployee)?.role}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {employees.find(emp => emp.id === selectedEmployee)?.department}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleLogin} 
            disabled={!selectedEmployee || !email || !password || isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Logging in...
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                Login
              </>
            )}
          </Button>
        </div>

        {/* Demo Note */}
        <div className="text-xs text-muted-foreground text-center p-3 bg-muted/30 rounded-lg">
          <strong>Demo Login:</strong> Select any employee and use any password (6+ characters)
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;