import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle, Target, Sparkles } from "lucide-react";

interface AIAnalysisResultsProps {
  results: {
    vision: any | null;
    coaching: any | null;
  };
}

export function AIAnalysisResults({ results }: AIAnalysisResultsProps) {
  const { vision, coaching } = results;

  return (
    <div className="space-y-4 w-full max-w-full min-w-0" data-testid="ai-analysis-results">
      {coaching && (
        <Card className="w-full max-w-full min-w-0">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3 space-y-0">
            <h3 className="text-sm font-heading font-semibold">AI Coaching Feedback</h3>
            <div className="rounded-md bg-primary/10 p-2">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {coaching.strengths && coaching.strengths.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-chart-4" />
                  <h4 className="text-xs font-semibold text-chart-4">Strengths</h4>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {coaching.strengths.map((strength: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-chart-4 mt-0.5">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {coaching.areasToImprove && coaching.areasToImprove.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-chart-1" />
                  <h4 className="text-xs font-semibold text-chart-1">Areas to Improve</h4>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {coaching.areasToImprove.map((area: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-chart-1 mt-0.5">•</span>
                      <span>{area}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {coaching.specificRecommendations && coaching.specificRecommendations.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  <h4 className="text-xs font-semibold">Recommendations</h4>
                </div>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {coaching.specificRecommendations.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {coaching.trainingFocus && (
              <div className="p-3 rounded-md bg-primary/5 border border-primary/20">
                <h4 className="text-xs font-semibold mb-1">Training Focus</h4>
                <p className="text-xs text-muted-foreground">{coaching.trainingFocus}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {vision && (
        <Card className="w-full max-w-full min-w-0">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3 space-y-0">
            <h3 className="text-sm font-heading font-semibold">Vision Analysis</h3>
            <Badge variant="secondary" className="text-[10px]">Beta</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {vision.muscleDefinition && (
              <div>
                <h4 className="text-xs font-semibold mb-1">Muscle Definition</h4>
                <p className="text-xs text-muted-foreground">{vision.muscleDefinition}</p>
              </div>
            )}
            {vision.vascularity && (
              <div>
                <h4 className="text-xs font-semibold mb-1">Vascularity</h4>
                <p className="text-xs text-muted-foreground">{vision.vascularity}</p>
              </div>
            )}
            {vision.conditioningNotes && (
              <div>
                <h4 className="text-xs font-semibold mb-1">Conditioning</h4>
                <p className="text-xs text-muted-foreground">{vision.conditioningNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
