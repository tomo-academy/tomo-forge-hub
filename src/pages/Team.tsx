import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Mail, Award, Search, Filter, X, Download, Share2, User, Calendar, MapPin, Star, Video, PlayCircle, CheckCircle, Users, Clock, ChevronRight, Menu, Send as PaperPlane, Facebook, Twitter, Linkedin, Instagram, Youtube, Github, Plus, LayoutGrid, List, Briefcase, GraduationCap, Sparkles, Zap, Trophy, Target, TrendingUp, Eye, Heart, MessageSquare, Bookmark, MoreVertical, Camera, Edit, Copy, ExternalLink, ChevronDown, Bell, Settings, LogOut, Home, BookOpen, Users2, BarChart3, FileText, HelpCircle, DollarSign, Shield, Megaphone, Figma, Palette, Code, Database, Cloud, Smartphone, Globe, Lock, CreditCard, PieChart, FileCheck, TrendingDown, Activity, AlertCircle, UserCheck, UserX, Hash, AtSign, Link2, MessageCircle, ThumbsUp, BookmarkIcon, Share, Send, Image, Film, Music, Headphones, Radio, Tv, Wifi, Battery, Signal, Volume2, Mic, MicOff, VideoOff, Phone, PhoneOff, Maximize, Minimize, RefreshCw, WifiOff, BatteryLow } from "lucide-react";
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
    students: number;
    courses: number;
    achievements: number;
    followers: number;
    posts: number;
    projects: number;
  };
  image?: string;
  bio?: string;
  availability?: "available" | "mentoring" | "busy" | "offline";
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
    thumbnail?: string;
    category?: string;
    level?: string;
  }[];
  employeeId?: string;
  since?: number;
  cardVariant?: "tech" | "science" | "arts" | "business" | "design" | "marketing" | "social" | "finance" | "content";
  social?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
    instagram?: string;
    facebook?: string;
  };
  languages?: string[];
  certifications?: string[];
  specialties?: string[];
  upcomingEvents?: {
    title: string;
    date: string;
    type: string;
  }[];
  isEditor?: boolean;
  kpi?: {
    engagement: number;
    reach: number;
    conversion: number;
    retention: number;
  };
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

// Initial team members data with the new names
const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Kanish SJ",
    role: "Lead Developer",
    department: "Technology",
    email: "kanish.sj@tomoacademy.com",
    skills: ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
    stats: {
      videos: 28,
      tasks: 165,
      rating: 4.9,
      students: 1850,
      courses: 10,
      achievements: 18,
      followers: 3200,
      posts: 145,
      projects: 24
    },
    bio: "Kanish is a full-stack developer with expertise in modern web technologies and cloud architecture. He leads the development team with innovative solutions.",
    availability: "available",
    education: "B.Tech in Computer Science, IIT Bombay",
    experience: 8,
    location: "Bangalore, India",
    availabilityHours: "Mon-Fri, 10AM-6PM IST",
    contributions: ["Tech Lead", "Code Review", "Architecture Design"],
    content: [
      { title: "Advanced React Patterns", duration: "1h 15min", views: "18.5K", date: "2023-07-15", category: "Web Development", level: "Advanced" },
      { title: "Building Scalable APIs", duration: "55 min", views: "12.3K", date: "2023-06-22", category: "Backend", level: "Intermediate" },
      { title: "Cloud Deployment Strategies", duration: "1h 30min", views: "9.8K", date: "2023-05-10", category: "DevOps", level: "Advanced" }
    ],
    employeeId: "TM2023001",
    since: 2018,
    cardVariant: "tech",
    social: {
      linkedin: "https://linkedin.com/in/kanishsj",
      github: "https://github.com/kanishsj",
      twitter: "https://twitter.com/kanishsj"
    },
    languages: ["English", "Hindi", "Tamil"],
    certifications: ["AWS Certified Solutions Architect", "Google Cloud Professional"],
    specialties: ["Full-Stack Development", "Cloud Architecture", "System Design"],
    upcomingEvents: [
      { title: "React Conference 2023", date: "2023-08-20", type: "Conference" },
      { title: "Cloud Architecture Workshop", date: "2023-09-15", type: "Workshop" }
    ],
    kpi: {
      engagement: 85,
      reach: 92,
      conversion: 78,
      retention: 88
    }
  },
  {
    id: "2",
    name: "Kamesh",
    role: "Senior Editor",
    department: "Content",
    email: "kamesh@tomoacademy.com",
    skills: ["Content Strategy", "Editing", "SEO", "Copywriting"],
    stats: {
      videos: 15,
      tasks: 98,
      rating: 4.8,
      students: 950,
      courses: 5,
      achievements: 12,
      followers: 2100,
      posts: 89,
      projects: 15
    },
    bio: "Kamesh is a senior editor with a keen eye for detail and a passion for creating engaging content. He ensures all educational materials meet the highest quality standards.",
    availability: "available",
    education: "MA in English Literature, Delhi University",
    experience: 7,
    location: "Delhi, India",
    availabilityHours: "Mon-Fri, 9AM-5PM IST",
    contributions: ["Content Strategy", "Quality Assurance", "Editorial Guidelines"],
    content: [
      { title: "Effective Content Editing", duration: "45 min", views: "8.2K", date: "2023-07-08", category: "Editing", level: "Intermediate" },
      { title: "SEO Best Practices", duration: "1h 10min", views: "11.5K", date: "2023-06-15", category: "Marketing", level: "Beginner" },
      { title: "Writing for Digital Platforms", duration: "55 min", views: "9.7K", date: "2023-05-22", category: "Content", level: "Beginner" }
    ],
    employeeId: "TM2023002",
    since: 2019,
    cardVariant: "content",
    social: {
      linkedin: "https://linkedin.com/in/kamesh",
      twitter: "https://twitter.com/kamesh"
    },
    languages: ["English", "Hindi", "Telugu"],
    certifications: ["Google Analytics Certified", "HubSpot Content Marketing"],
    specialties: ["Content Strategy", "Editorial Management", "SEO Optimization"],
    upcomingEvents: [
      { title: "Content Strategy Summit", date: "2023-08-25", type: "Summit" }
    ],
    isEditor: true,
    kpi: {
      engagement: 90,
      reach: 85,
      conversion: 82,
      retention: 92
    }
  },
  {
    id: "3",
    name: "Ajay Krithick",
    role: "Social Media Manager",
    department: "Marketing",
    email: "ajay.krithick@tomoacademy.com",
    skills: ["Social Media Strategy", "Content Creation", "Community Management", "Analytics"],
    stats: {
      videos: 22,
      tasks: 134,
      rating: 4.7,
      students: 1200,
      courses: 6,
      achievements: 14,
      followers: 8500,
      posts: 267,
      projects: 18
    },
    bio: "Ajay specializes in creating viral social media campaigns and building engaged communities across multiple platforms. He brings creativity and data-driven insights to every campaign.",
    availability: "available",
    education: "MBA in Marketing, IIM Ahmedabad",
    experience: 6,
    location: "Mumbai, India",
    availabilityHours: "Mon-Fri, 10AM-7PM IST",
    contributions: ["Social Media Strategy", "Brand Awareness", "Community Building"],
    content: [
      { title: "Instagram Growth Hacks", duration: "50 min", views: "22.4K", date: "2023-07-12", category: "Social Media", level: "Intermediate" },
      { title: "Creating Viral Content", duration: "1h 5min", views: "18.9K", date: "2023-06-18", category: "Content", level: "Beginner" },
      { title: "Social Media Analytics", duration: "45 min", views: "12.7K", date: "2023-05-28", category: "Analytics", level: "Intermediate" }
    ],
    employeeId: "TM2023003",
    since: 2020,
    cardVariant: "social",
    social: {
      linkedin: "https://linkedin.com/in/ajaykrithick",
      instagram: "https://instagram.com/ajaykrithick",
      twitter: "https://twitter.com/ajaykrithick"
    },
    languages: ["English", "Hindi", "Tamil"],
    certifications: ["Facebook Blueprint Certified", "Twitter Flight School"],
    specialties: ["Social Media Strategy", "Community Management", "Content Creation"],
    upcomingEvents: [
      { title: "Social Media Marketing Conference", date: "2023-08-30", type: "Conference" }
    ],
    kpi: {
      engagement: 88,
      reach: 95,
      conversion: 75,
      retention: 85
    }
  },
  {
    id: "4",
    name: "Nithish",
    role: "Finance Manager",
    department: "Finance",
    email: "nithish@tomoacademy.com",
    skills: ["Financial Planning", "Budget Management", "Risk Assessment", "Financial Analysis"],
    stats: {
      videos: 12,
      tasks: 87,
      rating: 4.6,
      students: 650,
      courses: 4,
      achievements: 10,
      followers: 1200,
      posts: 45,
      projects: 12
    },
    bio: "Nithish is a finance professional with expertise in financial planning and analysis. He ensures the financial health and sustainability of the organization.",
    availability: "busy",
    education: "CA, Institute of Chartered Accountants of India",
    experience: 9,
    location: "Chennai, India",
    availabilityHours: "Mon-Fri, 9AM-6PM IST",
    contributions: ["Financial Planning", "Budget Management", "Risk Assessment"],
    content: [
      { title: "Financial Planning for Startups", duration: "1h 20min", views: "7.5K", date: "2023-07-05", category: "Finance", level: "Intermediate" },
      { title: "Budget Management Basics", duration: "55 min", views: "6.2K", date: "2023-06-12", category: "Finance", level: "Beginner" },
      { title: "Understanding Financial Statements", duration: "1h 10min", views: "8.9K", date: "2023-05-18", category: "Finance", level: "Intermediate" }
    ],
    employeeId: "TM2023004",
    since: 2017,
    cardVariant: "finance",
    social: {
      linkedin: "https://linkedin.com/in/nithish"
    },
    languages: ["English", "Tamil", "Hindi"],
    certifications: ["CFA Level 2", "Financial Risk Manager"],
    specialties: ["Financial Planning", "Budget Management", "Risk Assessment"],
    upcomingEvents: [
      { title: "Finance Leadership Summit", date: "2023-09-10", type: "Summit" }
    ],
    kpi: {
      engagement: 75,
      reach: 70,
      conversion: 85,
      retention: 90
    }
  },
  {
    id: "5",
    name: "Haridharuson L.J",
    role: "Content Verifier",
    department: "Content",
    email: "haridharuson@tomoacademy.com",
    skills: ["Content Review", "Quality Assurance", "Fact-Checking", "Editorial Standards"],
    stats: {
      videos: 8,
      tasks: 112,
      rating: 4.8,
      students: 420,
      courses: 3,
      achievements: 8,
      followers: 800,
      posts: 32,
      projects: 10
    },
    bio: "Haridharuson ensures all content meets the highest quality standards through meticulous review and fact-checking. He maintains editorial integrity across all platforms.",
    availability: "available",
    education: "MA in Journalism, Madras University",
    experience: 5,
    location: "Chennai, India",
    availabilityHours: "Mon-Fri, 10AM-6PM IST",
    contributions: ["Content Verification", "Quality Assurance", "Editorial Standards"],
    content: [
      { title: "Fact-Checking Best Practices", duration: "40 min", views: "5.2K", date: "2023-07-10", category: "Content", level: "Beginner" },
      { title: "Maintaining Editorial Standards", duration: "50 min", views: "4.8K", date: "2023-06-15", category: "Editing", level: "Intermediate" },
      { title: "Content Quality Assessment", duration: "45 min", views: "3.9K", date: "2023-05-20", category: "Content", level: "Beginner" }
    ],
    employeeId: "TM2023005",
    since: 2021,
    cardVariant: "content",
    social: {
      linkedin: "https://linkedin.com/in/haridharuson"
    },
    languages: ["English", "Tamil"],
    certifications: ["AP Stylebook Certified", "Poynter News University"],
    specialties: ["Content Verification", "Quality Assurance", "Fact-Checking"],
    upcomingEvents: [
      { title: "Editorial Standards Workshop", date: "2023-08-18", type: "Workshop" }
    ],
    kpi: {
      engagement: 82,
      reach: 75,
      conversion: 80,
      retention: 95
    }
  },
  {
    id: "6",
    name: "Aditya Chaurasiya",
    role: "Senior Editor",
    department: "Content",
    email: "aditya.chaurasiya@tomoacademy.com",
    skills: ["Content Editing", "Editorial Strategy", "Copywriting", "Content Management"],
    stats: {
      videos: 18,
      tasks: 125,
      rating: 4.9,
      students: 1100,
      courses: 6,
      achievements: 15,
      followers: 2800,
      posts: 112,
      projects: 18
    },
    bio: "Aditya is a senior editor with a passion for creating compelling content that educates and inspires. He brings a strategic approach to content development and editorial management.",
    availability: "mentoring",
    education: "MA in Mass Communication, Jamia Millia Islamia",
    experience: 8,
    location: "New Delhi, India",
    availabilityHours: "Mon-Fri, 9AM-5PM IST",
    contributions: ["Editorial Strategy", "Content Development", "Mentorship Program"],
    content: [
      { title: "Advanced Editing Techniques", duration: "1h 15min", views: "10.5K", date: "2023-07-08", category: "Editing", level: "Advanced" },
      { title: "Content Strategy for Educators", duration: "55 min", views: "8.7K", date: "2023-06-14", category: "Content", level: "Intermediate" },
      { title: "Effective Copywriting", duration: "50 min", views: "9.2K", date: "2023-05-25", category: "Writing", level: "Beginner" }
    ],
    employeeId: "TM2023006",
    since: 2018,
    cardVariant: "content",
    social: {
      linkedin: "https://linkedin.com/in/adityachaurasiya",
      twitter: "https://twitter.com/adityachaurasiya"
    },
    languages: ["English", "Hindi"],
    certifications: ["Google Content Marketing Certified", "Copyblogger Certified"],
    specialties: ["Content Editing", "Editorial Strategy", "Copywriting"],
    upcomingEvents: [
      { title: "Content Marketing Summit", date: "2023-09-05", type: "Summit" }
    ],
    isEditor: true,
    kpi: {
      engagement: 92,
      reach: 88,
      conversion: 85,
      retention: 90
    }
  },
  {
    id: "7",
    name: "Dev",
    role: "Facebook Manager",
    department: "Marketing",
    email: "dev@tomoacademy.com",
    skills: ["Facebook Marketing", "Social Media Ads", "Community Management", "Analytics"],
    stats: {
      videos: 14,
      tasks: 98,
      rating: 4.7,
      students: 890,
      courses: 4,
      achievements: 11,
      followers: 5200,
      posts: 178,
      projects: 14
    },
    bio: "Dev specializes in Facebook marketing and community building. He creates engaging campaigns that drive engagement and conversions on the platform.",
    availability: "available",
    education: "BBA in Marketing, Mumbai University",
    experience: 5,
    location: "Mumbai, India",
    availabilityHours: "Mon-Fri, 10AM-7PM IST",
    contributions: ["Facebook Strategy", "Ad Campaigns", "Community Building"],
    content: [
      { title: "Facebook Ads Mastery", duration: "1h 10min", views: "15.3K", date: "2023-07-12", category: "Social Media", level: "Intermediate" },
      { title: "Building Facebook Communities", duration: "55 min", views: "11.8K", date: "2023-06-18", category: "Community", level: "Beginner" },
      { title: "Facebook Analytics Deep Dive", duration: "45 min", views: "8.9K", date: "2023-05-24", category: "Analytics", level: "Intermediate" }
    ],
    employeeId: "TM2023007",
    since: 2020,
    cardVariant: "social",
    social: {
      linkedin: "https://linkedin.com/in/dev",
      facebook: "https://facebook.com/dev"
    },
    languages: ["English", "Hindi", "Marathi"],
    certifications: ["Facebook Certified Marketing Professional", "Facebook Certified Community Manager"],
    specialties: ["Facebook Marketing", "Social Media Ads", "Community Management"],
    upcomingEvents: [
      { title: "Facebook Marketing Workshop", date: "2023-08-22", type: "Workshop" }
    ],
    kpi: {
      engagement: 85,
      reach: 90,
      conversion: 80,
      retention: 82
    }
  },
  {
    id: "8",
    name: "Nithyasri",
    role: "Instagram Manager",
    department: "Marketing",
    email: "nithyasri@tomoacademy.com",
    skills: ["Instagram Marketing", "Visual Content", "Influencer Collaboration", "Storytelling"],
    stats: {
      videos: 20,
      tasks: 118,
      rating: 4.8,
      students: 1350,
      courses: 5,
      achievements: 13,
      followers: 12000,
      posts: 245,
      projects: 16
    },
    bio: "Nithyasri is an Instagram expert with a talent for creating visually stunning content and building engaged communities. She leverages the platform's features to maximize reach and engagement.",
    availability: "available",
    education: "B.Des in Visual Communication, NIFT Delhi",
    experience: 4,
    location: "Bangalore, India",
    availabilityHours: "Mon-Fri, 10AM-7PM IST",
    contributions: ["Instagram Strategy", "Visual Content", "Influencer Partnerships"],
    content: [
      { title: "Instagram Reels Strategy", duration: "50 min", views: "22.7K", date: "2023-07-15", category: "Social Media", level: "Intermediate" },
      { title: "Visual Storytelling on Instagram", duration: "1h 5min", views: "18.4K", date: "2023-06-20", category: "Content", level: "Beginner" },
      { title: "Influencer Marketing on Instagram", duration: "55 min", views: "14.9K", date: "2023-05-28", category: "Marketing", level: "Intermediate" }
    ],
    employeeId: "TM2023008",
    since: 2021,
    cardVariant: "social",
    social: {
      linkedin: "https://linkedin.com/in/nithyasri",
      instagram: "https://instagram.com/nithyasri"
    },
    languages: ["English", "Hindi", "Tamil", "Kannada"],
    certifications: ["Instagram Marketing Certified", "Visual Design Professional"],
    specialties: ["Instagram Marketing", "Visual Content", "Influencer Collaboration"],
    upcomingEvents: [
      { title: "Instagram Marketing Summit", date: "2023-09-12", type: "Summit" }
    ],
    kpi: {
      engagement: 92,
      reach: 95,
      conversion: 78,
      retention: 88
    }
  },
  {
    id: "9",
    name: "Raaj Nikitaa",
    role: "Marketing Lead",
    department: "Marketing",
    email: "raaj.nikitaa@tomoacademy.com",
    skills: ["Marketing Strategy", "Brand Management", "Campaign Management", "Market Research"],
    stats: {
      videos: 16,
      tasks: 142,
      rating: 4.9,
      students: 1600,
      courses: 7,
      achievements: 16,
      followers: 6800,
      posts: 198,
      projects: 22
    },
    bio: "Raaj Nikitaa leads the marketing department with a strategic approach to brand building and campaign management. She combines creativity with data-driven insights to achieve marketing objectives.",
    availability: "mentoring",
    education: "MBA in Marketing, XLRI Jamshedpur",
    experience: 10,
    location: "Mumbai, India",
    availabilityHours: "Mon-Fri, 9AM-6PM IST",
    contributions: ["Marketing Strategy", "Brand Development", "Team Leadership"],
    content: [
      { title: "Strategic Marketing Planning", duration: "1h 20min", views: "14.5K", date: "2023-07-10", category: "Marketing", level: "Advanced" },
      { title: "Building Strong Brands", duration: "55 min", views: "12.3K", date: "2023-06-16", category: "Branding", level: "Intermediate" },
      { title: "Effective Campaign Management", duration: "1h 10min", views: "10.8K", date: "2023-05-22", category: "Marketing", level: "Intermediate" }
    ],
    employeeId: "TM2023009",
    since: 2016,
    cardVariant: "marketing",
    social: {
      linkedin: "https://linkedin.com/in/raajnikitaa",
      twitter: "https://twitter.com/raajnikitaa"
    },
    languages: ["English", "Hindi", "Tamil"],
    certifications: ["Digital Marketing Certified", "Brand Management Professional"],
    specialties: ["Marketing Strategy", "Brand Management", "Campaign Management"],
    upcomingEvents: [
      { title: "Marketing Leadership Conference", date: "2023-08-28", type: "Conference" }
    ],
    kpi: {
      engagement: 88,
      reach: 92,
      conversion: 85,
      retention: 90
    }
  },
  {
    id: "10",
    name: "Indhumathi",
    role: "Content Verifier",
    department: "Content",
    email: "indhumathi@tomoacademy.com",
    skills: ["Content Review", "Quality Assurance", "Editorial Standards", "Research"],
    stats: {
      videos: 10,
      tasks: 96,
      rating: 4.7,
      students: 580,
      courses: 3,
      achievements: 9,
      followers: 950,
      posts: 38,
      projects: 11
    },
    bio: "Indhumathi ensures content accuracy and quality through thorough research and fact-checking. She maintains high editorial standards across all educational materials.",
    availability: "available",
    education: "MA in English Literature, Chennai University",
    experience: 6,
    location: "Chennai, India",
    availabilityHours: "Mon-Fri, 10AM-6PM IST",
    contributions: ["Content Verification", "Research", "Quality Assurance"],
    content: [
      { title: "Research Methodologies for Content", duration: "50 min", views: "6.3K", date: "2023-07-08", category: "Research", level: "Intermediate" },
      { title: "Quality Assurance in Content Creation", duration: "45 min", views: "5.1K", date: "2023-06-14", category: "Content", level: "Beginner" },
      { title: "Editorial Standards and Guidelines", duration: "55 min", views: "4.8K", date: "2023-05-20", category: "Editing", level: "Intermediate" }
    ],
    employeeId: "TM2023010",
    since: 2020,
    cardVariant: "content",
    social: {
      linkedin: "https://linkedin.com/in/indhumathi"
    },
    languages: ["English", "Tamil"],
    certifications: ["Content Quality Certified", "Research Methodology Professional"],
    specialties: ["Content Verification", "Quality Assurance", "Research"],
    upcomingEvents: [
      { title: "Content Quality Workshop", date: "2023-08-25", type: "Workshop" }
    ],
    kpi: {
      engagement: 80,
      reach: 75,
      conversion: 82,
      retention: 92
    }
  },
  {
    id: "11",
    name: "Kavyashree",
    role: "Senior Editor",
    department: "Content",
    email: "kavyashree@tomoacademy.com",
    skills: ["Content Editing", "Editorial Strategy", "Creative Writing", "Content Management"],
    stats: {
      videos: 22,
      tasks: 138,
      rating: 4.9,
      students: 1450,
      courses: 7,
      achievements: 17,
      followers: 3200,
      posts: 156,
      projects: 20
    },
    bio: "Kavyashree is a senior editor with a creative flair for storytelling and a strategic approach to content development. She ensures all content is engaging, informative, and meets the highest quality standards.",
    availability: "available",
    education: "MA in Creative Writing, Bangalore University",
    experience: 7,
    location: "Bangalore, India",
    availabilityHours: "Mon-Fri, 9AM-5PM IST",
    contributions: ["Editorial Strategy", "Creative Content", "Quality Assurance"],
    content: [
      { title: "Creative Writing Techniques", duration: "1h 15min", views: "12.8K", date: "2023-07-12", category: "Writing", level: "Intermediate" },
      { title: "Editorial Strategy for Digital Content", duration: "55 min", views: "10.5K", date: "2023-06-18", category: "Content", level: "Advanced" },
      { title: "Content Management Systems", duration: "50 min", views: "8.7K", date: "2023-05-25", category: "Technology", level: "Beginner" }
    ],
    employeeId: "TM2023011",
    since: 2019,
    cardVariant: "content",
    social: {
      linkedin: "https://linkedin.com/in/kavyashree",
      twitter: "https://twitter.com/kavyashree"
    },
    languages: ["English", "Hindi", "Kannada", "Tamil"],
    certifications: ["Advanced Content Marketing", "Creative Writing Professional"],
    specialties: ["Content Editing", "Editorial Strategy", "Creative Writing"],
    upcomingEvents: [
      { title: "Creative Writing Workshop", date: "2023-08-30", type: "Workshop" }
    ],
    isEditor: true,
    kpi: {
      engagement: 90,
      reach: 87,
      conversion: 85,
      retention: 92
    }
  },
  {
    id: "12",
    name: "Keerthana",
    role: "Finance Analyst",
    department: "Finance",
    email: "keerthana@tomoacademy.com",
    skills: ["Financial Analysis", "Budget Planning", "Forecasting", "Risk Management"],
    stats: {
      videos: 11,
      tasks: 89,
      rating: 4.6,
      students: 520,
      courses: 3,
      achievements: 8,
      followers: 1100,
      posts: 42,
      projects: 10
    },
    bio: "Keerthana specializes in financial analysis and forecasting. She provides valuable insights that drive financial decision-making and ensure fiscal responsibility.",
    availability: "available",
    education: "B.Com in Finance, Mumbai University",
    experience: 4,
    location: "Mumbai, India",
    availabilityHours: "Mon-Fri, 9AM-6PM IST",
    contributions: ["Financial Analysis", "Budget Planning", "Risk Assessment"],
    content: [
      { title: "Financial Forecasting Methods", duration: "1h 10min", views: "5.8K", date: "2023-07-05", category: "Finance", level: "Intermediate" },
      { title: "Budget Planning for Organizations", duration: "55 min", views: "4.9K", date: "2023-06-12", category: "Finance", level: "Beginner" },
      { title: "Risk Management Strategies", duration: "50 min", views: "4.2K", date: "2023-05-18", category: "Finance", level: "Intermediate" }
    ],
    employeeId: "TM2023012",
    since: 2021,
    cardVariant: "finance",
    social: {
      linkedin: "https://linkedin.com/in/keerthana"
    },
    languages: ["English", "Hindi", "Tamil"],
    certifications: ["Financial Modeling & Valuation Analyst", "Risk Management Certified"],
    specialties: ["Financial Analysis", "Budget Planning", "Forecasting"],
    upcomingEvents: [
      { title: "Finance Analysis Workshop", date: "2023-09-08", type: "Workshop" }
    ],
    kpi: {
      engagement: 75,
      reach: 70,
      conversion: 85,
      retention: 88
    }
  },
  {
    id: "13",
    name: "Monika",
    role: "Senior Editor",
    department: "Content",
    email: "monika@tomoacademy.com",
    skills: ["Content Editing", "Editorial Management", "Copywriting", "Content Strategy"],
    stats: {
      videos: 19,
      tasks: 128,
      rating: 4.8,
      students: 1200,
      courses: 6,
      achievements: 14,
      followers: 2600,
      posts: 134,
      projects: 17
    },
    bio: "Monika is a senior editor with expertise in content strategy and editorial management. She ensures all content is engaging, accurate, and aligned with educational objectives.",
    availability: "mentoring",
    education: "MA in Journalism, Delhi University",
    experience: 8,
    location: "New Delhi, India",
    availabilityHours: "Mon-Fri, 9AM-5PM IST",
    contributions: ["Editorial Management", "Content Strategy", "Mentorship"],
    content: [
      { title: "Editorial Management Best Practices", duration: "1h 5min", views: "9.7K", date: "2023-07-10", category: "Editing", level: "Advanced" },
      { title: "Content Strategy for Educational Platforms", duration: "55 min", views: "8.3K", date: "2023-06-16", category: "Content", level: "Intermediate" },
      { title: "Effective Copywriting for Education", duration: "50 min", views: "7.9K", date: "2023-05-22", category: "Writing", level: "Beginner" }
    ],
    employeeId: "TM2023013",
    since: 2018,
    cardVariant: "content",
    social: {
      linkedin: "https://linkedin.com/in/monika",
      twitter: "https://twitter.com/monika"
    },
    languages: ["English", "Hindi"],
    certifications: ["Advanced Editorial Management", "Content Strategy Professional"],
    specialties: ["Content Editing", "Editorial Management", "Copywriting"],
    upcomingEvents: [
      { title: "Editorial Leadership Summit", date: "2023-09-15", type: "Summit" }
    ],
    isEditor: true,
    kpi: {
      engagement: 88,
      reach: 85,
      conversion: 82,
      retention: 90
    }
  },
  {
    id: "14",
    name: "Prawin Krishnan",
    role: "Marketing Specialist",
    department: "Marketing",
    email: "prawin.krishnan@tomoacademy.com",
    skills: ["Digital Marketing", "SEO", "Content Marketing", "Analytics"],
    stats: {
      videos: 17,
      tasks: 115,
      rating: 4.7,
      students: 980,
      courses: 5,
      achievements: 12,
      followers: 4200,
      posts: 167,
      projects: 15
    },
    bio: "Prawin Krishnan is a marketing specialist with expertise in digital marketing strategies and analytics. He creates data-driven campaigns that increase brand visibility and engagement.",
    availability: "available",
    education: "BBA in Marketing, Chennai University",
    experience: 5,
    location: "Chennai, India",
    availabilityHours: "Mon-Fri, 10AM-7PM IST",
    contributions: ["Digital Marketing", "SEO Strategy", "Content Campaigns"],
    content: [
      { title: "Advanced SEO Techniques", duration: "1h 15min", views: "13.6K", date: "2023-07-08", category: "SEO", level: "Intermediate" },
      { title: "Content Marketing Funnel", duration: "55 min", views: "11.2K", date: "2023-06-14", category: "Marketing", level: "Beginner" },
      { title: "Marketing Analytics Deep Dive", duration: "1h 5min", views: "9.8K", date: "2023-05-20", category: "Analytics", level: "Advanced" }
    ],
    employeeId: "TM2023014",
    since: 2020,
    cardVariant: "marketing",
    social: {
      linkedin: "https://linkedin.com/in/prawinkrishnan",
      twitter: "https://twitter.com/prawinkrishnan"
    },
    languages: ["English", "Tamil"],
    certifications: ["Google Ads Certified", "HubSpot Inbound Marketing"],
    specialties: ["Digital Marketing", "SEO", "Content Marketing"],
    upcomingEvents: [
      { title: "Digital Marketing Conference", date: "2023-08-25", type: "Conference" }
    ],
    kpi: {
      engagement: 85,
      reach: 88,
      conversion: 80,
      retention: 85
    }
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
  const [activeTab, setActiveTab] = useState<"about" | "content" | "contact" | "idcard" | "achievements" | "kpi">("about");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error" | "info">("info");
  const [submittingContact, setSubmittingContact] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
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

  // Filter and sort team members
  const filteredMembers = teamMembers
    .filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = roleFilter === "All Roles" || member.role === roleFilter;
      const matchesDepartment = departmentFilter === "All Departments" || member.department === departmentFilter;
      const matchesAvailability = availabilityFilter === "All" || member.availability === availabilityFilter;
      
      return matchesSearch && matchesRole && matchesDepartment && matchesAvailability;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
          return b.stats.rating - a.stats.rating;
        case "students":
          return b.stats.students - a.stats.students;
        case "experience":
          return (b.experience || 0) - (a.experience || 0);
        case "followers":
          return b.stats.followers - a.stats.followers;
        default:
          return 0;
      }
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
    
    // Set canvas size - smaller and more compact
    canvas.width = 600;
    canvas.height = 380;
    
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
      case 'design':
        gradient.addColorStop(0, '#ec4899');
        gradient.addColorStop(1, '#f472b6');
        break;
      case 'marketing':
        gradient.addColorStop(0, '#f59e0b');
        gradient.addColorStop(1, '#fbbf24');
        break;
      case 'social':
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#60a5fa');
        break;
      case 'finance':
        gradient.addColorStop(0, '#10b981');
        gradient.addColorStop(1, '#34d399');
        break;
      case 'content':
        gradient.addColorStop(0, '#8b5cf6');
        gradient.addColorStop(1, '#a78bfa');
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
    ctx.arc(500, 80, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(100, 300, 40, 0, Math.PI * 2);
    ctx.fill();
    
    // Add Tomo Academy logo style element
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(550, 320, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(540, 310, 20, 20);
    
    // Add text content
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.fillText('TOMO ACADEMY', 30, 40);
    ctx.font = '14px Arial';
    ctx.fillText('EDUCATION ELEVATED', 30, 60);
    
    ctx.font = 'bold 22px Arial';
    ctx.fillText(selectedMember.name, 30, 110);
    ctx.font = '16px Arial';
    ctx.fillText(selectedMember.role, 30, 135);
    
    ctx.font = '12px Arial';
    ctx.fillText(`ID: ${selectedMember.employeeId || selectedMember.id}`, 30, 165);
    ctx.fillText(`Department: ${selectedMember.department}`, 30, 185);
    ctx.fillText(`Since: ${selectedMember.since || 2020}`, 30, 205);
    
    // Add rating stars
    ctx.fillStyle = '#fbbf24';
    const rating = Math.floor(selectedMember.stats.rating);
    for (let i = 0; i < rating; i++) {
      ctx.fillText('★', 30 + i * 15, 230);
    }
    
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

  // Copy email to clipboard
  const copyEmail = (email: string, memberId: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(memberId);
    showNotification("Email copied to clipboard!", "success");
    setTimeout(() => setCopiedId(null), 2000);
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
        return "bg-green-100 text-green-800 border-green-200";
      case "mentoring":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "busy":
        return "bg-red-100 text-red-800 border-red-200";
      case "offline":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get availability text
  const getAvailabilityText = (availability?: string) => {
    switch (availability) {
      case "available":
        return "Available";
      case "mentoring":
        return "Mentoring";
      case "busy":
        return "Busy";
      case "offline":
        return "Offline";
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
      case "design":
        return "from-pink-600 to-pink-400";
      case "marketing":
        return "from-amber-600 to-amber-400";
      case "social":
        return "from-blue-600 to-blue-400";
      case "finance":
        return "from-green-600 to-green-400";
      case "content":
        return "from-purple-600 to-purple-400";
      default:
        return "from-indigo-700 to-purple-600";
    }
  };

  // Get department icon
  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "Technology":
        return <Code className="h-4 w-4" />;
      case "Content":
        return <FileText className="h-4 w-4" />;
      case "Marketing":
        return <Megaphone className="h-4 w-4" />;
      case "Finance":
        return <DollarSign className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    if (role.includes("Editor")) return <Edit className="h-4 w-4" />;
    if (role.includes("Facebook")) return <Facebook className="h-4 w-4" />;
    if (role.includes("Instagram")) return <Instagram className="h-4 w-4" />;
    if (role.includes("Marketing")) return <TrendingUp className="h-4 w-4" />;
    if (role.includes("Finance")) return <DollarSign className="h-4 w-4" />;
    if (role.includes("Content")) return <FileCheck className="h-4 w-4" />;
    if (role.includes("Developer")) return <Code className="h-4 w-4" />;
    if (role.includes("Lead")) return <Users className="h-4 w-4" />;
    return <User className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500 mx-auto"></div>
            <div className="absolute top-0 left-0 animate-ping rounded-full h-16 w-16 border-4 border-pink-300 mx-auto opacity-20"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading team members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4 text-xl font-medium">Error loading team members</div>
          <Button onClick={() => window.location.reload()} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-slate-50 to-blue-50'}`}>
      {/* Premium Header with Tomo Academy Branding */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white/80'} backdrop-blur-md shadow-sm sticky top-0 z-40 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>TOMO ACADEMY</h1>
                <p className="text-xs text-gray-500">EDUCATION ELEVATED</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-pink-400' : 'text-gray-700 hover:text-pink-600'} font-medium transition-colors flex items-center`}>
                <Home className="h-4 w-4 mr-1" />
                Home
              </a>
              <a href="#" className="text-pink-600 font-medium flex items-center">
                <Users2 className="h-4 w-4 mr-1" />
                Team
              </a>
              <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-pink-400' : 'text-gray-700 hover:text-pink-600'} font-medium transition-colors flex items-center`}>
                <BookOpen className="h-4 w-4 mr-1" />
                Courses
              </a>
              <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-pink-400' : 'text-gray-700 hover:text-pink-600'} font-medium transition-colors flex items-center`}>
                <BarChart3 className="h-4 w-4 mr-1" />
                Analytics
              </a>
              <a href="#" className={`${darkMode ? 'text-gray-300 hover:text-pink-400' : 'text-gray-700 hover:text-pink-600'} font-medium transition-colors flex items-center`}>
                <FileText className="h-4 w-4 mr-1" />
                Resources
              </a>
            </nav>
            
            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              
              {/* Advanced Stats Toggle */}
              <button
                className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}
                onClick={() => setShowAdvancedStats(!showAdvancedStats)}
              >
                <Activity className="h-5 w-5" />
              </button>
              
              {/* Notifications */}
              <div className="relative">
                <button
                  className={`p-2 rounded-full ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
                </button>
                
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border overflow-hidden z-50`}>
                    <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className={`p-4 ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} border-b cursor-pointer`}>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>New course available</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Advanced Machine Learning by Kanish SJ</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className={`p-4 ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'} border-b cursor-pointer`}>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Team member available</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Kamesh is now available for mentoring</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>5 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className={`p-4 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} cursor-pointer`}>
                        <div className="flex items-start">
                          <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 mr-3"></div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming event</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>Content Strategy Summit on August 25</p>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                      <a href="#" className="text-sm text-pink-600 font-medium hover:text-pink-700">View all notifications</a>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Profile Menu */}
              <div className="relative">
                <button
                  className={`flex items-center space-x-2 p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    JD
                  </div>
                  <ChevronDown className={`h-4 w-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                </button>
                
                {showProfileMenu && (
                  <div className={`absolute right-0 mt-2 w-56 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border overflow-hidden z-50`}>
                    <div className={`p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                      <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>John Doe</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>john.doe@example.com</p>
                    </div>
                    <div className="py-1">
                      <a href="#" className={`flex items-center px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <User className="h-4 w-4 mr-3 text-gray-400" />
                        Profile
                      </a>
                      <a href="#" className={`flex items-center px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <Settings className="h-4 w-4 mr-3 text-gray-400" />
                        Settings
                      </a>
                      <a href="#" className={`flex items-center px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <HelpCircle className="h-4 w-4 mr-3 text-gray-400" />
                        Help
                      </a>
                      <a href="#" className={`flex items-center px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                        <LogOut className="h-4 w-4 mr-3 text-gray-400" />
                        Sign out
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${
          toastType === "success" ? "bg-green-500 text-white" :
          toastType === "error" ? "bg-red-500 text-white" :
          "bg-blue-500 text-white"
        }`}>
          <div className="flex items-center">
            {toastType === "success" && <CheckCircle className="h-5 w-5 mr-2" />}
            {toastType === "error" && <X className="h-5 w-5 mr-2" />}
            {toastType === "info" && <div className="h-5 w-5 mr-2 rounded-full bg-white/30 flex items-center justify-center text-xs">i</div>}
            {toastMessage}
          </div>
        </div>
      )}
      
      {/* Hero Section with Tomo Academy Branding */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Meet Our Exceptional Team</h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">Discover the talented individuals who are elevating education at Tomo Academy</p>
            
            <div className="mt-8 flex justify-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold">{teamMembers.length}+</div>
                <div className="text-sm opacity-80">Expert Team Members</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold">{teamMembers.reduce((acc, member) => acc + member.stats.students, 0).toLocaleString()}+</div>
                <div className="text-sm opacity-80">Students Enrolled</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold">{teamMembers.reduce((acc, member) => acc + member.stats.courses, 0)}+</div>
                <div className="text-sm opacity-80">Premium Courses</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
                <div className="text-2xl font-bold">{teamMembers.filter(member => member.isEditor).length}</div>
                <div className="text-sm opacity-80">Senior Editors</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filter Section */}
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white/80'} backdrop-blur-md shadow-sm sticky top-16 z-30 ${darkMode ? 'border-gray-700' : 'border-gray-100'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'} h-5 w-5`} />
              <input
                type="text"
                placeholder="Search by name, role, department, or skills..."
                className={`w-full pl-10 pr-4 py-3 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                className={`appearance-none ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="students">Sort by Students</option>
                <option value="experience">Sort by Experience</option>
                <option value="followers">Sort by Followers</option>
              </select>
              <ChevronDown className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-400'} h-4 w-4 pointer-events-none`} />
            </div>
            
            {/* Filter Toggle Button */}
            <Button
              variant="outline"
              className={`flex items-center gap-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters && <X className="h-4 w-4" />}
            </Button>
            
            {/* View Mode Toggle */}
            <div className={`flex ${darkMode ? 'border-gray-600' : 'border-gray-300'} border rounded-lg overflow-hidden`}>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-none ${viewMode === "grid" ? "bg-pink-500 text-white" : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-none ${viewMode === "list" ? "bg-pink-500 text-white" : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Role</label>
                <select
                  className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Department</label>
                <select
                  className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  {uniqueDepartments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Availability</label>
                <select
                  className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="available">Available</option>
                  <option value="mentoring">Mentoring</option>
                  <option value="busy">Busy</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Team Members Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} text-lg`}>No team members found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("All Roles");
                setDepartmentFilter("All Departments");
                setAvailabilityFilter("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {filteredMembers.map(member => (
              <Card key={member.id} className={`overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-0'} shadow-md`}>
                <div className="relative">
                  {/* Card Header with Gradient */}
                  <div className={`h-32 bg-gradient-to-r ${getIdCardVariant(member.cardVariant)} relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
                    
                    {/* Tomo Academy Logo Style Element */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-5 h-5 bg-white/40 rounded-sm"></div>
                    </div>
                    
                    {/* Department Icon */}
                    <div className="absolute bottom-4 left-4 text-white/80">
                      {getDepartmentIcon(member.department)}
                    </div>
                    
                    {/* Editor Badge */}
                    {member.isEditor && (
                      <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium flex items-center">
                        <Edit className="h-3 w-3 mr-1" />
                        Editor
                      </div>
                    )}
                  </div>
                  
                  {/* Profile Image */}
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                    <div className={`w-20 h-20 rounded-full border-4 ${darkMode ? 'border-gray-800' : 'border-white'} shadow-lg flex items-center justify-center text-white font-bold text-xl bg-gradient-to-br ${getIdCardVariant(member.cardVariant)}`}>
                      {getInitials(member.name)}
                    </div>
                  </div>
                </div>
                
                <div className={`pt-12 pb-6 px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="text-center mb-4">
                    <h3 className={`font-bold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>{member.name}</h3>
                    <div className="flex items-center justify-center mt-1">
                      {getRoleIcon(member.role)}
                      <p className={`ml-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{member.role}</p>
                    </div>
                    <div className="flex items-center justify-center mt-1">
                      <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                      <p className="text-xs text-gray-500">{member.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityBadge(member.availability)}`}>
                      {getAvailabilityText(member.availability)}
                    </Badge>
                  </div>
                  
                  {/* Advanced Stats Toggle */}
                  {showAdvancedStats && (
                    <div className="mb-4 grid grid-cols-2 gap-2">
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="text-lg font-bold text-pink-600">{member.stats.followers.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Followers</div>
                      </div>
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="text-lg font-bold text-blue-600">{member.stats.posts}</div>
                        <div className="text-xs text-gray-500">Posts</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{member.stats.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{member.stats.students.toLocaleString()} students</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{member.stats.courses} courses</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{member.stats.achievements} awards</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm line-clamp-2`}>{member.bio}</p>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {member.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className={`text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          {skill}
                        </Badge>
                      ))}
                      {member.skills.length > 3 && (
                        <Badge variant="outline" className={`text-xs ${darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'}`}>
                          +{member.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700"
                      onClick={() => setSelectedMember(member)}
                    >
                      View Profile
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`border-gray-300 text-gray-600 hover:bg-gray-50 ${darkMode ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : ''}`}
                      onClick={() => copyEmail(member.email, member.id)}
                    >
                      {copiedId === member.id ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Mail className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl`}>
            {/* Modal Header */}
            <div className={`relative h-32 bg-gradient-to-r ${getIdCardVariant(selectedMember.cardVariant)}`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
              
              {/* Tomo Academy Logo Style Element */}
              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-white/40 rounded-sm"></div>
              </div>
              
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm font-medium">
                  {selectedMember.department}
                </div>
                <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityBadge(selectedMember.availability)}`}>
                  {getAvailabilityText(selectedMember.availability)}
                </Badge>
                {selectedMember.isEditor && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium flex items-center">
                    <Edit className="h-3 w-3 mr-1" />
                    Editor
                  </div>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-16 text-white hover:bg-white/20"
                onClick={() => setSelectedMember(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Profile Section */}
            <div className={`relative px-6 pb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex flex-col md:flex-row gap-6 -mt-12">
                <div className={`w-24 h-24 rounded-full border-4 ${darkMode ? 'border-gray-800' : 'border-white'} shadow-lg flex items-center justify-center text-white font-bold text-2xl bg-gradient-to-br ${getIdCardVariant(selectedMember.cardVariant)}`}>
                  {getInitials(selectedMember.name)}
                </div>
                <div className="flex-1 pt-2">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{selectedMember.name}</h2>
                  <div className="flex items-center mt-1">
                    {getRoleIcon(selectedMember.role)}
                    <p className={`ml-1 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedMember.role}</p>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedMember.location}
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    {selectedMember.availabilityHours}
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-center gap-2">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-1" />
                    <span className="font-bold text-lg">{selectedMember.stats.rating}</span>
                    <span className="text-gray-500 ml-1">({selectedMember.stats.videos} reviews)</span>
                  </div>
                  <div className="flex gap-2">
                    {selectedMember.social?.linkedin && (
                      <a href={selectedMember.social.linkedin} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {selectedMember.social?.twitter && (
                      <a href={selectedMember.social.twitter} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        <Twitter className="h-4 w-4" />
                      </a>
                    )}
                    {selectedMember.social?.github && (
                      <a href={selectedMember.social.github} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {selectedMember.social?.instagram && (
                      <a href={selectedMember.social.instagram} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        <Instagram className="h-4 w-4" />
                      </a>
                    )}
                    {selectedMember.social?.facebook && (
                      <a href={selectedMember.social.facebook} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        <Facebook className="h-4 w-4" />
                      </a>
                    )}
                    {selectedMember.social?.website && (
                      <a href={selectedMember.social.website} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 text-center">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-300">{selectedMember.stats.students.toLocaleString()}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-400">Students</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 text-center">
                  <BookOpen className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900 dark:text-green-300">{selectedMember.stats.courses}</div>
                  <div className="text-sm text-green-700 dark:text-green-400">Courses</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 text-center">
                  <Video className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900 dark:text-purple-300">{selectedMember.stats.videos}</div>
                  <div className="text-sm text-purple-700 dark:text-purple-400">Videos</div>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-lg p-4 text-center">
                  <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-300">{selectedMember.stats.achievements}</div>
                  <div className="text-sm text-amber-700 dark:text-amber-400">Achievements</div>
                </div>
              </div>
              
              {/* Social Stats */}
              {showAdvancedStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-lg p-4 text-center">
                    <Users className="h-8 w-8 text-pink-600 dark:text-pink-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-pink-900 dark:text-pink-300">{selectedMember.stats.followers.toLocaleString()}</div>
                    <div className="text-sm text-pink-700 dark:text-pink-400">Followers</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 rounded-lg p-4 text-center">
                    <MessageSquare className="h-8 w-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-300">{selectedMember.stats.posts}</div>
                    <div className="text-sm text-indigo-700 dark:text-indigo-400">Posts</div>
                  </div>
                  <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/20 dark:to-teal-800/20 rounded-lg p-4 text-center">
                    <Target className="h-8 w-8 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-teal-900 dark:text-teal-300">{selectedMember.stats.projects}</div>
                    <div className="text-sm text-teal-700 dark:text-teal-400">Projects</div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 text-center">
                    <Activity className="h-8 w-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-300">{selectedMember.stats.tasks}</div>
                    <div className="text-sm text-orange-700 dark:text-orange-400">Tasks</div>
                  </div>
                </div>
              )}
              
              {/* Tabs */}
              <div className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-6 mb-6`}>
                <div className="flex space-x-8 overflow-x-auto">
                  <button
                    className={`pb-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === "about"
                        ? "border-pink-500 text-pink-600"
                        : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                    }`}
                    onClick={() => setActiveTab("about")}
                  >
                    About
                  </button>
                  <button
                    className={`pb-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === "content"
                        ? "border-pink-500 text-pink-600"
                        : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                    }`}
                    onClick={() => setActiveTab("content")}
                  >
                    Content
                  </button>
                  <button
                    className={`pb-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === "achievements"
                        ? "border-pink-500 text-pink-600"
                        : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                    }`}
                    onClick={() => setActiveTab("achievements")}
                  >
                    Achievements
                  </button>
                  {selectedMember.kpi && (
                    <button
                      className={`pb-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                        activeTab === "kpi"
                          ? "border-pink-500 text-pink-600"
                          : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                      }`}
                      onClick={() => setActiveTab("kpi")}
                    >
                      KPI
                    </button>
                  )}
                  <button
                    className={`pb-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === "contact"
                        ? "border-pink-500 text-pink-600"
                        : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                    }`}
                    onClick={() => setActiveTab("contact")}
                  >
                    Contact
                  </button>
                  <button
                    className={`pb-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeTab === "idcard"
                        ? "border-pink-500 text-pink-600"
                        : `border-transparent ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
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
                    <h4 className={`font-semibold text-lg mb-2 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <User className="h-5 w-5 mr-2 text-pink-500" />
                      Biography
                    </h4>
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedMember.bio}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className={`font-semibold text-lg mb-2 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <GraduationCap className="h-5 w-5 mr-2 text-pink-500" />
                        Education
                      </h4>
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedMember.education}</p>
                    </div>
                    
                    <div>
                      <h4 className={`font-semibold text-lg mb-2 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Briefcase className="h-5 w-5 mr-2 text-pink-500" />
                        Experience
                      </h4>
                      <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedMember.experience} years</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={`font-semibold text-lg mb-2 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Zap className="h-5 w-5 mr-2 text-pink-500" />
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className={darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={`font-semibold text-lg mb-2 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Target className="h-5 w-5 mr-2 text-pink-500" />
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.specialties?.map((specialty, index) => (
                        <Badge key={index} className="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={`font-semibold text-lg mb-2 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Award className="h-5 w-5 mr-2 text-pink-500" />
                      Contributions
                    </h4>
                    <ul className={`list-disc list-inside ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
                      {selectedMember.contributions?.map((contribution, index) => (
                        <li key={index}>{contribution}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className={`font-semibold text-lg mb-2 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <MessageSquare className="h-5 w-5 mr-2 text-pink-500" />
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMember.languages?.map((language, index) => (
                        <Badge key={index} variant="outline" className={darkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-700'}>
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className={`font-semibold text-lg mb-2 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <CheckCircle className="h-5 w-5 mr-2 text-pink-500" />
                      Certifications
                    </h4>
                    <ul className={`list-disc list-inside ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
                      {selectedMember.certifications?.map((certification, index) => (
                        <li key={index}>{certification}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTab === "content" && (
                <div className="space-y-4">
                  <h4 className={`font-semibold text-lg mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Video className="h-5 w-5 mr-2 text-pink-500" />
                    Recent Content
                  </h4>
                  {selectedMember.content?.map((item, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}>
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className={`w-full md:w-32 h-20 ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-br from-gray-100 to-gray-200'} rounded-lg flex items-center justify-center`}>
                          <PlayCircle className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h5 className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h5>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {item.duration}
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              {item.views} views
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(item.date)}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                              {item.level}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="self-start">
                          <PlayCircle className="h-4 w-4 mr-1" />
                          Watch
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {activeTab === "achievements" && (
                <div className="space-y-4">
                  <h4 className={`font-semibold text-lg mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Trophy className="h-5 w-5 mr-2 text-pink-500" />
                    Achievements & Awards
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700 bg-gradient-to-br from-amber-900/20 to-amber-800/20' : 'border-gray-200 bg-gradient-to-br from-amber-50 to-amber-100'}`}>
                      <div className="flex items-center mb-2">
                        <Trophy className="h-8 w-8 text-amber-600 dark:text-amber-400 mr-3" />
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Excellence in Teaching</h5>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Awarded for outstanding teaching performance and student feedback.</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>2023</p>
                    </div>
                    <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700 bg-gradient-to-br from-blue-900/20 to-blue-800/20' : 'border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100'}`}>
                      <div className="flex items-center mb-2">
                        <Award className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Research Innovation</h5>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Recognized for groundbreaking research in the field.</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>2022</p>
                    </div>
                    <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700 bg-gradient-to-br from-green-900/20 to-green-800/20' : 'border-gray-200 bg-gradient-to-br from-green-50 to-green-100'}`}>
                      <div className="flex items-center mb-2">
                        <Target className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Mentor of the Year</h5>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Honored for exceptional mentorship and guidance to students.</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>2021</p>
                    </div>
                    <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700 bg-gradient-to-br from-purple-900/20 to-purple-800/20' : 'border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100'}`}>
                      <div className="flex items-center mb-2">
                        <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Innovation Award</h5>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Recognized for innovative approaches to education.</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>2020</p>
                    </div>
                  </div>
                  
                  <h4 className={`font-semibold text-lg mt-6 mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Calendar className="h-5 w-5 mr-2 text-pink-500" />
                    Upcoming Events
                  </h4>
                  <div className="space-y-3">
                    {selectedMember.upcomingEvents?.map((event, index) => (
                      <div key={index} className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
                        <div>
                          <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</h5>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(event.date)}
                            <span className="mx-2">•</span>
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Register
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === "kpi" && selectedMember.kpi && (
                <div className="space-y-4">
                  <h4 className={`font-semibold text-lg mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Activity className="h-5 w-5 mr-2 text-pink-500" />
                    Key Performance Indicators
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Engagement Rate</h5>
                        <span className="text-2xl font-bold text-pink-600">{selectedMember.kpi.engagement}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-pink-600 h-2.5 rounded-full" style={{ width: `${selectedMember.kpi.engagement}%` }}></div>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>Above average engagement with audience</p>
                    </div>
                    
                    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Reach</h5>
                        <span className="text-2xl font-bold text-blue-600">{selectedMember.kpi.reach}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${selectedMember.kpi.reach}%` }}></div>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>Excellent reach across platforms</p>
                    </div>
                    
                    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Conversion Rate</h5>
                        <span className="text-2xl font-bold text-green-600">{selectedMember.kpi.conversion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${selectedMember.kpi.conversion}%` }}></div>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>Strong conversion performance</p>
                    </div>
                    
                    <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h5 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Retention Rate</h5>
                        <span className="text-2xl font-bold text-purple-600">{selectedMember.kpi.retention}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${selectedMember.kpi.retention}%` }}></div>
                      </div>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2`}>Outstanding audience retention</p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "contact" && (
                <div>
                  <h4 className={`font-semibold text-lg mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Mail className="h-5 w-5 mr-2 text-pink-500" />
                    Send a Message
                  </h4>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Your Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                        />
                      </div>
                      <div>
                        <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Your Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Subject</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>Message</label>
                      <textarea
                        name="message"
                        rows={5}
                        required
                        className={`w-full px-3 py-2 ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                      ></textarea>
                    </div>
                    <Button type="submit" disabled={submittingContact} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700">
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
                    <h4 className={`font-semibold text-lg flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      <Award className="h-5 w-5 mr-2 text-pink-500" />
                      Premium ID Card
                    </h4>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={downloadIdCard} className={`border-gray-300 text-gray-600 hover:bg-gray-50 ${darkMode ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : ''}`}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="outline" onClick={shareIdCard} className={`border-gray-300 text-gray-600 hover:bg-gray-50 ${darkMode ? 'border-gray-600 text-gray-400 hover:bg-gray-700' : ''}`}>
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                  
                  <div ref={idCardRef} className={`bg-gradient-to-br ${getIdCardVariant(selectedMember.cardVariant)} rounded-xl p-6 text-white relative overflow-hidden shadow-2xl`}>
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
                    
                    {/* Tomo Academy Logo Style Element */}
                    <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="w-7 h-7 bg-white/40 rounded-sm"></div>
                    </div>
                    
                    {/* Card Content */}
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="text-2xl font-bold mb-1">TOMO ACADEMY</h3>
                          <p className="text-sm opacity-80">EDUCATION ELEVATED</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-70">VALID THRU</p>
                          <p className="text-lg font-semibold">12/25</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-6 mb-6">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl bg-white/20 backdrop-blur-sm`}>
                          {getInitials(selectedMember.name)}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold mb-1">{selectedMember.name}</h4>
                          <p className="text-base opacity-90 mb-2">{selectedMember.role}</p>
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
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm">{selectedMember.stats.rating}</span>
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
