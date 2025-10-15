// src/pages/EmployeeProfile.tsx

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AnimatedCard, GlowCard } from "@/components/ui/animated-card";
import { LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import QRCode from "react-qr-code";
import { 
  ArrowLeft, Mail, Phone, MapPin, Calendar, Star, 
  Video, CheckCircle, Briefcase, Award, Shield,
  Linkedin, Twitter, Github, Globe, Instagram,
  Download, Share2, Copy, ExternalLink, Youtube,
  User, Clock, TrendingUp, Eye, MessageSquare,
  Building2, Users, Target, Activity, BarChart3
} from "lucide-react";

// Import database service
import { db } from "@/lib/db";

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [employee, setEmployee] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEmployee = async () => {
      console.log('🔄 Loading employee profile from database...');
      console.log('📋 Looking for employee ID:', employeeId);
      
      try {
        // Fetch employee from database
        const dbEmployee = await db.employees.getById(employeeId || '');
        
        if (dbEmployee) {
          console.log('✅ Found employee in database:', dbEmployee);
          console.log('📸 Avatar URL from DB:', dbEmployee.avatar_url);
          
          // Add cache busting for Cloudinary images
          let avatarUrl = dbEmployee.avatar_url;
          if (avatarUrl && avatarUrl.includes('cloudinary.com')) {
            // Add timestamp to force refresh
            const timestamp = Date.now();
            avatarUrl = avatarUrl.includes('?') 
              ? `${avatarUrl}&t=${timestamp}` 
              : `${avatarUrl}?t=${timestamp}`;
          }
          
          // Map database fields to component fields
          const mappedEmployee = {
            ...dbEmployee,
            employeeId: dbEmployee.employee_id,
            joinDate: dbEmployee.join_date,
            avatar: avatarUrl,
            avatar_url: avatarUrl,
            social: dbEmployee.social_links,
            cardColor: dbEmployee.card_color
          };
          
          console.log('✅ Mapped employee with avatar:', mappedEmployee.avatar);
          setEmployee(mappedEmployee);
        } else {
          console.warn('⚠️ Employee not found in database');
          setEmployee(null);
        }
      } catch (error) {
        console.error('❌ Error loading employee:', error);
        setEmployee(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (employeeId) {
      loadEmployee();
    } else {
      setIsLoading(false);
    }
  }, [employeeId]);

  if (isLoading) {
    return <LoadingSpinnerOverlay isLoading={true}><div className="h-screen" /></LoadingSpinnerOverlay>;
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">Employee Not Found</h1>
          <p className="text-muted-foreground mb-6">
            Could not find employee with ID: <code className="bg-muted px-2 py-1 rounded">{employeeId}</code>
          </p>
          
          <div className="flex gap-2 justify-center">
            <Link to="/team">
              <Button>
                <Users className="w-4 h-4 mr-2" />
                View All Team Members
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const qrData = `https://tomo-forge-hub.vercel.app/profile/${employee.id}`;

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
URL:https://tomoacademy.com/profile/${employee.id}
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
    const shareData = {
      title: `${employee.name} - TOMO Academy`,
      text: `Check out ${employee.name}'s profile at TOMO Academy - ${employee.role}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
      } catch (err) {
        console.error('Failed to copy URL:', err);
      }
    }
  };

  // Function to get the correct image path
  const getImagePath = (avatar?: string, avatar_url?: string) => {
    // Check both avatar and avatar_url fields
    const avatarPath = avatar || avatar_url;
    
    if (!avatarPath) return null;
    
    // If it's already a full URL (http/https), return as is
    if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
      // Add cache busting for Cloudinary images
      if (avatarPath.includes('cloudinary.com') && !avatarPath.includes('?t=')) {
        return `${avatarPath}?t=${Date.now()}`;
      }
      return avatarPath;
    }
    
    // If it's a public path, remove the 'public/' prefix
    if (avatarPath.startsWith('public/')) {
      return avatarPath.replace('public/', '/');
    }
    
    // If it already starts with '/', return as is
    if (avatarPath.startsWith('/')) {
      return avatarPath;
    }
    
    // If it's a relative path without leading '/', add it
    return `/${avatarPath}`;
  };

  // Function to render avatar with fallback
  const renderAvatar = () => {
    const imagePath = getImagePath(employee.avatar, employee.avatar_url);
    
    if (imagePath) {
      // External URL or properly formatted path
      return (
        <img 
          src={imagePath} 
          alt={employee.name}
          className="w-full h-full object-cover rounded-full"
          onError={(e) => {
            // Fallback to initials if image fails to load
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling!.style.display = 'flex';
          }}
        />
      );
    } else {
      // Fallback to initials
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Mobile Optimized */}
      <div className="bg-gradient-to-r from-primary to-accent text-white">
        <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
          {/* Navigation */}
          <div className="flex items-center gap-3 mb-6">
            <Link to="/team">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-2 ring-white/50 p-1">
              <img 
                src="/logo.png" 
                alt="TOMO Academy"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.currentTarget.src = '/TOMO.jpg';
                }}
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold">TOMO Academy</h1>
              <p className="text-white/90 text-sm">Employee Profile</p>
            </div>
          </div>

          {/* Employee Info - Mobile Stacked */}
          <div className="text-center">
            {/* Employee Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-2xl md:text-4xl border-4 border-white shadow-lg overflow-hidden">
                {renderAvatar()}
                <span className={!getImagePath(employee.avatar, employee.avatar_url) ? '' : 'hidden'}>
                  {employee.name.split(' ').map((n: string) => n[0]).join('')}
                </span>
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full border-3 md:border-4 border-white ${
                employee.availability === 'available' ? 'bg-success' :
                employee.availability === 'busy' ? 'bg-warning' : 'bg-muted'
              }`} />
            </div>

            {/* Basic Info */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{employee.name}</h1>
              <p className="text-lg md:text-xl text-white/90 mb-3">{employee.role}</p>
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {employee.department}
                </Badge>
                <Badge className={getAvailabilityColor()}>
                  {employee.availability}
                </Badge>
                <Badge variant="outline" className="border-white/30 text-white">
                  {employee.employeeId}
                </Badge>
              </div>
            </div>
            
            {/* Quick Stats - Mobile Friendly */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold">{employee.stats.videos}</div>
                <div className="text-sm text-white/80">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold">{employee.stats.tasks}</div>
                <div className="text-sm text-white/80">Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold">{employee.stats.projects}</div>
                <div className="text-sm text-white/80">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold">{employee.stats.rating}</div>
                <div className="text-sm text-white/80">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Mobile Optimized */}
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* Action Buttons - Mobile Friendly */}
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 justify-center">
          <Button onClick={downloadVCard} className="gap-2" size="sm">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="outline" onClick={shareProfile} className="gap-2" size="sm">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button variant="outline" onClick={() => navigator.clipboard.writeText(employee.email)} className="gap-2" size="sm">
            <Copy className="w-4 h-4" />
            Copy Email
          </Button>
          <Link to="/team">
            <Button variant="outline" className="gap-2" size="sm">
              <Users className="w-4 h-4" />
              Back to Team
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            {/* About */}
            {employee.bio && (
              <AnimatedCard hoverEffect="border">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    About
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{employee.bio}</p>
                </div>
              </AnimatedCard>
            )}

            {/* Skills */}
            {employee.skills && employee.skills.length > 0 && (
              <AnimatedCard hoverEffect="border">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Skills & Expertise
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AnimatedCard>
            )}

            {/* Recent Work */}
            {employee.recentWork && employee.recentWork.length > 0 && (
              <AnimatedCard hoverEffect="border">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Recent Work
                  </h2>
                  <div className="space-y-3">
                    {employee.recentWork.map((work: any, index: number) => (
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
                </div>
              </AnimatedCard>
            )}

            {/* Performance Stats */}
            <AnimatedCard hoverEffect="border">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Performance Statistics
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <Video className="w-8 h-8 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{employee.stats.videos}</div>
                    <div className="text-sm text-muted-foreground">Videos Created</div>
                  </div>
                  
                  <div className="text-center p-4 bg-success/10 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                    <div className="text-2xl font-bold">{employee.stats.tasks}</div>
                    <div className="text-sm text-muted-foreground">Tasks Completed</div>
                  </div>
                  
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <Briefcase className="w-8 h-8 text-accent mx-auto mb-2" />
                    <div className="text-2xl font-bold">{employee.stats.projects}</div>
                    <div className="text-sm text-muted-foreground">Active Projects</div>
                  </div>
                  
                  <div className="text-center p-4 bg-warning/10 rounded-lg">
                    <Star className="w-8 h-8 text-warning mx-auto mb-2" />
                    <div className="text-2xl font-bold">{employee.stats.rating}</div>
                    <div className="text-sm text-muted-foreground">Average Rating</div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <GlowCard glowColor="primary">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">{employee.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(employee.email)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  {employee.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{employee.phone}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(employee.phone)}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Employee ID</p>
                      <p className="text-sm text-muted-foreground font-mono">{employee.employeeId}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Join Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(employee.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {employee.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Location</p>
                        <p className="text-sm text-muted-foreground">{employee.location}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-muted-foreground">{employee.department}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlowCard>

            {/* Social Links */}
            {employee.social && Object.keys(employee.social).length > 0 && (
              <AnimatedCard hoverEffect="glow">
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-4">Social Links</h2>
                  <div className="space-y-2">
                    {employee.social.linkedin && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open(employee.social.linkedin, '_blank')}
                      >
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn Profile
                      </Button>
                    )}
                    {employee.social.twitter && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open(employee.social.twitter, '_blank')}
                      >
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter Profile
                      </Button>
                    )}
                    {employee.social.github && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open(employee.social.github, '_blank')}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub Profile
                      </Button>
                    )}
                    {employee.social.website && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open(employee.social.website, '_blank')}
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Personal Website
                      </Button>
                    )}
                    {employee.social.instagram && (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => window.open(employee.social.instagram, '_blank')}
                      >
                        <Instagram className="w-4 h-4 mr-2" />
                        Instagram Profile
                      </Button>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            )}

            {/* QR Code */}
            <AnimatedCard hoverEffect="glow">
              <div className="p-6 text-center">
                <h2 className="text-xl font-bold mb-4">Profile QR Code</h2>
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-white rounded-lg shadow-lg">
                    <QRCode
                      value={qrData}
                      size={150}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Scan to share this profile
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={downloadVCard}>
                    <Download className="w-3 h-3 mr-1" />
                    vCard
                  </Button>
                  <Button variant="outline" size="sm" onClick={shareProfile}>
                    <Share2 className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-border">
          <p className="text-muted-foreground">
            © 2025 TOMO Academy. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Internal Employee Profile System
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
