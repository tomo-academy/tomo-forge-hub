import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, Video, X, Check, AlertCircle, 
  FileVideo, Image as ImageIcon, Tag, Eye, 
  Clock, Calendar, Sparkles, Youtube, Globe
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoUploaded?: (video: any) => void;
}

export function UploadVideoModal({ isOpen, onClose, onVideoUploaded }: UploadVideoModalProps) {
  const { toast } = useToast();
  const [uploadStep, setUploadStep] = useState<'select' | 'uploading' | 'details' | 'complete'>('select');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Education",
    tags: "",
    visibility: "public" as 'public' | 'unlisted' | 'private',
    scheduledDate: "",
    scheduledTime: ""
  });

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast({
          title: "❌ Invalid File Type",
          description: "Please select a video file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (max 2GB for demo)
      const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
      if (file.size > maxSize) {
        toast({
          title: "❌ File Too Large",
          description: "Maximum file size is 2GB",
          variant: "destructive",
        });
        return;
      }

      setVideoFile(file);
      setFormData({ ...formData, title: file.name.replace(/\.[^/.]+$/, "") });
      simulateUpload();
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateUpload = () => {
    setUploadStep('uploading');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadStep('details');
        }, 500);
      }
    }, 300);
  };

  const handlePublish = async () => {
    if (!formData.title) {
      toast({
        title: "❌ Missing Title",
        description: "Please enter a video title",
        variant: "destructive",
      });
      return;
    }

    try {
      // In production, this would upload to YouTube API
      const newVideo = {
        id: `video-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        visibility: formData.visibility,
        thumbnail: thumbnailPreview || '/placeholder-video.jpg',
        uploadedAt: new Date().toISOString(),
        status: formData.scheduledDate ? 'scheduled' : 'published',
        scheduledFor: formData.scheduledDate ? `${formData.scheduledDate}T${formData.scheduledTime}` : undefined,
        views: 0,
        likes: 0,
        comments: 0
      };

      setUploadStep('complete');
      
      toast({
        title: "✅ Video Uploaded Successfully!",
        description: `${formData.title} has been ${formData.scheduledDate ? 'scheduled' : 'published'}`,
        duration: 3000,
      });

      if (onVideoUploaded) {
        onVideoUploaded(newVideo);
      }

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      toast({
        title: "❌ Upload Failed",
        description: "Failed to upload video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setUploadStep('select');
    setUploadProgress(0);
    setVideoFile(null);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setFormData({
      title: "",
      description: "",
      category: "Education",
      tags: "",
      visibility: "public",
      scheduledDate: "",
      scheduledTime: ""
    });
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" />
            Upload Video
          </DialogTitle>
          <DialogDescription>
            Upload and publish videos to your YouTube channel
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Step 1: Select Video */}
          {uploadStep === 'select' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer bg-muted/20">
                <Label htmlFor="video-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Select video to upload</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Or drag and drop video files
                      </p>
                      <Button type="button" className="gap-2">
                        <FileVideo className="w-4 h-4" />
                        Select File
                      </Button>
                    </div>
                  </div>
                </Label>
                <Input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoSelect}
                  className="hidden"
                />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      YouTube Upload Guidelines
                    </p>
                    <ul className="text-blue-700 dark:text-blue-300 space-y-1">
                      <li>• Maximum file size: 256 GB</li>
                      <li>• Supported formats: MP4, MOV, AVI, WMV, FLV, 3GP, WebM</li>
                      <li>• Maximum length: 12 hours</li>
                      <li>• Recommended resolution: 1080p or 4K</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Uploading */}
          {uploadStep === 'uploading' && videoFile && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/20">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{videoFile.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(videoFile.size)}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Uploading...</span>
                  <span className="font-semibold">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Processing video... This may take a few minutes
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Video Details */}
          {uploadStep === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Video Preview & Thumbnail */}
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Video Preview</Label>
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                      <Video className="w-12 h-12 text-white/50" />
                    </div>
                    {videoFile && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {videoFile.name} • {formatFileSize(videoFile.size)}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="thumbnail-upload" className="mb-2 block">
                      Custom Thumbnail
                    </Label>
                    {thumbnailPreview ? (
                      <div className="relative group">
                        <img 
                          src={thumbnailPreview} 
                          alt="Thumbnail" 
                          className="w-full aspect-video object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnailFile(null);
                            setThumbnailPreview(null);
                          }}
                          className="absolute top-2 right-2 w-8 h-8 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <Label htmlFor="thumbnail-upload" className="cursor-pointer">
                        <div className="aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary transition-colors bg-muted/20">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Upload thumbnail</span>
                        </div>
                      </Label>
                    )}
                    <Input
                      id="thumbnail-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelect}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Right: Video Details Form */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Add a title that describes your video"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="mt-2"
                      maxLength={100}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.title.length}/100
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell viewers about your video"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="mt-2"
                      maxLength={5000}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.description.length}/5000
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Science & Technology">Science & Technology</SelectItem>
                          <SelectItem value="How-to & Style">How-to & Style</SelectItem>
                          <SelectItem value="Entertainment">Entertainment</SelectItem>
                          <SelectItem value="Gaming">Gaming</SelectItem>
                          <SelectItem value="Music">Music</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="visibility">Visibility</Label>
                      <Select 
                        value={formData.visibility} 
                        onValueChange={(value: any) => setFormData({ ...formData, visibility: value })}
                      >
                        <SelectTrigger className="mt-2">
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
                              <X className="w-4 h-4" />
                              Private
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="Add tags separated by commas"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Tags help people find your video
                    </p>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Schedule (Optional)
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="scheduledDate">Date</Label>
                        <Input
                          id="scheduledDate"
                          type="date"
                          value={formData.scheduledDate}
                          onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                          className="mt-2"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="scheduledTime">Time</Label>
                        <Input
                          id="scheduledTime"
                          type="time"
                          value={formData.scheduledTime}
                          onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handlePublish}
                  className="gap-2"
                >
                  <Youtube className="w-4 h-4" />
                  {formData.scheduledDate ? 'Schedule' : 'Publish'}
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {uploadStep === 'complete' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Video {formData.scheduledDate ? 'Scheduled' : 'Published'}!</h3>
              <p className="text-muted-foreground mb-6">
                Your video has been successfully {formData.scheduledDate ? 'scheduled' : 'uploaded to YouTube'}
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={handleClose}>
                  Done
                </Button>
                <Button variant="outline" onClick={() => setUploadStep('select')}>
                  Upload Another
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
