// src/components/MiniVideoPlayer.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  X, 
  ExternalLink, 
  Maximize2,
  Play,
  Eye,
  ThumbsUp,
  MessageSquare
} from "lucide-react";

interface MiniVideoPlayerProps {
  videoId: string;
  title?: string;
  description?: string;
  onClose: () => void;
}

const MiniVideoPlayer = ({ videoId, title, description, onClose }: MiniVideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPiPSupported, setIsPiPSupported] = useState(false);

  useEffect(() => {
    // Check for Picture-in-Picture support
    setIsPiPSupported('pictureInPictureEnabled' in document);
  }, []);

  const handlePictureInPicture = async () => {
    const iframe = document.querySelector(`#youtube-iframe-${videoId}`) as HTMLIFrameElement;
    if (iframe && isPiPSupported) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          // For YouTube iframes, we need to open in new window for PiP
          const pipWindow = window.open(
            `https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`,
            'pip',
            'width=480,height=270,scrollbars=no,resizable=yes'
          );
          if (pipWindow) {
            pipWindow.focus();
          }
        }
      } catch (error) {
        console.log('PiP not supported or failed:', error);
      }
    }
  };

  const openInYouTube = () => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="relative w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 text-white">
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold truncate">{title || 'YouTube Video'}</h2>
              {description && (
                <p className="text-sm text-gray-300 mt-1 line-clamp-2">{description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-4">
              {isPiPSupported && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePictureInPicture}
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={openInYouTube}
                className="text-white border-white hover:bg-white hover:text-black"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                YouTube
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onClose}
                className="text-white border-white hover:bg-white hover:text-black"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-white text-sm">Loading video...</p>
                </div>
              </div>
            )}
            
            <iframe
              id={`youtube-iframe-${videoId}`}
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              title={title || 'YouTube Video'}
            />
          </div>

          {/* Quick Stats (if available) */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Play className="w-4 h-4" />
                Playing on TOMO Academy
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span>Press ESC to close</span>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      />
    </div>
  );
};

// Add keyboard event listener for ESC key
export default function MiniVideoPlayerWithEscape(props: MiniVideoPlayerProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        props.onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [props.onClose]);

  return <MiniVideoPlayer {...props} />;
}