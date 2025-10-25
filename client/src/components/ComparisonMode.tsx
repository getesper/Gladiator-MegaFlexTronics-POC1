import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GitCompare } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ComparisonMode() {
  const comparisons = [
    { metric: "Overall Score", current: 86, previous: 82, ideal: 90 },
    { metric: "Muscularity", current: 85, previous: 80, ideal: 88 },
    { metric: "Symmetry", current: 78, previous: 75, ideal: 85 },
    { metric: "Conditioning", current: 92, previous: 88, ideal: 95 },
    { metric: "Posing", current: 84, previous: 79, ideal: 90 },
  ];

  const getChange = (current: number, previous: number) => {
    const diff = current - previous;
    return {
      value: Math.abs(diff),
      isPositive: diff > 0,
      color: diff > 0 ? "text-chart-4" : diff < 0 ? "text-destructive" : "text-muted-foreground",
    };
  };

  return (
    <Card data-testid="card-comparison-mode">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">
          Progress Comparison
        </h3>
        <div className="rounded-md bg-primary/10 p-2">
          <GitCompare className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {comparisons.map((item) => {
          const change = getChange(item.current, item.previous);
          return (
            <div key={item.metric} className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-body font-semibold">{item.metric}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-heading font-bold ${change.color}`}>
                    {change.isPositive ? "+" : "-"}{change.value}
                  </span>
                  <span className="text-muted-foreground">vs. previous</span>
                </div>
              </div>
              <div className="relative">
                <Progress value={item.current} className="h-2" />
                <div
                  className="absolute top-0 h-2 w-0.5 bg-chart-3"
                  style={{ left: `${item.ideal}%` }}
                  title={`Ideal: ${item.ideal}`}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Current: {item.current}</span>
                <span>Previous: {item.previous}</span>
                <span>Ideal: {item.ideal}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
