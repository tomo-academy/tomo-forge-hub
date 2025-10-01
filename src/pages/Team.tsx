import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Mail, QrCode, Award } from "lucide-react";

const Team = () => {
  const teamMembers = [
    {
      id: "EMP001",
      name: "Kanish SJ",
      role: "Senior Software Developer",
      department: "Engineering",
      email: "kanish.sj@tomoacademy.com",
      skills: ["JavaScript", "Firebase", "Node.js", "React"],
      stats: { videos: 45, tasks: 120, rating: 4.8 },
    },
    {
      id: "EMP002",
      name: "Kamesh",
      role: "UI/UX Designer",
      department: "Design",
      email: "kamesh@tomoacademy.com",
      skills: ["Figma", "Adobe XD", "Illustrator", "Branding"],
      stats: { videos: 67, tasks: 98, rating: 4.9 },
    },
    {
      id: "EMP003",
      name: "Ajay Krithick",
      role: "Content Creator",
      department: "Content",
      email: "ajay@tomoacademy.com",
      skills: ["Video Editing", "Scripting", "SEO"],
      stats: { videos: 89, tasks: 145, rating: 4.7 },
    },
    {
      id: "EMP004",
      name: "Nithish",
      role: "Video Editor",
      department: "Production",
      email: "nithish@tomoacademy.com",
      skills: ["Premiere Pro", "After Effects"],
      stats: { videos: 102, tasks: 167, rating: 4.9 },
    },
    {
      id: "EMP005",
      name: "Haridharuson L.J",
      role: "Content Strategist",
      department: "Content",
      email: "haridharuson@tomoacademy.com",
      skills: ["Strategy", "Planning", "Research"],
      stats: { videos: 34, tasks: 78, rating: 4.6 },
    },
    {
      id: "EMP006",
      name: "Aditya Chaurasiya",
      role: "Social Media Manager",
      department: "Marketing",
      email: "aditya@tomoacademy.com",
      skills: ["Social Media", "Engagement"],
      stats: { videos: 23, tasks: 56, rating: 4.7 },
    },
    {
      id: "EMP007",
      name: "Dev",
      role: "Full Stack Developer",
      department: "Engineering",
      email: "dev@tomoacademy.com",
      skills: ["React", "Python", "AWS", "Docker"],
      stats: { videos: 12, tasks: 89, rating: 4.8 },
    },
    {
      id: "EMP008",
      name: "Nithyasri",
      role: "Content Writer",
      department: "Content",
      email: "nithyasri@tomoacademy.com",
      skills: ["Writing", "Research", "Editing"],
      stats: { videos: 56, tasks: 112, rating: 4.7 },
    },
    {
      id: "EMP009",
      name: "Raaj Nikitaa",
      role: "Graphic Designer",
      department: "Design",
      email: "raaj@tomoacademy.com",
      skills: ["Photoshop", "Illustrator"],
      stats: { videos: 78, tasks: 134, rating: 4.9 },
    },
    {
      id: "EMP010",
      name: "Indhumathi",
      role: "Project Manager",
      department: "Operations",
      email: "indhumathi@tomoacademy.com",
      skills: ["Project Management", "Agile"],
      stats: { videos: 29, tasks: 156, rating: 4.8 },
    },
    {
      id: "EMP011",
      name: "Kavyashree",
      role: "Research Analyst",
      department: "Content",
      email: "kavyashree@tomoacademy.com",
      skills: ["Research", "Analytics"],
      stats: { videos: 18, tasks: 67, rating: 4.6 },
    },
    {
      id: "EMP012",
      name: "Keerthana",
      role: "QA Specialist",
      department: "Quality",
      email: "keerthana@tomoacademy.com",
      skills: ["Quality Assurance", "Testing"],
      stats: { videos: 41, tasks: 98, rating: 4.7 },
    },
    {
      id: "EMP013",
      name: "Monika",
      role: "Marketing Coordinator",
      department: "Marketing",
      email: "monika@tomoacademy.com",
      skills: ["Marketing", "Campaigns"],
      stats: { videos: 27, tasks: 72, rating: 4.8 },
    },
    {
      id: "EMP014",
      name: "Prawin Krishnan",
      role: "Technical Lead",
      department: "Engineering",
      email: "prawin@tomoacademy.com",
      skills: ["Leadership", "Architecture"],
      stats: { videos: 15, tasks: 103, rating: 4.9 },
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Team Directory</h1>
              <p className="text-muted-foreground text-lg">
                Meet the talented creators behind TOMO Academy
              </p>
            </div>
            <Button className="bg-primary hover:bg-primary-hover shadow-glow">
              Add Team Member
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">14</p>
              <p className="text-sm text-muted-foreground mt-1">Total Members</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-accent">6</p>
              <p className="text-sm text-muted-foreground mt-1">Departments</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-success">696</p>
              <p className="text-sm text-muted-foreground mt-1">Videos Produced</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-3xl font-bold text-warning">4.8</p>
              <p className="text-sm text-muted-foreground mt-1">Avg Performance</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <Card 
                key={member.id}
                className="p-6 hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-xs text-muted-foreground">{member.id}</p>
                    </div>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="hover:bg-primary/10"
                  >
                    <QrCode className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mb-4">
                  <p className="font-medium text-sm mb-1">{member.role}</p>
                  <Badge variant="secondary" className="text-xs">
                    {member.department}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{member.email}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-border">
                  <div className="text-center">
                    <p className="text-lg font-bold">{member.stats.videos}</p>
                    <p className="text-xs text-muted-foreground">Videos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold">{member.stats.tasks}</p>
                    <p className="text-xs text-muted-foreground">Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold flex items-center justify-center gap-1">
                      <Award className="w-4 h-4 text-warning" />
                      {member.stats.rating}
                    </p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 3).map((skill, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="text-xs px-2 py-0"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {member.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        +{member.skills.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                  >
                    View Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:text-primary"
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
