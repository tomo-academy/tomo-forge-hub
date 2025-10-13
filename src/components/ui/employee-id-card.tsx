import { useState } from "react";
import QRCode from "react-qr-code";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmployeeDetailModal } from "./employee-detail-modal";
import { EmployeeMenu } from "./employee-menu";
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
  Youtube,
  Eye,
  ExternalLink,
  MoreVertical
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
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  // Create QR data that links to individual profile page
  const profileUrl = `https://tomo-forge-hub.vercel.app/profile/${employee.id}`;
  const qrData = profileUrl;

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${employee.name}
ORG:TOMO Academy
TITLE:${employee.role}
EMAIL:${employee.email}
${employee.phone ? `TEL:${employee.phone}` : ''}
${employee.location ? `ADR:;;${employee.location};;;;` : ''}
NOTE:Employee ID: ${employee.employeeId} | Department: ${employee.department}
URL:https://tomo-forge-hub.vercel.app/profile/${employee.id}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employee.name.replace(/\s+/g, '_')}_TOMO_Academy.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${employee.name} - TOMO Academy`,
          text: `Check out ${employee.name}'s profile at TOMO Academy - ${employee.role}`,
          url: `https://tomo-forge-hub.vercel.app/profile/${employee.id}`
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(`https://tomo-forge-hub.vercel.app/profile/${employee.id}`);
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

  const isLandscape = variant === 'landscape';

  return (
    <>
      <div className={cn(
        "relative group perspective-1000 mx-auto",
        isLandscape 
          ? "w-full max-w-[400px] h-[250px] sm:w-[400px]" 
          : "w-full max-w-[280px] h-[400px] sm:w-[280px]"
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
          <div className="relative h-12 bg-gradient-to-r from-primary to-accent text-white flex items-center px-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/TOMO.jpg" 
                  alt="TOMO Academy"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'block';
                  }}
                />
                <Youtube className="w-5 h-5 text-primary hidden" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm leading-tight">TOMO Academy</h3>
                <p className="text-xs opacity-90 leading-tight">Digital Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Verified className="w-4 h-4" />
              <Shield className="w-4 h-4" />
              <EmployeeMenu
                employee={employee}
                onViewDetails={() => setShowDetailModal(true)}
                onDownload={downloadVCard}
                onShare={shareProfile}
              />
            </div>
          </div>

          {/* Main Content - Essential Information Only */}
          <div className="flex-1 p-4 flex">
            {isLandscape ? (
              // Landscape Layout - Clean & Essential
              <>
                {/* Left Section - Profile Photo */}
                <div className="w-28 flex flex-col items-center justify-center">
                  <div className="relative mb-3">
                    {/* Profile Photo Placeholder */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl border-3 border-white shadow-lg overflow-hidden">
                      {/* Placeholder for actual photo */}
                      <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                        {employee.avatar || employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h2 className="font-bold text-base leading-tight">{employee.name}</h2>
                    <p className="text-xs text-muted-foreground leading-tight mt-1">{employee.role}</p>
                  </div>
                </div>

                {/* Middle Section - Essential Details */}
                <div className="flex-1 flex flex-col justify-center px-3">
                  <div className="space-y-2">
                    {/* TOMO Number */}
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">TOMO No.</p>
                        <p className="font-mono font-bold text-sm">{employee.employeeId}</p>
                      </div>
                    </div>
                    
                    {/* Since */}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-accent flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Since</p>
                        <p className="font-semibold text-sm">{new Date(employee.joinDate).getFullYear()}</p>
                      </div>
                    </div>
                    
                    {/* Location */}
                    {employee.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-success flex-shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Location</p>
                          <p className="font-semibold text-sm">{employee.location}</p>
                        </div>
                      </div>
                    )}

                    {/* Email */}
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-warning flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="font-semibold text-xs truncate">{employee.email}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - QR Code */}
                {showQR && (
                  <div className="w-24 flex flex-col items-center justify-center">
                    <div className="p-2 bg-white rounded-lg shadow-md">
                      <QRCode
                        value={qrData}
                        size={75}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-1 leading-tight">
                      Scan Profile
                    </p>
                  </div>
                )}
              </>
            ) : (
              // Portrait Layout - Essential Info Only
              <div className="w-full flex flex-col justify-between">
                {/* Profile Photo & Name */}
                <div className="text-center mb-4">
                  <div className="relative mx-auto mb-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg border-3 border-white shadow-lg overflow-hidden">
                      {/* Placeholder for actual photo */}
                      <div className="w-full h-full bg-muted/20 flex items-center justify-center">
                        {employee.avatar || employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="font-bold text-lg leading-tight">{employee.name}</h2>
                  <p className="text-sm text-muted-foreground leading-tight">{employee.role}</p>
                </div>

                {/* Essential Details */}
                <div className="space-y-3 flex-1">
                  {/* TOMO Number */}
                  <div className="flex items-center gap-2 justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">TOMO No.</p>
                      <p className="font-mono font-bold">{employee.employeeId}</p>
                    </div>
                  </div>
                  
                  {/* Since & Location */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center">
                      <Calendar className="w-4 h-4 text-accent mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Since</p>
                      <p className="font-semibold text-sm">{new Date(employee.joinDate).getFullYear()}</p>
                    </div>
                    
                    {employee.location && (
                      <div className="text-center">
                        <MapPin className="w-4 h-4 text-success mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="font-semibold text-xs">{employee.location.split(',')[0]}</p>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="text-center">
                    <Mail className="w-4 h-4 text-warning mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold text-xs">{employee.email}</p>
                  </div>

                  {/* QR Code */}
                  {showQR && (
                    <div className="flex justify-center pt-2">
                      <div className="p-2 bg-white rounded-lg shadow-md">
                        <QRCode
                          value={qrData}
                          size={80}
                          style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="h-8 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border flex items-center justify-between px-3">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-warning fill-warning" />
              <span className="font-medium text-xs">{employee.stats.rating}/5.0</span>
            </div>
            <div className="text-muted-foreground text-xs font-mono">
              {employee.employeeId}
            </div>
          </div>

          {/* Premium glow effect */}
          {premium && (
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          )}
        </Card>

        {/* Back Side - Perfect QR with TOMO Branding */}
        <Card className={cn(
          "absolute inset-0 backface-hidden rotate-y-180 overflow-hidden",
          "bg-gradient-to-br from-accent/20 to-primary/5",
          premium && "shadow-2xl border-2 border-accent/20"
        )}>
          {/* TOMO Academy Header */}
          <div className="h-16 bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/TOMO.jpg" 
                  alt="TOMO Academy"
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'block';
                  }}
                />
                <Youtube className="w-6 h-6 text-primary hidden" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-base leading-tight">TOMO Academy</h3>
                <p className="text-xs opacity-90 leading-tight">Digital Platform</p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-2 right-4 w-2 h-2 bg-white/30 rounded-full animate-pulse" />
            <div className="absolute bottom-2 left-4 w-1 h-1 bg-white/40 rounded-full animate-ping" />
          </div>

          {/* Main Content - QR Code Focus */}
          <div className="flex-1 flex flex-col items-center justify-center p-4" style={{ height: 'calc(100% - 64px - 32px)' }}>
            {showQR && (
              <div className="text-center w-full">
                {/* Employee Name */}
                <div className="mb-4">
                  <h2 className="font-bold text-lg text-foreground">{employee.name}</h2>
                  <p className="text-sm text-muted-foreground">{employee.role}</p>
                  <p className="text-xs font-mono text-primary mt-1">{employee.employeeId}</p>
                </div>

                {/* Large QR Code */}
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-primary/10">
                    <QRCode
                      value={qrData}
                      size={isLandscape ? 120 : 140}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                </div>
                
                {/* Instructions */}
                <div className="space-y-1 mb-4">
                  <p className="font-semibold text-sm text-foreground">Scan for Full Profile</p>
                  <p className="text-xs text-muted-foreground">
                    Use mobile camera to view complete details
                  </p>
                </div>

                {/* Quick Contact */}
                <div className="text-xs text-muted-foreground space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <Mail className="w-3 h-3" />
                    {employee.email.split('@')[0]}@...
                  </p>
                  {employee.location && (
                    <p className="flex items-center justify-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {employee.location.split(',')[0]}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer with Actions */}
          <div className="h-8 bg-gradient-to-r from-primary/10 to-accent/10 border-t border-border flex items-center justify-center">
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadVCard();
                }}
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 px-2 text-xs text-primary hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/profile/${employee.id}`, '_blank');
                }}
              >
                <Eye className="w-3 h-3 mr-1" />
                View Profile
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

      {/* Employee Detail Modal */}
      <EmployeeDetailModal
        employee={employee}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </>
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
      "grid gap-4 justify-items-center",
      variant === 'landscape' 
        ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" 
        : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
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
