import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Droplet } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ConditioningCardProps {
  measurements?: {
    bodyFatPercentage?: number;
  };
}

export function ConditioningCard({ measurements }: ConditioningCardProps) {
  const bodyFat = measurements?.bodyFatPercentage || 6.2;
  const metrics = [
    { name: "Body Fat %", value: bodyFat, target: 5, max: 10 },
    { name: "Muscle Definition", value: 88, target: 90, max: 100 },
    { name: "Vascularity", value: 85, target: 80, max: 100 },
    { name: "Striations", value: 78, target: 85, max: 100 },
  ];

  return (
    <Card data-testid="card-conditioning">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">
          Conditioning Analysis
        </h3>
        <div className="rounded-md bg-primary/10 p-2">
          <Droplet className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.name} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-body">{metric.name}</span>
              <span className="font-body font-semibold">
                {metric.name === "Body Fat %" ? `${metric.value}%` : `${metric.value}/100`}
              </span>
            </div>
            <Progress 
              value={metric.name === "Body Fat %" ? ((metric.max - metric.value) / metric.max) * 100 : metric.value} 
              className="h-2" 
            />
            <p className="text-[10px] text-muted-foreground">
              Target: {metric.name === "Body Fat %" ? `${metric.target}%` : metric.target}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
