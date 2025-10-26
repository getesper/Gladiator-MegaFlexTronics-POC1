import { Dumbbell, Upload, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Progress } from "@/components/ui/progress";

interface HeaderProps {
  onNewAnalysis?: () => void;
  isAnalyzing?: boolean;
  uploadProgress?: number;
  analysisStatus?: string;
}

export function Header({ onNewAnalysis, isAnalyzing, uploadProgress, analysisStatus }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6 gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <div className="rounded-md bg-primary p-1.5 sm:p-2 flex-shrink-0">
              <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-sm sm:text-base lg:text-xl font-bold truncate" data-testid="text-app-title">
              GLADIATOR MEGAFLEXTRONICS
            </h1>
          </div>
          
          {isAnalyzing && (
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 max-w-md">
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5 sm:mb-1">
                  <span className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate">
                    {analysisStatus || "Processing..."}
                  </span>
                  {uploadProgress !== undefined && uploadProgress > 0 && uploadProgress < 100 && (
                    <span className="text-[10px] sm:text-xs font-semibold text-primary flex-shrink-0">
                      {uploadProgress}%
                    </span>
                  )}
                </div>
                {uploadProgress !== undefined && uploadProgress > 0 && uploadProgress < 100 && (
                  <Progress value={uploadProgress} className="h-0.5 sm:h-1" data-testid="progress-upload" />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {onNewAnalysis && (
            <Button
              variant="default"
              size="sm"
              onClick={onNewAnalysis}
              data-testid="button-new-analysis"
              className="hidden sm:flex"
              disabled={isAnalyzing}
            >
              <Upload className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          )}
          {onNewAnalysis && (
            <Button
              variant="default"
              size="icon"
              onClick={onNewAnalysis}
              data-testid="button-new-analysis-mobile"
              className="sm:hidden"
              disabled={isAnalyzing}
            >
              <Upload className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" data-testid="button-settings" className="hidden sm:flex">
            <Settings className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
