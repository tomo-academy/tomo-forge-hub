import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Upload, 
  Video, 
  FileText, 
  Users, 
  Calendar as CalendarIcon,
  Clock,
  Tag,
  Eye,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Check,
  X,
  AlertCircle,
  Sparkles,
  Brain,
  Target,
  MessageSquare,
  Hash,
  Thumbnail,
  BookOpen,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { allEmployees } from '@/data/employeesComplete';

interface VideoProject {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: File | null;
  videoFile: File | null;
  status: 'draft' | 'recording' | 'editing' | 'review' | 'approved' | 'published';
  priority: 'low' | 'medium' | 'high' | 'urgent';
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
  metadata: {
    duration?: string;
    tags: string[];
    targetAudience: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedViews: number;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    customThumbnail: boolean;
  };
  collaboration: {
    comments: Array<{
      id: string;
      author: string;
      message: string;
      timestamp: Date;
      type: 'feedback' | 'approval' | 'revision';
    }>;
    revisions: number;
    currentVersion: string;
  };
  aiSuggestions: {
    titleSuggestions: string[];
    descriptionSuggestions: string[];
    tagSuggestions: string[];
    thumbnailSuggestions: string[];
  };
}

const videoCategories = [
  'Tutorial', 'Review', 'Interview', 'Live Stream', 
  'Course Content', 'Workshop', 'Q&A', 'News Update',
  'Project Showcase', 'Behind the Scenes'
];

const contentCreators = allEmployees.filter(emp => 
  emp.role.toLowerCase().includes('content') || 
  emp.role.toLowerCase().includes('creator') ||
  emp.department === 'Content Strategy'
);

const videoEditors = allEmployees.filter(emp => 
  emp.role.toLowerCase().includes('editor') ||
  emp.role.toLowerCase().includes('video')
);

const reviewers = allEmployees.filter(emp => 
  emp.role.toLowerCase().includes('lead') ||
  emp.role.toLowerCase().includes('manager') ||
  emp.role.toLowerCase().includes('senior')
);

export const EnhancedVideoUpload: React.FC = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [project, setProject] = useState<Partial<VideoProject>>({
    title: '',
    description: '',
    category: '',
    status: 'draft',
    priority: 'medium',
    assignedTo: {
      contentCreator: '',
      videoEditor: '',
      reviewer: ''
    },
    schedule: {},
    metadata: {
      tags: [],
      targetAudience: '',
      difficulty: 'intermediate',
      estimatedViews: 10000
    },
    seo: {
      title: '',
      description: '',
      keywords: [],
      customThumbnail: false
    },
    collaboration: {
      comments: [],
      revisions: 0,
      currentVersion: '1.0'
    },
    aiSuggestions: {
      titleSuggestions: [],
      descriptionSuggestions: [],
      tagSuggestions: [],
      thumbnailSuggestions: []
    }
  });

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    { id: 'basic', title: 'Basic Info', icon: FileText },
    { id: 'team', title: 'Team Assignment', icon: Users },
    { id: 'schedule', title: 'Schedule', icon: CalendarIcon },
    { id: 'metadata', title: 'Metadata & SEO', icon: Tag },
    { id: 'upload', title: 'Upload Files', icon: Upload },
    { id: 'review', title: 'Review & Submit', icon: Check }
  ];

  const handleFileUpload = useCallback((file: File, type: 'video' | 'thumbnail') => {
    if (type === 'video') {
      setProject(prev => ({ ...prev, videoFile: file }));
      // Simulate video processing
      setIsUploading(true);
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setIsUploading(false);
          toast({
            title: "Video uploaded successfully!",
            description: "Your video is ready for processing."
          });
        }
        setUploadProgress(progress);
      }, 200);
    } else {
      setProject(prev => ({ ...prev, thumbnail: file }));
    }
  }, [toast]);

  const generateAISuggestions = useCallback(async () => {
    // Simulate AI generation
    const titleSuggestions = [
      `${project.title} - Complete Tutorial 2024`,
      `How to ${project.title} - Step by Step Guide`,
      `${project.title} Masterclass - From Beginner to Pro`,
      `Ultimate ${project.title} Tutorial - Everything You Need`
    ];

    const descriptionSuggestions = [
      `Learn ${project.title} in this comprehensive tutorial. Perfect for beginners and advanced users alike.`,
      `Master ${project.title} with our step-by-step guide. Includes practical examples and best practices.`,
      `Complete ${project.title} course covering everything from basics to advanced techniques.`
    ];

    const tagSuggestions = [
      'tutorial', 'education', 'beginner', 'advanced', '2024',
      'programming', 'webdev', 'coding', 'tech', 'learn'
    ];

    setProject(prev => ({
      ...prev,
      aiSuggestions: {
        titleSuggestions,
        descriptionSuggestions,
        tagSuggestions,
        thumbnailSuggestions: []
      }
    }));

    toast({
      title: "AI Suggestions Generated!",
      description: "Check the suggestions tabs for AI-powered content ideas."
    });
  }, [project.title, toast]);

  const handleSubmit = async () => {
    // Simulate project creation
    toast({
      title: "Video Project Created!",
      description: `Project "${project.title}" has been created and assigned to the team.`
    });
    
    // Reset form
    setProject({
      title: '',
      description: '',
      category: '',
      status: 'draft',
      priority: 'medium',
      assignedTo: { contentCreator: '', videoEditor: '', reviewer: '' },
      schedule: {},
      metadata: { tags: [], targetAudience: '', difficulty: 'intermediate', estimatedViews: 10000 },
      seo: { title: '', description: '', keywords: [], customThumbnail: false },
      collaboration: { comments: [], revisions: 0, currentVersion: '1.0' },
      aiSuggestions: { titleSuggestions: [], descriptionSuggestions: [], tagSuggestions: [], thumbnailSuggestions: [] }
    });
    setCurrentStep(0);
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'basic':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Video Title *</Label>
              <Input
                id="title"
                value={project.title || ''}
                onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter video title..."
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={project.description || ''}
                onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your video content..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={project.category || ''} 
                  onValueChange={(value) => setProject(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {videoCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={project.priority || 'medium'} 
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => 
                    setProject(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={generateAISuggestions}
              variant="outline"
              className="w-full"
              disabled={!project.title}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate AI Suggestions
            </Button>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Content Creator *</Label>
                <Select 
                  value={project.assignedTo?.contentCreator || ''} 
                  onValueChange={(value) => 
                    setProject(prev => ({ 
                      ...prev, 
                      assignedTo: { ...prev.assignedTo!, contentCreator: value } 
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content creator" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentCreators.map((creator) => (
                      <SelectItem key={creator.id} value={creator.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                            {creator.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{creator.name}</span>
                          <Badge variant="outline" className="ml-auto">
                            {creator.role}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Video Editor *</Label>
                <Select 
                  value={project.assignedTo?.videoEditor || ''} 
                  onValueChange={(value) => 
                    setProject(prev => ({ 
                      ...prev, 
                      assignedTo: { ...prev.assignedTo!, videoEditor: value } 
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select video editor" />
                  </SelectTrigger>
                  <SelectContent>
                    {videoEditors.map((editor) => (
                      <SelectItem key={editor.id} value={editor.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs">
                            {editor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{editor.name}</span>
                          <Badge variant="outline" className="ml-auto">
                            {editor.role}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reviewer *</Label>
                <Select 
                  value={project.assignedTo?.reviewer || ''} 
                  onValueChange={(value) => 
                    setProject(prev => ({ 
                      ...prev, 
                      assignedTo: { ...prev.assignedTo!, reviewer: value } 
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    {reviewers.map((reviewer) => (
                      <SelectItem key={reviewer.id} value={reviewer.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-xs">
                            {reviewer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{reviewer.name}</span>
                          <Badge variant="outline" className="ml-auto">
                            {reviewer.role}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Team Assignment Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Content Creator:</strong> {
                    project.assignedTo?.contentCreator ? 
                    contentCreators.find(c => c.id === project.assignedTo?.contentCreator)?.name : 
                    'Not assigned'
                  }
                </div>
                <div>
                  <strong>Video Editor:</strong> {
                    project.assignedTo?.videoEditor ? 
                    videoEditors.find(e => e.id === project.assignedTo?.videoEditor)?.name : 
                    'Not assigned'
                  }
                </div>
                <div>
                  <strong>Reviewer:</strong> {
                    project.assignedTo?.reviewer ? 
                    reviewers.find(r => r.id === project.assignedTo?.reviewer)?.name : 
                    'Not assigned'
                  }
                </div>
              </div>
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Recording Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !project.schedule?.recordingDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {project.schedule?.recordingDate ? 
                        format(project.schedule.recordingDate, "PPP") : 
                        "Pick a date"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={project.schedule?.recordingDate}
                      onSelect={(date) => 
                        setProject(prev => ({ 
                          ...prev, 
                          schedule: { ...prev.schedule, recordingDate: date } 
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Editing Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !project.schedule?.editingDeadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {project.schedule?.editingDeadline ? 
                        format(project.schedule.editingDeadline, "PPP") : 
                        "Pick a date"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={project.schedule?.editingDeadline}
                      onSelect={(date) => 
                        setProject(prev => ({ 
                          ...prev, 
                          schedule: { ...prev.schedule, editingDeadline: date } 
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Publish Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !project.schedule?.publishDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {project.schedule?.publishDate ? 
                        format(project.schedule.publishDate, "PPP") : 
                        "Pick a date"
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={project.schedule?.publishDate}
                      onSelect={(date) => 
                        setProject(prev => ({ 
                          ...prev, 
                          schedule: { ...prev.schedule, publishDate: date } 
                        }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <Clock className="w-4 h-4" />
                Production Timeline
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Recording Phase:</span>
                  <span>{project.schedule?.recordingDate ? '3-5 days' : 'TBD'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Editing Phase:</span>
                  <span>{project.schedule?.editingDeadline ? '7-10 days' : 'TBD'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Review & Approval:</span>
                  <span>2-3 days</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total Timeline:</span>
                  <span>12-18 days</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'metadata':
        return (
          <div className="space-y-6">
            <Tabs defaultValue="metadata" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="ai-suggestions">AI Suggestions</TabsTrigger>
              </TabsList>

              <TabsContent value="metadata" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select 
                      value={project.metadata?.targetAudience || ''} 
                      onValueChange={(value) => 
                        setProject(prev => ({ 
                          ...prev, 
                          metadata: { ...prev.metadata!, targetAudience: value } 
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginners">Beginners</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="all-levels">All Levels</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Difficulty Level</Label>
                    <Select 
                      value={project.metadata?.difficulty || 'intermediate'} 
                      onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                        setProject(prev => ({ 
                          ...prev, 
                          metadata: { ...prev.metadata!, difficulty: value } 
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input
                    placeholder="Enter tags separated by commas..."
                    value={project.metadata?.tags?.join(', ') || ''}
                    onChange={(e) => 
                      setProject(prev => ({ 
                        ...prev, 
                        metadata: { 
                          ...prev.metadata!, 
                          tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                        } 
                      }))
                    }
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.metadata?.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Estimated Views</Label>
                  <Input
                    type="number"
                    value={project.metadata?.estimatedViews || 10000}
                    onChange={(e) => 
                      setProject(prev => ({ 
                        ...prev, 
                        metadata: { 
                          ...prev.metadata!, 
                          estimatedViews: parseInt(e.target.value) || 10000
                        } 
                      }))
                    }
                  />
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input
                    value={project.seo?.title || ''}
                    onChange={(e) => 
                      setProject(prev => ({ 
                        ...prev, 
                        seo: { ...prev.seo!, title: e.target.value } 
                      }))
                    }
                    placeholder="Optimized title for search..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>SEO Description</Label>
                  <Textarea
                    value={project.seo?.description || ''}
                    onChange={(e) => 
                      setProject(prev => ({ 
                        ...prev, 
                        seo: { ...prev.seo!, description: e.target.value } 
                      }))
                    }
                    placeholder="SEO-optimized description..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Keywords</Label>
                  <Input
                    placeholder="Enter keywords separated by commas..."
                    value={project.seo?.keywords?.join(', ') || ''}
                    onChange={(e) => 
                      setProject(prev => ({ 
                        ...prev, 
                        seo: { 
                          ...prev.seo!, 
                          keywords: e.target.value.split(',').map(keyword => keyword.trim()).filter(Boolean)
                        } 
                      }))
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="custom-thumbnail"
                    checked={project.seo?.customThumbnail || false}
                    onCheckedChange={(checked) => 
                      setProject(prev => ({ 
                        ...prev, 
                        seo: { ...prev.seo!, customThumbnail: !!checked } 
                      }))
                    }
                  />
                  <Label htmlFor="custom-thumbnail">Use custom thumbnail</Label>
                </div>
              </TabsContent>

              <TabsContent value="ai-suggestions" className="space-y-4">
                {project.aiSuggestions?.titleSuggestions?.length ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        AI Title Suggestions
                      </h4>
                      <div className="space-y-2">
                        {project.aiSuggestions.titleSuggestions.map((title, index) => (
                          <div key={index} className="p-2 border rounded-lg hover:bg-muted/50 cursor-pointer"
                               onClick={() => setProject(prev => ({ ...prev, title }))}>
                            {title}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        AI Description Suggestions
                      </h4>
                      <div className="space-y-2">
                        {project.aiSuggestions.descriptionSuggestions.map((desc, index) => (
                          <div key={index} className="p-2 border rounded-lg hover:bg-muted/50 cursor-pointer"
                               onClick={() => setProject(prev => ({ ...prev, description: desc }))}>
                            {desc}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Hash className="w-4 h-4" />
                        AI Tag Suggestions
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {project.aiSuggestions.tagSuggestions.map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                            onClick={() => {
                              const currentTags = project.metadata?.tags || [];
                              if (!currentTags.includes(tag)) {
                                setProject(prev => ({ 
                                  ...prev, 
                                  metadata: { 
                                    ...prev.metadata!, 
                                    tags: [...currentTags, tag]
                                  } 
                                }));
                              }
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Generate AI suggestions in the first step to see recommendations here.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'upload':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Video File
                  </CardTitle>
                  <CardDescription>Upload your main video file</CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    {project.videoFile ? (
                      <div className="space-y-2">
                        <Video className="w-12 h-12 mx-auto text-primary" />
                        <p className="font-medium">{project.videoFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(project.videoFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {isUploading && (
                          <div className="space-y-2">
                            <Progress value={uploadProgress} className="w-full" />
                            <p className="text-sm">Uploading... {Math.round(uploadProgress)}%</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p>Click to upload video</p>
                        <p className="text-sm text-muted-foreground">MP4, MOV, AVI up to 2GB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'video');
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Thumbnail className="w-5 h-5" />
                    Thumbnail
                  </CardTitle>
                  <CardDescription>Upload a custom thumbnail (optional)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    {project.thumbnail ? (
                      <div className="space-y-2">
                        <img 
                          src={URL.createObjectURL(project.thumbnail)} 
                          alt="Thumbnail"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <p className="font-medium">{project.thumbnail.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                        <p>Click to upload thumbnail</p>
                        <p className="text-sm text-muted-foreground">JPG, PNG up to 5MB</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'thumbnail');
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-300">
                <AlertCircle className="w-4 h-4" />
                Upload Guidelines
              </h4>
              <ul className="text-sm space-y-1">
                <li>• Video files should be in MP4 format for best compatibility</li>
                <li>• Recommended resolution: 1920x1080 (1080p) or higher</li>
                <li>• Thumbnail should be 1280x720 pixels for optimal display</li>
                <li>• Files are automatically backed up to cloud storage</li>
              </ul>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Project Review
                </CardTitle>
                <CardDescription>Review all details before creating the project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold">Basic Information</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Title:</strong> {project.title}</div>
                      <div><strong>Category:</strong> {project.category}</div>
                      <div><strong>Priority:</strong> 
                        <Badge className="ml-2" variant={
                          project.priority === 'urgent' ? 'destructive' :
                          project.priority === 'high' ? 'default' :
                          project.priority === 'medium' ? 'secondary' : 'outline'
                        }>
                          {project.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold">Team Assignment</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Creator:</strong> {
                        contentCreators.find(c => c.id === project.assignedTo?.contentCreator)?.name || 'Not assigned'
                      }</div>
                      <div><strong>Editor:</strong> {
                        videoEditors.find(e => e.id === project.assignedTo?.videoEditor)?.name || 'Not assigned'
                      }</div>
                      <div><strong>Reviewer:</strong> {
                        reviewers.find(r => r.id === project.assignedTo?.reviewer)?.name || 'Not assigned'
                      }</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold">Schedule</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div><strong>Recording:</strong> {
                      project.schedule?.recordingDate ? 
                      format(project.schedule.recordingDate, "MMM dd, yyyy") : 
                      'Not set'
                    }</div>
                    <div><strong>Editing Deadline:</strong> {
                      project.schedule?.editingDeadline ? 
                      format(project.schedule.editingDeadline, "MMM dd, yyyy") : 
                      'Not set'
                    }</div>
                    <div><strong>Publish Date:</strong> {
                      project.schedule?.publishDate ? 
                      format(project.schedule.publishDate, "MMM dd, yyyy") : 
                      'Not set'
                    }</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold">Files</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Video:</strong> {project.videoFile ? project.videoFile.name : 'Not uploaded'}</div>
                    <div><strong>Thumbnail:</strong> {project.thumbnail ? project.thumbnail.name : 'Not uploaded'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={handleSubmit} className="flex-1" size="lg">
                <Check className="w-4 h-4 mr-2" />
                Create Video Project
              </Button>
              <Button variant="outline" onClick={() => setCurrentStep(0)} size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Video className="w-6 h-6" />
            Enhanced Video Upload & Project Management
          </CardTitle>
          <CardDescription>
            Create comprehensive video projects with team assignments, scheduling, and AI-powered suggestions
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                index <= currentStep 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "border-muted-foreground text-muted-foreground"
              )}
            >
              {index < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <div className="ml-2 hidden sm:block">
              <div className={cn(
                "text-sm font-medium",
                index <= currentStep ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.title}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-8 h-0.5 mx-4",
                index < currentStep ? "bg-primary" : "bg-muted-foreground/25"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <steps[currentStep].icon className="w-5 h-5" />
            {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
        >
          Previous
        </Button>
        <Button 
          onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
          disabled={currentStep === steps.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
};