import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AnimatedCard, GlowCard } from "@/components/ui/animated-card";
import { LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import { SEO } from "@/components/SEO";
import { QRCodeComponent } from "@/components/QRCodeComponent";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Download, 
  Share2,
  ExternalLink 
} from "lucide-react";

// Import employee data and GitHub photo service
import { employees, Employee } from "@/data/employees";
import { githubPhotoService } from "@/services/githubPhotoService";

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadEmployee = async () => {
      console.log('🔄 Loading employee profile...');
      console.log('📋 Looking for employee ID:', employeeId);
      
      try {
        // Find employee in static data
        const foundEmployee = employees.find(emp => emp.id === employeeId);
        
        if (foundEmployee) {
          console.log('✅ Found employee:', foundEmployee);
          console.log('📸 Avatar path:', foundEmployee.avatar);
          
          setEmployee(foundEmployee);
        } else {
          console.log('❌ Employee not found');
        }
      } catch (error) {
        console.error('❌ Error loading employee:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployee();
  }, [employeeId]);

  // Handle image error and use GitHub photo service
  const handleImageError = () => {
    setImageError(true);
  };

  const getEmployeeAvatar = () => {
    if (!employee) return null;
    
    if (imageError) {
      return githubPhotoService.getAvatarProps(employee.name);
    }
    
    return {
      src: employee.avatar,
      alt: employee.name,
      onError: handleImageError
    };
  };

  const downloadVCard = () => {
    if (!employee) return;
    
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${employee.name}
ORG:TOMO Academy
TITLE:${employee.position}
EMAIL:${employee.email}
TEL:${employee.phone}
NOTE:${employee.bio}
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${employee.name.replace(/\s+/g, '_')}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const shareProfile = async () => {
    if (!employee) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${employee.name} - TOMO Academy`,
          text: `Check out ${employee.name}'s profile at TOMO Academy`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  if (isLoading) {
    return <LoadingSpinnerOverlay message="Loading employee profile..." />;
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <AnimatedCard className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Employee Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The employee profile you're looking for doesn't exist.
          </p>
          <Link to="/team">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Team
            </Button>
          </Link>
        </AnimatedCard>
      </div>
    );
  }

  const avatarProps = getEmployeeAvatar();

  return (
    <>
      <SEO 
        title={`${employee.name} - Employee Profile`}
        description={`View ${employee.name}'s profile at TOMO Academy. ${employee.position} with expertise in ${employee.specialization}.`}
        canonical={`/employee/${employee.id}`}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="container mx-auto px-4 py-8">
          {/* Header Navigation */}
          <div className="mb-8">
            <Link to="/team">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Team
              </Button>
            </Link>
          </div>

          {/* Main Profile Card */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <GlowCard className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Avatar */}
                  <div className="flex flex-col items-center md:items-start">
                    <div className="relative">
                      <img
                        {...avatarProps}
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-background"></div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-bold mb-2">{employee.name}</h1>
                    <p className="text-xl text-primary mb-3">{employee.position}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                      {employee.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {employee.bio}
                    </p>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-primary" />
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${employee.email}`} className="text-blue-600 hover:underline">
                          {employee.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${employee.phone}`} className="text-blue-600 hover:underline">
                          {employee.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{employee.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-primary" />
                      Work Details
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{employee.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Specialization</p>
                        <p className="font-medium">{employee.specialization}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Join Date</p>
                        <p className="font-medium">{employee.joinDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Skills Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {employee.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="hover:bg-primary/10">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Projects Section */}
                {employee.projects && employee.projects.length > 0 && (
                  <>
                    <Separator className="my-8" />
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Recent Projects</h3>
                      <div className="grid gap-4">
                        {employee.projects.slice(0, 3).map((project, index) => (
                          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium mb-2">{project.name}</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {project.description}
                                </p>
                                <div className="flex flex-wrap gap-1">
                                  {project.technologies.map((tech, techIndex) => (
                                    <Badge key={techIndex} variant="secondary" className="text-xs">
                                      {tech}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              {project.link && (
                                <Button size="sm" variant="ghost" asChild>
                                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </GlowCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* QR Code Card */}
              <AnimatedCard className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-4">Share Profile</h3>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <QRCodeComponent 
                      value={window.location.href}
                      size={120}
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
    </>
  );
};

export default EmployeeProfile;