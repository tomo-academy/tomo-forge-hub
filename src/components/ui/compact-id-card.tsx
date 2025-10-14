import { useState } from "react";
import QRCode from "react-qr-code";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, Share2, Mail, Phone, MapPin, Calendar, Star, Shield,
  Verified, Eye, Camera, Sparkles, Video, Briefcase, Globe,
  Linkedin, Twitter, Github, Instagram, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompactIDCardProps {
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
  };
  onPhotoUpdate?: (file: File) => Promise<void>;
}

export function CompactIDCard({ employee, onPhotoUpdate }: CompactIDCardProps) {
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
          title: "✅ Photo Updated",
          description: "Profile photo updated successfully!",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "❌ Upload Failed",
        description: "Failed to update photo. Please try again.",
        variant: "destructive",
        duration: 2000,
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
    a.download = `${employee.name.replace(/\s+/g, '_')}_TOMO.vcf`;
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
          text: `Check out ${employee.name}'s profile`,
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
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const yearsSince = new Date().getFullYear() - new Date(employee.joinDate).getFullYear();

  return (
    <div className="w-full max-w-sm mx-auto perspective-1000 group/card">
      <div 
        className={cn(
          "relative w-full h-[260px] transition-all duration-700 transform-style-preserve-3d cursor-pointer",
          isFlipped && "rotate-y-180"
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT SIDE - Compact Design */}
        <Card className={cn(
          "absolute inset-0 backface-hidden overflow-hidden",
          "bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900",
          "border-2 shadow-xl hover:shadow-2xl transition-all duration-300",
          "border-primary/20"
        )}>
          {/* Decorative Elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent rounded-full blur-3xl" />
          </div>

          {/* Compact Header */}
          <div className="relative h-12 bg-gradient-to-r from-primary via-primary to-accent flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md">
                <img src="/TOMO.jpg" alt="TOMO" className="w-full h-full object-cover" />
              </div>
              <div className="text-white">
                <p className="font-bold text-xs leading-none flex items-center gap-1">
                  TOMO Academy
                  <Verified className="w-3 h-3" />
                </p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 text-[10px] px-1.5 py-0">
              <Shield className="w-2.5 h-2.5 mr-0.5" />
              ID
            </Badge>
          </div>

          {/* Main Content - Compact Layout */}
          <div className="relative h-[calc(260px-48px-44px)] flex items-center px-4 py-3 gap-3">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="relative group/photo">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl border-3 border-white shadow-lg overflow-hidden">
                  {employee.avatar ? (
                    <img 
                      src={employee.avatar} 
                      alt={employee.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">{employee.name.split(' ').map(n => n[0]).join('')}</span>
                  )}
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {onPhotoUpdate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById(`photo-${employee.id}`)?.click();
                    }}
                    disabled={isUploading}
                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-all shadow-md hover:scale-110"
                  >
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                )}
                <input
                  id={`photo-${employee.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                  disabled={isUploading}
                />
                <div className={cn(
                  "absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm",
                  getAvailabilityColor()
                )} />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <div>
                <h2 className="font-bold text-base leading-tight truncate">{employee.name}</h2>
                <p className="text-xs text-muted-foreground leading-tight truncate">{employee.role}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="text-[10px] font-mono font-semibold">{employee.employeeId}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-3 h-3 text-accent flex-shrink-0" />
                  <span className="text-[10px] truncate">{employee.department}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
                  <span className="text-[10px] truncate">{employee.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-orange-500 flex-shrink-0" />
                  <span className="text-[10px]">
                    {yearsSince > 0 ? `${yearsSince}yr${yearsSince > 1 ? 's' : ''}` : 'New'}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <div className="p-1.5 bg-white rounded-lg shadow-md border border-primary/10">
                <QRCode value={profileUrl} size={60} />
              </div>
              <p className="text-[8px] text-muted-foreground text-center leading-tight">
                Scan<br/>Profile
              </p>
            </div>
          </div>

          {/* Footer Stats - Compact */}
          <div className="relative h-11 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-t flex items-center justify-between px-4 py-2">
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <Video className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold">{employee.stats.videos}</span>
              </div>
              <div className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-bold">{employee.stats.projects}</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-bold">{employee.stats.rating}</span>
            </div>
          </div>
        </Card>

        {/* BACK SIDE - QR Focus */}
        <Card className={cn(
          "absolute inset-0 backface-hidden rotate-y-180 overflow-hidden",
          "bg-gradient-to-br from-accent/10 via-primary/5 to-accent/10",
          "border-2 border-accent/30 shadow-xl"
        )}>
          {/* Header */}
          <div className="relative h-14 bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-md">
                <img src="/TOMO.jpg" alt="TOMO" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-sm leading-none">TOMO Academy</p>
                <p className="text-[10px] opacity-90 leading-none mt-0.5">Digital Learning</p>
              </div>
            </div>
          </div>

          {/* QR Content */}
          <div className="relative h-[calc(260px-56px-48px)] flex flex-col items-center justify-center p-4">
            <div className="text-center mb-2">
              <h3 className="font-bold text-sm">{employee.name}</h3>
              <p className="text-xs text-muted-foreground">{employee.role}</p>
              <p className="text-[10px] font-mono text-primary mt-0.5">{employee.employeeId}</p>
            </div>

            <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-primary/20 mb-2">
              <QRCode value={profileUrl} size={100} />
            </div>

            <div className="text-center space-y-0.5 mb-2">
              <p className="font-semibold text-xs flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" />
                Scan for Full Profile
              </p>
              <p className="text-[10px] text-muted-foreground">
                Access complete details
              </p>
            </div>

            {/* Social Links */}
            {employee.social && Object.values(employee.social).some(v => v) && (
              <div className="flex items-center gap-1.5">
                {employee.social.linkedin && (
                  <a href={employee.social.linkedin} target="_blank" rel="noopener noreferrer" 
                     onClick={(e) => e.stopPropagation()}
                     className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Linkedin className="w-3 h-3 text-primary" />
                  </a>
                )}
                {employee.social.twitter && (
                  <a href={employee.social.twitter} target="_blank" rel="noopener noreferrer"
                     onClick={(e) => e.stopPropagation()}
                     className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Twitter className="w-3 h-3 text-primary" />
                  </a>
                )}
                {employee.social.github && (
                  <a href={employee.social.github} target="_blank" rel="noopener noreferrer"
                     onClick={(e) => e.stopPropagation()}
                     className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <Github className="w-3 h-3 text-primary" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="relative h-12 bg-gradient-to-r from-primary/10 to-accent/10 border-t flex items-center justify-center gap-1.5 px-3">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 px-2 text-[10px]"
              onClick={downloadVCard}
            >
              <Download className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 px-2 text-[10px]"
              onClick={shareProfile}
            >
              <Share2 className="w-3 h-3 mr-1" />
              Share
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="h-7 px-2 text-[10px] bg-primary"
              onClick={(e) => {
                e.stopPropagation();
                window.open(`/profile/${employee.id}`, '_blank');
              }}
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
          </div>
        </Card>
      </div>

      {/* Flip Hint */}
      <div className="text-center mt-2 opacity-0 group-hover/card:opacity-100 transition-opacity">
        <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          Click to flip
        </p>
      </div>
    </div>
  );
}

// Grid Component for Compact Cards
export function CompactIDCardGrid({ 
  employees,
  onPhotoUpdate 
}: { 
  employees: CompactIDCardProps['employee'][];
  onPhotoUpdate?: (employeeId: string, file: File) => Promise<void>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
      {employees.map((employee) => (
        <CompactIDCard
          key={employee.id}
          employee={employee}
          onPhotoUpdate={onPhotoUpdate ? (file) => onPhotoUpdate(employee.id, file) : undefined}
        />
      ))}
    </div>
  );
}
