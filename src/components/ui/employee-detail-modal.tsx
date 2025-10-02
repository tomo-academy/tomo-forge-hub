import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import QRCode from "react-qr-code";
import { 
  X, Mail, Phone, MapPin, Calendar, Star, 
  Video, CheckCircle, Briefcase, Award,
  Linkedin, Twitter, Github, Globe, Instagram,
  Download, Share2, Edit, Copy, ExternalLink,
  Shield, Users, Clock, TrendingUp, Eye,
  MessageSquare, ThumbsUp, Youtube
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  employeeId: string;
  joinDate: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  location?: string;
  availability: 'available' | 'busy' | 'offline';
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
    website?: string;
    instagram?: string;
  };
  cardColor?: string;
  recentWork?: {
    title: string;
    type: string;
    date: string;
  }[];
}

interface EmployeeDetailModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeDetailModal({ employee, isOpen, onClose }: EmployeeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'work' | 'contact'>('overview');

  if (!employee) return null;

  const getAvailabilityColor = () => {
    switch (employee.availability) {
      case 'available':
        return 'bg-success text-success-foreground';
      case 'busy':
        return 'bg-warning text-warning-foreground';
      case 'offline':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const qrData = JSON.stringify({
    id: employee.id,
    name: employee.name,
    role: employee.role,
    department: employee.department,
    employeeId: employee.employeeId,
    email: employee.email,
    phone: employee.phone,
    company: 'TOMO Academy',
    verified: true,
    profileUrl: `https://tomoacademy.com/team/${employee.id}`,
    joinDate: employee.joinDate,
    location: employee.location,
    skills: employee.skills.join(', '),
    stats: employee.stats
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
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
NOTE:${employee.bio || ''}
URL:https://tomoacademy.com
END:VCARD`;

    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employee.name.replace(/\s+/g, '_')}_contact.vcf`;
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
          text: `Check out ${employee.name}'s profile at TOMO Academy`,
          url: `https://tomoacademy.com/team/${employee.id}`
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      copyToClipboard(`https://tomoacademy.com/team/${employee.id}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-primary to-accent text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="/TOMO.svg" 
                alt="TOMO Academy"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling!.style.display = 'block';
                }}
              />
              <Youtube className="w-10 h-10 text-primary hidden" />
            </div>
            
            <div className="flex-1">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                  {employee.name}
                </DialogTitle>
                <p className="text-white/90">{employee.role}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {employee.department}
                  </Badge>
                  <Badge className={cn("text-xs", getAvailabilityColor())}>
                    {employee.availability}
                  </Badge>
                </div>
              </DialogHeader>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-xl">
                {employee.avatar || employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{employee.stats.rating}/5.0</span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'work', label: 'Work & Stats', icon: Briefcase },
            { id: 'contact', label: 'Contact & QR', icon: Mail }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-b-2 border-primary text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Bio */}
              {employee.bio && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-2">About</h3>
                  <p className="text-muted-foreground">{employee.bio}</p>
                </Card>
              )}

              {/* Skills */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {employee.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Basic Info */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Employee Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Employee ID</p>
                      <p className="text-sm text-muted-foreground font-mono">{employee.employeeId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Join Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(employee.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {employee.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{employee.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-muted-foreground">{employee.department}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'work' && (
            <div className="space-y-6">
              {/* Performance Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 text-center">
                  <Video className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{employee.stats.videos}</div>
                  <div className="text-sm text-muted-foreground">Videos</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                  <div className="text-2xl font-bold">{employee.stats.tasks}</div>
                  <div className="text-sm text-muted-foreground">Tasks</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <Briefcase className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold">{employee.stats.projects}</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </Card>
                
                <Card className="p-4 text-center">
                  <Star className="w-8 h-8 text-warning mx-auto mb-2" />
                  <div className="text-2xl font-bold">{employee.stats.rating}</div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </Card>
              </div>

              {/* Recent Work */}
              {employee.recentWork && employee.recentWork.length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Recent Work</h3>
                  <div className="space-y-3">
                    {employee.recentWork.map((work, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{work.title}</p>
                          <p className="text-sm text-muted-foreground">{work.type}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(work.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="flex-1">{employee.email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(employee.email)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {employee.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="flex-1">{employee.phone}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(employee.phone)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>

              {/* Social Links */}
              {employee.social && Object.keys(employee.social).length > 0 && (
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Social Links</h3>
                  <div className="flex flex-wrap gap-2">
                    {employee.social.linkedin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(employee.social!.linkedin, '_blank')}
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </Button>
                    )}
                    {employee.social.twitter && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(employee.social!.twitter, '_blank')}
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </Button>
                    )}
                    {employee.social.github && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(employee.social!.github, '_blank')}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Button>
                    )}
                    {employee.social.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(employee.social!.website, '_blank')}
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </Button>
                    )}
                    {employee.social.instagram && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(employee.social!.instagram, '_blank')}
                      >
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram
                      </Button>
                    )}
                  </div>
                </Card>
              )}

              {/* QR Code */}
              <Card className="p-6">
                <h3 className="font-semibold mb-3 text-center">Employee QR Code</h3>
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-white rounded-lg shadow-lg">
                    <QRCode
                      value={qrData}
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Scan this QR code with any mobile camera to view complete employee information
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={downloadVCard}>
                      <Download className="w-4 h-4 mr-2" />
                      Download vCard
                    </Button>
                    <Button variant="outline" size="sm" onClick={shareProfile}>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Profile
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}