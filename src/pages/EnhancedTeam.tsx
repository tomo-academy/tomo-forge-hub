import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AnimatedCard, GlowCard } from "@/components/ui/animated-card";
import { StatsCard } from "@/components/ui/stats-card";
import Navbar from "@/components/Navbar";
import { 
  Users, Search, Filter, Mail, Award, MapPin, 
  Calendar, Clock, Video, CheckCircle, Star,
  Github, Linkedin, Twitter, Globe, Phone,
  Briefcase, GraduationCap, Trophy, Target,
  Activity, TrendingUp, Eye, MessageSquare,
  Plus, MoreVertical, Edit, Share2, Download
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
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const departments = ["all", "Technology", "Content Production", "Content Strategy", "Design"];

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDepartment = selectedDepartment === "all" || member.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

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
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Team Management
              </h1>
              <p className="text-muted-foreground text-lg">
                Meet our talented team of creators, developers, and designers
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
              <Button className="bg-primary hover:bg-primary-hover shadow-glow gap-2">
                <Plus className="w-4 h-4" />
                Add Member
              </Button>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total Members"
              value={teamMembers.length}
              change={{ value: 2, label: "this month", isPositive: true }}
              icon={Users}
              iconColor="text-primary"
              iconBgColor="bg-primary/10"
            />
            
            <StatsCard
              title="Active Projects"
              value={teamMembers.reduce((sum, member) => sum + member.stats.projects, 0)}
              change={{ value: 8, label: "this week", isPositive: true }}
              icon={Briefcase}
              iconColor="text-accent"
              iconBgColor="bg-accent/10"
            />
            
            <StatsCard
              title="Completed Tasks"
              value={teamMembers.reduce((sum, member) => sum + member.stats.tasks, 0)}
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

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, role, or skills..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              {departments.map((dept) => (
                <Button
                  key={dept}
                  variant={selectedDepartment === dept ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDepartment(dept)}
                  className="capitalize"
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>

          {/* Team Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                  {/* Recent Work */}
                  {member.recentWork && member.recentWork.length > 0 && (
                    <div className="pt-3 border-t border-border">
                      <h4 className="text-sm font-medium mb-2">Recent Work</h4>
                      <div className="space-y-1">
                        {member.recentWork.slice(0, 2).map((work, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground truncate">{work.title}</span>
                            <span className="text-muted-foreground ml-2">
                              {new Date(work.date).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedCard>
            ))}
          </div>

          {/* Department Overview */}
          <GlowCard glowColor="primary">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Department Overview</h2>
              <div className="grid md:grid-cols-4 gap-6">
                {departments.slice(1).map((dept) => {
                  const deptMembers = teamMembers.filter(m => m.department === dept);
                  const totalVideos = deptMembers.reduce((sum, m) => sum + m.stats.videos, 0);
                  const avgRating = deptMembers.reduce((sum, m) => sum + m.stats.rating, 0) / deptMembers.length;
                  
                  return (
                    <div key={dept} className="text-center p-4 rounded-lg bg-muted/30">
                      <h3 className="font-semibold mb-2">{dept}</h3>
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
                    </div>
                  );
                })}
              </div>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
};

export default EnhancedTeam;