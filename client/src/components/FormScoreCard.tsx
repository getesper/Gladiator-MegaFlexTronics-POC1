import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

interface FormScoreCardProps {
  score: number;
}

export function FormScoreCard({ score }: FormScoreCardProps) {
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
    { name: "Posture", value: 85 },
    { name: "Symmetry", value: 78 },
    { name: "Balance", value: 92 },
    { name: "Muscle Definition", value: 88 },
  ];

  return (
    <Card data-testid="card-form-score">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">
          Form Score
        </h3>
        <div className="rounded-md bg-primary/10 p-2">
          <Trophy className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-muted"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(score / 100) * 352} 352`}
                className={getScoreColor(score)}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-heading font-bold ${getScoreColor(score)}`} data-testid="text-score">
                {score}
              </span>
              <span className="text-xs text-muted-foreground">{getScoreLabel(score)}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 pt-2">
          {subScores.map((item) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-body">{item.name}</span>
                <span className="font-body font-semibold">{item.value}%</span>
              </div>
              <Progress value={item.value} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
