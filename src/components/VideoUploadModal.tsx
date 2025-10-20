// src/components/VideoUploadModal.tsx
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MiniVideoPlayer } from "@/components/MiniVideoPlayer";
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
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface VideoUploadProps {
  onVideoUploaded?: (video: any) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const VideoUploadModal = ({ onVideoUploaded, isOpen, onOpenChange }: VideoUploadProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [videoPreview, setVideoPreview] = useState<string>("");

  const categories = [
    "Education",
    "Technology", 
    "Programming",
    "Web Development",
    "Data Science",
    "Machine Learning",
    "Mobile Development",
    "DevOps",
    "Design",
    "Tutorials"
  ];

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      // Create preview URL for video
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      // Create preview URL for thumbnail
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const handleUpload = async () => {
    if (!videoFile || !title.trim()) {
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      // Create video data object
      const videoData = {
        id: `video_${Date.now()}`,
        title,
        description,
        tags,
        privacy,
        category,
        filename: videoFile.name,
        size: videoFile.size,
        duration: "00:00", // Would be calculated from video file
        thumbnailUrl: thumbnailPreview || "/placeholder-thumbnail.jpg",
        videoUrl: videoPreview,
        uploadDate: new Date().toISOString(),
        status: "processing",
        views: 0,
        likes: 0,
        comments: 0
      };

      // Simulate API upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUploadProgress(100);
      
      // Store in localStorage (in real app, this would be API call)
      const existingVideos = JSON.parse(localStorage.getItem('uploaded_videos') || '[]');
      const updatedVideos = [videoData, ...existingVideos];
      localStorage.setItem('uploaded_videos', JSON.stringify(updatedVideos));

      // Call callback
      onVideoUploaded?.(videoData);

      // Reset form
      resetForm();
      onOpenChange?.(false);

    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setNewTag("");
    setPrivacy("public");
    setCategory("");
    setThumbnail(null);
    setVideoFile(null);
    setThumbnailPreview("");
    setVideoPreview("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Upload Video to YouTube
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Upload Forms */}
          <div className="space-y-6">
            {/* Video File Upload */}
            <Card className="p-4">
              <Label className="text-sm font-medium">Video File</Label>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {videoFile ? (
                      <>
                        <FileVideo className="w-8 h-8 mb-2 text-primary" />
                        <p className="text-sm font-medium">{videoFile.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(videoFile.size)}</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">MP4, MOV, AVI up to 2GB</p>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="video/*"
                    onChange={handleVideoFileChange}
                  />
                </label>
              </div>
            </Card>

            {/* Thumbnail Upload */}
            <Card className="p-4">
              <Label className="text-sm font-medium">Custom Thumbnail (Optional)</Label>
              <div className="mt-2">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/50 hover:bg-muted transition-colors">
                  <div className="flex flex-col items-center justify-center pt-2 pb-3">
                    {thumbnail ? (
                      <>
                        <ImageIcon className="w-6 h-6 mb-1 text-primary" />
                        <p className="text-xs font-medium">{thumbnail.name}</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 mb-1 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Upload thumbnail</p>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleThumbnailChange}
                  />
                </label>
              </div>
            </Card>

            {/* Video Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title*</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter video title..."
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {title.length}/100 characters
                </p>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your video..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Privacy</Label>
                  <Select value={privacy} onValueChange={setPrivacy}>
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

                <div>
                  <Label>Category</Label>
                  <Select value={category} onValueChange={setCategory}>
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
              </div>

              {/* Tags */}
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
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      <Tag className="w-3 h-3" />
                      {tag}
                      <X 
                        className="w-3 h-3 cursor-pointer hover:text-destructive" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="space-y-6">
            {/* Video Preview */}
            {videoPreview && (
              <Card className="p-4">
                <Label className="text-sm font-medium mb-2 block">Video Preview</Label>
                <MiniVideoPlayer
                  src={videoPreview}
                  title={title || "Video Preview"}
                  poster={thumbnailPreview}
                  className="w-full h-48"
                />
              </Card>
            )}

            {/* Thumbnail Preview */}
            {thumbnailPreview && (
              <Card className="p-4">
                <Label className="text-sm font-medium mb-2 block">Thumbnail Preview</Label>
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail preview"
                  className="w-full rounded-lg object-cover"
                  style={{ maxHeight: '150px' }}
                />
              </Card>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <Card className="p-4">
                <Label className="text-sm font-medium mb-2 block">Upload Progress</Label>
                <Progress value={uploadProgress} className="mb-2" />
                <p className="text-sm text-muted-foreground">
                  {uploadProgress < 100 ? `Uploading... ${Math.round(uploadProgress)}%` : 'Processing...'}
                </p>
              </Card>
            )}

            {/* Upload Summary */}
            <Card className="p-4">
              <Label className="text-sm font-medium mb-3 block">Upload Summary</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {videoFile ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  )}
                  <span className="text-sm">Video file selected</span>
                </div>
                <div className="flex items-center gap-2">
                  {title.trim() ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                  )}
                  <span className="text-sm">Title provided</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Privacy setting: {privacy}</span>
                </div>
                {category && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Category: {category}</span>
                  </div>
                )}
                {tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{tags.length} tags added</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!videoFile || !title.trim() || isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Video
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadModal;