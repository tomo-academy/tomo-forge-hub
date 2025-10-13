import { useState } from "react";
import QRCode from "react-qr-code";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, Share2, Mail, Phone, MapPin, Calendar, Star, Shield,
  Verified, Youtube, Eye, Camera, Sparkles, Award, Video, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumLandscapeCardProps {
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
  };
  onPhotoUpdate?: (file: File) => Promise<void>;
}

export function PremiumLandscapeCard({ employee, onPhotoUpdate }: PremiumLandscapeCardProps) {
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
          title: "✅ Photo Updated!",
          description: `${employee.name}'s photo has been updated successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "❌ Upload Failed",
        description: "Failed to update photo. Please try again.",
        variant: "destructive",
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
URL:${profileUrl}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employee.name.replace(/\s+/g, '_')}_TOMO.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareProfile = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${employee.name} - TOMO Academy`,
          url: profileUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast({ title: "🔗 Link Copied!", description: "Profile link copied to clipboard!" });
    }
  };

  const yearsSince = new Date().getFullYear() - new Date(employee.joinDate).getFullYear();

  return (
    <div className="w-full max-w-[500px] mx-auto perspective-1000">
      <div 
        className={cn(
          "relative w-full h-[280px] transition-all duration-700 transform-style-preserve-3d cursor-pointer",
          isFlipped && "rotate-y-180"
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT SIDE - LANDSCAPE */}
        <Card className={cn(
          "absolute inset-0 backface-hidden overflow-hidden",
          "bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900",
          "border-2 border-primary/20 shadow-2xl"
        )}>
          {/* Premium Header */}
          <div className="h-14 bg-gradient-to-r from-red-600 via-red-500 to-orange-500 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg">
                <img src="/TOMO.jpg" alt="TOMO" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="text-white">
                <p className="font-bold text-sm leading-none flex items-center gap-1">
                  TOMO Academy <Verified className="w-3.5 h-3.5" />
                </p>
                <p className="text-xs opacity-90 leading-none mt-0.5">Digital Learning Platform</p>
              </div>
            </div>
            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs">
              <Shield className="w-3 h-3 mr-1" />
              Premium ID
            </Badge>
          </div>

          {/* Main Content - Perfect Landscape Layout */}
          <div className="h-[calc(280px-56px-48px)] flex items-stretch">
            {/* Left: Photo Section */}
            <div className="w-[140px] flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 border-r border-border p-3">
              <div className="relative group/photo mb-2">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-xl overflow-hidden">
                  {employee.avatar ? (
                    <img src={employee.avatar} alt={employee.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{employee.name.split(' ').map(n => n[0]).join('')}</span>
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
                      document.getElementById(`photo-${employee.id}`)?.click();
                    }}
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover/photo:opacity-100 transition-all shadow-lg hover:scale-110"
                  >
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
                <input
                  id={`photo-${employee.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                <div className={cn(
                  "absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-md",
                  employee.availability === 'available' && "bg-green-500",
                  employee.availability === 'busy' && "bg-yellow-500",
                  employee.availability === 'offline' && "bg-gray-400"
                )} />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-sm leading-tight">{employee.name}</h3>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">{employee.role}</p>
              </div>
            </div>

            {/* Middle: Information Section */}
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div className="space-y-2">
                {/* Employee ID */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-red-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground leading-none">Employee ID</p>
                    <p className="font-mono font-bold text-xs leading-tight">{employee.employeeId}</p>
                  </div>
                </div>

                {/* Department */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground leading-none">Department</p>
                    <p className="font-semibold text-xs leading-tight truncate">{employee.department}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground leading-none">Location</p>
                    <p className="font-semibold text-xs leading-tight truncate">{employee.location || 'Remote'}</p>
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-muted-foreground leading-none">Experience</p>
                    <p className="font-semibold text-xs leading-tight">
                      {yearsSince > 0 ? `${yearsSince} year${yearsSince > 1 ? 's' : ''}` : 'New'} at TOMO
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-3 pt-2 border-t">
                <div className="flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs font-bold">{employee.stats.videos}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-xs font-bold">{employee.stats.projects}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold">{employee.stats.rating}</span>
                </div>
              </div>
            </div>

            {/* Right: QR Code Section */}
            <div className="w-[120px] flex flex-col items-center justify-center bg-gradient-to-br from-accent/5 to-primary/5 border-l border-border p-3">
              <div className="p-2 bg-white rounded-xl shadow-lg border-2 border-primary/10 mb-2">
                <QRCode value={profileUrl} size={80} />
              </div>
              <p className="text-[9px] text-center text-muted-foreground leading-tight">
                Scan to View<br/>Full Profile
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="h-12 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 border-t flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold">TOMO Academy</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-xs font-bold">Premium Member</span>
            </div>
          </div>
        </Card>

        {/* BACK SIDE */}
        <Card className={cn(
          "absolute inset-0 backface-hidden rotate-y-180 overflow-hidden",
          "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20",
          "border-2 border-red-500/30 shadow-2xl"
        )}>
          <div className="h-16 bg-gradient-to-r from-red-600 to-orange-500 text-white flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg">
                <img src="/TOMO.jpg" alt="TOMO" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <p className="font-bold text-base leading-none">TOMO Academy</p>
                <p className="text-xs opacity-90 leading-none mt-1">Digital Learning Platform</p>
              </div>
            </div>
          </div>

          <div className="h-[calc(280px-64px-52px)] flex flex-col items-center justify-center p-4">
            <div className="text-center mb-3">
              <h3 className="font-bold text-base">{employee.name}</h3>
              <p className="text-sm text-muted-foreground">{employee.role}</p>
              <p className="text-xs font-mono text-red-600 mt-1">{employee.employeeId}</p>
            </div>

            <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-red-500/20 mb-3">
              <QRCode value={profileUrl} size={110} />
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Scan for complete profile & portfolio
            </p>
          </div>

          <div className="h-13 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-t flex items-center justify-center gap-2 px-3">
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={downloadVCard}>
              <Download className="w-3 h-3 mr-1" />
              vCard
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={shareProfile}>
              <Share2 className="w-3 h-3 mr-1" />
              Share
            </Button>
            <Button variant="default" size="sm" className="h-8 text-xs bg-red-500 hover:bg-red-600" onClick={(e) => {
              e.stopPropagation();
              window.open(`/profile/${employee.id}`, '_blank');
            }}>
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
          </div>
        </Card>
      </div>

      <p className="text-center text-xs text-muted-foreground mt-2 opacity-70">
        Click to flip card
      </p>
    </div>
  );
}

// Grid Component
export function PremiumLandscapeGrid({ 
  employees,
  onPhotoUpdate 
}: { 
  employees: PremiumLandscapeCardProps['employee'][];
  onPhotoUpdate?: (employeeId: string, file: File) => Promise<void>;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {employees.map((employee) => (
        <PremiumLandscapeCard
          key={employee.id}
          employee={employee}
          onPhotoUpdate={onPhotoUpdate ? (file) => onPhotoUpdate(employee.id, file) : undefined}
        />
      ))}
    </div>
  );
}
