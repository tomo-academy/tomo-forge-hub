
// src/data/employees.ts

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
    facebook?: string;
  };
  cardColor?: 'primary' | 'accent' | 'success' | 'warning' | 'destructive';
  recentWork?: {
    title: string;
    type: string;
    date: string;
  }[];
}

export const employees: Employee[] = [
  // Leadership & Administration
  {
    id: "kanish-sj",
    name: "Kanish",
    role: "Content Creator & Admin",
    department: "Content Creation & Administration",
    email: "kanish.sj@tomoacademy.com",
    phone: "+91 99403 75600",
    employeeId: "TOMO-001",
    joinDate: "2025-08-15",
    avatar: "/kanish.jpg",
    bio: "Content Creator and Administrator leading TOMO Academy with technical and strategic vision.",
    skills: ["Content Creation", "Administration", "Team Leadership", "React", "TypeScript", "YouTube API"],
    location: "Salem, Tamil Nadu, India",
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
      { title: "Types OF charts-Data Visualization", type: "Video", date: "2025-11-11" },
      { title: "Data and Task Abstraction", type: "Data Visualization", date: "2025-11-11" },
      { title: "Dimensions And Measures", type: "Data Visualization", date: "2025-11-11" }
    ]
  },

  // Content Editors & Content Verification
  {
    id: "kamesh",
    name: "Kamesh",
    role: "Head of Content Editors & Web Designer",
    department: "Content Editors",
    email: "kamesh@tomoacademy.com",
    phone: "+91 93857 18659",
    employeeId: "TOMO-002",
    joinDate: "2025-08-15",
    avatar: "/kamesh.jpg",
    bio: "Head of Content Editors and Web Designer with expertise in creating engaging educational content.",
    skills: ["Video Editing", "Web Design", "Adobe Premiere", "After Effects", "Figma", "Motion Graphics"],
    location: "Salem, Tamil Nadu, India",
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
    id: "monika",
    name: "Monika",
    role: "Assistant Head of Content Editors",
    department: "Content Editors",
    email: "monika@tomoacademy.com",
    phone: "+91 75021 35500",
    employeeId: "TOMO-003",
    joinDate: "2025-08-20",
    avatar: "/monika.jpg",
    bio: "Assistant Head of Content Editors specializing in visual storytelling.",
    skills: ["Video Editing", "Graphic Design", "Photoshop", "Illustrator", "Animation"],
    location: "Chennai, Tamil Nadu, India",
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

  {
    id: "chandramathi",
    name: "Chandramathi",
    role: "Assistant Content Editor",
    department: "Content Editors",
    email: "chandramathi@tomoacademy.com",
    phone: "+91 93422 47332",
    employeeId: "TOMO-004",
    joinDate: "2025-11-15",
    avatar: "/Chandramathi.jpg",
    bio: "Assistant Content Editor focused on creating engaging educational content.",
    skills: ["Video Editing", "Content Creation", "Storytelling", "Adobe Creative Suite"],
    location: "Salem, Tamil Nadu, India",
    availability: "available",
    stats: {
      videos: 67,
      tasks: 89,
      rating: 4.6,
      projects: 34
    },
    social: {
      linkedin: "https://linkedin.com/in/chandramathi",
      instagram: "https://instagram.com/chandramathi_creates"
    },
    cardColor: "accent",
    recentWork: [
      { title: "Educational Content Edit", type: "Editing", date: "2025-11-18" },
      { title: "Video Production", type: "Production", date: "2025-11-16" },
      { title: "Content Strategy", type: "Strategy", date: "2025-11-14" }
    ]
  },

  {
    id: "aditya-chaurasiya",
    name: "Aditya Chaurasiya",
    role: "External Developer & Consultant",
    department: "External Consultancy",
    email: "aditya.chaurasiya@tomoacademy.com",
    phone: "+91 9608006085",
    employeeId: "TOMO-005",
    joinDate: "2025-08-15",
    avatar: "/aditya.jpg",
    bio: "External Developer and Consultant providing technical expertise and development solutions.",
    skills: ["Full Stack Development", "Consulting", "System Architecture", "Project Management"],
    location: "Nepal",
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
      { title: "System Architecture Review", type: "Consulting", date: "2025-11-18" },
      { title: "Platform Enhancement", type: "Development", date: "2025-11-15" },
      { title: "Technical Documentation", type: "Documentation", date: "2025-11-12" }
    ]
  },

  // Content Creators & Content Verification
  {
    id: "ajay-krithick",
    name: "Ajay Krithick",
    role: "Content Creator & Assistant Content Verifier",
    department: "Content Creation",
    email: "ajay.krithick@tomoacademy.com",
    phone: "+91 63744 36900",
    employeeId: "TOMO-006",
    joinDate: "2025-08-16",
    avatar: "/ajay.jpg",
    bio: "Content Creator and Assistant Content Verifier with expertise in educational content.",
    skills: ["Content Creation", "Content Verification", "Script Writing", "SEO", "Educational Design"],
    location: "Salem, Tamil Nadu, India",
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
      { title: "Next.js Deployment Guide", type: "Content", date: "2025-09-27" },
      { title: "Web3 Explainer", type: "Content", date: "2025-09-24" },
      { title: "Content Verification", type: "Verification", date: "2025-09-21" }
    ]
  },

  {
    id: "nithyasri",
    name: "Nithya Sri",
    role: "Content Creator & Assistant Head of Content Verification",
    department: "Content Creation",
    email: "nithyasri@tomoacademy.com",
    phone: "+91 93458 28690",
    employeeId: "TOMO-007",
    joinDate: "2025-08-15",
    avatar: "/nithyasri.jpg",
    bio: "Content Creator and Assistant Head of Content Verification focused on quality content.",
    skills: ["Content Creation", "Content Verification", "Quality Assurance", "Educational Content", "Review Process"],
    location: "Tamil Nadu, India",
    availability: "available",
    stats: {
      videos: 67,
      tasks: 89,
      rating: 4.6,
      projects: 34
    },
    social: {
      linkedin: "https://linkedin.com/in/nithyasri",
      instagram: "https://instagram.com/nithya_creates"
    },
    cardColor: "accent",
    recentWork: [
      { title: "Content Quality Review", type: "Verification", date: "2025-11-18" },
      { title: "Educational Content Creation", type: "Content", date: "2025-11-16" },
      { title: "Verification Standards", type: "Quality", date: "2025-11-14" }
    ]
  },

  {
    id: "haridharuson-lj",
    name: "Haridharuson",
    role: "Content Verifier & Head of Content Verification",
    department: "Content Verification",
    email: "haridharuson.lj@tomoacademy.com",
    phone: "+91 93453 04086",
    employeeId: "TOMO-008",
    joinDate: "2025-07-05",
    avatar: "/haridharuson.jpg",
    bio: "Head of Content Verification ensuring all educational content meets the highest standards.",
    skills: ["Content Verification", "Quality Control", "Technical Review", "Documentation", "Process Management"],
    location: "Salem, Tamil Nadu, India",
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
      { title: "Content Verification System", type: "Verification", date: "2025-11-18" },
      { title: "Quality Standards Review", type: "Quality", date: "2025-11-15" },
      { title: "Verification Process Update", type: "Process", date: "2025-11-12" }
    ]
  },

  // Instagram & Facebook Management
  {
    id: "keerthana",
    name: "Keerthana",
    role: "Content Creator & Head of Instagram Management",
    department: "Instagram Management",
    email: "keerthana@tomoacademy.com",
    phone: "+91 79048 35387",
    employeeId: "TOMO-009",
    joinDate: "2025-08-22",
    avatar: "/placeholder.jpg",
    bio: "Content Creator and Head of Instagram Management specializing in social media strategy.",
    skills: ["Instagram Management", "Content Creation", "Social Media Strategy", "Community Management", "Visual Content"],
    location: "Chennai, Tamil Nadu, India",
    availability: "available",
    stats: {
      videos: 189,
      tasks: 145,
      rating: 4.8,
      projects: 23
    },
    social: {
      linkedin: "https://linkedin.com/in/keerthana-social",
      instagram: "https://instagram.com/keerthana_social"
    },
    cardColor: "warning",
    recentWork: [
      { title: "Instagram Content Strategy", type: "Strategy", date: "2025-11-18" },
      { title: "Social Media Campaign", type: "Campaign", date: "2025-11-16" },
      { title: "Content Calendar Planning", type: "Planning", date: "2025-11-14" }
    ]
  },

  {
    id: "gowsika",
    name: "Gowsika",
    role: "Instagram Manager & Facebook Management Executive",
    department: "Social Media Management",
    email: "gowsika@tomoacademy.com",
    phone: "+91 93422 47332",
    employeeId: "TOMO-010",
    joinDate: "2025-11-15",
    avatar: "/gowsika.jpg",
    bio: "Instagram Manager and Facebook Management Executive focused on social media engagement.",
    skills: ["Instagram Management", "Facebook Management", "Social Media Marketing", "Content Curation", "Analytics"],
    location: "Thiruchengodu, Tamil Nadu, India",
    availability: "available",
    stats: {
      videos: 67,
      tasks: 89,
      rating: 4.6,
      projects: 34
    },
    social: {
      linkedin: "https://linkedin.com/in/gowsika",
      instagram: "https://instagram.com/gowsika_social"
    },
    cardColor: "accent",
    recentWork: [
      { title: "Instagram Engagement Campaign", type: "Campaign", date: "2025-11-18" },
      { title: "Facebook Content Strategy", type: "Strategy", date: "2025-11-16" },
      { title: "Social Media Analytics", type: "Analytics", date: "2025-11-14" }
    ]
  },

  {
    id: "indhumathi",
    name: "Indhumathi",
    role: "Content Creator & Head of Facebook Management",
    department: "Facebook Management",
    email: "indhumathi@tomoacademy.com",
    phone: "+91 88258 04082",
    employeeId: "TOMO-011",
    joinDate: "2025-09-10",
    avatar: "/indhu.jpg",
    bio: "Content Creator and Head of Facebook Management with expertise in social media strategy.",
    skills: ["Facebook Management", "Content Creation", "Social Media Strategy", "Community Building", "Digital Marketing"],
    location: "Tamil Nadu, India",
    availability: "busy",
    stats: {
      videos: 45,
      tasks: 112,
      rating: 4.7,
      projects: 29
    },
    social: {
      linkedin: "https://linkedin.com/in/indhumathi-social",
      facebook: "https://facebook.com/indhumathi.social"
    },
    cardColor: "success",
    recentWork: [
      { title: "Facebook Community Growth", type: "Strategy", date: "2025-11-18" },
      { title: "Content Creation Campaign", type: "Content", date: "2025-11-16" },
      { title: "Social Media Optimization", type: "Optimization", date: "2025-11-14" }
    ]
  },

  // Marketing
  {
    id: "dev",
    name: "Dev",
    role: "Head of Marketing",
    department: "Marketing",
    email: "dev@tomoacademy.com",
    phone: "+91 84380 74241",
    employeeId: "TOMO-012",
    joinDate: "2025-05-01",
    avatar: "/dev.jpg",
    bio: "Head of Marketing specializing in digital marketing strategies and campaign management.",
    skills: ["Digital Marketing", "Campaign Management", "Analytics", "Social Media Strategy", "Content Marketing"],
    location: "Salem, Ponnamapet, Tamil Nadu, India",
    availability: "available",
    stats: {
      videos: 8,
      tasks: 76,
      rating: 4.5,
      projects: 18
    },
    social: {
      linkedin: "https://linkedin.com/in/dev-marketing",
      twitter: "https://twitter.com/dev_marketing"
    },
    cardColor: "warning",
    recentWork: [
      { title: "Digital Marketing Campaign", type: "Marketing", date: "2025-11-18" },
      { title: "Marketing Analytics Dashboard", type: "Analytics", date: "2025-11-16" },
      { title: "Social Media Strategy", type: "Strategy", date: "2025-11-14" }
    ]
  },

  {
    id: "raaj-nikitaa",
    name: "Raaj Nikitaa",
    role: "Content Creator & Assistant Head of Marketing",
    department: "Marketing",
    email: "raaj.nikitaa@tomoacademy.com",
    phone: "+91 82487 91699",
    employeeId: "TOMO-013",
    joinDate: "2025-08-20",
    avatar: "/rajnikita.jpg",
    bio: "Content Creator and Assistant Head of Marketing specializing in visual content and brand design.",
    skills: ["Content Creation", "Brand Design", "Visual Marketing", "Graphic Design", "Social Media Content"],
    location: "Salem, Tamil Nadu, India",
    availability: "available",
    stats: {
      videos: 234,
      tasks: 98,
      rating: 4.9,
      projects: 67
    },
    social: {
      linkedin: "https://linkedin.com/in/raaj-nikitaa",
      instagram: "https://instagram.com/raaj_designs"
    },
    cardColor: "primary",
    recentWork: [
      { title: "Brand Visual Campaign", type: "Design", date: "2025-11-18" },
      { title: "Marketing Content Creation", type: "Content", date: "2025-11-16" },
      { title: "Visual Identity Update", type: "Branding", date: "2025-11-14" }
    ]
  },

  // Finance Management
  {
    id: "prawin-krishnan",
    name: "Prawin Krishnan",
    role: "Content Creator & Head of Finance Management",
    department: "Finance Management",
    email: "prawin.krishnan@tomoacademy.com",
    phone: "+91 93458 09191",
    employeeId: "TOMO-014",
    joinDate: "2025-11-01",
    avatar: "/pravin.jpg",
    bio: "Content Creator and Head of Finance Management overseeing financial operations and strategic planning.",
    skills: ["Financial Planning", "Content Creation", "Budgeting", "Operations Management", "Strategic Planning"],
    location: "Salem, Tamil Nadu, India",
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
      { title: "Financial Content Creation", type: "Content", date: "2025-11-18" },
      { title: "Budget Planning Q4", type: "Finance", date: "2025-11-16" },
      { title: "Financial Operations Review", type: "Operations", date: "2025-11-14" }
    ]
  },

  {
    id: "kavyashree-finance",
    name: "Kavyashree",
    role: "Assistant Head of Finance Management",
    department: "Finance Management",
    email: "kavyashree.finance@tomoacademy.com",
    phone: "+91 93450 44033",
    employeeId: "TOMO-015",
    joinDate: "2025-08-15",
    avatar: "/Kavyashree.jpg",
    bio: "Assistant Head of Finance Management with expertise in financial operations and analysis.",
    skills: ["Financial Analysis", "Budget Management", "Financial Operations", "Data Analysis", "Process Optimization"],
    location: "Salem, Tamil Nadu, India",
    availability: "available",
    stats: {
      videos: 98,
      tasks: 67,
      rating: 4.6,
      projects: 29
    },
    social: {
      linkedin: "https://linkedin.com/in/kavyashree-finance",
      instagram: "https://instagram.com/kavya_finance"
    },
    cardColor: "warning",
    recentWork: [
      { title: "Financial Analysis Report", type: "Analysis", date: "2025-11-18" },
      { title: "Budget Optimization", type: "Finance", date: "2025-11-16" },
      { title: "Financial Process Review", type: "Process", date: "2025-11-14" }
    ]
  }
];

// Department organization
export const departments = {
  "Content Creation & Administration": employees.filter(emp => emp.department === "Content Creation & Administration"),
  "Content Editors": employees.filter(emp => emp.department === "Content Editors"),
  "Content Creation": employees.filter(emp => emp.department === "Content Creation"),
  "Content Verification": employees.filter(emp => emp.department === "Content Verification"),
  "Instagram Management": employees.filter(emp => emp.department === "Instagram Management"),
  "Facebook Management": employees.filter(emp => emp.department === "Facebook Management"),
  "Social Media Management": employees.filter(emp => emp.department === "Social Media Management"),
  "Marketing": employees.filter(emp => emp.department === "Marketing"),
  "Finance Management": employees.filter(emp => emp.department === "Finance Management"),
  "External Consultancy": employees.filter(emp => emp.department === "External Consultancy"),
};

// Role-based organization
export const roles = {
  "Content Creators": employees.filter(emp => 
    emp.role.includes("Content Creator")
  ),
  "Content Editors": employees.filter(emp => 
    emp.name === "Kamesh" || 
    emp.name === "Monika" || 
    emp.name === "Chandramathi"
  ),
  "Content Verifiers": employees.filter(emp => 
    emp.role.includes("Content Verifier") || emp.role.includes("Content Verification")
  ),
  "Instagram Management": employees.filter(emp => 
    emp.department === "Instagram Management" || emp.department === "Social Media Management"
  ),
  "Facebook Management": employees.filter(emp => 
    emp.department === "Facebook Management"
  ),
  "Marketing Team": employees.filter(emp => emp.department === "Marketing"),
  "Finance Team": employees.filter(emp => emp.department === "Finance Management"),
  "External Consultants": employees.filter(emp => emp.department === "External Consultancy"),
};

export default employees;
