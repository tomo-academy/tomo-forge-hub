// src/components/MiniVideoPlayer.tsx
import { useState, useRef, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  ExternalLink,
  Share,
  Heart,
  MessageSquare,
  Eye
} from "lucide-react";

// YouTube Player type definitions
interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
}

interface YouTubeEvent {
  target: YouTubePlayer;
  data: number;
}

declare global {
  interface Window {
    YT: {
      Player: new (elementId: string, config: any) => YouTubePlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface MiniVideoPlayerProps {
  videoId: string; // YouTube video ID
  title?: string;
  thumbnail?: string;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
  showStats?: boolean;
  stats?: {
    views: number;
    likes: number;
    comments: number;
  };
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

export const MiniVideoPlayer = ({
  videoId,
  title,
  thumbnail,
  autoPlay = false,
  muted = false,
  className = "",
  showStats = true,
  stats,
  onTimeUpdate,
  onEnded
}: MiniVideoPlayerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(muted);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(false);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);

  const initializePlayer = useCallback(() => {
    if (!showPlayer || !window.YT) return;

    const newPlayer = new window.YT.Player(`youtube-player-${videoId}`, {
      height: '100%',
      width: '100%',
      videoId: videoId,
      playerVars: {
        autoplay: autoPlay ? 1 : 0,
        mute: muted ? 1 : 0,
        controls: 0, // Hide default controls
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        fs: 1,
        enablejsapi: 1,
      },
      events: {
        onReady: (event: YouTubeEvent) => {
          setIsLoading(false);
          setPlayer(event.target);
          setDuration(event.target.getDuration());
        },
        onStateChange: (event: YouTubeEvent) => {
          const state = event.data;
          setIsPlaying(state === window.YT.PlayerState.PLAYING);
          
          if (state === window.YT.PlayerState.ENDED) {
            setIsPlaying(false);
            onEnded?.();
          }
        },
      },
    });

    setPlayer(newPlayer);
  }, [showPlayer, videoId, autoPlay, muted, onEnded]);

  // YouTube API ready check
  useEffect(() => {
    const checkYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        initializePlayer();
      } else {
        // Load YouTube API if not available
        if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
          const script = document.createElement('script');
          script.src = 'https://www.youtube.com/iframe_api';
          script.async = true;
          document.head.appendChild(script);
        }
        
        window.onYouTubeIframeAPIReady = () => {
          initializePlayer();
        };
      }
    };

    if (showPlayer) {
      checkYouTubeAPI();
    }
  }, [showPlayer, videoId, initializePlayer]);

  // Update current time
  useEffect(() => {
    if (!player || !isPlaying) return;

    const updateTime = () => {
      if (player && player.getCurrentTime) {
        const current = player.getCurrentTime();
        setCurrentTime(current);
        onTimeUpdate?.(current, duration);
      }
    };

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [player, isPlaying, duration, onTimeUpdate]);

  const togglePlay = () => {
    if (!player) return;

    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleSeek = (value: number[]) => {
    if (!player || !duration) return;

    const newTime = (value[0] / 100) * duration;
    player.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!player) return;

    const newVolume = value[0];
    player.setVolume(newVolume);
    setVolume(newVolume / 100);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!player) return;

    if (isMuted) {
      player.unMute();
      setIsMuted(false);
    } else {
      player.mute();
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    if (!player) return;

    const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
    player.seekTo(newTime, true);
  };

  const toggleFullscreen = () => {
    const container = iframeRef.current?.parentElement;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const openYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  const shareVideo = () => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    if (navigator.share) {
      navigator.share({
        title: title || 'YouTube Video',
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      // Could add a toast notification here
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  const getThumbnailUrl = () => {
    return thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <Card className={`relative overflow-hidden bg-black group ${className}`}>
      {!showPlayer ? (
        // Thumbnail View
        <div 
          className="relative cursor-pointer aspect-video"
          onClick={() => setShowPlayer(true)}
        >
          <img
            src={getThumbnailUrl()}
            alt={title || 'YouTube Video'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback to medium quality thumbnail
              e.currentTarget.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/50 transition-all duration-300">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>

          {/* Title Overlay */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <h3 className="text-white font-medium text-sm line-clamp-2">{title}</h3>
            </div>
          )}

          {/* Stats Overlay */}
          {showStats && stats && (
            <div className="absolute top-2 left-2 right-2 flex justify-between">
              <div className="flex gap-2">
                <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatNumber(stats.views)}
                </div>
              </div>
              <div className="flex gap-1">
                <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {formatNumber(stats.likes)}
                </div>
                <div className="bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {formatNumber(stats.comments)}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // YouTube Player View
        <div className="relative aspect-video">
          {/* YouTube IFrame Player */}
          <div 
            id={`youtube-player-${videoId}`}
            ref={iframeRef}
            className="w-full h-full"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          />

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Custom Controls Overlay */}
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 pointer-events-none ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            {/* Title */}
            {title && (
              <div className="absolute top-4 left-4 right-4 pointer-events-auto">
                <h3 className="text-white font-medium text-sm truncate">{title}</h3>
              </div>
            )}

            {/* Bottom Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3 pointer-events-auto">
              {/* Progress Bar */}
              <div className="space-y-1">
                <Slider
                  value={[progressPercentage]}
                  onValueChange={handleSeek}
                  max={100}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-white/80">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Skip Back */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => skip(-10)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipBack className="w-4 h-4" />
                  </Button>

                  {/* Play/Pause */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>

                  {/* Skip Forward */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => skip(10)}
                    className="text-white hover:bg-white/20"
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>

                  {/* Volume Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                    <div className="w-20 hidden md:block">
                      <Slider
                        value={[isMuted ? 0 : volume * 100]}
                        onValueChange={handleVolumeChange}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Share */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={shareVideo}
                    className="text-white hover:bg-white/20"
                  >
                    <Share className="w-4 h-4" />
                  </Button>

                  {/* Open in YouTube */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={openYouTube}
                    className="text-white hover:bg-white/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>

                  {/* Settings */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>

                  {/* Fullscreen */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleFullscreen}
                    className="text-white hover:bg-white/20"
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MiniVideoPlayer;