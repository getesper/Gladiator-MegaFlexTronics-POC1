import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Zap, Scale, Droplets, ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

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
  if (score >= 90) return "#22c55e";
  if (score >= 80) return "#3b82f6";
  if (score >= 70) return "#eab308";
  if (score >= 60) return "#f97316";
  return "#ef4444";
}

function getScoreBadgeVariant(score: number): "default" | "secondary" | "destructive" {
  if (score >= 80) return "default";
  if (score >= 60) return "secondary";
  return "destructive";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  return "Needs Work";
}

interface RadialGaugeProps {
  value: number;
  label: string;
  icon: React.ElementType;
  size?: number;
}

function RadialGauge({ value, label, icon: Icon, size = 80 }: RadialGaugeProps) {
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = getScoreColor(value);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-muted/20"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-3 h-3 mb-0.5 text-muted-foreground" />
          <span className="text-sm font-bold" style={{ color }}>
            {value}
          </span>
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground text-center">{label}</span>
    </div>
  );
}

interface MuscleGroupCardProps {
  name: string;
  data: MuscleGroupScore;
}

function MuscleGroupCard({ name, data }: MuscleGroupCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const avgScore = Math.round((data.development + data.definition + data.symmetry + data.conditioning) / 4);
  const scoreLabel = getScoreLabel(avgScore);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} data-testid={`collapsible-muscle-${name.toLowerCase()}`}>
      <Card className="w-full min-w-0 overflow-hidden">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3 hover-elevate cursor-pointer">
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-2">
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                <div className="text-left">
                  <CardTitle className="text-sm font-semibold">
                    {muscleGroupDisplayNames[name as keyof typeof muscleGroupDisplayNames]}
                  </CardTitle>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{scoreLabel}</p>
                </div>
              </div>
              <Badge variant={getScoreBadgeVariant(avgScore)} className="text-xs font-bold" data-testid={`badge-score-${name}`}>
                {avgScore}
              </Badge>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <div className="grid grid-cols-4 gap-3 p-4 rounded-md bg-muted/30">
              <RadialGauge value={data.development} label="Development" icon={Activity} />
              <RadialGauge value={data.definition} label="Definition" icon={Zap} />
              <RadialGauge value={data.symmetry} label="Symmetry" icon={Scale} />
              <RadialGauge value={data.conditioning} label="Condition" icon={Droplets} />
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-semibold flex items-center gap-1">
                <span className="h-1 w-1 rounded-full bg-primary" />
                AI Feedback
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-muted" data-testid={`text-feedback-${name}`}>
                {data.feedback}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-1.5">
              {data.development >= 85 && (
                <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20">
                  Well Developed
                </Badge>
              )}
              {data.definition >= 85 && (
                <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">
                  Sharp Definition
                </Badge>
              )}
              {data.symmetry >= 85 && (
                <Badge variant="outline" className="text-[10px] bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20">
                  Balanced
                </Badge>
              )}
              {data.conditioning >= 85 && (
                <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
                  Stage Ready
                </Badge>
              )}
              {avgScore < 70 && (
                <Badge variant="outline" className="text-[10px] bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20">
                  Priority Area
                </Badge>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

export function DetailedMuscleAnalysis({ muscleData }: DetailedMuscleAnalysisProps) {
  if (!muscleData || !muscleData.pectorals || !muscleData.overallAssessment) {
    return null;
  }

  return (
    <Card className="w-full min-w-0" data-testid="card-detailed-muscle-analysis">
      <CardHeader>
        <CardTitle className="text-base font-heading">Detailed Muscle Analysis</CardTitle>
        <p className="text-xs text-muted-foreground">
          Individual muscle group evaluation with AI-powered feedback
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-md bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <h4 className="text-xs font-heading font-semibold">Overall Assessment</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed" data-testid="text-overall-assessment">
            {muscleData.overallAssessment}
          </p>
        </div>

        <Tabs defaultValue="upper" className="w-full min-w-0">
          <TabsList className="grid w-full grid-cols-4 text-xs">
            <TabsTrigger value="upper" className="text-[10px] sm:text-xs">Upper Body</TabsTrigger>
            <TabsTrigger value="arms" className="text-[10px] sm:text-xs">Arms</TabsTrigger>
            <TabsTrigger value="core" className="text-[10px] sm:text-xs">Core</TabsTrigger>
            <TabsTrigger value="lower" className="text-[10px] sm:text-xs">Lower Body</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[450px] w-full mt-3">
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
