import { useState } from "react";
import { Header } from "@/components/Header";
import { VideoUploadZone } from "@/components/VideoUploadZone";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import type { VideoAnalysis } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: currentAnalysis, isLoading } = useQuery<VideoAnalysis>({
    queryKey: ["/api/analyses", currentAnalysisId],
    enabled: !!currentAnalysisId,
  });

  const handleVideoSelect = async (file: File) => {
    try {
      // Get upload URL from backend
      const { uploadURL } = await apiRequest<{ uploadURL: string }>("/api/objects/upload", {
        method: "POST",
      });

      // Upload video to object storage
      await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      // Get video duration
      const duration = await getVideoDuration(file);

      // Create analysis
      const analysis = await apiRequest<VideoAnalysis>("/api/analyses", {
        method: "POST",
        body: JSON.stringify({
          videoURL: uploadURL,
          videoName: file.name,
          duration,
          category: "bodybuilding",
        }),
      });

      setCurrentAnalysisId(analysis.id);
      queryClient.invalidateQueries({ queryKey: ["/api/analyses"] });

      toast({
        title: "Analysis Complete",
        description: "Your video has been analyzed successfully!",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload and analyze video. Please try again.",
        variant: "destructive",
      });
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
                Upload a video to get instant AI-powered pose analysis
              </p>
            </div>
            <VideoUploadZone onVideoSelect={handleVideoSelect} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col p-6 overflow-hidden">
            <VideoPlayer videoUrl={currentAnalysis.videoUrl} />
          </div>
          
          <div className="w-[400px] border-l bg-card/50 overflow-hidden">
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
