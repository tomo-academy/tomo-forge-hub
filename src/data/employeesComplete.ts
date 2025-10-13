// Complete TOMO Academy Employee Database - All 14 Members

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
}

export const allEmployees: Employee[] = [
  // 1. Kanish SJ - Lead Developer & Channel Manager
  {
    id: "kanish-sj",
    name: "Kanish SJ",
    role: "Lead Developer & Channel Manager",
    department: "Technology",
    email: "kanish.sj@tomoacademy.com",
    phone: "+91 98765 43210",
    employeeId: "TOMO-001",
    joinDate: "2020-01-15",
    bio: "Full-stack developer and channel manager leading TOMO Academy's technical vision.",
    skills: ["React", "Node.js", "MongoDB", "AWS", "TypeScript", "Leadership"],
    location: "Chennai, India",
    availability: "available",
    stats: { videos: 28, tasks: 165, rating: 4.9, projects: 24 }
  },

  // 2. Kamesh - Senior Video Editor
  {
    id: "kamesh",
    name: "Kamesh",
    role: "Senior Video Editor & Designer",
    department: "Video Editing",
    email: "kamesh@tomoacademy.com",
    phone: "+91 98765 43211",
    employeeId: "TOMO-002",
    joinDate: "2020-06-01",
    bio: "Expert video editor specializing in educational content and motion graphics.",
    skills: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Motion Graphics"],
    location: "Bangalore, India",
    availability: "busy",
    stats: { videos: 156, tasks: 89, rating: 4.8, projects: 45 }
  },

  // 3. Aditya Chaurasiya - Video Editor
  {
    id: "aditya-chaurasiya",
    name: "Aditya Chaurasiya",
    role: "Video Editor & Content Creator",
    department: "Video Editing",
    email: "aditya.chaurasiya@tomoacademy.com",
    phone: "+91 98765 43212",
    employeeId: "TOMO-003",
    joinDate: "2021-02-10",
    bio: "Creative video editor with expertise in storytelling and visual effects.",
    skills: ["Premiere Pro", "After Effects", "Photoshop", "Color Grading"],
    location: "Mumbai, India",
    availability: "available",
    stats: { videos: 134, tasks: 76, rating: 4.7, projects: 38 }
  },

  // 4. Kavyashree - Video Editor
  {
    id: "kavyashree",
    name: "Kavyashree",
    role: "Video Editor & Motion Designer",
    department: "Video Editing",
    email: "kavyashree@tomoacademy.com",
    phone: "+91 98765 43213",
    employeeId: "TOMO-004",
    joinDate: "2021-08-15",
    bio: "Talented video editor with a passion for creating engaging educational content.",
    skills: ["Premiere Pro", "After Effects", "Illustrator", "Animation"],
    location: "Hyderabad, India",
    availability: "available",
    stats: { videos: 98, tasks: 67, rating: 4.6, projects: 29 }
  },

  // 5. Monika - Video Editor
  {
    id: "monika",
    name: "Monika",
    role: "Video Editor & Graphics Designer",
    department: "Video Editing",
    email: "monika@tomoacademy.com",
    phone: "+91 98765 43214",
    employeeId: "TOMO-005",
    joinDate: "2022-01-20",
    bio: "Creative video editor and graphics designer specializing in visual storytelling.",
    skills: ["Premiere Pro", "Photoshop", "Illustrator", "Typography"],
    location: "Chennai, India",
    availability: "busy",
    stats: { videos: 87, tasks: 54, rating: 4.5, projects: 31 }
  },

  // 6. Ajay Krithick - Content Strategist
  {
    id: "ajay-krithick",
    name: "Ajay Krithick",
    role: "Content Strategist & Script Writer",
    department: "Content Strategy",
    email: "ajay.krithick@tomoacademy.com",
    phone: "+91 98765 43215",
    employeeId: "TOMO-006",
    joinDate: "2020-09-01",
    bio: "Strategic content planner and script writer ensuring quality educational material.",
    skills: ["Content Strategy", "Script Writing", "SEO", "Analytics"],
    location: "Delhi, India",
    availability: "available",
    stats: { videos: 145, tasks: 198, rating: 4.8, projects: 52 }
  },

  // 7. Nithish - Content Strategist
  {
    id: "nithish",
    name: "Nithish",
    role: "Content Strategist & Planner",
    department: "Content Strategy",
    email: "nithish@tomoacademy.com",
    phone: "+91 98765 43216",
    employeeId: "TOMO-007",
    joinDate: "2021-03-15",
    bio: "Content strategist focused on creating impactful learning experiences.",
    skills: ["Content Planning", "Research", "Analytics", "Project Management"],
    location: "Chennai, India",
    availability: "available",
    stats: { videos: 112, tasks: 156, rating: 4.7, projects: 41 }
  },

  // 8. Dev - Developer
  {
    id: "dev",
    name: "Dev",
    role: "Full Stack Developer",
    department: "Technology",
    email: "dev@tomoacademy.com",
    phone: "+91 98765 43217",
    employeeId: "TOMO-008",
    joinDate: "2021-11-01",
    bio: "Full-stack developer building scalable solutions for TOMO Academy platform.",
    skills: ["React", "Node.js", "Python", "MongoDB", "Docker"],
    location: "Pune, India",
    availability: "available",
    stats: { videos: 15, tasks: 143, rating: 4.8, projects: 28 }
  },

  // 9. Haridharuson L.J - Designer
  {
    id: "haridharuson-lj",
    name: "Haridharuson L.J",
    role: "UI/UX Designer & Brand Specialist",
    department: "Design",
    email: "haridharuson@tomoacademy.com",
    phone: "+91 98765 43218",
    employeeId: "TOMO-009",
    joinDate: "2020-12-01",
    bio: "Creative designer crafting beautiful and intuitive user experiences.",
    skills: ["Figma", "Adobe XD", "Illustrator", "Branding", "UI/UX"],
    location: "Coimbatore, India",
    availability: "available",
    stats: { videos: 45, tasks: 167, rating: 4.9, projects: 56 }
  },

  // 10. Raaj Nikitaa - Designer
  {
    id: "raaj-nikitaa",
    name: "Raaj Nikitaa",
    role: "Graphic Designer & Thumbnail Specialist",
    department: "Design",
    email: "raaj.nikitaa@tomoacademy.com",
    phone: "+91 98765 43219",
    employeeId: "TOMO-010",
    joinDate: "2021-05-20",
    bio: "Expert graphic designer creating eye-catching thumbnails and visual assets.",
    skills: ["Photoshop", "Illustrator", "Canva", "Typography", "Branding"],
    location: "Hyderabad, India",
    availability: "busy",
    stats: { videos: 234, tasks: 145, rating: 4.8, projects: 67 }
  },

  // 11. Nithyasri - Social Media Manager
  {
    id: "nithyasri",
    name: "Nithyasri",
    role: "Social Media Manager",
    department: "Marketing",
    email: "nithyasri@tomoacademy.com",
    phone: "+91 98765 43220",
    employeeId: "TOMO-011",
    joinDate: "2021-07-01",
    bio: "Social media expert managing Instagram, Facebook, and community engagement.",
    skills: ["Social Media Marketing", "Content Creation", "Analytics", "Community Management"],
    location: "Chennai, India",
    availability: "available",
    stats: { videos: 67, tasks: 234, rating: 4.7, projects: 45 }
  },

  // 12. Indhumathi - Content Verifier
  {
    id: "indhumathi",
    name: "Indhumathi",
    role: "Content Verifier & Quality Analyst",
    department: "Quality Assurance",
    email: "indhumathi@tomoacademy.com",
    phone: "+91 98765 43221",
    employeeId: "TOMO-012",
    joinDate: "2022-02-15",
    bio: "Quality analyst ensuring all content meets TOMO Academy's high standards.",
    skills: ["Quality Assurance", "Content Review", "Proofreading", "Testing"],
    location: "Bangalore, India",
    availability: "available",
    stats: { videos: 198, tasks: 167, rating: 4.8, projects: 34 }
  },

  // 13. Keerthana - Content Verifier
  {
    id: "keerthana",
    name: "Keerthana",
    role: "Content Verifier & QA Specialist",
    department: "Quality Assurance",
    email: "keerthana@tomoacademy.com",
    phone: "+91 98765 43222",
    employeeId: "TOMO-013",
    joinDate: "2022-03-01",
    bio: "Content verifier ensuring accuracy and quality in all educational materials.",
    skills: ["Quality Control", "Content Verification", "Documentation", "Testing"],
    location: "Chennai, India",
    availability: "available",
    stats: { videos: 189, tasks: 145, rating: 4.8, projects: 23 }
  },

  // 14. Prawin Krishnan - Finance Manager
  {
    id: "prawin-krishnan",
    name: "Prawin Krishnan",
    role: "Finance Manager & Operations Head",
    department: "Finance",
    email: "prawin.krishnan@tomoacademy.com",
    phone: "+91 98765 43223",
    employeeId: "TOMO-014",
    joinDate: "2020-11-01",
    bio: "Finance manager overseeing financial planning and operational efficiency.",
    skills: ["Financial Planning", "Operations Management", "Budgeting", "Analytics"],
    location: "Mumbai, India",
    availability: "available",
    stats: { videos: 15, tasks: 87, rating: 4.9, projects: 19 }
  }
];

// Department organization
export const departmentGroups = {
  "Technology": allEmployees.filter(emp => emp.department === "Technology"),
  "Video Editing": allEmployees.filter(emp => emp.department === "Video Editing"),
  "Content Strategy": allEmployees.filter(emp => emp.department === "Content Strategy"),
  "Design": allEmployees.filter(emp => emp.department === "Design"),
  "Marketing": allEmployees.filter(emp => emp.department === "Marketing"),
  "Quality Assurance": allEmployees.filter(emp => emp.department === "Quality Assurance"),
  "Finance": allEmployees.filter(emp => emp.department === "Finance")
};

// Role-based groups
export const roleGroups = {
  "Video Editors": allEmployees.filter(emp => 
    emp.name === "Kamesh" || 
    emp.name === "Aditya Chaurasiya" || 
    emp.name === "Kavyashree" || 
    emp.name === "Monika"
  ),
  "Developers": allEmployees.filter(emp => emp.department === "Technology"),
  "Designers": allEmployees.filter(emp => emp.department === "Design"),
  "Content Team": allEmployees.filter(emp => emp.department === "Content Strategy"),
  "Marketing Team": allEmployees.filter(emp => emp.department === "Marketing"),
  "QA Team": allEmployees.filter(emp => emp.department === "Quality Assurance"),
  "Finance Team": allEmployees.filter(emp => emp.department === "Finance")
};

export const departments = [
  "Technology",
  "Video Editing",
  "Content Strategy",
  "Design",
  "Marketing",
  "Quality Assurance",
  "Finance"
];
