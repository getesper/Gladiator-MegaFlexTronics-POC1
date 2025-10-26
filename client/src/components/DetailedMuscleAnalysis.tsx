import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Zap, Scale, Droplets } from "lucide-react";

interface MuscleGroupScore {
  development: number;
  definition: number;
  symmetry: number;
  conditioning: number;
  feedback: string;
}

interface MuscleAnalysisData {
  pectorals: MuscleGroupScore;
  biceps: MuscleGroupScore;
  triceps: MuscleGroupScore;
  forearms: MuscleGroupScore;
  shoulders: MuscleGroupScore;
  abs: MuscleGroupScore;
  obliques: MuscleGroupScore;
  lats: MuscleGroupScore;
  traps: MuscleGroupScore;
  quads: MuscleGroupScore;
  hamstrings: MuscleGroupScore;
  calves: MuscleGroupScore;
  glutes: MuscleGroupScore;
  overallAssessment: string;
}

interface DetailedMuscleAnalysisProps {
  muscleData: MuscleAnalysisData;
}

const muscleGroupDisplayNames: Record<keyof Omit<MuscleAnalysisData, "overallAssessment">, string> = {
  pectorals: "Pectorals (Chest)",
  biceps: "Biceps",
  triceps: "Triceps",
  forearms: "Forearms",
  shoulders: "Shoulders (Deltoids)",
  abs: "Abs (Rectus Abdominis)",
  obliques: "Obliques",
  lats: "Lats (Back Width)",
  traps: "Traps",
  quads: "Quads (Front Thighs)",
  hamstrings: "Hamstrings (Back Thighs)",
  calves: "Calves",
  glutes: "Glutes"
};

const muscleGroups = {
  upper: ["pectorals", "shoulders", "traps", "lats"] as const,
  arms: ["biceps", "triceps", "forearms"] as const,
  core: ["abs", "obliques"] as const,
  lower: ["quads", "hamstrings", "glutes", "calves"] as const,
};

function getScoreColor(score: number): string {
  if (score >= 90) return "text-green-600 dark:text-green-400";
  if (score >= 80) return "text-blue-600 dark:text-blue-400";
  if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
  if (score >= 60) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

function getScoreBadgeVariant(score: number): "default" | "secondary" | "destructive" {
  if (score >= 80) return "default";
  if (score >= 60) return "secondary";
  return "destructive";
}

function MuscleGroupCard({ name, data }: { name: string; data: MuscleGroupScore }) {
  const avgScore = Math.round((data.development + data.definition + data.symmetry + data.conditioning) / 4);
  
  return (
    <Card data-testid={`card-muscle-${name.toLowerCase()}`} className="w-full min-w-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm font-semibold truncate">
            {muscleGroupDisplayNames[name as keyof typeof muscleGroupDisplayNames]}
          </CardTitle>
          <Badge variant={getScoreBadgeVariant(avgScore)} className="text-xs" data-testid={`badge-score-${name}`}>
            {avgScore}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Development</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={data.development} className="flex-1 h-1.5" />
              <span className={`text-xs font-semibold min-w-[28px] ${getScoreColor(data.development)}`}>
                {data.development}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Definition</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={data.definition} className="flex-1 h-1.5" />
              <span className={`text-xs font-semibold min-w-[28px] ${getScoreColor(data.definition)}`}>
                {data.definition}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Scale className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Symmetry</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={data.symmetry} className="flex-1 h-1.5" />
              <span className={`text-xs font-semibold min-w-[28px] ${getScoreColor(data.symmetry)}`}>
                {data.symmetry}
              </span>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Droplets className="w-3 h-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Conditioning</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress value={data.conditioning} className="flex-1 h-1.5" />
              <span className={`text-xs font-semibold min-w-[28px] ${getScoreColor(data.conditioning)}`}>
                {data.conditioning}
              </span>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground leading-relaxed" data-testid={`text-feedback-${name}`}>
            {data.feedback}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DetailedMuscleAnalysis({ muscleData }: DetailedMuscleAnalysisProps) {
  // Type guard: ensure muscleData has expected structure
  if (!muscleData || !muscleData.pectorals || !muscleData.overallAssessment) {
    return null;
  }

  return (
    <Card className="w-full min-w-0" data-testid="card-detailed-muscle-analysis">
      <CardHeader>
        <CardTitle className="text-base">Detailed Muscle Analysis</CardTitle>
        <p className="text-xs text-muted-foreground">
          Individual muscle group evaluation with AI-powered feedback
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 rounded-md bg-muted/50 border">
          <h4 className="text-xs font-semibold mb-1">Overall Assessment</h4>
          <p className="text-xs text-muted-foreground leading-relaxed" data-testid="text-overall-assessment">
            {muscleData.overallAssessment}
          </p>
        </div>

        <Tabs defaultValue="upper" className="w-full min-w-0">
          <TabsList className="grid w-full grid-cols-4 text-xs">
            <TabsTrigger value="upper" className="text-[10px] sm:text-xs">Upper</TabsTrigger>
            <TabsTrigger value="arms" className="text-[10px] sm:text-xs">Arms</TabsTrigger>
            <TabsTrigger value="core" className="text-[10px] sm:text-xs">Core</TabsTrigger>
            <TabsTrigger value="lower" className="text-[10px] sm:text-xs">Lower</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] w-full mt-3">
            <TabsContent value="upper" className="space-y-3 mt-0 pr-3">
              {muscleGroups.upper.map((muscle) => (
                <MuscleGroupCard
                  key={muscle}
                  name={muscle}
                  data={muscleData[muscle]}
                />
              ))}
            </TabsContent>

            <TabsContent value="arms" className="space-y-3 mt-0 pr-3">
              {muscleGroups.arms.map((muscle) => (
                <MuscleGroupCard
                  key={muscle}
                  name={muscle}
                  data={muscleData[muscle]}
                />
              ))}
            </TabsContent>

            <TabsContent value="core" className="space-y-3 mt-0 pr-3">
              {muscleGroups.core.map((muscle) => (
                <MuscleGroupCard
                  key={muscle}
                  name={muscle}
                  data={muscleData[muscle]}
                />
              ))}
            </TabsContent>

            <TabsContent value="lower" className="space-y-3 mt-0 pr-3">
              {muscleGroups.lower.map((muscle) => (
                <MuscleGroupCard
                  key={muscle}
                  name={muscle}
                  data={muscleData[muscle]}
                />
              ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}
