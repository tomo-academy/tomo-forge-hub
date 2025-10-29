import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MiniVideoPlayer from "@/components/MiniVideoPlayer";
import { Play, Youtube } from "lucide-react";

const VideoPlayerDemo = () => {
  const [customVideoId, setCustomVideoId] = useState("");

  // Sample TOMO Academy YouTube videos (replace with actual video IDs)
  const sampleVideos = [
    {
      id: "dQw4w9WgXcQ", // Sample YouTube video ID
      title: "React Tutorial - Complete Beginner's Guide",
      stats: {
        views: 125000,
        likes: 4200,
        comments: 350
      }
    },
    {
      id: "jNQXAC9IVRw", // Sample YouTube video ID
      title: "JavaScript ES6 Features Explained",
      stats: {
        views: 89000,
        likes: 3100,
        comments: 220
      }
    },
    {
      id: "FQPlEnKav48", // Sample YouTube video ID
      title: "TypeScript for Beginners",
      stats: {
        views: 67000,
        likes: 2800,
        comments: 180
      }
    }
  ];

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const handleCustomVideoSubmit = () => {
    const videoId = extractVideoId(customVideoId);
    if (videoId) {
      setCustomVideoId(videoId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              YouTube Video Player Demo
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Test the enhanced MiniVideoPlayer component with real YouTube videos from TOMO Academy
            </p>
          </div>

          {/* Custom Video Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Youtube className="w-5 h-5 text-red-600" />
                Test Custom YouTube Video
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter YouTube URL or Video ID (e.g., dQw4w9WgXcQ)"
                  value={customVideoId}
                  onChange={(e) => setCustomVideoId(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleCustomVideoSubmit}>
                  <Play className="w-4 h-4 mr-2" />
                  Load Video
                </Button>
              </div>
              
              {customVideoId && (
                <div className="mt-4">
                  <MiniVideoPlayer
                    videoId={extractVideoId(customVideoId)}
                    title="Custom YouTube Video"
                    className="max-w-2xl mx-auto"
                    showStats={false}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sample Videos Grid */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center">Sample TOMO Academy Videos</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <MiniVideoPlayer
                      videoId={video.id}
                      title={video.title}
                      stats={video.stats}
                      showStats={true}
                      onTimeUpdate={(current, duration) => {
                        console.log(`Video ${video.id}: ${current}/${duration}`);
                      }}
                      onEnded={() => {
                        console.log(`Video ${video.id} ended`);
                      }}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Video Player Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">🎮 Interactive Controls</h3>
                  <p className="text-sm text-muted-foreground">
                    Custom play/pause, seek, volume controls with smooth animations
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">📊 Live Statistics</h3>
                  <p className="text-sm text-muted-foreground">
                    Display real-time view counts, likes, and comments from YouTube API
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">📱 Mobile Responsive</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimized for all screen sizes with touch-friendly controls
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">🎨 Thumbnail Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    Beautiful thumbnail with hover effects before video loads
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">🔗 YouTube Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Direct links to YouTube, sharing functionality, and embed support
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-semibold text-primary">⚡ Performance</h3>
                  <p className="text-sm text-muted-foreground">
                    Lazy loading with thumbnail preview to optimize page load times
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Basic Usage:</h4>
                <pre className="text-sm overflow-x-auto">
{`<MiniVideoPlayer
  videoId="dQw4w9WgXcQ"
  title="Your Video Title"
  stats={{
    views: 125000,
    likes: 4200,
    comments: 350
  }}
  showStats={true}
  onTimeUpdate={(current, duration) => console.log(current, duration)}
  onEnded={() => console.log('Video ended')}
/>`}
                </pre>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>• <strong>videoId:</strong> YouTube video ID (11 characters) or full YouTube URL</p>
                <p>• <strong>title:</strong> Optional title displayed on the video</p>
                <p>• <strong>stats:</strong> Optional view/like/comment statistics</p>
                <p>• <strong>showStats:</strong> Whether to display statistics overlay</p>
                <p>• <strong>onTimeUpdate:</strong> Callback for video progress tracking</p>
                <p>• <strong>onEnded:</strong> Callback when video finishes playing</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerDemo;