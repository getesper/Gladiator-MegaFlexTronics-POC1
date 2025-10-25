import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lightbulb, ArrowRight } from "lucide-react";

export function PoseCorrections() {
  const corrections = [
    {
      pose: "Front Double Biceps",
      current: "Elbows slightly forward",
      correction: "Pull elbows back in line with shoulders",
      impact: "+4 points",
    },
    {
      pose: "Side Chest",
      current: "Chest not fully expanded",
      correction: "Take deeper breath, expand ribcage more",
      impact: "+3 points",
    },
    {
      pose: "Most Muscular",
      current: "Shoulders hunched too high",
      correction: "Lower shoulders, push chest forward",
      impact: "+5 points",
    },
  ];

  return (
    <Card data-testid="card-pose-corrections">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">
          Pose Corrections
        </h3>
        <div className="rounded-md bg-primary/10 p-2">
          <Lightbulb className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {corrections.map((item) => (
          <div key={item.pose} className="p-3 rounded-md border bg-card/50 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-semibold text-sm">{item.pose}</h4>
              <span className="text-xs font-semibold text-primary">{item.impact}</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <div className="flex-1 space-y-1">
                <p className="text-muted-foreground">Current:</p>
                <p className="font-body">{item.current}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground mt-4 flex-shrink-0" />
              <div className="flex-1 space-y-1">
                <p className="text-muted-foreground">Correction:</p>
                <p className="font-body text-chart-4">{item.correction}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
