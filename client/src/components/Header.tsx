import { Dumbbell, Upload, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  onNewAnalysis?: () => void;
}

export function Header({ onNewAnalysis }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="rounded-md bg-primary p-2">
              <Dumbbell className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-heading text-xl font-bold" data-testid="text-app-title">
              GLADIATOR MEGAFLEXTRONICS
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNewAnalysis && (
            <Button
              variant="default"
              onClick={onNewAnalysis}
              data-testid="button-new-analysis"
            >
              <Upload className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          )}
          <Button variant="ghost" size="icon" data-testid="button-settings">
            <Settings className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
