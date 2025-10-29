import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar,
  Clock,
  Users,
  Video,
  BarChart3,
  TrendingUp,
  Target,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  Edit,
  Eye,
  Upload,
  MessageSquare,
  Star,
  Award,
  Zap,
  Brain,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import { allEmployees } from '@/data/employeesComplete';
import { format, isAfter, isBefore, addDays, differenceInDays } from 'date-fns';

interface ProjectProgress {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'recording' | 'editing' | 'review' | 'approved' | 'published';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  assignedTo: {
    contentCreator: string;
    videoEditor: string;
    reviewer: string;
  };
  schedule: {
    recordingDate?: Date;
    editingDeadline?: Date;
    publishDate?: Date;
  };
  metrics: {
    estimatedViews: number;
    actualViews?: number;
    engagement?: number;
    completionTime?: number;
  };
  milestones: Array<{
    id: string;
    title: string;
    completed: boolean;
    completedAt?: Date;
    assignee: string;
  }>;
  collaboration: {
    comments: number;
    revisions: number;
    approvals: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const realProjects: ProjectProgress[] = [
  {
    id: 'proj-001',
    title: 'React Hooks Masterclass 2025',
    description: 'Complete guide to React Hooks including useState, useEffect, custom hooks, and advanced patterns',
    category: 'Tutorial',
    status: 'editing',
    priority: 'high',
    progress: 75,
    assignedTo: {
      contentCreator: 'kanish-sj',
      videoEditor: 'kamesh',
      reviewer: 'ajay-krithick'
    },
    schedule: {
      recordingDate: new Date('2025-10-25'),
      editingDeadline: new Date('2025-11-05'),
      publishDate: new Date('2025-11-10')
    },
    metrics: {
      estimatedViews: 85000,
      completionTime: 10
    },
    milestones: [
      { id: 'm1', title: 'Script Writing', completed: true, completedAt: new Date('2025-10-20'), assignee: 'kanish-sj' },
      { id: 'm2', title: 'Recording', completed: true, completedAt: new Date('2025-10-25'), assignee: 'kanish-sj' },
      { id: 'm3', title: 'Video Editing', completed: false, assignee: 'kamesh' },
      { id: 'm4', title: 'Review & Approval', completed: false, assignee: 'ajay-krithick' },
      { id: 'm5', title: 'Thumbnail Creation', completed: false, assignee: 'raaj-nikitaa' },
      { id: 'm6', title: 'Publishing', completed: false, assignee: 'kanish-sj' }
    ],
    collaboration: {
      comments: 8,
      revisions: 3,
      approvals: 1
    },
    createdAt: new Date('2025-10-20'),
    updatedAt: new Date('2025-10-29')
  },
  {
    id: 'proj-002',
    title: 'Node.js REST API Development',
    description: 'Build scalable REST APIs with Node.js, Express, MongoDB, and JWT authentication',
    category: 'Tutorial',
    status: 'review',
    priority: 'urgent',
    progress: 95,
    assignedTo: {
      contentCreator: 'dev',
      videoEditor: 'aditya-chaurasiya',
      reviewer: 'indhumathi'
    },
    schedule: {
      recordingDate: new Date('2025-10-20'),
      editingDeadline: new Date('2025-10-30'),
      publishDate: new Date('2025-11-08')
    },
    metrics: {
      estimatedViews: 120000,
      completionTime: 14
    },
    milestones: [
      { id: 'm1', title: 'Script Writing', completed: true, completedAt: new Date('2025-10-15'), assignee: 'dev' },
      { id: 'm2', title: 'Recording', completed: true, completedAt: new Date('2025-10-20'), assignee: 'dev' },
      { id: 'm3', title: 'Video Editing', completed: true, completedAt: new Date('2025-10-28'), assignee: 'aditya-chaurasiya' },
      { id: 'm4', title: 'Review & Approval', completed: false, assignee: 'indhumathi' },
      { id: 'm5', title: 'Thumbnail Creation', completed: true, completedAt: new Date('2025-10-28'), assignee: 'raaj-nikitaa' },
      { id: 'm6', title: 'Publishing', completed: false, assignee: 'kanish-sj' }
    ],
    collaboration: {
      comments: 12,
      revisions: 2,
      approvals: 2
    },
    createdAt: new Date('2025-10-15'),
    updatedAt: new Date('2025-10-29')
  },
  {
    id: 'proj-003',
    title: 'Top 15 AI Tools for Developers in 2025',
    description: 'Comprehensive review of the best AI tools for coding, debugging, and productivity enhancement',
    category: 'Review',
    status: 'recording',
    priority: 'medium',
    progress: 40,
    assignedTo: {
      contentCreator: 'nithish',
      videoEditor: 'kavyashree',
      reviewer: 'keerthana'
    },
    schedule: {
      recordingDate: new Date('2025-10-30'),
      editingDeadline: new Date('2025-11-12'),
      publishDate: new Date('2025-11-18')
    },
    metrics: {
      estimatedViews: 95000,
      completionTime: 8
    },
    milestones: [
      { id: 'm1', title: 'Research & Script', completed: true, completedAt: new Date('2025-10-28'), assignee: 'nithish' },
      { id: 'm2', title: 'Recording', completed: false, assignee: 'nithish' },
      { id: 'm3', title: 'Video Editing', completed: false, assignee: 'kavyashree' },
      { id: 'm4', title: 'Review & Approval', completed: false, assignee: 'keerthana' },
      { id: 'm5', title: 'Thumbnail Creation', completed: false, assignee: 'raaj-nikitaa' },
      { id: 'm6', title: 'Publishing', completed: false, assignee: 'nithyasri' }
    ],
    collaboration: {
      comments: 5,
      revisions: 1,
      approvals: 0
    },
    createdAt: new Date('2025-10-25'),
    updatedAt: new Date('2025-10-29')
  },
  {
    id: 'proj-004',
    title: 'MongoDB Aggregation Pipeline Deep Dive',
    description: 'Master MongoDB aggregation framework with real-world examples and performance optimization',
    category: 'Tutorial',
    status: 'draft',
    priority: 'medium',
    progress: 15,
    assignedTo: {
      contentCreator: 'kanish-sj',
      videoEditor: 'monika',
      reviewer: 'ajay-krithick'
    },
    schedule: {
      recordingDate: new Date('2025-11-05'),
      editingDeadline: new Date('2025-11-20'),
      publishDate: new Date('2025-11-25')
    },
    metrics: {
      estimatedViews: 70000,
      completionTime: 12
    },
    milestones: [
      { id: 'm1', title: 'Research & Planning', completed: true, completedAt: new Date('2025-10-29'), assignee: 'kanish-sj' },
      { id: 'm2', title: 'Script Writing', completed: false, assignee: 'kanish-sj' },
      { id: 'm3', title: 'Recording', completed: false, assignee: 'kanish-sj' },
      { id: 'm4', title: 'Video Editing', completed: false, assignee: 'monika' },
      { id: 'm5', title: 'Review & Approval', completed: false, assignee: 'ajay-krithick' },
      { id: 'm6', title: 'Publishing', completed: false, assignee: 'kanish-sj' }
    ],
    collaboration: {
      comments: 3,
      revisions: 0,
      approvals: 0
    },
    createdAt: new Date('2025-10-29'),
    updatedAt: new Date('2025-10-29')
  },
  {
    id: 'proj-005',
    title: 'Advanced TypeScript Patterns & Best Practices',
    description: 'Advanced TypeScript concepts including generics, decorators, conditional types, and utility types',
    category: 'Tutorial',
    status: 'published',
    priority: 'low',
    progress: 100,
    assignedTo: {
      contentCreator: 'dev',
      videoEditor: 'kamesh',
      reviewer: 'indhumathi'
    },
    schedule: {
      recordingDate: new Date('2025-10-05'),
      editingDeadline: new Date('2025-10-15'),
      publishDate: new Date('2025-10-22')
    },
    metrics: {
      estimatedViews: 65000,
      actualViews: 72500,
      engagement: 8.2,
      completionTime: 11
    },
    milestones: [
      { id: 'm1', title: 'Script Writing', completed: true, completedAt: new Date('2025-10-01'), assignee: 'dev' },
      { id: 'm2', title: 'Recording', completed: true, completedAt: new Date('2025-10-05'), assignee: 'dev' },
      { id: 'm3', title: 'Video Editing', completed: true, completedAt: new Date('2025-10-12'), assignee: 'kamesh' },
      { id: 'm4', title: 'Review & Approval', completed: true, completedAt: new Date('2025-10-18'), assignee: 'indhumathi' },
      { id: 'm5', title: 'Thumbnail Creation', completed: true, completedAt: new Date('2025-10-20'), assignee: 'raaj-nikitaa' },
      { id: 'm6', title: 'Publishing', completed: true, completedAt: new Date('2025-10-22'), assignee: 'nithyasri' }
    ],
    collaboration: {
      comments: 15,
      revisions: 4,
      approvals: 3
    },
    createdAt: new Date('2025-09-28'),
    updatedAt: new Date('2025-10-22')
  },
  {
    id: 'proj-003',
    title: 'AI Tools for Developers 2024',
    description: 'Complete guide to AI tools that boost developer productivity',
    category: 'Review',
    status: 'recording',
    priority: 'medium',
    progress: 35,
    assignedTo: {
      contentCreator: 'kanish-sj',
      videoEditor: 'kavyashree',
      reviewer: 'kanish-sj'
    },
    schedule: {
      recordingDate: new Date('2024-10-29'),
      editingDeadline: new Date('2024-11-08'),
      publishDate: new Date('2024-11-15')
    },
    metrics: {
      estimatedViews: 40000,
      completionTime: 6
    },
    milestones: [
      { id: 'm1', title: 'Script Writing', completed: true, completedAt: new Date('2024-10-25'), assignee: 'kanish-sj' },
      { id: 'm2', title: 'Recording', completed: false, assignee: 'kanish-sj' },
      { id: 'm3', title: 'Video Editing', completed: false, assignee: 'kavyashree' },
      { id: 'm4', title: 'Review & Approval', completed: false, assignee: 'kanish-sj' },
      { id: 'm5', title: 'Thumbnail Creation', completed: false, assignee: 'kavyashree' },
      { id: 'm6', title: 'Publishing', completed: false, assignee: 'kanish-sj' }
    ],
    collaboration: {
      comments: 4,
      revisions: 0,
      approvals: 0
    },
    createdAt: new Date('2024-10-22'),
    updatedAt: new Date('2024-10-28')
  }
];

export const ProgressTrackingDashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectProgress[]>(realProjects);
  const [filteredProjects, setFilteredProjects] = useState<ProjectProgress[]>(projects);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let filtered = projects;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(p => p.status === selectedStatus);
    }

    if (selectedPriority !== 'all') {
      filtered = filtered.filter(p => p.priority === selectedPriority);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  }, [projects, selectedStatus, selectedPriority, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'recording': return 'bg-blue-500';
      case 'editing': return 'bg-orange-500';
      case 'review': return 'bg-purple-500';
      case 'approved': return 'bg-green-500';
      case 'published': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getEmployee = (id: string) => allEmployees.find(emp => emp.id === id);

  const getOverallStats = () => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.status === 'published').length;
    const inProgressProjects = projects.filter(p => ['recording', 'editing', 'review'].includes(p.status)).length;
    const avgProgress = Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / totalProjects);
    const totalEstimatedViews = projects.reduce((sum, p) => sum + p.metrics.estimatedViews, 0);

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      avgProgress,
      totalEstimatedViews
    };
  };

  const stats = getOverallStats();

  const getUpcomingDeadlines = () => {
    const upcoming = projects
      .filter(p => p.schedule.editingDeadline || p.schedule.publishDate)
      .map(p => ({
        project: p,
        deadline: p.schedule.editingDeadline || p.schedule.publishDate,
        type: p.schedule.editingDeadline ? 'editing' : 'publish'
      }))
      .filter(item => item.deadline && isAfter(item.deadline, new Date()))
      .sort((a, b) => (a.deadline!.getTime() - b.deadline!.getTime()))
      .slice(0, 5);

    return upcoming;
  };

  const renderProjectCard = (project: ProjectProgress) => {
    const creator = getEmployee(project.assignedTo.contentCreator);
    const editor = getEmployee(project.assignedTo.videoEditor);
    const reviewer = getEmployee(project.assignedTo.reviewer);
    const completedMilestones = project.milestones.filter(m => m.completed).length;
    const totalMilestones = project.milestones.length;

    return (
      <Card key={project.id} className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {project.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Badge className={getPriorityColor(project.priority)}>
                {project.priority}
              </Badge>
              <Badge variant="outline">{project.category}</Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Status and Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(project.status)}`} />
                <span className="text-sm font-medium capitalize">{project.status}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {project.progress}% Complete
              </span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Milestones</span>
              <span className="text-sm text-muted-foreground">
                {completedMilestones}/{totalMilestones}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {project.milestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-2 text-xs">
                  {milestone.completed ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <Clock className="w-3 h-3 text-muted-foreground" />
                  )}
                  <span className={milestone.completed ? 'text-green-700' : 'text-muted-foreground'}>
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="space-y-2">
            <span className="text-sm font-medium">Team</span>
            <div className="flex items-center gap-2">
              {[
                { person: creator, role: 'Creator' },
                { person: editor, role: 'Editor' },
                { person: reviewer, role: 'Reviewer' }
              ].map(({ person, role }) => (
                <div key={role} className="flex items-center gap-1">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={person?.avatar} />
                    <AvatarFallback className="text-xs">
                      {person?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">{role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          {(project.schedule.editingDeadline || project.schedule.publishDate) && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {project.schedule.editingDeadline && (
                <div className="flex items-center gap-1">
                  <Edit className="w-3 h-3" />
                  <span>Edit by {format(project.schedule.editingDeadline, 'MMM dd')}</span>
                </div>
              )}
              {project.schedule.publishDate && (
                <div className="flex items-center gap-1">
                  <Upload className="w-3 h-3" />
                  <span>Publish {format(project.schedule.publishDate, 'MMM dd')}</span>
                </div>
              )}
            </div>
          )}

          {/* Collaboration Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{project.collaboration.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <RefreshCw className="w-3 h-3" />
              <span>{project.collaboration.revisions} revisions</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>{project.collaboration.approvals} approvals</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" className="flex-1 hidden sm:flex">
              <MessageSquare className="w-3 h-3 mr-1" />
              Comment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Progress Tracking Dashboard</h1>
          <p className="text-muted-foreground">Monitor video projects and team performance</p>
        </div>
        <Button>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold">{stats.totalProjects}</p>
              </div>
              <Video className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgressProjects}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedProjects}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{stats.avgProgress}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Est. Views</p>
                <p className="text-2xl font-bold">{(stats.totalEstimatedViews / 1000).toFixed(0)}K</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          <TabsTrigger value="team" className="hidden md:flex">Team</TabsTrigger>
          <TabsTrigger value="analytics" className="hidden md:flex">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border rounded px-3 py-1 flex-1 sm:w-64"
                  />
                </div>
                
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="recording">Recording</option>
                  <option value="editing">Editing</option>
                  <option value="review">Review</option>
                  <option value="approved">Approved</option>
                  <option value="published">Published</option>
                </select>

                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>

                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map(renderProjectCard)}
          </div>
        </TabsContent>

        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>Projects requiring attention in the next 14 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getUpcomingDeadlines().map(({ project, deadline, type }) => (
                  <div key={`${project.id}-${type}`} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{project.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {type === 'editing' ? 'Editing deadline' : 'Publish date'}: {format(deadline!, 'MMM dd, yyyy')}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getPriorityColor(project.priority)}>
                          {project.priority}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {differenceInDays(deadline!, new Date())} days remaining
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{project.progress}%</div>
                      <Progress value={project.progress} className="w-24 h-2 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Content Creators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Content Creators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allEmployees
                    .filter(emp => 
                      emp.role.toLowerCase().includes('content') || 
                      emp.role.toLowerCase().includes('creator') ||
                      emp.department === 'Content Strategy'
                    )
                    .map(creator => {
                      const assignedProjects = projects.filter(p => p.assignedTo.contentCreator === creator.id);
                      const completedProjects = assignedProjects.filter(p => p.status === 'published');
                      
                      return (
                        <div key={creator.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={creator.avatar} />
                              <AvatarFallback className="text-xs">
                                {creator.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{creator.name}</p>
                              <p className="text-xs text-muted-foreground">{creator.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{assignedProjects.length} projects</p>
                            <p className="text-xs text-muted-foreground">{completedProjects.length} completed</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Video Editors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Video Editors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allEmployees
                    .filter(emp => 
                      emp.role.toLowerCase().includes('editor') ||
                      emp.role.toLowerCase().includes('video')
                    )
                    .map(editor => {
                      const assignedProjects = projects.filter(p => p.assignedTo.videoEditor === editor.id);
                      const completedProjects = assignedProjects.filter(p => ['approved', 'published'].includes(p.status));
                      
                      return (
                        <div key={editor.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={editor.avatar} />
                              <AvatarFallback className="text-xs">
                                {editor.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{editor.name}</p>
                              <p className="text-xs text-muted-foreground">{editor.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{assignedProjects.length} projects</p>
                            <p className="text-xs text-muted-foreground">{completedProjects.length} completed</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>

            {/* Reviewers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Reviewers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allEmployees
                    .filter(emp => 
                      emp.role.toLowerCase().includes('lead') ||
                      emp.role.toLowerCase().includes('manager') ||
                      emp.role.toLowerCase().includes('senior')
                    )
                    .map(reviewer => {
                      const assignedProjects = projects.filter(p => p.assignedTo.reviewer === reviewer.id);
                      const completedReviews = assignedProjects.filter(p => ['approved', 'published'].includes(p.status));
                      
                      return (
                        <div key={reviewer.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={reviewer.avatar} />
                              <AvatarFallback className="text-xs">
                                {reviewer.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{reviewer.name}</p>
                              <p className="text-xs text-muted-foreground">{reviewer.role}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{assignedProjects.length} reviews</p>
                            <p className="text-xs text-muted-foreground">{completedReviews.length} completed</p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Project Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['draft', 'recording', 'editing', 'review', 'approved', 'published'].map(status => {
                    const count = projects.filter(p => p.status === status).length;
                    const percentage = Math.round((count / projects.length) * 100);
                    
                    return (
                      <div key={status} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{status}</span>
                          <span>{count} ({percentage}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Completion Time</span>
                    <span className="text-sm font-medium">
                      {Math.round(
                        projects
                          .filter(p => p.metrics.completionTime)
                          .reduce((sum, p) => sum + (p.metrics.completionTime || 0), 0) /
                        projects.filter(p => p.metrics.completionTime).length
                      )} days
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Estimated Views</span>
                    <span className="text-sm font-medium">
                      {(stats.totalEstimatedViews / 1000).toFixed(0)}K
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Revisions</span>
                    <span className="text-sm font-medium">
                      {(projects.reduce((sum, p) => sum + p.collaboration.revisions, 0) / projects.length).toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Team Collaboration Score</span>
                    <span className="text-sm font-medium">
                      {Math.round(
                        (projects.reduce((sum, p) => sum + p.collaboration.comments + p.collaboration.approvals, 0) / projects.length) * 10
                      )}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};