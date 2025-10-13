import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Upload, X, Video, Image, CheckCircle, AlertCircle, Loader2, 
  Youtube, Eye, Lock, Globe, Play, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { youtubeUploadService, type UploadProgress } from "@/services/youtubeUpload";

interface YouTubeUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoUploaded?: (video: any) => void;
}

export function YouTubeUploadModal({ isOpen, onClose, onVideoUploaded }: YouTubeUploadModalProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("education");
  const [privacyStatus, setPrivacyStatus] = useState<'public' | 'private' | 'unlisted'>('public');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setErrorMessage('Please select a valid video file');
        return;
      }
      if (file.size > 256 * 1024 * 1024 * 1024) { // 256GB max
        setErrorMessage('Video file size must be less than 256GB');
        return;
      }
      setVideoFile(file);
      setErrorMessage("");
      
      // Auto-fill title
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }

      // Create preview
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Please select a valid image file');
        return;
      }
      setThumbnailFile(file);
      setErrorMessage("");

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 15) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleUpload = async () => {
    if (!videoFile || !title) {
      setErrorMessage('Please provide a video file and title');
      return;
    }

    setIsUploading(true);
    setErrorMessage("");

    const result = await youtubeUploadService.uploadVideo(
      videoFile,
      {
        title,
        description,
        category,
        tags,
        privacyStatus,
        thumbnailFile: thumbnailFile || undefined
      },
      (progress) => {
        setUploadProgress(progress);
      }
    );

    setIsUploading(false);

    if (result.success && result.videoId) {
      // Notify parent
      if (onVideoUploaded) {
        onVideoUploaded({
          id: result.videoId,
          title,
          description,
          youtube_url: `https://www.youtube.com/watch?v=${result.videoId}`,
          thumbnail_url: `https://img.youtube.com/vi/${result.videoId}/maxresdefault.jpg`,
          category,
          tags,
          status: 'published'
        });
      }

      // Reset after delay
      setTimeout(() => {
        handleClose();
      }, 3000);
    } else {
      setErrorMessage(result.error || 'Upload failed');
    }
  };

  const handleClose = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    setTitle("");
    setDescription("");
    setCategory("education");
    setPrivacyStatus("public");
    setTags([]);
    setTagInput("");
    setUploadProgress(null);
    setErrorMessage("");
    setVideoPreview(null);
    setThumbnailPreview(null);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    if (!uploadProgress) return null;
    
    switch (uploadProgress.status) {
      case 'uploading':
      case 'preparing':
      case 'processing':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-600" />
            Upload to YouTube
          </DialogTitle>
          <DialogDescription>
            Upload your video directly to your YouTube channel
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Upload Status */}
          {uploadProgress && (
            <div className={cn(
              "p-4 rounded-lg border",
              uploadProgress.status === "complete" && "bg-success/10 border-success",
              uploadProgress.status === "error" && "bg-destructive/10 border-destructive",
              (uploadProgress.status === "uploading" || uploadProgress.status === "preparing" || uploadProgress.status === "processing") && "bg-primary/10 border-primary"
            )}>
              <div className="flex items-center gap-3 mb-2">
                {getStatusIcon()}
                <div className="flex-1">
                  <p className="font-medium">{uploadProgress.message}</p>
                  {uploadProgress.videoId && (
                    <a 
                      href={`https://www.youtube.com/watch?v=${uploadProgress.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      View on YouTube →
                    </a>
                  )}
                </div>
              </div>
              {(uploadProgress.status === "uploading" || uploadProgress.status === "processing") && (
                <Progress value={uploadProgress.progress} className="mt-2" />
              )}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Video & Thumbnail */}
            <div className="space-y-4">
              {/* Video Upload */}
              <div>
                <Label>Video File *</Label>
                <div
                  onClick={() => !isUploading && videoInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors mt-2",
                    videoFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                    isUploading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoSelect}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {videoFile ? (
                    <div className="space-y-2">
                      {videoPreview && (
                        <video src={videoPreview} className="w-full h-32 object-cover rounded" controls />
                      )}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{videoFile.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(videoFile.size)}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVideoFile(null);
                            setVideoPreview(null);
                          }}
                          disabled={isUploading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Video className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="font-medium">Click to upload video</p>
                      <p className="text-xs text-muted-foreground">MP4, MOV, AVI (max 256GB)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <Label>Custom Thumbnail (Optional)</Label>
                <div
                  onClick={() => !isUploading && thumbnailInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-3 cursor-pointer transition-colors mt-2",
                    thumbnailFile ? "border-accent bg-accent/5" : "border-border hover:border-accent/50",
                    isUploading && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailSelect}
                    className="hidden"
                    disabled={isUploading}
                  />
                  {thumbnailFile ? (
                    <div className="space-y-2">
                      {thumbnailPreview && (
                        <img src={thumbnailPreview} alt="Thumbnail" className="w-full h-24 object-cover rounded" />
                      )}
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{thumbnailFile.name}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setThumbnailFile(null);
                            setThumbnailPreview(null);
                          }}
                          disabled={isUploading}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Image className="w-6 h-6 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload (JPG, PNG)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Privacy Status */}
              <div>
                <Label>Privacy</Label>
                <RadioGroup value={privacyStatus} onValueChange={(v: any) => setPrivacyStatus(v)} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" disabled={isUploading} />
                    <Label htmlFor="public" className="flex items-center gap-2 cursor-pointer">
                      <Globe className="w-4 h-4" />
                      Public
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unlisted" id="unlisted" disabled={isUploading} />
                    <Label htmlFor="unlisted" className="flex items-center gap-2 cursor-pointer">
                      <Eye className="w-4 h-4" />
                      Unlisted
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" disabled={isUploading} />
                    <Label htmlFor="private" className="flex items-center gap-2 cursor-pointer">
                      <Lock className="w-4 h-4" />
                      Private
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                  maxLength={100}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">{title.length}/100</p>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter video description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  disabled={isUploading}
                  maxLength={5000}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">{description.length}/5000</p>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} disabled={isUploading}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="web-development">Web Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div>
                <Label htmlFor="tags">Tags (max 15)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="tags"
                    placeholder="Add tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    disabled={isUploading || tags.length >= 15}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTag}
                    disabled={isUploading || !tagInput.trim() || tags.length >= 15}
                  >
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                          disabled={isUploading}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-4 h-4" />
            <span>Uploads directly to YouTube</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!videoFile || !title || isUploading}
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Youtube className="w-4 h-4" />
                  Upload to YouTube
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
