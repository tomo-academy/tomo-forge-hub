// TOMO Academy Employee Database
export interface Employee {
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
    instagram?: string;
  };
  cardColor?: 'primary' | 'accent' | 'success' | 'warning' | 'destructive';
  recentWork?: {
    title: string;
    type: string;
    date: string;
  }[];
}

export const employees: Employee[] = [
  // Leadership & Development
  {
    id: "kanish-sj",
    name: "Kanish SJ",
    role: "Lead Developer & Channel Manager",
    department: "Technology",
    email: "kanish.sj@tomoacademy.com",
    phone: "+91 98765 43210",
    employeeId: "TOMO-001",
    joinDate: "2020-01-15",
    avatar: "KS",
    bio: "Full-stack developer and channel manager leading the technical vision for TOMO Academy. Expert in React, Node.js, and cloud technologies.",
    skills: ["React", "Node.js", "MongoDB", "AWS", "TypeScript", "Docker", "Leadership"],
    location: "Chennai, India",
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
    cardColor: "primary",
    recentWork: [
      { title: "Firebase Tutorial Series", type: "Video", date: "2025-09-28" },
      { title: "Platform Architecture", type: "Development", date: "2025-09-25" },
      { title: "API Integration", type: "Development", date: "2025-09-20" }
    ]
  },

  // Video Editors
  {
    id: "kamesh",
    name: "Kamesh",
    role: "Senior Video Editor & UI Designer",
    department: "Content Production",
    email: "kamesh@tomoacademy.com",
    phone: "+91 98765 43211",
    employeeId: "TOMO-002",
    joinDate: "2020-06-01",
    avatar: "K",
    bio: "Multi-talented video editor and UI designer with expertise in creating engaging educational content and intuitive user interfaces.",
    skills: ["Premiere Pro", "After Effects", "Figma", "UI/UX Design", "Motion Graphics", "Color Grading"],
    location: "Bangalore, India",
    availability: "busy",
    stats: {
      videos: 156,
      tasks: 89,
      rating: 4.8,
      projects: 45
    },
    social: {
      linkedin: "https://linkedin.com/in/kamesh-editor",
      instagram: "https://instagram.com/kamesh_creative"
    },
    cardColor: "accent",
    recentWork: [
      { title: "React Hooks Tutorial", type: "Editing", date: "2025-09-29" },
      { title: "Platform Dashboard Design", type: "Design", date: "2025-09-26" },
      { title: "CSS Animation Series", type: "Editing", date: "2025-09-22" }
    ]
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
    avatar: "AC",
    bio: "Creative video editor specializing in social media content and cross-platform optimization for maximum engagement.",
    skills: ["Premiere Pro", "After Effects", "Social Media Marketing", "Content Strategy", "DaVinci Resolve"],
    location: "Mumbai, India",
    availability: "available",
    stats: {
      videos: 134,
      tasks: 76,
      rating: 4.7,
      projects: 38
    },
    social: {
      linkedin: "https://linkedin.com/in/aditya-chaurasiya",
      instagram: "https://instagram.com/aditya_creates"
    },
    cardColor: "success",
    recentWork: [
      { title: "Instagram Reels Series", type: "Editing", date: "2025-09-28" },
      { title: "Social Media Campaign", type: "Marketing", date: "2025-09-25" },
      { title: "YouTube Shorts", type: "Editing", date: "2025-09-23" }
    ]
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
    avatar: "KV",
    bio: "Talented video editor and content creator with a passion for storytelling and educational content development.",
    skills: ["Premiere Pro", "After Effects", "Content Creation", "Storytelling", "Animation"],
    location: "Hyderabad, India",
    availability: "available",
    stats: {
      videos: 98,
      tasks: 67,
      rating: 4.6,
      projects: 29
    },
    social: {
      linkedin: "https://linkedin.com/in/kavyashree",
      instagram: "https://instagram.com/kavya_creates"
    },
    cardColor: "warning",
    recentWork: [
      { title: "Educational Series Edit", type: "Editing", date: "2025-09-27" },
      { title: "Content Planning", type: "Strategy", date: "2025-09-24" },
      { title: "Animation Project", type: "Animation", date: "2025-09-21" }
    ]
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
    avatar: "M",
    bio: "Creative video editor and graphics designer specializing in visual storytelling and brand-consistent content creation.",
    skills: ["Premiere Pro", "Photoshop", "Illustrator", "Motion Graphics", "Brand Design"],
    location: "Chennai, India",
    availability: "busy",
    stats: {
      videos: 87,
      tasks: 54,
      rating: 4.5,
      projects: 31
    },
    social: {
      linkedin: "https://linkedin.com/in/monika-designer",
      instagram: "https://instagram.com/monika_visuals"
    },
    cardColor: "destructive",
    recentWork: [
      { title: "Brand Graphics Update", type: "Design", date: "2025-09-28" },
      { title: "Tutorial Video Edit", type: "Editing", date: "2025-09-26" },
      { title: "Motion Graphics", type: "Animation", date: "2025-09-23" }
    ]
  },

  // Content Strategy & Writing
  {
    id: "ajay-krithick",
    name: "Ajay Krithick",
    role: "Content Strategist & Script Writer",
    department: "Content Strategy",
    email: "ajay.krithick@tomoacademy.com",
    phone: "+91 98765 43215",
    employeeId: "TOMO-006",
    joinDate: "2021-03-10",
    avatar: "AK",
    bio: "Content strategist with a passion for creating engaging educational material and technical documentation.",
    skills: ["Content Strategy", "Technical Writing", "SEO", "Research", "Scriptwriting", "Analytics"],
    location: "Mumbai, India",
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
    cardColor: "primary",
    recentWork: [
      { title: "Next.js Deployment Guide", type: "Script", date: "2025-09-27" },
      { title: "Web3 Explainer", type: "Script", date: "2025-09-24" },
      { title: "Content Calendar Q4", type: "Strategy", date: "2025-09-21" }
    ]
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
    avatar: "HL",
    bio: "Technical writer and research analyst specializing in emerging technologies and educational content development.",
    skills: ["Technical Writing", "Research", "Data Analysis", "Documentation", "AI/ML", "Blockchain"],
    location: "Coimbatore, India",
    availability: "available",
    stats: {
      videos: 45,
      tasks: 98,
      rating: 4.6,
      projects: 28
    },
    social: {
      linkedin: "https://linkedin.com/in/haridharuson-lj",
      twitter: "https://twitter.com/hari_tech"
    },
    cardColor: "accent",
    recentWork: [
      { title: "AI Research Paper", type: "Research", date: "2025-09-28" },
      { title: "Technical Documentation", type: "Writing", date: "2025-09-25" },
      { title: "Blockchain Guide", type: "Content", date: "2025-09-22" }
    ]
  },

  // Development Team
  {
    id: "nithish",
    name: "Nithish",
    role: "Senior Full Stack Developer",
    department: "Technology",
    email: "nithish@tomoacademy.com",
    phone: "+91 98765 43217",
    employeeId: "TOMO-008",
    joinDate: "2020-08-20",
    avatar: "N",
    bio: "Senior full-stack developer with expertise in modern web technologies and scalable application architecture.",
    skills: ["React", "Node.js", "Python", "PostgreSQL", "Docker", "Kubernetes", "DevOps"],
    location: "Bangalore, India",
    availability: "busy",
    stats: {
      videos: 12,
      tasks: 156,
      rating: 4.8,
      projects: 42
    },
    social: {
      github: "https://github.com/nithish-dev",
      linkedin: "https://linkedin.com/in/nithish-dev"
    },
    cardColor: "success",
    recentWork: [
      { title: "Platform Backend", type: "Development", date: "2025-09-29" },
      { title: "Database Optimization", type: "Development", date: "2025-09-27" },
      { title: "API Enhancement", type: "Development", date: "2025-09-25" }
    ]
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
    avatar: "D",
    bio: "Full-stack developer specializing in modern web technologies and API development.",
    skills: ["React", "Python", "Django", "PostgreSQL", "Docker", "AWS", "GraphQL"],
    location: "Pune, India",
    availability: "available",
    stats: {
      videos: 8,
      tasks: 76,
      rating: 4.5,
      projects: 18
    },
    social: {
      github: "https://github.com/dev-tomo",
      linkedin: "https://linkedin.com/in/dev-tomo"
    },
    cardColor: "warning",
    recentWork: [
      { title: "Analytics Dashboard", type: "Development", date: "2025-09-29" },
      { title: "API Optimization", type: "Development", date: "2025-09-27" },
      { title: "Database Migration", type: "Development", date: "2025-09-25" }
    ]
  },

  // Design Team
  {
    id: "raaj-nikitaa",
    name: "Raaj Nikitaa",
    role: "Lead Designer & Brand Manager",
    department: "Design",
    email: "raaj.nikitaa@tomoacademy.com",
    phone: "+91 98765 43219",
    employeeId: "TOMO-010",
    joinDate: "2020-08-20",
    avatar: "RN",
    bio: "Creative lead designer specializing in thumbnails, UI/UX, and brand identity for educational content.",
    skills: ["Photoshop", "Illustrator", "Figma", "UI/UX Design", "Brand Design", "Thumbnail Design"],
    location: "Hyderabad, India",
    availability: "available",
    stats: {
      videos: 234,
      tasks: 98,
      rating: 4.9,
      projects: 67
    },
    social: {
      linkedin: "https://linkedin.com/in/raaj-nikitaa",
      website: "https://raajnikitaa.design",
      instagram: "https://instagram.com/raaj_designs"
    },
    cardColor: "primary",
    recentWork: [
      { title: "Firebase Tutorial Thumbnail", type: "Design", date: "2025-09-28" },
      { title: "Brand Guidelines Update", type: "Design", date: "2025-09-25" },
      { title: "Course Landing Page", type: "Design", date: "2025-09-23" }
    ]
  },

  // Content & Marketing
  {
    id: "nithyasri",
    name: "Nithyasri",
    role: "Content Writer & Social Media Specialist",
    department: "Marketing",
    email: "nithyasri@tomoacademy.com",
    phone: "+91 98765 43220",
    employeeId: "TOMO-011",
    joinDate: "2021-11-15",
    avatar: "NS",
    bio: "Content writer and social media specialist focused on creating engaging content across multiple platforms.",
    skills: ["Content Writing", "Social Media Marketing", "SEO", "Copywriting", "Instagram Marketing", "Facebook Ads"],
    location: "Chennai, India",
    availability: "available",
    stats: {
      videos: 67,
      tasks: 89,
      rating: 4.6,
      projects: 34
    },
    social: {
      linkedin: "https://linkedin.com/in/nithyasri",
      instagram: "https://instagram.com/nithya_writes"
    },
    cardColor: "accent",
    recentWork: [
      { title: "Social Media Campaign", type: "Marketing", date: "2025-09-28" },
      { title: "Blog Content Series", type: "Writing", date: "2025-09-26" },
      { title: "Instagram Strategy", type: "Strategy", date: "2025-09-24" }
    ]
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
    avatar: "I",
    bio: "Marketing manager with expertise in content planning, campaign management, and audience engagement strategies.",
    skills: ["Marketing Strategy", "Content Planning", "Campaign Management", "Analytics", "Email Marketing"],
    location: "Coimbatore, India",
    availability: "busy",
    stats: {
      videos: 45,
      tasks: 112,
      rating: 4.7,
      projects: 29
    },
    social: {
      linkedin: "https://linkedin.com/in/indhumathi-marketing"
    },
    cardColor: "success",
    recentWork: [
      { title: "Q4 Marketing Plan", type: "Strategy", date: "2025-09-27" },
      { title: "Email Campaign", type: "Marketing", date: "2025-09-25" },
      { title: "Content Calendar", type: "Planning", date: "2025-09-23" }
    ]
  },

  // Quality & Operations
  {
    id: "keerthana",
    name: "Keerthana",
    role: "Content Verifier & Quality Analyst",
    department: "Quality Assurance",
    email: "keerthana@tomoacademy.com",
    phone: "+91 98765 43222",
    employeeId: "TOMO-013",
    joinDate: "2022-03-01",
    avatar: "KT",
    bio: "Content verifier and quality analyst ensuring all educational content meets TOMO Academy's high standards.",
    skills: ["Quality Assurance", "Content Review", "Proofreading", "Educational Standards", "Process Improvement"],
    location: "Chennai, India",
    availability: "available",
    stats: {
      videos: 189,
      tasks: 145,
      rating: 4.8,
      projects: 23
    },
    social: {
      linkedin: "https://linkedin.com/in/keerthana-qa"
    },
    cardColor: "warning",
    recentWork: [
      { title: "Content Quality Review", type: "Review", date: "2025-09-28" },
      { title: "Process Documentation", type: "Documentation", date: "2025-09-26" },
      { title: "Standards Update", type: "Quality", date: "2025-09-24" }
    ]
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
    avatar: "PK",
    bio: "Finance manager and operations head overseeing financial planning, budgeting, and operational efficiency.",
    skills: ["Financial Planning", "Budget Management", "Operations", "Analytics", "Strategic Planning", "Compliance"],
    location: "Mumbai, India",
    availability: "available",
    stats: {
      videos: 15,
      tasks: 87,
      rating: 4.9,
      projects: 19
    },
    social: {
      linkedin: "https://linkedin.com/in/prawin-krishnan"
    },
    cardColor: "destructive",
    recentWork: [
      { title: "Q4 Budget Planning", type: "Finance", date: "2025-09-27" },
      { title: "Revenue Analysis", type: "Analytics", date: "2025-09-25" },
      { title: "Operations Review", type: "Operations", date: "2025-09-23" }
    ]
  }
];

// Department organization
export const departments = {
  "Technology": employees.filter(emp => emp.department === "Technology"),
  "Content Production": employees.filter(emp => emp.department === "Content Production"),
  "Content Strategy": employees.filter(emp => emp.department === "Content Strategy"),
  "Design": employees.filter(emp => emp.department === "Design"),
  "Marketing": employees.filter(emp => emp.department === "Marketing"),
  "Quality Assurance": employees.filter(emp => emp.department === "Quality Assurance"),
  "Finance": employees.filter(emp => emp.department === "Finance"),
};

// Role-based organization
export const roles = {
  "Editors": employees.filter(emp => 
    emp.name === "Kamesh" || 
    emp.name === "Aditya Chaurasiya" || 
    emp.name === "Kavyashree" || 
    emp.name === "Monika"
  ),
  "Developers": employees.filter(emp => emp.department === "Technology"),
  "Designers": employees.filter(emp => emp.department === "Design"),
  "Content Team": employees.filter(emp => 
    emp.department === "Content Strategy" || emp.department === "Content Production"
  ),
  "Marketing Team": employees.filter(emp => emp.department === "Marketing"),
  "Operations": employees.filter(emp => 
    emp.department === "Quality Assurance" || emp.department === "Finance"
  ),
};

export default employees;