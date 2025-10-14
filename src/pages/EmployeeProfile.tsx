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

// Complete employee data for all 14 members
const employeeData = [
  {
    id: "kanish-sj",
    name: "Kanish SJ",
    role: "Lead Developer & Channel Manager",
    department: "Technology",
    email: "kanish.sj@tomoacademy.com",
    phone: "+91 9940375600",
    employeeId: "TOMO-001",
    joinDate: "2025-08-15",
    avatar: "public/kanish.jpg", // Updated to use actual photo
    location: "salem, Tamilnadu, India",
    availability: "available",
    stats: { videos: 28, tasks: 165, rating: 4.9, projects: 24 },
    bio: "Full-stack developer and channel manager leading the technical vision for TOMO Academy.",
    skills: ["React", "TypeScript", "Node.js", "Firebase", "YouTube API", "Team Leadership"],
    social: {
      linkedin: "https://linkedin.com/in/kanish-sj",
      github: "https://github.com/kanish-sj"
    }
  },
  {
    id: "kamesh",
    name: "Kamesh AJ",
    role: "Senior Video Editor & UI Designer",
    department: "Content Production",
    email: "kamesh@tomoacademy.com",
    phone: "+91 9385718659",
    employeeId: "TOMO-002",
    joinDate: "2025-08-15",
    avatar: "public/kamesh.jpg", // Placeholder image
    location: "salem, tamilnadu, India",
    availability: "busy",
    stats: { videos: 156, tasks: 89, rating: 4.8, projects: 45 },
    bio: "Multi-talented video editor and UI designer with expertise in creating engaging educational content.",
    skills: ["Video Editing", "UI Design", "Adobe Premiere", "After Effects", "Figma", "Motion Graphics"]
  },
  {
    id: "aditya-chaurasiya",
    name: "Aditya Chaurasiya",
    role: "Video Editor & Social Media Manager",
    department: "Content Production",
    email: "aditya.chaurasiya@tomoacademy.com",
    phone: "+91 98765 43212",
    employeeId: "TOMO-003",
    joinDate: "2021-02-10",
    avatar: "public/placeholder.jpg", // Placeholder image
    location: "Mumbai, India",
    availability: "available",
    stats: { videos: 134, tasks: 76, rating: 4.7, projects: 38 },
    bio: "Creative video editor specializing in social media content and cross-platform optimization.",
    skills: ["Video Editing", "Social Media", "Content Strategy", "Adobe Creative Suite", "Analytics"]
  },
  {
    id: "kavyashree",
    name: "Kavyashree",
    role: "Video Editor & Content Creator",
    department: "Content Production",
    email: "kavyashree@tomoacademy.com",
    phone: "+91 98765 43213",
    employeeId: "TOMO-004",
    joinDate: "2021-08-15",
    avatar: "public/placeholder.jpg", // Placeholder image
    location: "Hyderabad, India",
    availability: "available",
    stats: { videos: 98, tasks: 67, rating: 4.6, projects: 29 },
    bio: "Talented video editor and content creator with a passion for storytelling.",
    skills: ["Video Editing", "Storytelling", "Color Grading", "Sound Design", "DaVinci Resolve"]
  },
  {
    id: "monika",
    name: "Monika",
    role: "Video Editor & Graphics Designer",
    department: "Content Production",
    email: "monika@tomoacademy.com",
    phone: "+91 98765 43214",
    employeeId: "TOMO-005",
    joinDate: "2022-01-20",
    avatar: "public/placeholder.jpg", // Placeholder image
    location: "Chennai, India",
    availability: "busy",
    stats: { videos: 87, tasks: 54, rating: 4.5, projects: 31 },
    bio: "Creative video editor and graphics designer specializing in visual storytelling.",
    skills: ["Video Editing", "Graphic Design", "Photoshop", "Illustrator", "Animation"]
  },
  {
    id: "ajay-krithick",
    name: "Ajay Krithick",
    role: "Content Strategist & Script Writer",
    department: "Content Strategy",
    email: "ajay.krithick@tomoacademy.com",
    phone: "+91 98765 43215",
    employeeId: "TOMO-006",
    joinDate: "2021-03-10",
    avatar: "public/placeholder.jpg", // Placeholder image
    location: "Mumbai, India",
    availability: "available",
    stats: { videos: 89, tasks: 134, rating: 4.7, projects: 32 },
    bio: "Content strategist with a passion for creating engaging educational material.",
    skills: ["Content Strategy", "Script Writing", "SEO", "Research", "Educational Design"]
  },
  {
    id: "haridharuson-lj",
    name: "Haridharuson L.J",
    role: "Technical Writer & Research Analyst",
    department: "Content Strategy",
    email: "haridharuson.lj@tomoacademy.com",
    phone: "+91 98765 43216",
    employeeId: "TOMO-007",
    joinDate: "2021-07-05",
    avatar: "public/placeholder.jpg", // Placeholder image
    location: "Coimbatore, India",
    availability: "available",
    stats: { videos: 45, tasks: 98, rating: 4.6, projects: 28 },
    bio: "Technical writer and research analyst specializing in emerging technologies.",
    skills: ["Technical Writing", "Research", "Documentation", "Data Analysis", "Python"]
  },
  {
    id: "nithish",
    name: "Nithish",
    role: "Senior Full Stack Developer",
    department: "Technology",
    email: "nithish@tomoacademy.com",
    phone: "+91 98765 43217",
    employeeId: "TOMO-008",
    joinDate: "2020-08-20",
    avatar: "public/placeholder.jpg", // Placeholder image
    location: "Bangalore, India",
    availability: "busy",
    stats: { videos: 12, tasks: 156, rating: 4.8, projects: 42 },
    bio: "Senior full-stack developer with expertise in modern web technologies.",
    skills: ["React", "Node.js", "MongoDB", "AWS", "Docker", "Microservices"]
  },
  {
    id: "dev",
    name: "Dev",
    role: "Full Stack Developer",
    department: "Technology",
    email: "dev@tomoacademy.com",
    phone: "+91 98765 43218",
    employeeId: "TOMO-009",
    joinDate: "2022-05-01",
    avatar: "public/placeholder.jpg", // Placeholder image
    location: "Pune, India",
    availability: "available",
    stats: { videos: 8, tasks: 76, rating: 4.5, projects: 18 },
    bio: "Full-stack developer specializing in modern web technologies and API development.",
    skills: ["JavaScript", "React", "Express", "PostgreSQL", "REST APIs", "Git"]
  },
  {
    id: "raaj-nikitaa",
    name: "Raaj Nikitaa",
    role: "Lead Designer & Brand Manager",
    department: "Design",
    email: "raaj.nikitaa@tomoacademy.com",
    phone: "+91 98765 43219",
    employeeId: "TOMO-010",
    joinDate: "2020-08-20",
    avatar: "public/placeholder.jpg", // Placeholder image
    location: "Hyderabad, India",
    availability: "available",
    stats: { videos: 234, tasks: 98, rating: 4.9, projects: 67 },
    bio: "Creative lead designer specializing in thumbnails, UI/UX, and brand identity.",
    skills: ["UI/UX Design", "Brand Identity", "Thumbnail Design", "Figma", "Adobe XD", "Typography"]
  },
  {
    id: "nithyasri",
    name: "Nithyasri",
    role: "Content Writer & Social Media Specialist",
    department: "Marketing",
    email: "nithyasri@tomoacademy.com",
    phone: "+91 98765 43220",
    employeeId: "TOMO-011",
    joinDate: "2021-11-15",
    avatar: "public/placeholder.jpg", // Placeholder image
    location: "Chennai, India",
    availability: "available",
    stats: { videos: 67, tasks: 89, rating: 4.6, projects: 34 },
    bio: "Content writer and social media specialist focused on creating engaging content.",
    skills: ["Content Writing", "Social Media Marketing", "Copywriting", "SEO", "Community Management"]
  },
  {
    id: "indhumathi",
    name: "Indhumathi",
    role: "Marketing Manager & Content Planner",
    department: "Marketing",
    email: "indhumathi@tomoacademy.com",
    phone: "+91 98765 43221",
    employeeId: "TOMO-012",
    joinDate: "2021-09-10",
    avatar: "public/placeholder.jpg", // Placeholder image
    location: "Coimbatore, India",
    availability: "busy",
    stats: { videos: 45, tasks: 112, rating: 4.7, projects: 29 },
    bio: "Marketing manager with expertise in content planning and campaign management.",
    skills: ["Marketing Strategy", "Content Planning", "Campaign Management", "Analytics", "Project Management"]
  },
  {
    id: "keerthana",
    name: "Keerthana",
    role: "Content Verifier & Quality Analyst",
    department: "Quality Assurance",
    email: "keerthana@tomoacademy.com",
    phone: "+91 98765 43222",
    employeeId: "TOMO-013",
    joinDate: "2022-03-01",
    avatar: "public/placeholder.jpg", // Placeholder image
    location: "Chennai, India",
    availability: "available",
    stats: { videos: 189, tasks: 145, rating: 4.8, projects: 23 },
    bio: "Content verifier and quality analyst ensuring all educational content meets high standards.",
    skills: ["Quality Assurance", "Content Review", "Attention to Detail", "Process Improvement", "Documentation"]
  },
  {
    id: "prawin-krishnan",
    name: "Prawin Krishnan",
    role: "Finance Manager & Operations Head",
    department: "Finance",
    email: "prawin.krishnan@tomoacademy.com",
    phone: "+91 98765 43223",
    employeeId: "TOMO-014",
    joinDate: "2020-11-01",
    avatar: "public/placeholder.jpg", // Placeholder image
    location: "Mumbai, India",
    availability: "available",
    stats: { videos: 15, tasks: 87, rating: 4.9, projects: 19 },
    bio: "Finance manager and operations head overseeing financial planning and operational efficiency.",
    skills: ["Financial Planning", "Operations Management", "Budgeting", "Excel", "Strategic Planning", "Team Leadership"]
  }
];

// Rest of the EmployeeProfile component remains unchanged
// ... (keep the rest of the file as it is)

const EmployeeProfile = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [employee, setEmployee] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Profile page loaded');
    console.log('Looking for employee ID:', employeeId);
    console.log('Available employees:', employeeData.map(emp => emp.id));
    
    // Find employee by ID
    const foundEmployee = employeeData.find(emp => emp.id === employeeId);
    console.log('Found employee:', foundEmployee);
    
    setEmployee(foundEmployee);
    setIsLoading(false);
  }, [employeeId]);

  if (isLoading) {
    return <LoadingSpinnerOverlay isLoading={true}><div className="h-screen" /></LoadingSpinnerOverlay>;
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-2xl">
          <h1 className="text-2xl font-bold mb-4">Employee Profile</h1>
          <p className="text-muted-foreground mb-6">
            Looking for employee ID: <code className="bg-muted px-2 py-1 rounded">{employeeId}</code>
          </p>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Available Employee IDs:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {employeeData.map(emp => (
                <Link 
                  key={emp.id} 
                  to={`/profile/${emp.id}`}
                  className="p-2 bg-muted rounded hover:bg-primary/10 transition-colors"
                >
                  <div className="font-mono text-xs">{emp.id}</div>
                  <div className="text-xs text-muted-foreground">{emp.name}</div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Link to="/team">
              <Button>
                <Users className="w-4 h-4 mr-2" />
                View All Team Members
              </Button>
            </Link>
            <Link to={`/profile/${employeeData[0].id}`}>
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Sample Profile
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
            
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold">TOMO Academy</h1>
              <p className="text-white/90 text-sm">Employee Profile</p>
            </div>
          </div>

          {/* Employee Info - Mobile Stacked */}
          <div className="text-center">
            {/* Employee Avatar */}
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-2xl md:text-4xl border-4 border-white shadow-lg">
                {employee.avatar || employee.name.split(' ').map((n: string) => n[0]).join('')}
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
