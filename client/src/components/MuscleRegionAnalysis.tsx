import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Activity, TrendingUp } from "lucide-react";

interface MuscleRegion {
  name: string;
  coverage: number;
  development: string;
  color: string;
}

const MUSCLE_COLORS: Record<string, string> = {
  "Biceps": "#4ECDC4",
  "Triceps": "#45B7D1",
  "Forearms": "#FFEAA7",
  "Quadriceps": "#00B894",
  "Hamstrings": "#00D2D3",
  "Calves": "#FD79A8",
  "Chest & Abs": "#6C5CE7",
  "Back": "#A29BFE",
};

interface MuscleRegionAnalysisProps {
  muscleStats?: Record<string, number> | null;
}

export function MuscleRegionAnalysis({ muscleStats }: MuscleRegionAnalysisProps) {
  // Generate muscle regions from stats or show placeholders
  const muscleRegions: MuscleRegion[] = muscleStats
    ? Object.entries(muscleStats)
        .filter(([name]) => name !== 'Unknown')
        .map(([name, coverage]) => ({
          name,
          coverage,
          development: coverage > 8 ? "Excellent" : coverage > 5 ? "Very Good" : coverage > 3 ? "Good" : "Moderate",
          color: MUSCLE_COLORS[name] || "#999999",
        }))
        .sort((a, b) => b.coverage - a.coverage)
    : Object.entries(MUSCLE_COLORS).map(([name, color]) => ({
        name,
        coverage: 0,
        development: "Awaiting Analysis",
        color,
      }));
  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-3">
        <CardTitle className="text-sm font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Dumbbell className="h-4 w-4 text-primary" />
          Muscle Region Analysis
        </CardTitle>
        <Badge variant="outline" className="text-[10px] font-mono">
          24 PARTS
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground mb-3">
          {muscleStats 
            ? "Real-time body segmentation identifying 24 distinct muscle regions"
            : "Enable 'Muscles' overlay mode to see muscle region analysis"}
        </div>
        
        <div className="space-y-2">
          {muscleRegions.map((region) => (
            <div 
              key={region.name} 
              className="flex items-center justify-between p-2 rounded bg-muted/30 hover-elevate"
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm border border-border"
                  style={{ backgroundColor: region.color }}
                />
                <span className="text-sm font-medium">{region.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {region.coverage > 0 && (
                  <span className="text-xs font-mono text-muted-foreground">
                    {region.coverage.toFixed(1)}%
                  </span>
                )}
                <Badge 
                  variant="outline" 
                  className="text-[10px] font-mono"
                >
                  {region.development}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 rounded bg-primary/10 border border-primary/20">
          <div className="flex items-start gap-2">
            <Activity className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <strong className="text-foreground">Physical Therapy Mode:</strong> Body part segmentation enables precise 
              muscle region tracking, ideal for rehabilitation progress monitoring and targeted exercise analysis.
            </div>
          </div>
        </div>
        
        <div className="mt-3 p-3 rounded bg-muted/30 border border-border">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <strong className="text-foreground">Bodybuilding Mode:</strong> Compare muscle development across 
              body regions to identify areas for improvement and track symmetry.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
