import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Video, Image, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoUploaded?: (video: any) => void;
}

export function VideoUploadModal({ isOpen, onClose, onVideoUploaded }: VideoUploadModalProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("education");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setErrorMessage('Please select a valid video file');
        return;
      }
      // Validate file size (max 2GB for demo)
      if (file.size > 2 * 1024 * 1024 * 1024) {
        setErrorMessage('Video file size must be less than 2GB');
        return;
      }
      setVideoFile(file);
      setErrorMessage("");
      // Auto-fill title from filename
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
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
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
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
    setUploadStatus("uploading");
    setErrorMessage("");

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setUploadStatus("processing");
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create video object
      const newVideo = {
        id: `video-${Date.now()}`,
        title,
        description,
        category,
        tags,
        videoFile: videoFile.name,
        thumbnailFile: thumbnailFile?.name || null,
        uploadedAt: new Date().toISOString(),
        status: 'processing',
        duration: '00:00',
        views: 0,
        likes: 0,
        comments: 0,
      };

      // Store in localStorage for demo
      const existingVideos = JSON.parse(localStorage.getItem('uploaded_videos') || '[]');
      existingVideos.unshift(newVideo);
      localStorage.setItem('uploaded_videos', JSON.stringify(existingVideos));

      setUploadStatus("success");
      
      // Notify parent component
      if (onVideoUploaded) {
        onVideoUploaded(newVideo);
      }

      // Reset form after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus("error");
      setErrorMessage('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setVideoFile(null);
    setThumbnailFile(null);
    setTitle("");
    setDescription("");
    setCategory("education");
    setTags([]);
    setTagInput("");
    setUploadProgress(0);
    setUploadStatus("idle");
    setErrorMessage("");
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            Upload New Video
          </DialogTitle>
          <DialogDescription>
            Upload your video content to TOMO Academy platform
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Upload Status */}
          {uploadStatus !== "idle" && (
            <div className={cn(
              "p-4 rounded-lg border",
              uploadStatus === "success" && "bg-success/10 border-success",
              uploadStatus === "error" && "bg-destructive/10 border-destructive",
              (uploadStatus === "uploading" || uploadStatus === "processing") && "bg-primary/10 border-primary"
            )}>
              <div className="flex items-center gap-3">
                {uploadStatus === "uploading" && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                {uploadStatus === "processing" && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                {uploadStatus === "success" && <CheckCircle className="w-5 h-5 text-success" />}
                {uploadStatus === "error" && <AlertCircle className="w-5 h-5 text-destructive" />}
                <div className="flex-1">
                  <p className="font-medium">
                    {uploadStatus === "uploading" && "Uploading video..."}
                    {uploadStatus === "processing" && "Processing video..."}
                    {uploadStatus === "success" && "Video uploaded successfully!"}
                    {uploadStatus === "error" && "Upload failed"}
                  </p>
                  {(uploadStatus === "uploading" || uploadStatus === "processing") && (
                    <Progress value={uploadProgress} className="mt-2" />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          {/* Video File Upload */}
          <div className="space-y-2">
            <Label htmlFor="video-file">Video File *</Label>
            <div
              onClick={() => videoInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
                videoFile ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
            >
              <input
                ref={videoInputRef}
                type="file"
                id="video-file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
                disabled={isUploading}
              />
              <div className="flex flex-col items-center gap-2 text-center">
                {videoFile ? (
                  <>
                    <Video className="w-12 h-12 text-primary" />
                    <div>
                      <p className="font-medium">{videoFile.name}</p>
                      <p className="text-sm text-muted-foreground">{formatFileSize(videoFile.size)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoFile(null);
                      }}
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Click to upload video</p>
                      <p className="text-sm text-muted-foreground">MP4, MOV, AVI (max 2GB)</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Thumbnail Upload */}
          <div className="space-y-2">
            <Label htmlFor="thumbnail-file">Thumbnail (Optional)</Label>
            <div
              onClick={() => thumbnailInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors",
                thumbnailFile ? "border-accent bg-accent/5" : "border-border hover:border-accent/50"
              )}
            >
              <input
                ref={thumbnailInputRef}
                type="file"
                id="thumbnail-file"
                accept="image/*"
                onChange={handleThumbnailSelect}
                className="hidden"
                disabled={isUploading}
              />
              <div className="flex items-center gap-3">
                {thumbnailFile ? (
                  <>
                    <Image className="w-8 h-8 text-accent" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{thumbnailFile.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(thumbnailFile.size)}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setThumbnailFile(null);
                      }}
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Image className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload thumbnail (JPG, PNG)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isUploading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter video description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              disabled={isUploading}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="tutorial">Tutorial</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="web-development">Web Development</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={isUploading || !tagInput.trim()}
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

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!videoFile || !title || isUploading}
            className="gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
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
}
