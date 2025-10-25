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
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

      // Upload video to object storage
      console.log("Uploading to object storage...");
      const uploadResponse = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
      
      if (!uploadResponse.ok) {
        throw new Error(`Upload failed with status ${uploadResponse.status}`);
      }
      console.log("Upload successful");

      // Get video duration
      console.log("Getting video duration...");
      const duration = await getVideoDuration(file);
      console.log("Video duration:", duration);

      // Create analysis
      console.log("Creating analysis...");
      const analysis = await apiRequest<VideoAnalysis>("/api/analyses", {
        method: "POST",
        body: JSON.stringify({
          videoURL: uploadURL,
          videoName: file.name,
          duration,
          category: "bodybuilding",
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
                {isAnalyzing ? "Analyzing your video..." : "Upload a video to get instant AI-powered pose analysis"}
              </p>
            </div>
            <VideoUploadZone onVideoSelect={handleVideoSelect} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <VideoPlayer videoUrl={currentAnalysis.videoUrl} />
          </div>
          
          <div className="w-[400px] border-l bg-card/50 overflow-y-auto">
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
