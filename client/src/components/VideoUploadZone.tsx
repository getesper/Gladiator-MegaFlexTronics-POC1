import { Upload, Film } from "lucide-react";
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface VideoUploadZoneProps {
  onVideoSelect: (file: File) => void;
}

export function VideoUploadZone({ onVideoSelect }: VideoUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    if (!file.type.startsWith("video/")) {
      alert("Please upload a video file");
      return false;
    }
    
    // 500MB limit
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`Video file is too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum size is 500MB.`);
      return false;
    }
    
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      simulateUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      simulateUpload(file);
    }
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            onVideoSelect(file);
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  return (
    <Card
      className={`p-12 transition-all ${
        isDragging ? "border-primary bg-accent" : "border-dashed"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="upload-zone"
    >
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="rounded-full bg-primary/10 p-6">
          {isUploading ? (
            <Film className="h-12 w-12 text-primary animate-pulse" />
          ) : (
            <Upload className="h-12 w-12 text-primary" />
          )}
        </div>
        
        {isUploading ? (
          <div className="w-full max-w-md space-y-2">
            <Progress value={uploadProgress} data-testid="progress-upload" />
            <p className="text-sm text-center text-muted-foreground">
              Uploading... {uploadProgress}%
            </p>
          </div>
        ) : (
          <>
            <div className="text-center space-y-2">
              <h3 className="font-heading text-lg font-semibold">
                Upload Your Training Video
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Drag and drop your video here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: MP4, MOV, AVI (max 500MB)
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="input-file"
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              data-testid="button-browse"
            >
              <Upload className="mr-2 h-4 w-4" />
              Browse Files
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
