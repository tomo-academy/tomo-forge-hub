import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Mail, QrCode, Award, Search, Filter, X, Download, Share2, User, Calendar, MapPin, Star, Video, PlayCircle, CheckCircle, Users, Clock, ChevronRight, Menu, Times, Facebook, Twitter, Linkedin, Instagram, Youtube, Github, PaperPlane, Plus, Th, List } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

interface ContactMessage {
  id?: string;
  to: string;
  from: string;
  name: string;
  subject: string;
  message: string;
  timestamp?: Timestamp;
}

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Roles");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "content" | "contact" | "idcard">("about");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submittingContact, setSubmittingContact] = useState(false);
  const idCardRef = useRef<HTMLDivElement>(null);

  // Initial team members data
  const initialTeamMembers: TeamMember[] = [
    {
      id: "EMP001",
      name: "Kanish SJ",
      role: "Senior Software Developer",
      department: "Engineering",
      email: "kanish.sj@tomoacademy.com",
      skills: ["JavaScript", "Firebase", "Node.js", "React"],
      stats: { videos: 45, tasks: 120, rating: 4.8 },
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      bio: "Kanish is a passionate software developer with expertise in web technologies. With years of experience in the field, Kanish brings innovative teaching methods and a deep understanding of programming concepts to help students succeed.",
      availability: "available",
      education: "MS in Computer Science, University of Excellence • BS in Software Engineering, State University",
      experience: 7,
      location: "San Francisco, CA",
      availabilityHours: "Mon-Fri, 9AM-5PM EST",
      contributions: [
        "JavaScript Fundamentals Series - 12 episodes",
        "React Advanced Concepts - 8 episodes",
        "Node.js Applications - 6 episodes"
      ],
      content: [
        { title: "Introduction to JavaScript", duration: "15:30", views: "5.2K", date: "2023-05-15" },
        { title: "Advanced React Concepts", duration: "22:45", views: "3.8K", date: "2023-06-02" },
        { title: "Node.js Applications", duration: "18:20", views: "2.9K", date: "2023-06-20" }
      ],
      employeeId: "TA0001",
      since: 2020,
      cardVariant: "tech"
    },
    {
      id: "EMP002",
      name: "Kamesh",
      role: "UI/UX Designer",
      department: "Design",
      email: "kamesh@tomoacademy.com",
      skills: ["Figma", "Adobe XD", "Illustrator", "Branding"],
      stats: { videos: 67, tasks: 98, rating: 4.9 },
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      bio: "Kamesh is a creative UI/UX designer with a passion for creating intuitive and beautiful user interfaces. With a keen eye for detail and a deep understanding of user psychology, Kamesh helps students learn the principles of good design.",
      availability: "mentoring",
      education: "MFA in Design, School of Visual Arts • BFA in Graphic Design, State University",
      experience: 5,
      location: "New York, NY",
      availabilityHours: "Mon-Wed, 10AM-6PM EST",
      contributions: [
        "UI Design Fundamentals - 10 episodes",
        "UX Research Methods - 7 episodes",
        "Branding Principles - 5 episodes"
      ],
      content: [
        { title: "Introduction to UI Design", duration: "12:15", views: "4.5K", date: "2023-05-10" },
        { title: "UX Research Methods", duration: "18:30", views: "3.2K", date: "2023-05-25" },
        { title: "Branding Principles", duration: "15:45", views: "2.7K", date: "2023-06-15" }
      ],
      employeeId: "TA0002",
      since: 2021,
      cardVariant: "arts"
    },
    {
      id: "EMP003",
      name: "Ajay Krithick",
      role: "Content Creator",
      department: "Content",
      email: "ajay@tomoacademy.com",
      skills: ["Video Editing", "Scripting", "SEO"],
      stats: { videos: 89, tasks: 145, rating: 4.7 },
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      bio: "Ajay is a talented content creator with expertise in video production and SEO. With a background in journalism and digital marketing, Ajay helps students learn how to create engaging content that reaches a wide audience.",
      availability: "available",
      education: "MA in Journalism, University of Excellence • BS in Marketing, State University",
      experience: 6,
      location: "Los Angeles, CA",
      availabilityHours: "Tue-Thu, 11AM-7PM EST",
      contributions: [
        "Video Production Basics - 15 episodes",
        "Script Writing Techniques - 10 episodes",
        "SEO for Content Creators - 8 episodes"
      ],
      content: [
        { title: "Video Production Basics", duration: "20:10", views: "6.8K", date: "2023-04-20" },
        { title: "Script Writing Techniques", duration: "16:45", views: "4.2K", date: "2023-05-10" },
        { title: "SEO for Content Creators", duration: "18:30", views: "3.5K", date: "2023-05-30" }
      ],
      employeeId: "TA0003",
      since: 2019,
      cardVariant: "business"
    },
    {
      id: "EMP004",
      name: "Nithish",
      role: "Video Editor",
      department: "Production",
      email: "nithish@tomoacademy.com",
      skills: ["Premiere Pro", "After Effects"],
      stats: { videos: 102, tasks: 167, rating: 4.9 },
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      bio: "Nithish is a skilled video editor with expertise in post-production techniques. With a background in film production and visual effects, Nithish helps students learn how to create professional-looking videos using industry-standard software.",
      availability: "recent",
      education: "BFA in Film Production, School of Visual Arts • Certificate in Visual Effects, Digital Media Institute",
      experience: 4,
      location: "Chicago, IL",
      availabilityHours: "Wed-Fri, 12PM-8PM EST",
      contributions: [
        "Premiere Pro Basics - 12 episodes",
        "After Effects Techniques - 10 episodes",
        "Color Grading Fundamentals - 6 episodes"
      ],
      content: [
        { title: "Premiere Pro Basics", duration: "25:15", views: "7.2K", date: "2023-04-15" },
        { title: "After Effects Techniques", duration: "22:30", views: "5.8K", date: "2023-05-05" },
        { title: "Color Grading Fundamentals", duration: "18:45", views: "4.1K", date: "2023-05-25" }
      ],
      employeeId: "TA0004",
      since: 2020,
      cardVariant: "arts"
    },
    {
      id: "EMP005",
      name: "Haridharuson L.J",
      role: "Content Strategist",
      department: "Content",
      email: "haridharuson@tomoacademy.com",
      skills: ["Strategy", "Planning", "Research"],
      stats: { videos: 34, tasks: 78, rating: 4.6 },
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      bio: "Haridharuson is a strategic thinker with expertise in content planning and research. With a background in marketing analytics and business strategy, Haridharuson helps students learn how to develop effective content strategies that drive engagement.",
      availability: "available",
      education: "MBA in Marketing, Business School • BA in Communications, State University",
      experience: 8,
      location: "Boston, MA",
      availabilityHours: "Mon-Thu, 9AM-5PM EST",
      contributions: [
        "Content Strategy Fundamentals - 8 episodes",
        "Research Methods for Content - 6 episodes",
        "Planning Effective Content Calendars - 5 episodes"
      ],
      content: [
        { title: "Content Strategy Fundamentals", duration: "18:20", views: "3.5K", date: "2023-05-05" },
        { title: "Research Methods for Content", duration: "15:45", views: "2.8K", date: "2023-05-20" },
        { title: "Planning Effective Content Calendars", duration: "12:30", views: "2.2K", date: "2023-06-10" }
      ],
      employeeId: "TA0005",
      since: 2018,
      cardVariant: "business"
    },
    {
      id: "EMP006",
      name: "Aditya Chaurasiya",
      role: "Social Media Manager",
      department: "Marketing",
      email: "aditya@tomoacademy.com",
      skills: ["Social Media", "Engagement"],
      stats: { videos: 23, tasks: 56, rating: 4.7 },
      image: "https://randomuser.me/api/portraits/men/6.jpg",
      bio: "Aditya is a social media expert with a passion for building online communities. With a background in digital marketing and community management, Aditya helps students learn how to create engaging social media content that grows their audience.",
      availability: "mentoring",
      education: "BS in Marketing, Business School • Certificate in Social Media Marketing, Digital Media Institute",
      experience: 5,
      location: "Austin, TX",
      availabilityHours: "Tue-Fri, 10AM-6PM EST",
      contributions: [
        "Social Media Strategy - 7 episodes",
        "Community Building Techniques - 5 episodes",
        "Content Creation for Social Platforms - 6 episodes"
      ],
      content: [
        { title: "Social Media Strategy", duration: "16:30", views: "4.1K", date: "2023-05-12" },
        { title: "Community Building Techniques", duration: "14:15", views: "3.2K", date: "2023-05-28" },
        { title: "Content Creation for Social Platforms", duration: "18:45", views: "2.9K", date: "2023-06-15" }
      ],
      employeeId: "TA0006",
      since: 2020,
      cardVariant: "business"
    },
    {
      id: "EMP007",
      name: "Dev",
      role: "Full Stack Developer",
      department: "Engineering",
      email: "dev@tomoacademy.com",
      skills: ["React", "Python", "AWS", "Docker"],
      stats: { videos: 12, tasks: 89, rating: 4.8 },
      image: "https://randomuser.me/api/portraits/men/7.jpg",
      bio: "Dev is a full-stack developer with expertise in modern web technologies and cloud computing. With a background in software engineering and DevOps, Dev helps students learn how to build scalable applications using industry-standard tools.",
      availability: "available",
      education: "MS in Computer Science, University of Excellence • BS in Software Engineering, State University",
      experience: 6,
      location: "Seattle, WA",
      availabilityHours: "Mon-Wed, 11AM-7PM EST",
      contributions: [
        "Full Stack Development with React - 8 episodes",
        "Python for Web Development - 6 episodes",
        "AWS Cloud Services - 5 episodes"
      ],
      content: [
        { title: "Full Stack Development with React", duration: "22:15", views: "3.8K", date: "2023-05-18" },
        { title: "Python for Web Development", duration: "18:30", views: "2.9K", date: "2023-06-05" },
        { title: "AWS Cloud Services", duration: "20:45", views: "2.4K", date: "2023-06-20" }
      ],
      employeeId: "TA0007",
      since: 2021,
      cardVariant: "tech"
    },
    {
      id: "EMP008",
      name: "Nithyasri",
      role: "Content Writer",
      department: "Content",
      email: "nithyasri@tomoacademy.com",
      skills: ["Writing", "Research", "Editing"],
      stats: { videos: 56, tasks: 112, rating: 4.7 },
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      bio: "Nithyasri is a talented content writer with expertise in research and editing. With a background in journalism and creative writing, Nithyasri helps students learn how to create compelling content that engages and informs their audience.",
      availability: "recent",
      education: "MA in Journalism, University of Excellence • BA in English Literature, State University",
      experience: 4,
      location: "Portland, OR",
      availabilityHours: "Thu-Sat, 10AM-6PM EST",
      contributions: [
        "Content Writing Fundamentals - 10 episodes",
        "Research Techniques for Writers - 7 episodes",
        "Editing and Proofreading - 6 episodes"
      ],
      content: [
        { title: "Content Writing Fundamentals", duration: "18:45", views: "4.5K", date: "2023-05-08" },
        { title: "Research Techniques for Writers", duration: "15:30", views: "3.6K", date: "2023-05-25" },
        { title: "Editing and Proofreading", duration: "12:15", views: "2.8K", date: "2023-06-12" }
      ],
      employeeId: "TA0008",
      since: 2022,
      cardVariant: "arts"
    },
    {
      id: "EMP009",
      name: "Raaj Nikitaa",
      role: "Graphic Designer",
      department: "Design",
      email: "raaj@tomoacademy.com",
      skills: ["Photoshop", "Illustrator"],
      stats: { videos: 78, tasks: 134, rating: 4.9 },
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      bio: "Raaj is a creative graphic designer with expertise in digital illustration and branding. With a background in visual arts and marketing, Raaj helps students learn how to create stunning graphics that communicate their message effectively.",
      availability: "available",
      education: "BFA in Graphic Design, School of Visual Arts • Certificate in Digital Illustration, Art Institute",
      experience: 5,
      location: "Miami, FL",
      availabilityHours: "Mon-Thu, 10AM-6PM EST",
      contributions: [
        "Photoshop Basics - 12 episodes",
        "Illustrator Techniques - 10 episodes",
        "Digital Illustration Fundamentals - 8 episodes"
      ],
      content: [
        { title: "Photoshop Basics", duration: "20:30", views: "5.8K", date: "2023-05-03" },
        { title: "Illustrator Techniques", duration: "18:15", views: "4.7K", date: "2023-05-20" },
        { title: "Digital Illustration Fundamentals", duration: "16:45", views: "3.9K", date: "2023-06-08" }
      ],
      employeeId: "TA0009",
      since: 2020,
      cardVariant: "arts"
    },
    {
      id: "EMP010",
      name: "Indhumathi",
      role: "Project Manager",
      department: "Operations",
      email: "indhumathi@tomoacademy.com",
      skills: ["Project Management", "Agile"],
      stats: { videos: 29, tasks: 156, rating: 4.8 },
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      bio: "Indhumathi is an experienced project manager with expertise in agile methodologies. With a background in business administration and operations, Indhumathi helps students learn how to manage projects effectively and deliver results on time.",
      availability: "mentoring",
      education: "MBA in Project Management, Business School • BA in Business Administration, State University",
      experience: 9,
      location: "Denver, CO",
      availabilityHours: "Mon-Fri, 9AM-5PM EST",
      contributions: [
        "Project Management Fundamentals - 9 episodes",
        "Agile Methodologies - 7 episodes",
        "Team Leadership Techniques - 6 episodes"
      ],
      content: [
        { title: "Project Management Fundamentals", duration: "22:15", views: "4.2K", date: "2023-05-10" },
        { title: "Agile Methodologies", duration: "18:30", views: "3.5K", date: "2023-05-28" },
        { title: "Team Leadership Techniques", duration: "16:45", views: "2.9K", date: "2023-06-15" }
      ],
      employeeId: "TA0010",
      since: 2018,
      cardVariant: "business"
    },
    {
      id: "EMP011",
      name: "Kavyashree",
      role: "Research Analyst",
      department: "Content",
      email: "kavyashree@tomoacademy.com",
      skills: ["Research", "Analytics"],
      stats: { videos: 18, tasks: 67, rating: 4.6 },
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      bio: "Kavyashree is a detail-oriented research analyst with expertise in data analysis and market research. With a background in statistics and business analytics, Kavyashree helps students learn how to gather, analyze, and interpret data to make informed decisions.",
      availability: "recent",
      education: "MS in Data Analytics, University of Excellence • BS in Statistics, State University",
      experience: 3,
      location: "Phoenix, AZ",
      availabilityHours: "Tue-Fri, 11AM-7PM EST",
      contributions: [
        "Research Methodology - 6 episodes",
        "Data Analysis Fundamentals - 5 episodes",
        "Market Research Techniques - 4 episodes"
      ],
      content: [
        { title: "Research Methodology", duration: "18:45", views: "2.8K", date: "2023-05-15" },
        { title: "Data Analysis Fundamentals", duration: "16:30", views: "2.2K", date: "2023-06-02" },
        { title: "Market Research Techniques", duration: "14:15", views: "1.9K", date: "2023-06-18" }
      ],
      employeeId: "TA0011",
      since: 2022,
      cardVariant: "science"
    },
    {
      id: "EMP012",
      name: "Keerthana",
      role: "QA Specialist",
      department: "Quality",
      email: "keerthana@tomoacademy.com",
      skills: ["Quality Assurance", "Testing"],
      stats: { videos: 41, tasks: 98, rating: 4.7 },
      image: "https://randomuser.me/api/portraits/women/5.jpg",
      bio: "Keerthana is a meticulous QA specialist with expertise in software testing and quality assurance. With a background in computer science and software engineering, Keerthana helps students learn how to ensure the quality and reliability of software products.",
      availability: "available",
      education: "MS in Software Engineering, University of Excellence • BS in Computer Science, State University",
      experience: 5,
      location: "Atlanta, GA",
      availabilityHours: "Mon-Thu, 10AM-6PM EST",
      contributions: [
        "Software Testing Fundamentals - 8 episodes",
        "Quality Assurance Methodologies - 6 episodes",
        "Automation Testing Techniques - 5 episodes"
      ],
      content: [
        { title: "Software Testing Fundamentals", duration: "20:15", views: "3.9K", date: "2023-05-05" },
        { title: "Quality Assurance Methodologies", duration: "17:30", views: "3.1K", date: "2023-05-22" },
        { title: "Automation Testing Techniques", duration: "15:45", views: "2.6K", date: "2023-06-10" }
      ],
      employeeId: "TA0012",
      since: 2021,
      cardVariant: "tech"
    },
    {
      id: "EMP013",
      name: "Monika",
      role: "Marketing Coordinator",
      department: "Marketing",
      email: "monika@tomoacademy.com",
      skills: ["Marketing", "Campaigns"],
      stats: { videos: 27, tasks: 72, rating: 4.8 },
      image: "https://randomuser.me/api/portraits/women/6.jpg",
      bio: "Monika is a creative marketing coordinator with expertise in campaign management and brand promotion. With a background in marketing and communications, Monika helps students learn how to create effective marketing campaigns that drive engagement and conversions.",
      availability: "mentoring",
      education: "BS in Marketing, Business School • Certificate in Digital Marketing, Digital Media Institute",
      experience: 4,
      location: "Nashville, TN",
      availabilityHours: "Wed-Fri, 10AM-6PM EST",
      contributions: [
        "Marketing Campaign Fundamentals - 7 episodes",
        "Brand Promotion Strategies - 5 episodes",
        "Digital Marketing Techniques - 6 episodes"
      ],
      content: [
        { title: "Marketing Campaign Fundamentals", duration: "18:30", views: "3.4K", date: "2023-05-12" },
        { title: "Brand Promotion Strategies", duration: "16:15", views: "2.8K", date: "2023-05-30" },
        { title: "Digital Marketing Techniques", duration: "19:45", views: "2.5K", date: "2023-06-15" }
      ],
      employeeId: "TA0013",
      since: 2022,
      cardVariant: "business"
    },
    {
      id: "EMP014",
      name: "Prawin Krishnan",
      role: "Technical Lead",
      department: "Engineering",
      email: "prawin@tomoacademy.com",
      skills: ["Leadership", "Architecture"],
      stats: { videos: 15, tasks: 103, rating: 4.9 },
      image: "https://randomuser.me/api/portraits/men/8.jpg",
      bio: "Prawin is an experienced technical lead with expertise in software architecture and team leadership. With a background in computer science and software engineering, Prawin helps students learn how to design scalable systems and lead technical teams effectively.",
      availability: "available",
      education: "MS in Computer Science, University of Excellence • BS in Software Engineering, State University",
      experience: 10,
      location: "San Jose, CA",
      availabilityHours: "Mon-Wed, 9AM-5PM EST",
      contributions: [
        "Software Architecture Fundamentals - 6 episodes",
        "Technical Leadership Techniques - 5 episodes",
        "System Design Principles - 4 episodes"
      ],
      content: [
        { title: "Software Architecture Fundamentals", duration: "22:30", views: "3.7K", date: "2023-05-08" },
        { title: "Technical Leadership Techniques", duration: "18:15", views: "2.9K", date: "2023-05-25" },
        { title: "System Design Principles", duration: "20:45", views: "2.4K", date: "2023-06-12" }
      ],
      employeeId: "TA0014",
      since: 2017,
      cardVariant: "tech"
    }
  ];

  // Initialize Firebase data
  useEffect(() => {
    initializeFirebaseData();
  }, []);

  // Initialize Firebase with team members data
  const initializeFirebaseData = async () => {
    try {
      setLoading(true);
      
      // Check if team members collection exists
      const teamMembersRef = collection(db, "teamMembers");
      const snapshot = await getDocs(teamMembersRef);
      
      if (snapshot.empty) {
        // If no data exists, add initial team members
        console.log("No team members found, adding initial data...");
        
        for (const member of initialTeamMembers) {
          const memberWithTimestamp = {
            ...member,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          };
          await addDoc(teamMembersRef, memberWithTimestamp);
        }
        
        // Fetch the newly added data
        const newSnapshot = await getDocs(teamMembersRef);
        const members: TeamMember[] = [];
        newSnapshot.forEach(doc => {
          members.push({ id: doc.id, ...doc.data() } as TeamMember);
        });
        setTeamMembers(members);
      } else {
        // Data exists, fetch from Firestore
        const members: TeamMember[] = [];
        snapshot.forEach(doc => {
          members.push({ id: doc.id, ...doc.data() } as TeamMember);
        });
        setTeamMembers(members);
      }
    } catch (error) {
      console.error("Error initializing Firebase data:", error);
      // Fallback to local data
      setTeamMembers(initialTeamMembers);
    } finally {
      setLoading(false);
    }
  };

  // Generate QR code for ID card using qrcode library
  useEffect(() => {
    if (selectedMember && activeTab === "idcard") {
      const profileUrl = `https://tomoacademy.com/team/${selectedMember.id}`;
      QRCode.toDataURL(profileUrl, { width: 60, margin: 1 }, (err, url) => {
        if (err) {
          console.error("Error generating QR code:", err);
          // Fallback to placeholder
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 60;
          canvas.height = 60;
          if (ctx) {
            ctx.fillStyle = '#000000';
            const cellSize = 3;
            const margin = 3;
            for (let i = 0; i < 18; i++) {
              for (let j = 0; j < 18; j++) {
                if (Math.random() > 0.5) {
                  ctx.fillRect(margin + i * cellSize, margin + j * cellSize, cellSize, cellSize);
                }
              }
            }
            ctx.fillRect(margin, margin, 21, 21);
            ctx.fillRect(margin + 39, margin, 21, 21);
            ctx.fillRect(margin, margin + 39, 21, 21);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(margin + 6, margin + 6, 9, 9);
            ctx.fillRect(margin + 45, margin + 6, 9, 9);
            ctx.fillRect(margin + 6, margin + 45, 9, 9);
            setQrCodeUrl(canvas.toDataURL('image/png'));
          }
          return;
        }
        setQrCodeUrl(url);
      });
    }
  }, [selectedMember, activeTab]);

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

  // Download ID card
  const downloadIdCard = () => {
    if (idCardRef.current) {
      html2canvas(idCardRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${selectedMember?.name}-id-card.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showNotification("ID Card downloaded successfully!", "success");
      }).catch((error) => {
        console.error("Error downloading ID card:", error);
        showNotification("Error downloading ID card", "error");
      });
    }
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
        timestamp: Timestamp.now()
      };
      
      // Save to Firestore
      const docRef = await addDoc(collection(db, "contactMessages"), contactMessage);
      console.log("Contact message saved with ID: ", docRef.id);
      
      showNotification("Message sent successfully!", "success");
      e.currentTarget.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      showNotification("Error sending message. Please try again.", "error");
    } finally {
      setSubmittingContact(false);
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-6">
              <CheckCircle className="w-4 h-4 mr-2" />
              {teamMembers.length} Expert Educators • 50,000+ Students Impacted
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Meet the minds behind
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> educational innovation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Our diverse team of dedicated educators, content creators, and technology innovators work together to bridge traditional learning with modern digital solutions. Each member brings unique expertise and passion for empowering students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => document.getElementById("team-section")?.scrollIntoView({ behavior: "smooth" })}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4"
              >
                <Users className="w-5 h-5 mr-2" />
                Explore Team
              </Button>
              <Button 
                variant="outline"
                className="text-lg px-8 py-4"
              >
                <PlayCircle className="w-5 h-5 mr-2" />
                View Content
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-blue-600 mb-2">{teamMembers.length}</div>
              <div className="text-gray-600">Expert Educators</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-purple-600 mb-2">
                {teamMembers.reduce((acc, member) => acc + member.stats.videos, 0)}
              </div>
              <div className="text-gray-600">Educational Videos</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-amber-600 mb-2">50<span className="text-lg">K+</span></div>
              <div className="text-gray-600">Students Helped</div>
            </div>
            <div>
              <div className="text-4xl lg:text-5xl font-bold text-green-600 mb-2">
                {(teamMembers.reduce((acc, member) => acc + member.stats.rating, 0) / teamMembers.length).toFixed(1)}
              </div>
              <div className="text-gray-600">Avg Performance</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section id="team-section" className="py-16 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Find the perfect mentor for your journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Filter by expertise, content type, or collaboration availability to connect with the right team member.
            </p>
          </div>

          {/* Search and Filter Controls */}
          <Card className="p-6 mb-12">
            <div className="grid md:grid-cols-4 gap-4">
              {/* Search Bar */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by name, role, or skills..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={availabilityFilter === "available" ? "default" : "outline"}
                size="sm"
                onClick={() => setAvailabilityFilter(availabilityFilter === "available" ? "All" : "available")}
                className="flex items-center"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Available for Collaboration
              </Button>
              <Button
                variant={availabilityFilter === "mentoring" ? "default" : "outline"}
                size="sm"
                onClick={() => setAvailabilityFilter(availabilityFilter === "mentoring" ? "All" : "mentoring")}
                className="flex items-center"
              >
                <User className="w-4 h-4 mr-2" />
                Accepting Mentees
              </Button>
              <Button
                variant={availabilityFilter === "recent" ? "default" : "outline"}
                size="sm"
                onClick={() => setAvailabilityFilter(availabilityFilter === "recent" ? "All" : "recent")}
                className="flex items-center"
              >
                <Clock className="w-4 h-4 mr-2" />
                Recently Active
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("All Roles");
                  setDepartmentFilter("All Departments");
                  setAvailabilityFilter("All");
                }}
                className="flex items-center"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </Card>

          {/* View Toggle */}
          <div className="flex justify-end mb-4">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Th className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Team Members Grid/List */}
          <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
            {filteredMembers.map((member) => (
              <Card
                key={member.id}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedMember(member)}
              >
                <div className="relative">
                  <img
                    src={member.image || `https://picsum.photos/seed/${member.id}/400/300.jpg`}
                    alt={member.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/seed/${member.id}/400/300.jpg`;
                    }}
                  />
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityBadge(member.availability)}`}>
                    {getAvailabilityText(member.availability)}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{member.name}</h3>
                      <p className="text-sm text-gray-500">{member.id}</p>
                    </div>
                  </div>
                  <p className="font-medium text-sm mb-1">{member.role}</p>
                  <Badge variant="secondary" className="text-xs mb-4">
                    {member.department}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Mail className="w-3 h-3 mr-1" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-gray-200">
                    <div className="text-center">
                      <p className="text-lg font-bold">{member.stats.videos}</p>
                      <p className="text-xs text-gray-500">Videos</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">{member.stats.tasks}</p>
                      <p className="text-xs text-gray-500">Tasks</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold flex items-center justify-center gap-1">
                        <Award className="w-4 h-4 text-amber-500" />
                        {member.stats.rating}
                      </p>
                      <p className="text-xs text-gray-500">Rating</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs px-2 py-0">
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
                  <div className="flex items-center text-blue-600 font-medium group-hover:text-blue-800">
                    <span>View Profile</span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" className="px-8 py-4">
              <Plus className="w-5 h-5 mr-2" />
              Load More Team Members
            </Button>
          </div>
        </div>
      </section>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <img
                    src={selectedMember.image || `https://picsum.photos/seed/${selectedMember.id}/200/200.jpg`}
                    alt={selectedMember.name}
                    className="w-20 h-20 rounded-full object-cover mr-6"
                    onError={(e) => {
                      e.currentTarget.src = `https://picsum.photos/seed/${selectedMember.id}/200/200.jpg`;
                    }}
                  />
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedMember.name}</h2>
                    <p className="text-xl text-blue-600 font-medium mb-2">{selectedMember.role}</p>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityBadge(selectedMember.availability)}`}>
                      {getAvailabilityText(selectedMember.availability)}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedMember(null)}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-gray-200 mb-6">
                <Button
                  variant={activeTab === "about" ? "default" : "ghost"}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
                  onClick={() => setActiveTab("about")}
                >
                  About
                </Button>
                <Button
                  variant={activeTab === "content" ? "default" : "ghost"}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
                  onClick={() => setActiveTab("content")}
                >
                  Content
                </Button>
                <Button
                  variant={activeTab === "contact" ? "default" : "ghost"}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
                  onClick={() => setActiveTab("contact")}
                >
                  Contact
                </Button>
                <Button
                  variant={activeTab === "idcard" ? "default" : "ghost"}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
                  onClick={() => setActiveTab("idcard")}
                >
                  <QrCode className="w-4 h-4 mr-1" />
                  ID Card
                </Button>
              </div>

              {/* Tab Content */}
              <div>
                {/* About Tab */}
                {activeTab === "about" && (
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Biography</h3>
                      <p className="text-gray-600 mb-6">{selectedMember.bio}</p>

                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Expertise</h3>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {selectedMember.skills.map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="px-3 py-1">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Education</h3>
                      <p className="text-gray-600 mb-6">{selectedMember.education}</p>
                    </div>

                    {/* Right Column */}
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 mb-1">{selectedMember.stats.videos}</div>
                          <div className="text-sm text-gray-600">Videos Created</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-amber-600 mb-1">{selectedMember.stats.rating}/5</div>
                          <div className="text-sm text-gray-600">Average Rating</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600 mb-1">{selectedMember.stats.tasks}</div>
                          <div className="text-sm text-gray-600">Tasks Completed</div>
                        </div>
                        <div className="text-center p-4 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 mb-1">{selectedMember.experience || 5}+</div>
                          <div className="text-sm text-gray-600">Years Experience</div>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Contributions</h3>
                      <div className="space-y-3 mb-6">
                        {selectedMember.contributions?.map((contribution, idx) => (
                          <div key={idx} className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <Video className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{contribution}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <Button className="flex-1">
                          <PlayCircle className="w-5 h-5 mr-2" />
                          View Content
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Mail className="w-5 h-5 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Tab */}
                {activeTab === "content" && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Latest Content</h3>
                    <div className="space-y-4 mb-6">
                      {selectedMember.content?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <PlayCircle className="w-5 h-5 text-blue-600 mr-4" />
                            <div>
                              <div className="font-medium text-gray-900">{item.title}</div>
                              <div className="text-sm text-gray-600">{item.duration} • {formatDate(item.date)}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">{item.views} views</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center">
                      <Button>
                        <Th className="w-5 h-5 mr-2" />
                        View All Content
                      </Button>
                    </div>
                  </div>
                )}

                {/* Contact Tab */}
                {activeTab === "contact" && (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center">
                          <Mail className="w-5 h-5 text-blue-600 mr-3" />
                          <span className="text-gray-600">{selectedMember.email}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-blue-600 mr-3" />
                          <span className="text-gray-600">{selectedMember.availabilityHours || "Mon-Fri, 9AM-5PM EST"}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-5 h-5 text-blue-600 mr-3" />
                          <span className="text-gray-600">{selectedMember.location || "Remote"}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Media</h3>
                      <div className="flex space-x-4 mb-6">
                        <Button variant="ghost" size="icon">
                          <Twitter className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Linkedin className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Youtube className="w-5 h-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Github className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Send a Message</h3>
                      <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Your Name</label>
                          <input
                            type="text"
                            name="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                          <input
                            type="email"
                            name="email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter your email"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Subject</label>
                          <input
                            type="text"
                            name="subject"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter subject"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
                          <textarea
                            name="message"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={4}
                            placeholder="Enter your message"
                            required
                          ></textarea>
                        </div>
                        <Button type="submit" className="w-full" disabled={submittingContact}>
                          {submittingContact ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <PaperPlane className="w-5 h-5 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </div>
                  </div>
                )}

                {/* ID Card Tab */}
                {activeTab === "idcard" && (
                  <div className="flex flex-col items-center">
                    <div
                      ref={idCardRef}
                      className={`w-full max-w-md h-64 bg-gradient-to-br ${getIdCardVariant(selectedMember.cardVariant)} rounded-2xl shadow-xl p-6 text-white relative overflow-hidden`}
                    >
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
                      
                      {/* Card content */}
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold">TOMO ACADEMY</h3>
                            <p className="text-xs opacity-80">ID CARD</p>
                          </div>
                          <div className="bg-white bg-opacity-20 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            VERIFIED
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-end">
                          <div>
                            <h4 className="text-lg font-bold">{selectedMember.name}</h4>
                            <p className="text-sm opacity-90">{selectedMember.role}</p>
                            <div className="mt-2 space-y-1 text-xs">
                              <div className="flex items-center">
                                <span className="opacity-70 mr-2">ID:</span>
                                <span>{selectedMember.employeeId || selectedMember.id}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="opacity-70 mr-2">Dept:</span>
                                <span>{selectedMember.department}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="opacity-70 mr-2">Since:</span>
                                <span>{selectedMember.since || 2020}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center">
                            <img
                              src={selectedMember.image || `https://picsum.photos/seed/${selectedMember.id}/100/100.jpg`}
                              alt={selectedMember.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-white border-opacity-30 mb-2"
                              onError={(e) => {
                                e.currentTarget.src = `https://picsum.photos/seed/${selectedMember.id}/100/100.jpg`;
                              }}
                            />
                            {qrCodeUrl ? (
                              <img
                                src={qrCodeUrl}
                                alt="QR Code"
                                className="w-12 h-12 bg-white p-1 rounded"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-white p-1 rounded flex items-center justify-center">
                                <QrCode className="w-8 h-8 text-gray-800" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mt-6">
                      <Button onClick={downloadIdCard} className="flex items-center">
                        <Download className="w-5 h-5 mr-2" />
                        Download ID Card
                      </Button>
                      <Button variant="outline" onClick={shareIdCard} className="flex items-center">
                        <Share2 className="w-5 h-5 mr-2" />
                        Share ID Card
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
          toastType === "success" ? "bg-green-600" :
          toastType === "error" ? "bg-red-600" : "bg-blue-600"
        }`}>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Team;
