import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AnimatedCard, GlowCard } from "@/components/ui/animated-card";
import { StatsCard } from "@/components/ui/stats-card";
import { EmployeeIDCard, EmployeeIDCardsGrid } from "@/components/ui/employee-id-card";
import { LoadingSpinnerOverlay } from "@/components/ui/loading-spinner";
import { AddMemberModal } from "@/components/ui/add-member-modal";
import Navbar from "@/components/Navbar";
import { employees, departments, roles } from "@/data/employees";
import { firebaseService } from "@/services/firebase";
import { 
  Users, Search, Filter, Mail, Award, MapPin, 
  Calendar, Clock, Video, CheckCircle, Star,
  Github, Linkedin, Twitter, Globe, Phone,
  Briefcase, GraduationCap, Trophy, Target,
  Activity, TrendingUp, Eye, MessageSquare,
  Plus, MoreVertical, Edit, Share2, Download,
  CreditCard, Grid, List, Building2, UserCheck
} from "lucide-react";

// Team member interface
interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  bio?: string;
  skills: string[];
  experience: number;
  joinDate: string;
  availability: "available" | "busy" | "offline";
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
  };
  recentWork?: {
    title: string;
    type: string;
    date: string;
  }[];
}

// Enhanced team data
const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Kanish SJ",
    role: "Lead Developer & Channel Manager",
    department: "Technology",
    email: "kanish.sj@tomoacademy.com",
    phone: "+91 98765 43210",
    location: "Chennai, India",
    avatar: "KS",
    bio: "Full-stack developer with expertise in React, Node.js, and cloud technologies. Leading the technical vision for TOMO Academy.",
    skills: ["React", "Node.js", "MongoDB", "AWS", "TypeScript", "Docker"],
    experience: 5,
    joinDate: "2020-01-15",
    availability: "available",
    stats: {
      videos: 28,
      tasks: 165,
      rating: 4.9,
      projects: 24
    },
    social: {
      linkedin: "https://linkedin.com/in/kanish-sj",
      github: "https://github.com/kanish-sj",
      twitter: "https://twitter.com/kanish_sj"
    },
    recentWork: [
      { title: "Firebase Tutorial Series", type: "Video", date: "2025-09-28" },
      { title: "Platform Architecture", type: "Development", date: "2025-09-25" },
      { title: "API Integration", type: "Development", date: "2025-09-20" }
    ]
  },
  {
    id: "2",
    name: "Nithish",
    role: "Senior Video Editor",
    department: "Content Production",
    email: "nithish@tomoacademy.com",
    location: "Bangalore, India",
    avatar: "N",
    bio: "Creative video editor specializing in educational content with 4+ years of experience in post-production.",
    skills: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Motion Graphics", "Color Grading"],
    experience: 4,
    joinDate: "2020-06-01",
    availability: "busy",
    stats: {
      videos: 156,
      tasks: 89,
      rating: 4.8,
      projects: 45
    },
    social: {
      linkedin: "https://linkedin.com/in/nithish-editor"
    },
    recentWork: [
      { title: "React Hooks Tutorial", type: "Editing", date: "2025-09-29" },
      { title: "TypeScript Guide", type: "Editing", date: "2025-09-26" },
      { title: "CSS Animation Series", type: "Editing", date: "2025-09-22" }
    ]
  },
  {
    id: "3",
    name: "Ajay Krithick",
    role: "Content Strategist & Script Writer",
    department: "Content Strategy",
    email: "ajay.krithick@tomoacademy.com",
    location: "Mumbai, India",
    avatar: "AK",
    bio: "Content strategist with a passion for creating engaging educational material and technical documentation.",
    skills: ["Content Strategy", "Technical Writing", "SEO", "Research", "Scriptwriting"],
    experience: 3,
    joinDate: "2021-03-10",
    availability: "available",
    stats: {
      videos: 89,
      tasks: 134,
      rating: 4.7,
      projects: 32
    },
    social: {
      linkedin: "https://linkedin.com/in/ajay-krithick",
      twitter: "https://twitter.com/ajay_krithick"
    },
    recentWork: [
      { title: "Next.js Deployment Guide", type: "Script", date: "2025-09-27" },
      { title: "Web3 Explainer", type: "Script", date: "2025-09-24" },
      { title: "Content Calendar Q4", type: "Strategy", date: "2025-09-21" }
    ]
  },
  {
    id: "4",
    name: "Raaj Nikitaa",
    role: "Lead Designer",
    department: "Design",
    email: "raaj.nikitaa@tomoacademy.com",
    location: "Hyderabad, India",
    avatar: "RN",
    bio: "Creative designer specializing in thumbnails, UI/UX, and brand identity for educational content.",
    skills: ["Photoshop", "Illustrator", "Figma", "UI/UX Design", "Brand Design", "Thumbnail Design"],
    experience: 4,
    joinDate: "2020-08-20",
    availability: "available",
    stats: {
      videos: 234,
      tasks: 98,
      rating: 4.9,
      projects: 67
    },
    social: {
      linkedin: "https://linkedin.com/in/raaj-nikitaa",
      website: "https://raajnikitaa.design"
    },
    recentWork: [
      { title: "Firebase Tutorial Thumbnail", type: "Design", date: "2025-09-28" },
      { title: "Brand Guidelines Update", type: "Design", date: "2025-09-25" },
      { title: "Course Landing Page", type: "Design", date: "2025-09-23" }
    ]
  },
  {
    id: "5",
    name: "Kamesh",
    role: "UI/UX Designer",
    department: "Design",
    email: "kamesh@tomoacademy.com",
    location: "Chennai, India",
    avatar: "K",
    bio: "UI/UX designer focused on creating intuitive and engaging user experiences for educational platforms.",
    skills: ["Figma", "Sketch", "Prototyping", "User Research", "Interaction Design"],
    experience: 3,
    joinDate: "2021-01-15",
    availability: "available",
    stats: {
      videos: 45,
      tasks: 87,
      rating: 4.6,
      projects: 28
    },
    social: {
      linkedin: "https://linkedin.com/in/kamesh-designer",
      website: "https://kamesh.design"
    },
    recentWork: [
      { title: "Platform Dashboard Redesign", type: "Design", date: "2025-09-26" },
      { title: "Mobile App Wireframes", type: "Design", date: "2025-09-24" },
      { title: "User Flow Optimization", type: "Research", date: "2025-09-22" }
    ]
  },
  {
    id: "6",
    name: "Dev",
    role: "Full Stack Developer",
    department: "Technology",
    email: "dev@tomoacademy.com",
    location: "Pune, India",
    avatar: "D",
    bio: "Full-stack developer specializing in modern web technologies and API development.",
    skills: ["React", "Python", "Django", "PostgreSQL", "Docker", "AWS"],
    experience: 2,
    joinDate: "2022-05-01",
    availability: "busy",
    stats: {
      videos: 12,
      tasks: 76,
      rating: 4.5,
      projects: 18
    },
    social: {
      github: "https://github.com/dev-tomo",
      linkedin: "https://linkedin.com/in/dev-tomo"
    },
    recentWork: [
      { title: "Analytics Dashboard", type: "Development", date: "2025-09-29" },
      { title: "API Optimization", type: "Development", date: "2025-09-27" },
      { title: "Database Migration", type: "Development", date: "2025-09-25" }
    ]
  }
];

const EnhancedTeam = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "grid" | "list">("cards");
  const [isLoading, setIsLoading] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [teamData, setTeamData] = useState(employees);

  const departmentList = ["all", ...Object.keys(departments)];

  const filteredMembers = teamData.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleMemberAdded = async () => {
    // Refresh team data from Firebase
    try {
      const updatedEmployees = await firebaseService.getEmployees();
      if (updatedEmployees.length > 0) {
        setTeamData(updatedEmployees);
      }
    } catch (error) {
      console.error('Failed to refresh team data:', error);
    }
  };

  // Initialize Firebase data on component mount
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await firebaseService.initializeDefaultData();
      } catch (error) {
        console.error('Failed to initialize data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available":
        return "bg-success text-success-foreground";
      case "busy":
        return "bg-warning text-warning-foreground";
      case "offline":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case "available":
        return <CheckCircle className="w-3 h-3" />;
      case "busy":
        return <Clock className="w-3 h-3" />;
      case "offline":
        return <Activity className="w-3 h-3" />;
      default:
        return <Activity className="w-3 h-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <LoadingSpinnerOverlay isLoading={isLoading}>
        <div className="pt-24 px-4 pb-12 min-h-screen">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  TOMO Academy Team
                </h1>
                <p className="text-muted-foreground text-lg">
                  Meet our talented team of {employees.length} creators, developers, and designers
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export IDs
                </Button>
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => window.open('/test-profile', '_blank')}
                >
                  <Eye className="w-4 h-4" />
                  Test Profile
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary-hover shadow-glow gap-2"
                  onClick={() => setShowAddMember(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add Member
                </Button>
              </div>
            </div>

            {/* Team Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard
                title="Total Members"
                value={employees.length}
                change={{ value: 2, label: "this month", isPositive: true }}
                icon={Users}
                iconColor="text-primary"
                iconBgColor="bg-primary/10"
              />
              
              <StatsCard
                title="Active Projects"
                value={employees.reduce((sum, member) => sum + member.stats.projects, 0)}
                change={{ value: 8, label: "this week", isPositive: true }}
                icon={Briefcase}
                iconColor="text-accent"
                iconBgColor="bg-accent/10"
              />
              
              <StatsCard
                title="Completed Tasks"
                value={employees.reduce((sum, member) => sum + member.stats.tasks, 0)}
                change={{ value: 23, label: "this week", isPositive: true }}
                icon={CheckCircle}
                iconColor="text-success"
                iconBgColor="bg-success/10"
              />
              
              <StatsCard
                title="Avg Rating"
                value={4.7}
                change={{ value: 0.2, label: "vs last month", isPositive: true }}
                icon={Star}
                iconColor="text-warning"
                iconBgColor="bg-warning/10"
                suffix="/5"
              />
            </div>

            {/* Filters & View Toggle */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, role, or skills..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Department Filters - Mobile Scrollable */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {departmentList.map((dept) => (
                  <Button
                    key={dept}
                    variant={selectedDepartment === dept ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDepartment(dept)}
                    className="capitalize whitespace-nowrap flex-shrink-0"
                  >
                    {dept === "all" ? "All" : dept.split(' ')[0]}
                  </Button>
                ))}
              </div>

              {/* View Mode Toggle */}
              <div className="flex justify-center">
                <div className="flex gap-1 p-1 bg-muted rounded-lg">
                  <Button
                    variant={viewMode === "cards" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("cards")}
                    className="gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="hidden sm:inline">ID Cards</span>
                  </Button>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="gap-2"
                  >
                    <Grid className="w-4 h-4" />
                    <span className="hidden sm:inline">Grid</span>
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="gap-2"
                  >
                    <List className="w-4 h-4" />
                    <span className="hidden sm:inline">List</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Dynamic Content Based on View Mode */}
            {viewMode === "cards" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">Premium Employee ID Cards</h2>
                  <p className="text-muted-foreground">Click any card to flip and view contact details</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center">
                  {filteredMembers.map((member) => (
                    <EmployeeIDCard
                      key={member.id}
                      employee={member}
                      variant="landscape"
                      premium={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <AnimatedCard key={member.id} hoverEffect="lift" className="overflow-hidden">
                    <div className="p-6 space-y-4">
                      {/* Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                            {member.avatar}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                          </div>
                        </div>
                        <Badge className={getAvailabilityColor(member.availability)}>
                          {getAvailabilityIcon(member.availability)}
                          <span className="ml-1 capitalize">{member.availability}</span>
                        </Badge>
                      </div>

                      {/* Bio */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {member.bio}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 py-3 border-y border-border">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">{member.stats.videos}</div>
                          <div className="text-xs text-muted-foreground">Videos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-accent">{member.stats.tasks}</div>
                          <div className="text-xs text-muted-foreground">Tasks</div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div>
                        <h4 className="text-sm font-medium mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.slice(0, 4).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {member.skills.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{member.skills.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Contact & Social */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Mail className="w-4 h-4" />
                          </Button>
                          {member.social?.linkedin && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Linkedin className="w-4 h-4" />
                            </Button>
                          )}
                          {member.social?.github && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Github className="w-4 h-4" />
                            </Button>
                          )}
                          {member.social?.website && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Globe className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            )}

            {viewMode === "list" && (
              <div className="space-y-4">
                {filteredMembers.map((member) => (
                  <AnimatedCard key={member.id} hoverEffect="border" className="p-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                        {member.avatar}
                      </div>
                      
                      <div className="flex-1 grid md:grid-cols-4 gap-4">
                        <div>
                          <h3 className="font-bold text-lg">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                          <Badge variant="outline" className="text-xs mt-1">{member.department}</Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Contact</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground">{member.employeeId}</p>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Stats</p>
                          <p className="text-xs text-muted-foreground">{member.stats.videos} videos</p>
                          <p className="text-xs text-muted-foreground">{member.stats.rating}/5.0 rating</p>
                        </div>
                        
                        <div className="flex items-center justify-end gap-2">
                          <Badge className={getAvailabilityColor(member.availability)}>
                            {getAvailabilityIcon(member.availability)}
                            <span className="ml-1 capitalize">{member.availability}</span>
                          </Badge>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            )}

            {/* Department Overview */}
            <GlowCard glowColor="primary">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Building2 className="w-6 h-6 text-primary" />
                  <h2 className="text-2xl font-bold">Department Overview</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(departments).map(([deptName, deptMembers]) => {
                    const totalVideos = deptMembers.reduce((sum, m) => sum + m.stats.videos, 0);
                    const avgRating = deptMembers.reduce((sum, m) => sum + m.stats.rating, 0) / deptMembers.length;
                    
                    return (
                      <AnimatedCard key={deptName} hoverEffect="glow" className="text-center p-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                          <UserCheck className="w-6 h-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-3 text-sm">{deptName}</h3>
                        <div className="space-y-2">
                          <div>
                            <div className="text-2xl font-bold text-primary">{deptMembers.length}</div>
                            <div className="text-xs text-muted-foreground">Members</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-accent">{totalVideos}</div>
                            <div className="text-xs text-muted-foreground">Total Videos</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-success">{avgRating.toFixed(1)}</div>
                            <div className="text-xs text-muted-foreground">Avg Rating</div>
                          </div>
                        </div>
                      </AnimatedCard>
                    );
                  })}
                </div>
              </div>
            </GlowCard>

            {/* Role-based Teams */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(roles).map(([roleName, roleMembers]) => (
                <AnimatedCard key={roleName} hoverEffect="lift" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold">{roleName}</h3>
                      <p className="text-sm text-muted-foreground">{roleMembers.length} members</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {roleMembers.slice(0, 3).map((member) => (
                      <div key={member.id} className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-xs font-bold">
                          {member.avatar}
                        </div>
                        <span className="flex-1 truncate">{member.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {member.stats.rating}⭐
                        </Badge>
                      </div>
                    ))}
                    {roleMembers.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        +{roleMembers.length - 3} more members
                      </p>
                    )}
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>
      </LoadingSpinnerOverlay>

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddMember}
        onClose={() => setShowAddMember(false)}
        onMemberAdded={handleMemberAdded}
      />
    </div>
  );
};

export default EnhancedTeam;