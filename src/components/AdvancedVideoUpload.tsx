import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Upload, 
  Video, 
  Image as ImageIcon, 
  Tag, 
  Globe, 
  Eye, 
  EyeOff, 
  X, 
  Plus,
  FileVideo,
  Users,
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Edit,
  Play,
  Zap,
  Target,
  Star,
  Briefcase,
  Camera
} from "lucide-react";
import { allEmployees, Employee, roleGroups } from "@/data/employeesComplete";
import { format } from "date-fns";

interface TeamMember {
  employee: Employee;
  role: 'creator' | 'editor' | 'reviewer' | 'thumbnail_designer' | 'content_strategist';
  isLead?: boolean;
  estimatedHours?: number;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

interface VideoProject {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  privacy: 'public' | 'unlisted' | 'private';
  thumbnail?: File;
  videoFile?: File;
  
  // Team Assignment
  teamMembers: TeamMember[];
  projectLead: Employee;
  
  // Timeline
  deadline: Date;
  estimatedDuration: string; // e.g., "15:30"
  targetReleaseDate: Date;
  
  // Production Stages
  stages: {
    scriptWriting: { assigned: Employee[]; status: 'pending' | 'in_progress' | 'completed'; progress: number; };
    recording: { assigned: Employee[]; status: 'pending' | 'in_progress' | 'completed'; progress: number; };
    editing: { assigned: Employee[]; status: 'pending' | 'in_progress' | 'completed'; progress: number; };
    thumbnailDesign: { assigned: Employee[]; status: 'pending' | 'in_progress' | 'completed'; progress: number; };
    review: { assigned: Employee[]; status: 'pending' | 'in_progress' | 'completed'; progress: number; };
    publishing: { assigned: Employee[]; status: 'pending' | 'in_progress' | 'completed'; progress: number; };
  };
  
  // Content Strategy
  targetAudience: string[];
  expectedViews: number;
  seoKeywords: string[];
  competitorAnalysis?: string;
  
  // Progress Tracking
  overallProgress: number;
  currentStage: keyof VideoProject['stages'];
  status: 'planning' | 'in_production' | 'post_production' | 'ready' | 'published' | 'cancelled';
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: Employee;
}

interface AdvancedVideoUploadProps {
  onVideoUploaded?: (video: VideoProject) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AdvancedVideoUpload = ({ onVideoUploaded, isOpen, onOpenChange }: AdvancedVideoUploadProps) => {
  const [currentTab, setCurrentTab] = useState("basic");
  const [videoProject, setVideoProject] = useState<Partial<VideoProject>>({
    title: "",
    description: "",
    category: "",
    tags: [],
    privacy: "public",
    teamMembers: [],
    stages: {
      scriptWriting: { assigned: [], status: 'pending', progress: 0 },
      recording: { assigned: [], status: 'pending', progress: 0 },
      editing: { assigned: [], status: 'pending', progress: 0 },
      thumbnailDesign: { assigned: [], status: 'pending', progress: 0 },
      review: { assigned: [], status: 'pending', progress: 0 },
      publishing: { assigned: [], status: 'pending', progress: 0 }
    },
    targetAudience: [],
    seoKeywords: [],
    expectedViews: 10000,
    overallProgress: 0,
    currentStage: 'scriptWriting',
    status: 'planning'
  });

  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const categories = [
    "Programming Tutorials", "Web Development", "Mobile Development", "Data Science",
    "Machine Learning", "DevOps", "System Design", "Career Guidance",
    "Tech Reviews", "Project Builds", "Live Coding", "Interview Prep"
  ];

  const audiences = [
    "Beginners", "Intermediate", "Advanced", "Students", "Professionals",
    "Career Changers", "Freelancers", "Startup Founders", "Tech Enthusiasts"
  ];

  // Get available team members by role
  const getAvailableMembers = (role: string) => {
    switch (role) {
      case 'editor':
        return roleGroups["Video Editors"];
      case 'creator':
        return allEmployees.filter(emp => emp.department === "Content Strategy" || emp.department === "Technology");
      case 'designer':
        return roleGroups["Designers"];
      case 'reviewer':
        return roleGroups["QA Team"];
      default:
        return allEmployees;
    }
  };

  const addTeamMember = (employee: Employee, role: TeamMember['role']) => {
    const exists = videoProject.teamMembers?.some(tm => tm.employee.id === employee.id);
    if (!exists) {
      setVideoProject(prev => ({
        ...prev,
        teamMembers: [
          ...(prev.teamMembers || []),
          {
            employee,
            role,
            estimatedHours: role === 'editor' ? 8 : role === 'creator' ? 4 : 2,
            priority: 'medium'
          }
        ]
      }));
    }
  };

  const removeTeamMember = (employeeId: string) => {
    setVideoProject(prev => ({
      ...prev,
      teamMembers: prev.teamMembers?.filter(tm => tm.employee.id !== employeeId) || []
    }));
  };

  const assignToStage = (stage: keyof VideoProject['stages'], employee: Employee) => {
    setVideoProject(prev => ({
      ...prev,
      stages: {
        ...prev.stages!,
        [stage]: {
          ...prev.stages![stage],
          assigned: [...(prev.stages![stage].assigned || []), employee]
        }
      }
    }));
  };

  const calculateOverallProgress = () => {
    if (!videoProject.stages) return 0;
    const stages = Object.values(videoProject.stages);
    const totalProgress = stages.reduce((sum, stage) => sum + stage.progress, 0);
    return Math.round(totalProgress / stages.length);
  };

  const addTag = () => {
    if (newTag.trim() && !videoProject.tags?.includes(newTag.trim())) {
      setVideoProject(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !videoProject.seoKeywords?.includes(newKeyword.trim())) {
      setVideoProject(prev => ({
        ...prev,
        seoKeywords: [...(prev.seoKeywords || []), newKeyword.trim()]
      }));
      setNewKeyword("");
    }
  };

  const handleCreateProject = async () => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      const completeProject: VideoProject = {
        ...videoProject as VideoProject,
        id: `project_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: allEmployees[0], // Current user
        deadline: selectedDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        targetReleaseDate: selectedDate || new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        overallProgress: calculateOverallProgress()
      };

      await new Promise(resolve => setTimeout(resolve, 2000));
      setUploadProgress(100);

      // Store project
      const existingProjects = JSON.parse(localStorage.getItem('video_projects') || '[]');
      const updatedProjects = [completeProject, ...existingProjects];
      localStorage.setItem('video_projects', JSON.stringify(updatedProjects));

      onVideoUploaded?.(completeProject);
      onOpenChange?.(false);

    } catch (error) {
      console.error('Project creation failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'creator': return <Camera className="w-4 h-4" />;
      case 'editor': return <Edit className="w-4 h-4" />;
      case 'reviewer': return <CheckCircle className="w-4 h-4" />;
      case 'thumbnail_designer': return <ImageIcon className="w-4 h-4" />;
      case 'content_strategist': return <Target className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getStageStatus = (stage: keyof VideoProject['stages']) => {
    const stageData = videoProject.stages?.[stage];
    if (!stageData) return 'pending';
    
    if (stageData.progress === 100) return 'completed';
    if (stageData.progress > 0) return 'in_progress';
    return 'pending';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Create Video Project - Advanced Production Pipeline
          </DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="team">Team Assignment</TabsTrigger>
            <TabsTrigger value="workflow">Production Workflow</TabsTrigger>
            <TabsTrigger value="strategy">Content Strategy</TabsTrigger>
            <TabsTrigger value="review">Review & Launch</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Video Title*</Label>
                  <Input
                    id="title"
                    value={videoProject.title}
                    onChange={(e) => setVideoProject(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter compelling video title..."
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {(videoProject.title?.length || 0)}/100 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={videoProject.description}
                    onChange={(e) => setVideoProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Detailed video description..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Category</Label>
                    <Select value={videoProject.category} onValueChange={(value) => setVideoProject(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Privacy</Label>
                    <Select value={videoProject.privacy} onValueChange={(value: any) => setVideoProject(prev => ({ ...prev, privacy: value }))}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value="unlisted">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Unlisted
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <EyeOff className="w-4 h-4" />
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {videoProject.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-destructive" 
                          onClick={() => setVideoProject(prev => ({
                            ...prev,
                            tags: prev.tags?.filter(t => t !== tag) || []
                          }))}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Estimated Duration</Label>
                  <Input
                    value={videoProject.estimatedDuration}
                    onChange={(e) => setVideoProject(prev => ({ ...prev, estimatedDuration: e.target.value }))}
                    placeholder="15:30 (mm:ss)"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Card className="p-4">
                  <Label className="text-sm font-medium">Timeline</Label>
                  <div className="space-y-3 mt-3">
                    <div>
                      <Label className="text-xs">Target Release Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Expected Views</Label>
                      <Input
                        type="number"
                        value={videoProject.expectedViews}
                        onChange={(e) => setVideoProject(prev => ({ ...prev, expectedViews: parseInt(e.target.value) || 0 }))}
                        placeholder="10000"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <Label className="text-sm font-medium mb-3 block">Target Audience</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {audiences.map(audience => (
                      <div key={audience} className="flex items-center space-x-2">
                        <Checkbox
                          id={audience}
                          checked={videoProject.targetAudience?.includes(audience)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setVideoProject(prev => ({
                                ...prev,
                                targetAudience: [...(prev.targetAudience || []), audience]
                              }));
                            } else {
                              setVideoProject(prev => ({
                                ...prev,
                                targetAudience: prev.targetAudience?.filter(a => a !== audience) || []
                              }));
                            }
                          }}
                        />
                        <Label htmlFor={audience} className="text-sm">{audience}</Label>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Team Assignment Tab */}
          <TabsContent value="team" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="p-4">
                  <CardHeader className="p-0 pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Team Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-4">
                      {/* Video Editors */}
                      <div>
                        <Label className="text-sm font-medium">Video Editors</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {getAvailableMembers('editor').map(editor => (
                            <Button
                              key={editor.id}
                              variant="outline"
                              size="sm"
                              onClick={() => addTeamMember(editor, 'editor')}
                              className="justify-start h-auto p-2"
                            >
                              <Avatar className="w-6 h-6 mr-2">
                                <AvatarImage src={editor.avatar} />
                                <AvatarFallback>{editor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className="text-left">
                                <p className="text-xs font-medium">{editor.name}</p>
                                <p className="text-xs text-muted-foreground">{editor.stats.videos} videos</p>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Content Creators */}
                      <div>
                        <Label className="text-sm font-medium">Content Creators</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {getAvailableMembers('creator').slice(0, 4).map(creator => (
                            <Button
                              key={creator.id}
                              variant="outline"
                              size="sm"
                              onClick={() => addTeamMember(creator, 'creator')}
                              className="justify-start h-auto p-2"
                            >
                              <Avatar className="w-6 h-6 mr-2">
                                <AvatarImage src={creator.avatar} />
                                <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className="text-left">
                                <p className="text-xs font-medium">{creator.name}</p>
                                <p className="text-xs text-muted-foreground">{creator.role}</p>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Designers */}
                      <div>
                        <Label className="text-sm font-medium">Thumbnail Designers</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {getAvailableMembers('designer').map(designer => (
                            <Button
                              key={designer.id}
                              variant="outline"
                              size="sm"
                              onClick={() => addTeamMember(designer, 'thumbnail_designer')}
                              className="justify-start h-auto p-2"
                            >
                              <Avatar className="w-6 h-6 mr-2">
                                <AvatarImage src={designer.avatar} />
                                <AvatarFallback>{designer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div className="text-left">
                                <p className="text-xs font-medium">{designer.name}</p>
                                <p className="text-xs text-muted-foreground">{designer.department}</p>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="p-4">
                  <CardHeader className="p-0 pb-3">
                    <CardTitle className="text-lg">Assigned Team Members</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-3">
                      {videoProject.teamMembers?.map(teamMember => (
                        <div key={teamMember.employee.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={teamMember.employee.avatar} />
                              <AvatarFallback>
                                {teamMember.employee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{teamMember.employee.name}</p>
                              <div className="flex items-center gap-2">
                                {getRoleIcon(teamMember.role)}
                                <span className="text-xs text-muted-foreground capitalize">
                                  {teamMember.role.replace('_', ' ')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {teamMember.estimatedHours}h
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTeamMember(teamMember.employee.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}

                      {(!videoProject.teamMembers || videoProject.teamMembers.length === 0) && (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="w-12 w-12 mx-auto mb-4 opacity-50" />
                          <p>No team members assigned yet</p>
                          <p className="text-sm">Add team members from the left panel</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Production Workflow Tab */}
          <TabsContent value="workflow" className="space-y-6">
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Production Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-4">
                  {Object.entries(videoProject.stages || {}).map(([stageName, stageData]) => (
                    <div key={stageName} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            stageData.status === 'completed' ? 'bg-green-500' :
                            stageData.status === 'in_progress' ? 'bg-yellow-500' : 'bg-gray-300'
                          }`} />
                          <h3 className="font-medium capitalize">{stageName.replace(/([A-Z])/g, ' $1').trim()}</h3>
                        </div>
                        <Badge variant={stageData.status === 'completed' ? 'default' : 'secondary'}>
                          {stageData.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <Progress value={stageData.progress} className="mb-3" />
                      
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {stageData.assigned.map(member => (
                            <Avatar key={member.id} className="w-6 h-6 border-2 border-background">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback className="text-xs">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{stageData.progress}% complete</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Strategy Tab */}
          <TabsContent value="strategy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="p-4">
                  <CardHeader className="p-0 pb-3">
                    <CardTitle className="text-lg">SEO Keywords</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex gap-2 mb-3">
                      <Input
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="Add SEO keyword..."
                        onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                      />
                      <Button type="button" onClick={addKeyword} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {videoProject.seoKeywords?.map(keyword => (
                        <Badge key={keyword} variant="outline" className="gap-1">
                          {keyword}
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-destructive" 
                            onClick={() => setVideoProject(prev => ({
                              ...prev,
                              seoKeywords: prev.seoKeywords?.filter(k => k !== keyword) || []
                            }))}
                          />
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4">
                  <CardHeader className="p-0 pb-3">
                    <CardTitle className="text-lg">Competitor Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Textarea
                      value={videoProject.competitorAnalysis}
                      onChange={(e) => setVideoProject(prev => ({ ...prev, competitorAnalysis: e.target.value }))}
                      placeholder="Analyze similar videos from competitors..."
                      className="min-h-[100px]"
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="p-4">
                  <CardHeader className="p-0 pb-3">
                    <CardTitle className="text-lg">Performance Targets</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 space-y-3">
                    <div>
                      <Label className="text-sm">Expected Views</Label>
                      <Input
                        type="number"
                        value={videoProject.expectedViews}
                        onChange={(e) => setVideoProject(prev => ({ ...prev, expectedViews: parseInt(e.target.value) || 0 }))}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm">Target CTR</Label>
                        <Input placeholder="8%" className="mt-1" />
                      </div>
                      <div>
                        <Label className="text-sm">Target Retention</Label>
                        <Input placeholder="65%" className="mt-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-4">
                  <CardHeader className="p-0 pb-3">
                    <CardTitle className="text-lg">Target Audience</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="flex flex-wrap gap-2">
                      {videoProject.targetAudience?.map(audience => (
                        <Badge key={audience} variant="secondary">
                          {audience}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Review & Launch Tab */}
          <TabsContent value="review" className="space-y-6">
            <Card className="p-6">
              <CardHeader className="p-0 pb-4">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Project Review & Launch
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-6">
                  {/* Project Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-3">Project Details</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Title:</strong> {videoProject.title || "Not set"}</div>
                        <div><strong>Category:</strong> {videoProject.category || "Not set"}</div>
                        <div><strong>Privacy:</strong> {videoProject.privacy}</div>
                        <div><strong>Tags:</strong> {videoProject.tags?.length || 0} tags</div>
                        <div><strong>Expected Views:</strong> {videoProject.expectedViews?.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Team & Timeline</h3>
                      <div className="space-y-2 text-sm">
                        <div><strong>Team Members:</strong> {videoProject.teamMembers?.length || 0}</div>
                        <div><strong>Release Date:</strong> {selectedDate ? format(selectedDate, "PPP") : "Not set"}</div>
                        <div><strong>Duration:</strong> {videoProject.estimatedDuration || "Not set"}</div>
                        <div><strong>Target Audience:</strong> {videoProject.targetAudience?.length || 0} groups</div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Overview */}
                  <div>
                    <h3 className="font-medium mb-3">Overall Progress</h3>
                    <Progress value={calculateOverallProgress()} className="mb-2" />
                    <p className="text-sm text-muted-foreground">{calculateOverallProgress()}% complete</p>
                  </div>

                  {/* Upload Progress */}
                  {isUploading && (
                    <div>
                      <h3 className="font-medium mb-3">Creating Project...</h3>
                      <Progress value={uploadProgress} className="mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {uploadProgress < 100 ? `Setting up project... ${Math.round(uploadProgress)}%` : 'Finalizing...'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            {currentTab !== "review" && (
              <Button 
                variant="outline"
                onClick={() => {
                  const tabs = ["basic", "team", "workflow", "strategy", "review"];
                  const currentIndex = tabs.indexOf(currentTab);
                  if (currentIndex < tabs.length - 1) {
                    setCurrentTab(tabs[currentIndex + 1]);
                  }
                }}
              >
                Next
              </Button>
            )}
            {currentTab === "review" && (
              <Button 
                onClick={handleCreateProject} 
                disabled={!videoProject.title?.trim() || isUploading}
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    Create Project
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};