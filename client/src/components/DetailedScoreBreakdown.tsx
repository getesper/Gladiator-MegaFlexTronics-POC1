import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { VideoAnalysis } from "@shared/schema";

interface DetailedScoreBreakdownProps {
  analysis?: VideoAnalysis;
}

export function DetailedScoreBreakdown({ analysis }: DetailedScoreBreakdownProps) {
  const criteria = [
    {
      category: "Muscularity",
      subcriteria: [
        { name: "Size & Density", score: 88, weight: 30 },
        { name: "Muscle Separation", score: 82, weight: 25 },
        { name: "Vascularity", score: 85, weight: 20 },
        { name: "Proportional Growth", score: 78, weight: 25 },
      ],
    },
    {
      category: "Symmetry",
      subcriteria: [
        { name: "Left/Right Balance", score: 76, weight: 40 },
        { name: "Upper/Lower Balance", score: 82, weight: 35 },
        { name: "Aesthetic Harmony", score: 85, weight: 25 },
      ],
    },
    {
      category: "Conditioning",
      subcriteria: [
        { name: "Body Fat Level", score: 92, weight: 35 },
        { name: "Muscle Definition", score: 88, weight: 30 },
        { name: "Striations", score: 78, weight: 20 },
        { name: "Dryness", score: 85, weight: 15 },
      ],
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-chart-4";
    if (score >= 70) return "text-chart-3";
    return "text-destructive";
  };

  return (
    <Card data-testid="card-detailed-breakdown" className="w-full max-w-full min-w-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">
          Detailed Score Breakdown
        </h3>
        <div className="rounded-md bg-primary/10 p-2">
          <BarChart3 className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {criteria.map((item) => (
          <div key={item.category} className="space-y-3">
            <h4 className="font-heading font-semibold text-sm border-b pb-1">
              {item.category}
            </h4>
            <div className="space-y-2">
              {item.subcriteria.map((sub) => (
                <div key={sub.name} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-body">{sub.name}</span>
                    <span className={`font-body font-semibold ${getScoreColor(sub.score)}`}>
                      {sub.score}/100 ({sub.weight}%)
                    </span>
                  </div>
                  <Progress value={sub.score} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
