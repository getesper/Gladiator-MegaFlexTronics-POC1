import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Activity, TrendingUp } from "lucide-react";

interface MuscleRegion {
  name: string;
  coverage: number;
  development: string;
  color: string;
}

const MUSCLE_REGIONS: MuscleRegion[] = [
  { name: "Biceps", coverage: 0, development: "Good", color: "#4ECDC4" },
  { name: "Triceps", coverage: 0, development: "Excellent", color: "#45B7D1" },
  { name: "Forearms", coverage: 0, development: "Good", color: "#FFEAA7" },
  { name: "Quadriceps", coverage: 0, development: "Excellent", color: "#00B894" },
  { name: "Hamstrings", coverage: 0, development: "Very Good", color: "#00D2D3" },
  { name: "Calves", coverage: 0, development: "Good", color: "#FD79A8" },
  { name: "Chest & Abs", coverage: 0, development: "Excellent", color: "#6C5CE7" },
  { name: "Back", coverage: 0, development: "Very Good", color: "#A29BFE" },
];

export function MuscleRegionAnalysis() {
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
          Body segmentation identifies 24 distinct muscle regions for detailed analysis
        </div>
        
        <div className="space-y-2">
          {MUSCLE_REGIONS.map((region) => (
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
