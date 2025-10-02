import { useState } from "react";
import QRCode from "react-qr-code";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Share2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Star,
  Shield,
  Verified,
  Youtube
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeIDCardProps {
  employee: {
    id: string;
    name: string;
    role: string;
    department: string;
    email: string;
    phone?: string;
    employeeId: string;
    joinDate: string;
    avatar?: string;
    location?: string;
    availability: 'available' | 'busy' | 'offline';
    stats: {
      videos: number;
      tasks: number;
      rating: number;
      projects: number;
    };
    cardColor?: string;
  };
  variant?: 'landscape' | 'portrait';
  showQR?: boolean;
  premium?: boolean;
}

export function EmployeeIDCard({ 
  employee, 
  variant = 'landscape', 
  showQR = true, 
  premium = true 
}: EmployeeIDCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardColors = {
    primary: 'from-primary/20 to-primary/5',
    accent: 'from-accent/20 to-accent/5',
    success: 'from-success/20 to-success/5',
    warning: 'from-warning/20 to-warning/5',
    destructive: 'from-destructive/20 to-destructive/5',
  };

  const getCardColor = () => {
    if (employee.cardColor && cardColors[employee.cardColor as keyof typeof cardColors]) {
      return cardColors[employee.cardColor as keyof typeof cardColors];
    }
    return cardColors.primary;
  };

  const getAvailabilityColor = () => {
    switch (employee.availability) {
      case 'available':
        return 'bg-success';
      case 'busy':
        return 'bg-warning';
      case 'offline':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  const qrData = JSON.stringify({
    id: employee.id,
    name: employee.name,
    role: employee.role,
    department: employee.department,
    employeeId: employee.employeeId,
    email: employee.email,
    company: 'TOMO Academy',
    verified: true
  });

  const isLandscape = variant === 'landscape';

  return (
    <div className={cn(
      "relative group perspective-1000",
      isLandscape ? "w-96 h-60" : "w-72 h-96"
    )}>
      <div 
        className={cn(
          "relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer",
          isFlipped && "rotate-y-180"
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front Side */}
        <Card className={cn(
          "absolute inset-0 backface-hidden overflow-hidden",
          "bg-gradient-to-br", getCardColor(),
          premium && "shadow-2xl border-2 border-primary/20"
        )}>
          {/* Header with TOMO Academy Logo */}
          <div className="relative p-4 bg-gradient-to-r from-primary to-accent text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Youtube className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">TOMO Academy</h3>
                  <p className="text-xs opacity-90">Digital Platform</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Verified className="w-4 h-4" />
                <Shield className="w-4 h-4" />
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-2 right-16 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
            <div className="absolute bottom-2 left-20 w-1 h-1 bg-white/40 rounded-full animate-ping" />
          </div>

          {/* Main Content */}
          <div className={cn(
            "p-4 space-y-4",
            isLandscape ? "flex gap-4" : "block"
          )}>
            {/* Avatar and Basic Info */}
            <div className={cn(
              "flex items-center gap-4",
              isLandscape ? "flex-col" : "flex-row"
            )}>
              <div className="relative">
                <div className={cn(
                  "rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold",
                  isLandscape ? "w-16 h-16 text-xl" : "w-12 h-12 text-lg"
                )}>
                  {employee.avatar || employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className={cn(
                  "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white",
                  getAvailabilityColor()
                )} />
              </div>
              
              <div className={cn(
                "flex-1",
                isLandscape ? "text-center" : "text-left"
              )}>
                <h2 className="font-bold text-lg leading-tight">{employee.name}</h2>
                <p className="text-sm text-muted-foreground">{employee.role}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {employee.department}
                </Badge>
              </div>
            </div>

            {/* Employee Details */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Shield className="w-3 h-3 text-primary" />
                <span className="font-mono font-bold">{employee.employeeId}</span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Since {new Date(employee.joinDate).getFullYear()}</span>
              </div>
              
              {employee.location && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  <span>{employee.location}</span>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="text-center p-2 bg-primary/10 rounded">
                  <div className="font-bold text-primary">{employee.stats.videos}</div>
                  <div className="text-xs text-muted-foreground">Videos</div>
                </div>
                <div className="text-center p-2 bg-accent/10 rounded">
                  <div className="font-bold text-accent">{employee.stats.tasks}</div>
                  <div className="text-xs text-muted-foreground">Tasks</div>
                </div>
              </div>
            </div>

            {/* QR Code */}
            {showQR && isLandscape && (
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-white rounded-lg shadow-md">
                  <QRCode
                    value={qrData}
                    size={80}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
                <p className="text-xs text-muted-foreground text-center">Scan for details</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 text-warning fill-warning" />
                <span className="font-medium">{employee.stats.rating}/5.0</span>
              </div>
              <div className="text-muted-foreground">
                ID: {employee.employeeId}
              </div>
            </div>
          </div>

          {/* Premium glow effect */}
          {premium && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          )}
        </Card>

        {/* Back Side */}
        <Card className={cn(
          "absolute inset-0 backface-hidden rotate-y-180 overflow-hidden",
          "bg-gradient-to-br from-accent/20 to-primary/5",
          premium && "shadow-2xl border-2 border-accent/20"
        )}>
          <div className="p-4 h-full flex flex-col">
            {/* Header */}
            <div className="text-center mb-4">
              <h3 className="font-bold text-lg">Contact Information</h3>
              <p className="text-sm text-muted-foreground">{employee.name}</p>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3 p-2 bg-background/50 rounded">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">{employee.email}</span>
              </div>
              
              {employee.phone && (
                <div className="flex items-center gap-3 p-2 bg-background/50 rounded">
                  <Phone className="w-4 h-4 text-accent" />
                  <span className="text-sm">{employee.phone}</span>
                </div>
              )}

              {/* Large QR Code */}
              {showQR && (
                <div className="flex flex-col items-center gap-2 mt-4">
                  <div className="p-3 bg-white rounded-lg shadow-lg">
                    <QRCode
                      value={qrData}
                      size={isLandscape ? 120 : 160}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Scan to view full profile
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Share2 className="w-3 h-3 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Flip indicator */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        Click to flip
      </div>
    </div>
  );
}

// Bulk ID Card Display Component
interface EmployeeIDCardsGridProps {
  employees: EmployeeIDCardProps['employee'][];
  variant?: 'landscape' | 'portrait';
  columns?: number;
}

export function EmployeeIDCardsGrid({ 
  employees, 
  variant = 'landscape', 
  columns = 3 
}: EmployeeIDCardsGridProps) {
  return (
    <div className={cn(
      "grid gap-6",
      columns === 2 && "grid-cols-1 md:grid-cols-2",
      columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      columns === 4 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    )}>
      {employees.map((employee) => (
        <EmployeeIDCard
          key={employee.id}
          employee={employee}
          variant={variant}
          premium={true}
        />
      ))}
    </div>
  );
}