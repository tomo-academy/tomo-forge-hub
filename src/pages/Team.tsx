import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Mail, Award, Search, Filter, X, Download, Share2, User, Calendar, MapPin, Star, Video, PlayCircle, CheckCircle, Users, Clock, ChevronRight, Menu, Send as PaperPlane, Facebook, Twitter, Linkedin, Instagram, Youtube, Github, Plus, LayoutGrid, List } from "lucide-react";
import { useState, useRef, useEffect } from "react";

// Team member interface
interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  skills: string[];
  stats: {
    videos: number;
    tasks: number;
    rating: number;
  };
  image?: string;
  bio?: string;
  availability?: "available" | "mentoring" | "recent";
  education?: string;
  experience?: number;
  location?: string;
  availabilityHours?: string;
  contributions?: string[];
  content?: {
    title: string;
    duration: string;
    views: string;
    date: string;
  }[];
  employeeId?: string;
  since?: number;
  cardVariant?: "tech" | "science" | "arts" | "business";
}

interface ContactMessage {
  id?: string;
  to: string;
  from: string;
  name: string;
  subject: string;
  message: string;
  timestamp?: Date;
}

// Initial team members data
const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    role: "Senior Researcher",
    department: "Computer Science",
    email: "sarah.johnson@tomoacademy.com",
    skills: ["Machine Learning", "Data Science", "Python", "TensorFlow"],
    stats: {
      videos: 24,
      tasks: 142,
      rating: 4.8
    },
    bio: "Dr. Johnson is a leading expert in machine learning with over 10 years of experience in developing predictive models.",
    availability: "available",
    education: "Ph.D. in Computer Science, MIT",
    experience: 10,
    location: "San Francisco, CA",
    availabilityHours: "Mon-Fri, 9AM-5PM PST",
    contributions: ["AI Research Lab", "Data Science Initiative", "ML Mentorship Program"],
    content: [
      { title: "Introduction to Neural Networks", duration: "45 min", views: "12.5K", date: "2023-06-15" },
      { title: "Advanced TensorFlow Techniques", duration: "1h 20min", views: "8.2K", date: "2023-05-22" },
      { title: "Building Recommender Systems", duration: "55 min", views: "9.7K", date: "2023-04-10" }
    ],
    employeeId: "TM2023001",
    since: 2018,
    cardVariant: "tech"
  },
  {
    id: "2",
    name: "Prof. Michael Chen",
    role: "Department Head",
    department: "Physics",
    email: "michael.chen@tomoacademy.com",
    skills: ["Quantum Physics", "Particle Physics", "Research Methodology", "Data Analysis"],
    stats: {
      videos: 18,
      tasks: 98,
      rating: 4.9
    },
    bio: "Professor Chen specializes in quantum mechanics and has published numerous papers on particle physics.",
    availability: "mentoring",
    education: "Ph.D. in Physics, Stanford",
    experience: 15,
    location: "Boston, MA",
    availabilityHours: "Tue-Thu, 10AM-4PM EST",
    contributions: ["Quantum Research Lab", "Physics Curriculum Development", "Graduate Mentorship"],
    content: [
      { title: "Quantum Entanglement Explained", duration: "1h 15min", views: "15.3K", date: "2023-07-02" },
      { title: "Introduction to Particle Physics", duration: "50 min", views: "11.8K", date: "2023-06-18" },
      { title: "Quantum Computing Basics", duration: "1h 5min", views: "13.2K", date: "2023-05-30" }
    ],
    employeeId: "TM2023002",
    since: 2015,
    cardVariant: "science"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    role: "Creative Director",
    department: "Digital Arts",
    email: "emily.rodriguez@tomoacademy.com",
    skills: ["UI/UX Design", "Digital Illustration", "Animation", "Creative Strategy"],
    stats: {
      videos: 32,
      tasks: 186,
      rating: 4.7
    },
    bio: "Emily brings creativity and innovation to digital arts, with a focus on user experience and visual storytelling.",
    availability: "available",
    education: "MFA in Digital Arts, Parsons",
    experience: 8,
    location: "New York, NY",
    availabilityHours: "Mon-Wed, 11AM-6PM EST",
    contributions: ["Design System", "Visual Branding", "Creative Workshops"],
    content: [
      { title: "Principles of UI Design", duration: "40 min", views: "18.7K", date: "2023-07-10" },
      { title: "Digital Illustration Techniques", duration: "1h 10min", views: "14.5K", date: "2023-06-25" },
      { title: "Creating Engaging Animations", duration: "55 min", views: "16.2K", date: "2023-05-15" }
    ],
    employeeId: "TM2023003",
    since: 2019,
    cardVariant: "arts"
  },
  {
    id: "4",
    name: "James Wilson",
    role: "Business Strategist",
    department: "Business Administration",
    email: "james.wilson@tomoacademy.com",
    skills: ["Strategic Planning", "Market Analysis", "Leadership", "Financial Modeling"],
    stats: {
      videos: 21,
      tasks: 124,
      rating: 4.6
    },
    bio: "James has extensive experience in business strategy and has helped numerous organizations achieve their growth objectives.",
    availability: "recent",
    education: "MBA, Harvard Business School",
    experience: 12,
    location: "Chicago, IL",
    availabilityHours: "Mon-Fri, 8AM-4PM CST",
    contributions: ["Business Strategy Framework", "Leadership Development", "Startup Mentorship"],
    content: [
      { title: "Strategic Planning Fundamentals", duration: "50 min", views: "10.3K", date: "2023-07-05" },
      { title: "Market Analysis Techniques", duration: "1h 5min", views: "8.9K", date: "2023-06-20" },
      { title: "Effective Leadership Skills", duration: "45 min", views: "12.1K", date: "2023-05-28" }
    ],
    employeeId: "TM2023004",
    since: 2020,
    cardVariant: "business"
  },
  {
    id: "5",
    name: "Dr. Lisa Park",
    role: "Data Scientist",
    department: "Computer Science",
    email: "lisa.park@tomoacademy.com",
    skills: ["Data Visualization", "Statistical Analysis", "R Programming", "Big Data"],
    stats: {
      videos: 27,
      tasks: 156,
      rating: 4.8
    },
    bio: "Dr. Park specializes in turning complex data into actionable insights through advanced analytics and visualization.",
    availability: "available",
    education: "Ph.D. in Statistics, UC Berkeley",
    experience: 9,
    location: "Seattle, WA",
    availabilityHours: "Mon-Thu, 9AM-5PM PST",
    contributions: ["Data Analytics Lab", "Visualization Tools", "Statistical Methods Research"],
    content: [
      { title: "Data Visualization Best Practices", duration: "55 min", views: "14.8K", date: "2023-07-08" },
      { title: "Advanced Statistical Methods", duration: "1h 15min", views: "11.2K", date: "2023-06-12" },
      { title: "Big Data Processing with R", duration: "1h 30min", views: "9.5K", date: "2023-05-20" }
    ],
    employeeId: "TM2023005",
    since: 2017,
    cardVariant: "tech"
  },
  {
    id: "6",
    name: "Prof. Alex Thompson",
    role: "Research Lead",
    department: "Biology",
    email: "alex.thompson@tomoacademy.com",
    skills: ["Molecular Biology", "Genetics", "Biotechnology", "Research Methodology"],
    stats: {
      videos: 19,
      tasks: 112,
      rating: 4.9
    },
    bio: "Professor Thompson is a renowned biologist with groundbreaking research in genetics and molecular biology.",
    availability: "mentoring",
    education: "Ph.D. in Molecular Biology, Johns Hopkins",
    experience: 14,
    location: "Baltimore, MD",
    availabilityHours: "Tue-Fri, 10AM-5PM EST",
    contributions: ["Genetics Research Lab", "Biotechnology Innovation", "Graduate Mentorship Program"],
    content: [
      { title: "Introduction to Molecular Biology", duration: "1h 20min", views: "16.4K", date: "2023-07-12" },
      { title: "Genetics and Evolution", duration: "1h 10min", views: "13.7K", date: "2023-06-28" },
      { title: "Biotechnology Applications", duration: "50 min", views: "11.9K", date: "2023-05-25" }
    ],
    employeeId: "TM2023006",
    since: 2016,
    cardVariant: "science"
  }
];

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "content" | "contact" | "idcard">("about");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
  const [submittingContact, setSubmittingContact] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const idCardRef = useRef<HTMLDivElement>(null);

  // Load initial data
  useEffect(() => {
    const loadData = () => {
      try {
        setLoading(true);
        // For now, we'll just use the initial data
        setTeamMembers(initialTeamMembers);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter team members based on search and filters
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === "All Roles" || member.role === roleFilter;
    const matchesDepartment = departmentFilter === "All Departments" || member.department === departmentFilter;
    const matchesAvailability = availabilityFilter === "All" || member.availability === availabilityFilter;
    
    return matchesSearch && matchesRole && matchesDepartment && matchesAvailability;
  });

  // Get unique roles for filter dropdown
  const uniqueRoles = ["All Roles", ...Array.from(new Set(teamMembers.map(member => member.role)))];
  
  // Get unique departments for filter dropdown
  const uniqueDepartments = ["All Departments", ...Array.from(new Set(teamMembers.map(member => member.department)))];

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Show toast notification
  const showNotification = (message: string, type: "success" | "error" | "info" = "info") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Handle contact form submission
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedMember) return;
    
    setSubmittingContact(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const contactMessage: ContactMessage = {
        to: selectedMember.email,
        from: formData.get("email") as string,
        name: formData.get("name") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
        timestamp: new Date()
      };
      
      // Here you would normally save to Firebase, for now just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      showNotification("Message sent successfully!", "success");
      e.currentTarget.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      showNotification("Error sending message. Please try again.", "error");
    } finally {
      setSubmittingContact(false);
    }
  };

  // Download ID card
  const downloadIdCard = () => {
    if (!selectedMember || !idCardRef.current) return;
    
    // Create a canvas from the ID card
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 512;
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const variant = selectedMember.cardVariant || 'tech';
    
    switch (variant) {
      case 'tech':
        gradient.addColorStop(0, '#1e293b');
        gradient.addColorStop(1, '#334155');
        break;
      case 'science':
        gradient.addColorStop(0, '#047857');
        gradient.addColorStop(1, '#059669');
        break;
      case 'arts':
        gradient.addColorStop(0, '#b91c1c');
        gradient.addColorStop(1, '#dc2626');
        break;
      case 'business':
        gradient.addColorStop(0, '#6d28d9');
        gradient.addColorStop(1, '#7c3aed');
        break;
      default:
        gradient.addColorStop(0, '#4f46e5');
        gradient.addColorStop(1, '#7c3aed');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(650, 100, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(150, 400, 60, 0, Math.PI * 2);
    ctx.fill();
    
    // Add text content
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('TOMO ACADEMY', 40, 60);
    ctx.font = '16px Arial';
    ctx.fillText('ID CARD', 40, 85);
    
    ctx.font = 'bold 28px Arial';
    ctx.fillText(selectedMember.name, 40, 150);
    ctx.font = '18px Arial';
    ctx.fillText(selectedMember.role, 40, 180);
    
    ctx.font = '14px Arial';
    ctx.fillText(`ID: ${selectedMember.employeeId || selectedMember.id}`, 40, 220);
    ctx.fillText(`Department: ${selectedMember.department}`, 40, 245);
    ctx.fillText(`Since: ${selectedMember.since || 2020}`, 40, 270);
    
    // Download the canvas
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedMember.name.replace(/\s+/g, '_')}_ID_Card.png`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification("ID Card downloaded successfully!", "success");
      }
    });
  };

  // Share ID card
  const shareIdCard = () => {
    if (navigator.share && selectedMember) {
      navigator.share({
        title: `${selectedMember.name}'s ID Card`,
        text: `Check out ${selectedMember.name}'s ID Card from Tomo Academy`,
        url: `https://tomoacademy.com/team/${selectedMember.id}`
      }).then(() => {
        showNotification("ID Card shared successfully!", "success");
      }).catch(() => {
        showNotification("Error sharing ID Card", "error");
      });
    } else {
      // Fallback - copy to clipboard
      if (selectedMember) {
        navigator.clipboard.writeText(`https://tomoacademy.com/team/${selectedMember.id}`);
        showNotification("ID Card link copied to clipboard!", "success");
      }
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "short", day: "numeric" } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get availability badge styling
  const getAvailabilityBadge = (availability?: string) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "mentoring":
        return "bg-blue-100 text-blue-800";
      case "recent":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get availability text
  const getAvailabilityText = (availability?: string) => {
    switch (availability) {
      case "available":
        return "Available";
      case "mentoring":
        return "Mentoring";
      case "recent":
        return "Active";
      default:
        return "Unknown";
    }
  };

  // Get ID card variant styling
  const getIdCardVariant = (variant?: string) => {
    switch (variant) {
      case "tech":
        return "from-slate-900 to-slate-700";
      case "science":
        return "from-emerald-700 to-emerald-500";
      case "arts":
        return "from-red-700 to-red-500";
      case "business":
        return "from-violet-700 to-violet-500";
      default:
        return "from-indigo-700 to-purple-600";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error loading team members</div>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
          toastType === "success" ? "bg-green-500 text-white" :
          toastType === "error" ? "bg-red-500 text-white" :
          "bg-blue-500 text-white"
        }`}>
          {toastMessage}
        </div>
      )}
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Meet Our Team</h1>
          <p className="text-xl opacity-90">Get to know the talented individuals who make Tomo Academy exceptional</p>
        </div>
      </div>
      
      {/* Search and Filter Section */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by name, role, department, or skills..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter Toggle Button */}
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            
            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="available">Available</option>
                  <option value="mentoring">Mentoring</option>
                  <option value="recent">Active</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Team Members Grid/List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No team members found matching your criteria.</p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredMembers.map(member => (
              <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mr-3 bg-gradient-to-r ${getIdCardVariant(member.cardVariant)}`}>
                        {getInitials(member.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <p className="text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <Badge className={getAvailabilityBadge(member.availability)}>
                      {getAvailabilityText(member.availability)}
                    </Badge>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm">{member.bio}</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm mb-1">{member.department}</p>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {member.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{member.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {member.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Star className="h-4 w-4 mr-1 text-yellow-500" />
                      {member.stats.rating}
                    </div>
                  </div>
                  
                  <Button
                    className="w-full"
                    onClick={() => setSelectedMember(member)}
                  >
                    View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Team Member Profile</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMember(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6">
              {/* Member Header */}
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl bg-gradient-to-r ${getIdCardVariant(selectedMember.cardVariant)}`}>
                  {getInitials(selectedMember.name)}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-1">{selectedMember.name}</h3>
                  <p className="text-lg text-gray-600 mb-2">{selectedMember.role}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className={getAvailabilityBadge(selectedMember.availability)}>
                      {getAvailabilityText(selectedMember.availability)}
                    </Badge>
                    <Badge variant="outline">{selectedMember.department}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {selectedMember.email}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {selectedMember.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedMember.availabilityHours}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="border-b mb-6">
                <div className="flex space-x-8">
                  <button
                    className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "about"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("about")}
                  >
                    About
                  </button>
                  <button
                    className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "content"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("content")}
                  >
                    Content
                  </button>
                  <button
                    className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "contact"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("contact")}
                  >
                    Contact
                  </button>
                  <button
                    className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "idcard"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setActiveTab("idcard")}
                  >
                    ID Card
                  </button>
                </div>
              </div>
              
              {/* Tab Content */}
              {activeTab === "about" && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Biography</h4>
                    <p className="text-gray-700">{selectedMember.bio}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Education</h4>
                    <p className="text-gray-700">{selectedMember.education}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Experience</h4>
                    <p className="text-gray-700">{selectedMember.experience} years</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Contributions</h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {selectedMember.contributions?.map((contribution, index) => (
                        <li key={index}>{contribution}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Statistics</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{selectedMember.stats.videos}</div>
                        <div className="text-sm text-gray-600">Videos</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{selectedMember.stats.tasks}</div>
                        <div className="text-sm text-gray-600">Tasks</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{selectedMember.stats.rating}</div>
                        <div className="text-sm text-gray-600">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "content" && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg mb-2">Recent Content</h4>
                  {selectedMember.content?.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h5 className="font-medium mb-1">{item.title}</h5>
                          <div className="flex items-center text-sm text-gray-600 gap-4">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {item.duration}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {item.views} views
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(item.date)}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Watch
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === "contact" && (
                <div>
                  <h4 className="font-semibold text-lg mb-4">Send a Message</h4>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea
                        name="message"
                        rows={5}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      ></textarea>
                    </div>
                    <Button type="submit" disabled={submittingContact} className="w-full">
                      {submittingContact ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <PaperPlane className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
              
              {activeTab === "idcard" && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-lg">ID Card</h4>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={downloadIdCard}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" onClick={shareIdCard}>
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                  
                  <div ref={idCardRef} className={`bg-gradient-to-r ${getIdCardVariant(selectedMember.cardVariant)} rounded-lg p-8 text-white relative overflow-hidden`}>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
                    
                    {/* Card Content */}
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-3xl font-bold mb-1">TOMO ACADEMY</h3>
                          <p className="text-sm opacity-80">ID CARD</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm opacity-80">VALID THRU</p>
                          <p className="text-lg font-semibold">12/25</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-6 mb-6">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-2xl bg-white bg-opacity-20`}>
                          {getInitials(selectedMember.name)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold mb-1">{selectedMember.name}</h4>
                          <p className="text-lg opacity-90 mb-2">{selectedMember.role}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="opacity-70">ID:</span> {selectedMember.employeeId || selectedMember.id}
                            </div>
                            <div>
                              <span className="opacity-70">Dept:</span> {selectedMember.department}
                            </div>
                            <div>
                              <span className="opacity-70">Since:</span> {selectedMember.since || 2020}
                            </div>
                            <div>
                              <span className="opacity-70">Status:</span> {getAvailabilityText(selectedMember.availability)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="text-sm opacity-70">
                          <p>{selectedMember.email}</p>
                          <p>{selectedMember.location}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 px-3 py-1 rounded text-sm">
                          {selectedMember.education?.split(',')[1]?.trim() || 'University'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
