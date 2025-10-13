import { useState } from "react";
import QRCode from "react-qr-code";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, Share2, Mail, Phone, MapPin, Calendar, Star, Shield,
  Verified, Youtube, Eye, Camera, Check, Sparkles, Award, TrendingUp,
  Video, Briefcase, Clock, Globe, Linkedin, Twitter, Github, Instagram
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeIDCardAdvancedProps {
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
    bio?: string;
    skills?: string[];
    stats: {
      videos: number;
      tasks: number;
      rating: number;
      projects: number;
    };
    social?: {
      linkedin?: string;
      twitter?: string;
      github?: string;
      instagram?: string;
    };
    cardColor?: string;
  };
  onPhotoUpdate?: (file: File) => Promise<void>;
}

export function EmployeeIDCardAdvanced({ employee, onPhotoUpdate }: EmployeeIDCardAdvancedProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const profileUrl = `${window.location.origin}/profile/${employee.id}`;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      if (onPhotoUpdate) {
        await onPhotoUpdate(file);
        toast({
          title: "✅ Photo Updated Successfully!",
          description: `${employee.name}'s profile photo has been updated.`,
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: "❌ Upload Failed",
        description: "Failed to update photo. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadVCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${employee.name}
ORG:TOMO Academy
TITLE:${employee.role}
EMAIL:${employee.email}
${employee.phone ? `TEL:${employee.phone}` : ''}
${employee.location ? `ADR:;;${employee.location};;;;` : ''}
URL:${profileUrl}
NOTE:${employee.bio || ''}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employee.name.replace(/\s+/g, '_')}_TOMO_Academy.vcf`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "📥 Contact Downloaded",
      description: "vCard saved successfully!",
      duration: 2000,
    });
  };

  const shareProfile = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${employee.name} - TOMO Academy`,
          text: `Check out ${employee.name}'s profile at TOMO Academy`,
          url: profileUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast({
        title: "🔗 Link Copied",
        description: "Profile link copied to clipboard!",
        duration: 2000,
      });
    }
  };

  const getAvailabilityColor = () => {
    switch (employee.availability) {
      case 'available': return 'bg-success';
      case 'busy': return 'bg-warning';
      case 'offline': return 'bg-muted-foreground';
      default: return 'bg-muted';
    }
  };

  const getAvailabilityText = () => {
    switch (employee.availability) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const yearsSince = new Date().getFullYear() - new Date(employee.joinDate).getFullYear();

  return (
    <div className="w-full max-w-[440px] mx-auto perspective-1000 group/card">
      <div 
        className={cn(
          "relative w-full h-[300px] transition-all duration-700 transform-style-preserve-3d cursor-pointer",
          isFlipped && "rotate-y-180"
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT SIDE */}
        <Card className={cn(
          "absolute inset-0 backface-hidden overflow-hidden",
          "bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
          "border-2 shadow-2xl hover:shadow-3xl transition-shadow duration-300",
          "border-primary/30"
        )}>
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent rounded-full blur-3xl" />
          </div>

          {/* Header with TOMO Branding */}
          <div className="relative h-16 bg-gradient-to-r from-primary via-primary to-accent flex items-center justify-between px-4 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg ring-2 ring-white/50">
                <img src="/TOMO.jpg" alt="TOMO" className="w-full h-full object-cover" />
              </div>
              <div className="text-white">
                <p className="font-bold text-base leading-none flex items-center gap-1">
                  TOMO Academy
                  <Verified className="w-4 h-4" />
                </p>
                <p className="text-xs opacity-90 leading-none mt-1">Digital Learning Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2 relative z-10">
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Shield className="w-3 h-3 mr-1" />
                ID Card
              </Badge>
            </div>
          </div>

          {/* Main Content */}
          <div className="relative h-[calc(300px-64px-52px)] flex items-center px-5 py-4 gap-4">
            {/* Left: Photo with Upload */}
            <div className="flex-shrink-0">
              <div className="relative group/photo">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-xl overflow-hidden relative">
                  {employee.avatar ? (
                    <img 
                      src={employee.avatar} 
                      alt={employee.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl">{employee.name.split(' ').map(n => n[0]).join('')}</span>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {onPhotoUpdate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById(`photo-input-${employee.id}`)?.click();
                    }}
                    disabled={isUploading}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-all shadow-lg hover:scale-110 disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                )}
                <input
                  id={`photo-input-${employee.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  disabled={isUploading}
                />
                <div className={cn(
                  "absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-white shadow-md",
                  getAvailabilityColor()
                )} />
              </div>
              <div className="text-center mt-2">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                  {getAvailabilityText()}
                </Badge>
              </div>
            </div>

            {/* Middle: Info */}
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h2 className="font-bold text-xl leading-tight truncate">{employee.name}</h2>
                <p className="text-sm text-muted-foreground leading-tight truncate">{employee.role}</p>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-mono font-semibold">{employee.employeeId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <span className="text-xs truncate">{employee.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-success/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-success" />
                  </div>
                  <span className="text-xs truncate">{employee.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-warning/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-warning" />
                  </div>
                  <span className="text-xs">
                    {yearsSince > 0 ? `${yearsSince} year${yearsSince > 1 ? 's' : ''}` : 'New'} at TOMO
                  </span>
                </div>
              </div>
            </div>

            {/* Right: QR Code */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="p-2 bg-white rounded-xl shadow-lg border-2 border-primary/10">
                <QRCode value={profileUrl} size={70} />
              </div>
              <p className="text-[9px] text-muted-foreground text-center leading-tight">
                Scan to<br/>View Profile
              </p>
            </div>
          </div>

          {/* Footer with Stats */}
          <div className="relative h-13 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-t flex items-center justify-between px-5 py-2">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <Video className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold">{employee.stats.videos}</span>
                <span className="text-xs text-muted-foreground">Videos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-accent" />
                <span className="text-sm font-bold">{employee.stats.projects}</span>
                <span className="text-xs text-muted-foreground">Projects</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-warning fill-warning" />
              <span className="text-sm font-bold">{employee.stats.rating}</span>
              <span className="text-xs text-muted-foreground">/5</span>
            </div>
          </div>
        </Card>

        {/* BACK SIDE */}
        <Card className={cn(
          "absolute inset-0 backface-hidden rotate-y-180 overflow-hidden",
          "bg-gradient-to-br from-accent/10 via-primary/5 to-accent/10",
          "border-2 border-accent/30 shadow-2xl"
        )}>
          {/* Decorative Background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-40 h-40 bg-accent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary rounded-full blur-3xl" />
          </div>

          {/* Header */}
          <div className="relative h-20 bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg">
                <img src="/TOMO.jpg" alt="TOMO" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-lg leading-none">TOMO Academy</p>
                <p className="text-xs opacity-90 leading-none mt-1">Digital Learning Platform</p>
              </div>
            </div>
          </div>

          {/* Main Content - QR Focus */}
          <div className="relative h-[calc(300px-80px-56px)] flex flex-col items-center justify-center p-5">
            <div className="text-center mb-3">
              <h3 className="font-bold text-lg">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{employee.role}</p>
              <p className="text-xs font-mono text-primary mt-1">{employee.employeeId}</p>
            </div>

            <div className="p-4 bg-white rounded-2xl shadow-xl border-2 border-primary/20 mb-3">
              <QRCode value={profileUrl} size={120} />
            </div>

            <div className="text-center space-y-1 mb-3">
              <p className="font-semibold text-sm flex items-center justify-center gap-1">
                <Sparkles className="w-4 h-4 text-primary" />
                Scan for Full Profile
              </p>
              <p className="text-xs text-muted-foreground">
                Access complete details & portfolio
              </p>
            </div>

            {/* Social Links */}
            {employee.social && (
              <div className="flex items-center gap-2">
                {employee.social.linkedin && (
                  <a href={employee.social.linkedin} target="_blank" rel="noopener noreferrer" 
                     onClick={(e) => e.stopPropagation()}
                     className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Linkedin className="w-3.5 h-3.5 text-primary" />
                  </a>
                )}
                {employee.social.twitter && (
                  <a href={employee.social.twitter} target="_blank" rel="noopener noreferrer"
                     onClick={(e) => e.stopPropagation()}
                     className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Twitter className="w-3.5 h-3.5 text-primary" />
                  </a>
                )}
                {employee.social.github && (
                  <a href={employee.social.github} target="_blank" rel="noopener noreferrer"
                     onClick={(e) => e.stopPropagation()}
                     className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Github className="w-3.5 h-3.5 text-primary" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Footer - Actions */}
          <div className="relative h-14 bg-gradient-to-r from-primary/10 to-accent/10 border-t flex items-center justify-center gap-2 px-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-9 px-3 text-xs hover:bg-white/50"
              onClick={downloadVCard}
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Download
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-9 px-3 text-xs hover:bg-white/50"
              onClick={shareProfile}
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5" />
              Share
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="h-9 px-3 text-xs bg-primary hover:bg-primary/90"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/profile/${employee.id}`, '_blank');
              }}
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              View Profile
            </Button>
          </div>
        </Card>
      </div>

      {/* Flip Indicator */}
      <div className="text-center mt-3 opacity-0 group-hover/card:opacity-100 transition-opacity">
        <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3" />
          Click to flip card
        </p>
      </div>
    </div>
  );
}

// Grid Component
export function EmployeeIDCardsGridAdvanced({ 
  employees,
  onPhotoUpdate 
}: { 
  employees: EmployeeIDCardAdvancedProps['employee'][];
  onPhotoUpdate?: (employeeId: string, file: File) => Promise<void>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {employees.map((employee) => (
        <EmployeeIDCardAdvanced
          key={employee.id}
          employee={employee}
          onPhotoUpdate={onPhotoUpdate ? (file) => onPhotoUpdate(employee.id, file) : undefined}
        />
      ))}
    </div>
  );
}
