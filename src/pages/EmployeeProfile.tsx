import React from "react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AnimatedCard, GlowCard } from "@/components/ui/animated-card";
import { LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import { SEO } from "@/components/SEO";
import SimpleQRCode from "@/components/SimpleQRCode";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Download, 
  Share2,
  ExternalLink,
  User,
  Building2,
  Clock,
  Award
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
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Header Navigation */}
          <div className="mb-6">
            <Link to="/team">
              <Button variant="ghost" className="mb-4 hover:bg-white/80 dark:hover:bg-gray-800/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Team
              </Button>
            </Link>
          </div>

          {/* Mobile-First Single Column Layout */}
          <div className="space-y-6">
            {/* Hero Profile Card */}
            <GlowCard className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-24 sm:h-32 relative">
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
              <div className="relative px-4 sm:px-6 pb-6">
                {/* Profile Picture */}
                <div className="absolute -top-12 sm:-top-16 left-4 sm:left-6">
                  <div className="relative">
                    <img
                      {...avatarProps}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl bg-white"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 sm:w-8 sm:h-8 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                
                {/* Basic Info */}
                <div className="pt-16 sm:pt-20">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">{employee.name}</h1>
                  <p className="text-lg sm:text-xl text-blue-600 dark:text-blue-400 mb-4 flex items-center">
                    <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                    {employee.position}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {employee.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 text-xs sm:text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                    {employee.bio}
                  </p>
                </div>
              </div>
            </GlowCard>

            {/* QR Code and Actions Card - Mobile Priority */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Share Profile</h3>
              </CardHeader>
              <CardContent className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-inner border-2 border-gray-100">
                    <SimpleQRCode 
                      value={typeof window !== 'undefined' ? window.location.href : ''}
                      size={120}
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                  Scan QR code to share this profile
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={downloadVCard} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download vCard
                  </Button>
                  <Button variant="outline" onClick={shareProfile} className="w-full">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Info Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-300" />
                  Quick Info
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <User className="w-4 h-4 mr-3 text-blue-200 flex-shrink-0" />
                      <div>
                        <p className="text-blue-100 text-xs">Specialization</p>
                        <p className="font-medium">{employee.specialization}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Building2 className="w-4 h-4 mr-3 text-blue-200 flex-shrink-0" />
                      <div>
                        <p className="text-blue-100 text-xs">Department</p>
                        <p className="font-medium">{employee.department}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-3 text-blue-200 flex-shrink-0" />
                      <div>
                        <p className="text-blue-100 text-xs">Joined</p>
                        <p className="font-medium">{employee.joinDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-3 text-blue-200 flex-shrink-0" />
                      <div>
                        <p className="text-blue-100 text-xs">Location</p>
                        <p className="font-medium">{employee.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center text-gray-900 dark:text-white">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-500" />
                  Contact Information
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <a href={`mailto:${employee.email}`} className="text-blue-600 hover:text-blue-800 font-medium break-all">
                        {employee.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <a href={`tel:${employee.phone}`} className="text-green-600 hover:text-green-800 font-medium">
                        {employee.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                      <span className="text-orange-600 font-medium">{employee.joinDate}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills Section */}
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardHeader>
                <h2 className="text-xl sm:text-2xl font-bold flex items-center text-gray-900 dark:text-white">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-yellow-500" />
                  Skills & Expertise
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {employee.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg text-center font-medium hover:shadow-lg transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects Section */}
            {employee.projects && employee.projects.length > 0 && (
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center text-gray-900 dark:text-white">
                    <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-green-500" />
                    Recent Projects
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employee.projects.slice(0, 3).map((project, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700/50 p-4 sm:p-6 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{project.name}</h4>
                            <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm sm:text-base">
                              {project.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, techIndex) => (
                                <Badge key={techIndex} variant="outline" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {project.link && (
                            <Button size="sm" variant="ghost" asChild className="flex-shrink-0">
                              <a href={project.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Footer */}
            <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
              <div className="max-w-md mx-auto px-4">
                <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">
                  © 2025 TOMO Academy. All rights reserved.
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Internal Employee Profile System
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeProfile;