import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface FormScoreCardProps {
  score: number;
  muscularityScore?: number;
  symmetryScore?: number;
  conditioningScore?: number;
  aestheticsScore?: number;
}

export function FormScoreCard({ 
  score,
  muscularityScore = 85,
  symmetryScore = 78,
  conditioningScore = 92,
  aestheticsScore = 88
}: FormScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-chart-4";
    if (score >= 60) return "text-chart-3";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    return "Needs Work";
  };

  const subScores = [
    { name: "Muscularity", value: muscularityScore },
    { name: "Symmetry", value: symmetryScore },
    { name: "Conditioning", value: conditioningScore },
    { name: "Aesthetics", value: aestheticsScore },
  ];

  // Generate tick marks for circular gauge
  const size = 128;
  const radius = 56;
  const ticks = Array.from({ length: 36 }, (_, i) => {
    const angle = (i * 10) * (Math.PI / 180);
    const innerRadius = radius - 2;
    const outerRadius = i % 9 === 0 ? radius + 3 : radius + 1.5;
    const x1 = 64 + innerRadius * Math.cos(angle);
    const y1 = 64 + innerRadius * Math.sin(angle);
    const x2 = 64 + outerRadius * Math.cos(angle);
    const y2 = 64 + outerRadius * Math.sin(angle);
    return { x1, y1, x2, y2, major: i % 9 === 0 };
  });

  return (
    <Card data-testid="card-form-score" className="w-full max-w-full min-w-0 border-l-2 border-l-primary/60">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Overall Score
        </h3>
        <div className="rounded-md bg-primary/15 p-2 border border-primary/20">
          <Trophy className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted/10"
              />
              {/* Tick marks */}
              {ticks.map((tick, i) => (
                <line
                  key={i}
                  x1={tick.x1}
                  y1={tick.y1}
                  x2={tick.x2}
                  y2={tick.y2}
                  stroke="currentColor"
                  strokeWidth={tick.major ? 1.5 : 0.75}
                  className="text-muted-foreground/20"
                />
              ))}
              {/* Progress circle */}
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(score / 100) * 352} 352`}
                strokeLinecap="round"
                className={`${getScoreColor(score)} transition-all duration-700 ease-out drop-shadow-sm`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-mono font-bold tabular-nums ${getScoreColor(score)}`} data-testid="text-score">
                {score}
              </span>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">{getScoreLabel(score)}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 pt-2">
          {subScores.map((item) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium uppercase tracking-wide text-muted-foreground">{item.name}</span>
                <span className="font-mono font-semibold tabular-nums">{item.value}%</span>
              </div>
              <Progress value={item.value} className="h-2.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
