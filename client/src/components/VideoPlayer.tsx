import { Play, Pause, SkipBack, SkipForward, Maximize, Eye, EyeOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { drawPoseSkeleton, findClosestPose } from "@/lib/skeletonDrawer";

interface DetectedPose {
  poseName: string;
  timestamp: number;
  score: number;
  confidence?: number;
}

interface VideoPlayerProps {
  videoUrl: string;
  onFrameCaptureReady?: (captureFrame: () => string | null) => void;
  posesDetected?: number;
  detectedPoses?: DetectedPose[];
}

export function VideoPlayer({ videoUrl, onFrameCaptureReady, posesDetected, detectedPoses = [] }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const captureCurrentFrame = (): string | null => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      return null;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg", 0.8);
    return base64.split(",")[1];
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !onFrameCaptureReady) return;

    const handleMetadataLoaded = () => {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        onFrameCaptureReady(captureCurrentFrame);
      }
    };

    video.addEventListener("loadedmetadata", handleMetadataLoaded);
    
    if (video.videoWidth > 0 && video.videoHeight > 0) {
      onFrameCaptureReady(captureCurrentFrame);
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadataLoaded);
    };
  }, [onFrameCaptureReady]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      drawSkeletonOverlay(video.currentTime);
    };
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [detectedPoses, showOverlay]);

  const drawSkeletonOverlay = (currentTime: number) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video || !showOverlay) {
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    // Match canvas size to video dimensions
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Find pose landmarks closest to current time
    const landmarks = findClosestPose(detectedPoses, currentTime);
    
    if (landmarks) {
      drawPoseSkeleton(ctx, landmarks, canvas.width, canvas.height, "#00ff88", 3);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const skipFrame = (direction: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime += direction * 0.033;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden w-full max-w-full" data-testid="video-player">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full max-w-full aspect-video"
        onClick={togglePlay}
      />
      
      {showOverlay && (
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none opacity-80" 
          style={{ width: '100%', height: '100%' }}
        />
      )}
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-white font-mono min-w-[40px]">
            {formatTime(currentTime)}
          </span>
          <div className="flex-1 relative">
            <Slider
              value={[currentTime]}
              max={duration || 100}
              step={0.1}
              onValueChange={handleSeek}
              className="relative z-10"
              data-testid="slider-timeline"
            />
            {/* Timeline Pose Markers */}
            {duration > 0 && detectedPoses.map((pose, index) => {
              const position = (pose.timestamp / duration) * 100;
              return (
                <button
                  key={index}
                  onClick={() => {
                    const video = videoRef.current;
                    if (video) {
                      video.currentTime = pose.timestamp;
                      setCurrentTime(pose.timestamp);
                    }
                  }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 group"
                  style={{ left: `${position}%` }}
                  data-testid={`marker-pose-${index}`}
                  title={`${pose.poseName} at ${formatTime(pose.timestamp)} (${pose.score}%)`}
                >
                  <div className="relative">
                    {/* Marker dot */}
                    <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow-lg group-hover:scale-125 transition-transform" />
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black/90 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      {pose.poseName}<br/>{formatTime(pose.timestamp)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <span className="text-xs text-white font-mono min-w-[40px]">
            {formatTime(duration)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => skipFrame(-1)}
              className="h-8 w-8 text-white hover:bg-white/20"
              data-testid="button-frame-back"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="h-10 w-10 text-white hover:bg-white/20"
              data-testid="button-play-pause"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => skipFrame(1)}
              className="h-8 w-8 text-white hover:bg-white/20"
              data-testid="button-frame-forward"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOverlay(!showOverlay)}
              className="h-8 text-white hover:bg-white/20 gap-1"
              data-testid="button-toggle-overlay"
            >
              {showOverlay ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="text-xs">Pose Overlay</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/20"
              data-testid="button-fullscreen"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {posesDetected !== undefined && (
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="default" className="bg-primary" data-testid="badge-poses-detected">
            {posesDetected} Pose{posesDetected !== 1 ? 's' : ''} Detected
          </Badge>
        </div>
      )}
    </div>
  );
}
