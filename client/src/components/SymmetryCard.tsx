import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Scale } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SymmetryCardProps {
  measurements?: {
    leftRightSymmetry?: number;
  };
}

export function SymmetryCard({ measurements }: SymmetryCardProps) {
  const symmetryScore = measurements?.leftRightSymmetry || 96;
  const leftSide = 50 + (symmetryScore / 200);
  const rightSide = 100 - leftSide;
  const difference = Math.abs(leftSide - rightSide);

  return (
    <Card data-testid="card-symmetry" className="w-full max-w-full min-w-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">
          Symmetry Analysis
        </h3>
        <div className="rounded-md bg-primary/10 p-2">
          <Scale className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-body">Left Side</span>
            <span className="font-body font-semibold">{leftSide}%</span>
          </div>
          <Progress value={leftSide} className="h-2" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-body">Right Side</span>
            <span className="font-body font-semibold">{rightSide}%</span>
          </div>
          <Progress value={rightSide} className="h-2" />
        </div>
        
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Balance Difference</span>
            <span className={`text-sm font-heading font-bold ${
              difference < 5 ? "text-chart-4" : difference < 10 ? "text-chart-3" : "text-destructive"
            }`} data-testid="text-difference">
              {difference}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
