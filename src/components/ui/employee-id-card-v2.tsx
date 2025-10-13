import { useState } from "react";
import QRCode from "react-qr-code";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Download, Share2, Mail, Phone, MapPin, Calendar, Star, Shield,
  Verified, Youtube, Eye, ExternalLink, Camera, Edit, Save, X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EmployeeIDCardV2Props {
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
  onPhotoUpdate?: (file: File) => Promise<void>;
}

export function EmployeeIDCardV2({ employee, onPhotoUpdate }: EmployeeIDCardV2Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const profileUrl = `${window.location.origin}/profile/${employee.id}`;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    if (onPhotoUpdate) {
      await onPhotoUpdate(file);
    }
    setIsEditingPhoto(false);
  };

  const downloadVCard = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${employee.name}
ORG:TOMO Academy
TITLE:${employee.role}
EMAIL:${employee.email}
${employee.phone ? `TEL:${employee.phone}` : ''}
${employee.location ? `ADR:;;${employee.location};;;;` : ''}
URL:${profileUrl}
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employee.name.replace(/\s+/g, '_')}_contact.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareProfile = async () => {
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
      alert('Profile link copied to clipboard!');
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto perspective-1000">
      <div 
        className={cn(
          "relative w-full h-[280px] transition-transform duration-700 transform-style-preserve-3d cursor-pointer",
          isFlipped && "rotate-y-180"
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* FRONT SIDE - Completely Fixed Layout */}
        <Card className={cn(
          "absolute inset-0 backface-hidden overflow-hidden",
          "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",
          "border-2 border-primary/20 shadow-xl"
        )}>
          {/* Header - Fixed Height */}
          <div className="h-14 bg-gradient-to-r from-primary via-primary to-accent flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="/TOMO.jpg" alt="TOMO" className="w-full h-full object-cover" />
              </div>
              <div className="text-white">
                <p className="font-bold text-sm leading-none">TOMO Academy</p>
                <p className="text-xs opacity-90 leading-none mt-0.5">Digital Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Verified className="w-4 h-4 text-white" />
              <Shield className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Main Content - Fixed Layout with Flexbox */}
          <div className="h-[calc(280px-56px-48px)] flex items-center px-4 py-3">
            {/* Left: Photo */}
            <div className="w-24 flex-shrink-0 flex flex-col items-center">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl border-4 border-white shadow-lg overflow-hidden">
                  {photoPreview || employee.avatar ? (
                    <img 
                      src={photoPreview || employee.avatar} 
                      alt={employee.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{employee.name.split(' ').map(n => n[0]).join('')}</span>
                  )}
                </div>
                {onPhotoUpdate && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById(`photo-input-${employee.id}`)?.click();
                    }}
                    className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                )}
                <input
                  id={`photo-input-${employee.id}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <div className={cn(
                "w-2 h-2 rounded-full mt-2",
                employee.availability === 'available' && "bg-success",
                employee.availability === 'busy' && "bg-warning",
                employee.availability === 'offline' && "bg-muted"
              )} />
            </div>

            {/* Middle: Info */}
            <div className="flex-1 px-3 min-w-0">
              <h2 className="font-bold text-base leading-tight truncate">{employee.name}</h2>
              <p className="text-xs text-muted-foreground leading-tight truncate mb-2">{employee.role}</p>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-primary flex-shrink-0" />
                  <span className="text-xs font-mono font-semibold">{employee.employeeId}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-accent flex-shrink-0" />
                  <span className="text-xs">Since {new Date(employee.joinDate).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-success flex-shrink-0" />
                  <span className="text-xs truncate">{employee.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-warning flex-shrink-0" />
                  <span className="text-xs truncate">{employee.email.split('@')[0]}@...</span>
                </div>
              </div>
            </div>

            {/* Right: QR */}
            <div className="w-20 flex-shrink-0 flex flex-col items-center">
              <div className="p-1.5 bg-white rounded-lg shadow-md">
                <QRCode value={profileUrl} size={60} />
              </div>
              <p className="text-[10px] text-muted-foreground text-center mt-1 leading-tight">Scan Profile</p>
            </div>
          </div>

          {/* Footer - Fixed Height */}
          <div className="h-12 bg-gradient-to-r from-primary/5 to-accent/5 border-t flex items-center justify-between px-4">
            <Badge variant="outline" className="text-xs">{employee.department}</Badge>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-warning fill-warning" />
              <span className="text-xs font-semibold">{employee.stats.rating}</span>
            </div>
          </div>
        </Card>

        {/* BACK SIDE - Completely Fixed Layout */}
        <Card className={cn(
          "absolute inset-0 backface-hidden rotate-y-180 overflow-hidden",
          "bg-gradient-to-br from-accent/10 to-primary/10",
          "border-2 border-accent/20 shadow-xl"
        )}>
          {/* Header */}
          <div className="h-16 bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <img src="/TOMO.jpg" alt="TOMO" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-base leading-none">TOMO Academy</p>
                <p className="text-xs opacity-90 leading-none mt-0.5">Digital Platform</p>
              </div>
            </div>
          </div>

          {/* Main Content - Centered QR */}
          <div className="h-[calc(280px-64px-48px)] flex flex-col items-center justify-center p-4">
            <div className="text-center mb-3">
              <h3 className="font-bold text-base">{employee.name}</h3>
              <p className="text-xs text-muted-foreground">{employee.role}</p>
              <p className="text-xs font-mono text-primary mt-1">{employee.employeeId}</p>
            </div>

            <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-primary/10 mb-3">
              <QRCode value={profileUrl} size={110} />
            </div>

            <div className="text-center space-y-0.5">
              <p className="font-semibold text-xs">Scan for Full Profile</p>
              <p className="text-[10px] text-muted-foreground">Use camera to view details</p>
            </div>

            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
              <Mail className="w-3 h-3" />
              <MapPin className="w-3 h-3" />
              <Phone className="w-3 h-3" />
            </div>
          </div>

          {/* Footer - Actions */}
          <div className="h-12 bg-gradient-to-r from-primary/10 to-accent/10 border-t flex items-center justify-center gap-2 px-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 px-3 text-xs"
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
              className="h-8 px-3 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                shareProfile();
              }}
            >
              <Share2 className="w-3 h-3 mr-1" />
              Share
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 px-3 text-xs text-primary"
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

      {/* Flip Indicator */}
      <p className="text-center text-xs text-muted-foreground mt-2 opacity-70">
        Click to flip
      </p>
    </div>
  );
}

// Grid Component
export function EmployeeIDCardsGridV2({ 
  employees,
  onPhotoUpdate 
}: { 
  employees: EmployeeIDCardV2Props['employee'][];
  onPhotoUpdate?: (employeeId: string, file: File) => Promise<void>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {employees.map((employee) => (
        <EmployeeIDCardV2
          key={employee.id}
          employee={employee}
          onPhotoUpdate={onPhotoUpdate ? (file) => onPhotoUpdate(employee.id, file) : undefined}
        />
      ))}
    </div>
  );
}
