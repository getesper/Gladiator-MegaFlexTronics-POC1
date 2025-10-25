import { useState } from "react";
import { Header } from "@/components/Header";
import { VideoUploadZone } from "@/components/VideoUploadZone";
import { VideoPlayer } from "@/components/VideoPlayer";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";

export default function Home() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleVideoSelect = (file: File) => {
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoUrl(url);
  };

  const handleNewAnalysis = () => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
    setVideoFile(null);
    setVideoUrl(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header onNewAnalysis={videoUrl ? handleNewAnalysis : undefined} />
      
      {!videoUrl ? (
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
            <VideoPlayer videoUrl={videoUrl} />
          </div>
          
          <div className="w-[400px] border-l bg-card/50 overflow-hidden">
            <AnalysisDashboard />
          </div>
        </div>
      )}
    </div>
  );
}
