import { Play, Pause, SkipBack, SkipForward, Maximize, Eye, EyeOff, User, Users } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { drawPoseSkeleton, findClosestPose } from "@/lib/skeletonDrawer";
import { bodyPartSegmenter, type BodyPartSegmentation } from "@/lib/bodySegmentation";

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
  onSegmentationUpdate?: (stats: Record<string, number> | null) => void;
}

type OverlayMode = 'skeleton' | 'bodyParts' | 'both' | 'none';

export function VideoPlayer({ videoUrl, onFrameCaptureReady, posesDetected, detectedPoses = [], onSegmentationUpdate }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showOverlay, setShowOverlay] = useState(true);
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('skeleton');
  const [segmentationReady, setSegmentationReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Performance optimization: Cache segmentation results
  const lastSegmentationTime = useRef<number>(0);
  const cachedSegmentation = useRef<any>(null);
  const SEGMENTATION_THROTTLE_MS = 200; // Run segmentation max 5 times per second

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

  // Initialize body part segmenter (balanced for real-time performance)
  useEffect(() => {
    const initSegmenter = async () => {
      try {
        await bodyPartSegmenter.initialize();
        setSegmentationReady(true);
        console.log('Body part segmenter initialized (MobileNetV1, balanced for real-time performance)');
      } catch (error) {
        console.error('Failed to initialize body part segmenter:', error);
      }
    };
    
    initSegmenter();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      drawOverlay(video.currentTime);
    };
    const handleLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [detectedPoses, showOverlay, overlayMode, segmentationReady]);

  const drawOverlay = async (currentTime: number) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) {
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

    if (!showOverlay || overlayMode === 'none') return;

    // Draw technical measurement grid (always shown when overlay is on)
    ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
    ctx.lineWidth = 1;
    
    // Vertical grid lines (every 10%)
    for (let i = 0; i <= 10; i++) {
      const x = (canvas.width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal grid lines (every 10%)
    for (let i = 0; i <= 10; i++) {
      const y = (canvas.height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Center crosshair for reference
    ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
    ctx.lineWidth = 1.5;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Vertical center line
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
    
    // Horizontal center line
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Draw body part segmentation if enabled (with throttling)
    if ((overlayMode === 'bodyParts' || overlayMode === 'both') && segmentationReady && video.videoWidth > 0) {
      try {
        const now = Date.now();
        const shouldRunSegmentation = now - lastSegmentationTime.current > SEGMENTATION_THROTTLE_MS;
        
        if (shouldRunSegmentation || !cachedSegmentation.current) {
          const segmentation = await bodyPartSegmenter.segmentBodyParts(video);
          if (segmentation) {
            cachedSegmentation.current = segmentation;
            lastSegmentationTime.current = now;
            
            // Calculate and report muscle statistics
            if (onSegmentationUpdate) {
              const stats = bodyPartSegmenter.calculateMuscleStats(segmentation);
              onSegmentationUpdate(stats);
            }
          }
        }
        
        if (cachedSegmentation.current) {
          bodyPartSegmenter.drawBodyPartSegmentation(ctx, cachedSegmentation.current, 0.5);
        }
      } catch (error) {
        console.error('Error drawing body part segmentation:', error);
      }
    }

    // Draw skeleton overlay from pre-analyzed MediaPipe landmarks
    if (overlayMode === 'skeleton' || overlayMode === 'both') {
      const landmarks = findClosestPose(detectedPoses, currentTime);
      if (landmarks) {
        drawPoseSkeleton(ctx, landmarks, canvas.width, canvas.height, "#3b82f6", 3);
      }
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
    const ms = Math.floor((seconds % 1) * 1000);
    return `${mins}:${secs.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0")}`;
  };
  
  const formatFrameNumber = (seconds: number, fps: number = 30) => {
    return Math.floor(seconds * fps);
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden w-full max-w-full" data-testid="video-player">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full max-w-full h-auto"
        onClick={togglePlay}
      />
      
      <canvas 
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none opacity-80" 
        style={{ 
          width: '100%', 
          height: '100%',
          display: showOverlay ? 'block' : 'none'
        }}
      />
      
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
            <div className="flex items-center gap-1 bg-black/40 rounded px-1">
              <Button
                variant={overlayMode === 'skeleton' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setOverlayMode('skeleton')}
                className="h-7 text-white hover:bg-white/20 gap-1 text-xs"
                data-testid="button-skeleton-mode"
                title="Show skeleton overlay"
              >
                <User className="h-3 w-3" />
                Skeleton
              </Button>
              
              <Button
                variant={overlayMode === 'bodyParts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setOverlayMode('bodyParts')}
                className="h-7 text-white hover:bg-white/20 gap-1 text-xs"
                data-testid="button-bodyparts-mode"
                title="Show body part segmentation"
                disabled={!segmentationReady}
              >
                <Users className="h-3 w-3" />
                Muscles
              </Button>
              
              <Button
                variant={overlayMode === 'both' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setOverlayMode('both')}
                className="h-7 text-white hover:bg-white/20 gap-1 text-xs"
                data-testid="button-both-mode"
                title="Show both overlays"
                disabled={!segmentationReady}
              >
                Both
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowOverlay(!showOverlay)}
                className="h-7 w-7 text-white hover:bg-white/20"
                data-testid="button-toggle-overlay"
                title={showOverlay ? 'Hide overlay' : 'Show overlay'}
              >
                {showOverlay ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </div>
            
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
          <Badge variant="default" className="bg-primary border border-primary-foreground/20" data-testid="badge-poses-detected">
            {posesDetected} Pose{posesDetected !== 1 ? 's' : ''} Detected
          </Badge>
        </div>
      )}
      
      {/* Technical frame counter overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
        <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded border border-primary/30">
          <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-0.5">Frame</div>
          <div className="font-mono text-lg font-semibold text-primary tabular-nums">
            {formatFrameNumber(currentTime)}
          </div>
        </div>
        <div className="bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded border border-primary/30">
          <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-0.5">Time</div>
          <div className="font-mono text-sm font-semibold text-white tabular-nums">
            {formatTime(currentTime)}
          </div>
        </div>
      </div>
    </div>
  );
}
