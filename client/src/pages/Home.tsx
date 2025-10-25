import { useState } from "react";
import { Header } from "@/components/Header";
import { VideoUploadZone } from "@/components/VideoUploadZone";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import type { VideoAnalysis } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { VideoPoseAnalyzer } from "@/lib/poseAnalyzer";

export default function Home() {
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const { data: currentAnalysis, isLoading } = useQuery<VideoAnalysis>({
    queryKey: ["/api/analyses", currentAnalysisId],
    enabled: !!currentAnalysisId,
  });

  const handleVideoSelect = async (file: File) => {
    setIsAnalyzing(true);
    try {
      console.log("Starting video upload:", file.name, file.size);
      
      // Get upload URL from backend
      console.log("Requesting upload URL...");
      const { uploadURL } = await apiRequest<{ uploadURL: string }>("/api/objects/upload", {
        method: "POST",
      });
      console.log("Got upload URL:", uploadURL);

      // Upload video to object storage with progress tracking
      console.log("Uploading to object storage...");
      
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        // Track upload progress
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percentComplete);
            console.log(`Upload progress: ${percentComplete}%`);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            console.log("Upload successful");
            resolve();
          } else {
            console.error("Upload failed with status:", xhr.status);
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        });
        
        xhr.addEventListener('error', () => {
          console.error("Upload error");
          reject(new Error('Upload failed due to network error'));
        });
        
        xhr.addEventListener('timeout', () => {
          console.error("Upload timeout");
          reject(new Error('Upload timed out. Please try with a smaller video file.'));
        });
        
        xhr.open('PUT', uploadURL);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.timeout = 300000; // 5 minute timeout
        xhr.send(file);
      });

      // Get video duration
      console.log("Getting video duration...");
      const duration = await getVideoDuration(file);
      console.log("Video duration:", duration);

      // Perform real pose analysis using MediaPipe
      console.log("Analyzing video with MediaPipe...");
      setUploadProgress(0); // Reset for analysis progress
      const analyzer = new VideoPoseAnalyzer();
      const analysisResults = await analyzer.analyzeVideo(file);
      console.log("Pose analysis complete:", analysisResults);

      // Create analysis with real data
      console.log("Saving analysis...");
      const analysis = await apiRequest<VideoAnalysis>("/api/analyses", {
        method: "POST",
        body: JSON.stringify({
          videoURL: uploadURL,
          videoName: file.name,
          duration,
          category: "bodybuilding",
          ...analysisResults,
        }),
      });
      console.log("Analysis created:", analysis.id);

      setCurrentAnalysisId(analysis.id);
      queryClient.invalidateQueries({ queryKey: ["/api/analyses"] });

      toast({
        title: "Analysis Complete",
        description: "Your video has been analyzed successfully!",
      });
    } catch (error) {
      console.error("Upload error details:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Upload Failed",
        description: `Failed to upload and analyze video: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysisId(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onNewAnalysis={currentAnalysis ? handleNewAnalysis : undefined} />
      
      {!currentAnalysis ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8 space-y-2">
              <h2 className="font-heading text-4xl font-bold" data-testid="text-welcome-title">
                Analyze Your Form
              </h2>
              <p className="text-muted-foreground text-lg">
                {isAnalyzing 
                  ? uploadProgress > 0 && uploadProgress < 100
                    ? `Uploading... ${uploadProgress}%`
                    : "Analyzing your video..."
                  : "Upload a video to get instant AI-powered pose analysis"}
              </p>
            </div>
            <VideoUploadZone onVideoSelect={handleVideoSelect} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-full">
          <div className="flex-1 flex flex-col p-4 lg:p-6 overflow-y-auto min-w-0 max-w-full">
            <VideoPlayer videoUrl={currentAnalysis.videoUrl} />
          </div>
          
          <div className="w-full lg:w-96 xl:w-[28rem] border-t lg:border-t-0 lg:border-l bg-card/50 overflow-y-auto flex-shrink-0">
            <AnalysisDashboard analysis={currentAnalysis} />
          </div>
        </div>
      )}
    </div>
  );
}

async function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };
    video.src = URL.createObjectURL(file);
  });
}
