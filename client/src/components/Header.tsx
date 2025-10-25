import { Dumbbell, Upload, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  onNewAnalysis?: () => void;
}

export function Header({ onNewAnalysis }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
      <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-4 lg:px-6 gap-2 sm:gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="rounded-md bg-primary p-1.5 sm:p-2 flex-shrink-0">
              <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-sm sm:text-base lg:text-xl font-bold truncate" data-testid="text-app-title">
              GLADIATOR MEGAFLEXTRONICS
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {onNewAnalysis && (
            <Button
              variant="default"
              size="sm"
              onClick={onNewAnalysis}
              data-testid="button-new-analysis"
              className="hidden sm:flex"
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
