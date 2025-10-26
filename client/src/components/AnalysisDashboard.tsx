import { useState } from "react";
import { Clock, Target, TrendingUp, AlertCircle, CheckCircle, Ruler, Sparkles } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { FormScoreCard } from "./FormScoreCard";
import { SymmetryCard } from "./SymmetryCard";
import { MuscleGroupCard } from "./MuscleGroupCard";
import { ConditioningCard } from "./ConditioningCard";
import { PosingCard } from "./PosingCard";
import { CategorySelector } from "./CategorySelector";
import { DetailedScoreBreakdown } from "./DetailedScoreBreakdown";
import { ComparisonMode } from "./ComparisonMode";
import { PoseCorrections } from "./PoseCorrections";
import { JudgingNotes } from "./JudgingNotes";
import { FrameTimeline } from "./FrameTimeline";
import { RecommendationCard } from "./RecommendationCard";
import { DetectedPosesList } from "./DetectedPosesList";
import { PoseSnapshots } from "./PoseSnapshots";
import { AIModelSelector } from "./AIModelSelector";
import { AIAnalysisResults } from "./AIAnalysisResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { VideoAnalysis } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AnalysisDashboardProps {
  analysis: VideoAnalysis;
  captureFrame?: (() => string | null) | null;
  isFrameReady?: boolean;
}

export function AnalysisDashboard({ analysis, captureFrame, isFrameReady = false }: AnalysisDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState(analysis.category);
  const [visionModel, setVisionModel] = useState("gpt-4o");
  const [coachingModel, setCoachingModel] = useState("claude-sonnet-4");
  const [aiResults, setAiResults] = useState<any>(null);
  const { toast } = useToast();

  const handleExport = () => {
    console.log("Exporting analysis report...");
  };

  const runAIAnalysisMutation = useMutation({
    mutationFn: async () => {
      // Capture a frame from video for vision analysis (if enabled)
      let visionResult = null;
      if (visionModel !== "none") {
        if (!captureFrame) {
          console.warn("Vision analysis skipped: Frame capture not available");
        } else {
          const frameBase64 = captureFrame();
          if (!frameBase64) {
            console.warn("Vision analysis skipped: Failed to capture video frame");
          } else {
            visionResult = await apiRequest(`/api/analyses/${analysis.id}/vision`, {
              method: "POST",
              body: JSON.stringify({ 
                model: visionModel,
                frameBase64,
              }),
            });
          }
        }
      }

      // Run coaching analysis
      let coachingResult = null;
      if (coachingModel !== "none") {
        coachingResult = await apiRequest(`/api/analyses/${analysis.id}/coaching`, {
          method: "POST",
          body: JSON.stringify({ model: coachingModel }),
        });
      }

      if (!visionResult && !coachingResult) {
        throw new Error("No analysis performed. Please select at least one model.");
      }

      return { vision: visionResult, coaching: coachingResult };
    },
    onSuccess: (data) => {
      setAiResults(data);
      const parts = [];
      if (data.vision) parts.push("vision");
      if (data.coaching) parts.push("coaching");
      
      toast({
        title: "AI Analysis Complete",
        description: parts.length > 0 
          ? `${parts.join(" and ")} analysis ready`
          : "Analysis complete",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to generate AI analysis",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="px-3 sm:px-4 pt-3 pb-2 border-b flex-shrink-0 space-y-2 w-full max-w-full">
        <div className="flex items-center justify-center gap-2 px-2 py-1 rounded-md bg-chart-4/10 border border-chart-4/20">
          <div className="h-2 w-2 rounded-full bg-chart-4 animate-pulse" />
          <span className="text-[10px] sm:text-xs font-semibold text-chart-4">Real MediaPipe Analysis</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="w-full"
          data-testid="button-export-report"
        >
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden min-h-0 w-full max-w-full min-w-0">
        <div className="px-3 sm:px-4 pt-3 pb-2 flex-shrink-0 w-full max-w-full min-w-0">
          <TabsList className="grid w-full max-w-full grid-cols-4 text-xs" data-testid="tabs-analysis">
            <TabsTrigger value="overview" className="px-1 text-[10px] sm:text-xs min-w-0">Overview</TabsTrigger>
            <TabsTrigger value="detailed" className="px-1 text-[10px] sm:text-xs min-w-0">Detailed</TabsTrigger>
            <TabsTrigger value="corrections" className="px-1 text-[10px] sm:text-xs min-w-0">Fixes</TabsTrigger>
            <TabsTrigger value="progress" className="px-1 text-[10px] sm:text-xs min-w-0">Progress</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 min-h-0 w-full max-w-full overflow-x-hidden">
          <div className="p-3 sm:p-4 pt-2 space-y-4 w-full max-w-full min-w-0">
            <TabsContent value="overview" className="mt-0 space-y-4 w-full max-w-full min-w-0">
              <CategorySelector
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />

              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <MetricCard
                  title="Poses Detected"
                  value={(analysis.detectedPoses as any[])?.length || Object.keys(analysis.poseScores as Record<string, number>).length}
                  icon={Target}
                  description="Unique poses found"
                />
                <MetricCard
                  title="Video Duration"
                  value={formatDuration(analysis.duration)}
                  icon={Clock}
                  description="Total length"
                />
              </div>

              {analysis.detectedPoses && (analysis.detectedPoses as any[]).length > 0 ? (
                <>
                  <PoseSnapshots detectedPoses={analysis.detectedPoses as any[]} />
                  <DetectedPosesList poses={analysis.detectedPoses as any[]} />
                </>
              ) : null}

              <FormScoreCard 
                score={analysis.overallScore}
                muscularityScore={analysis.muscularityScore}
                symmetryScore={analysis.symmetryScore}
                conditioningScore={analysis.conditioningScore}
                aestheticsScore={analysis.aestheticsScore}
              />
              <MuscleGroupCard muscleGroups={analysis.muscleGroups as Record<string, string>} />
              <SymmetryCard measurements={analysis.measurements as any} />
              <ConditioningCard measurements={analysis.measurements as any} />
              <FrameTimeline />
            </TabsContent>

            <TabsContent value="detailed" className="mt-0 space-y-4 w-full max-w-full min-w-0">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <MetricCard
                  title="V-Taper Ratio"
                  value={(analysis.measurements as any).vTaperRatio}
                  icon={Ruler}
                  description="Shoulder to waist"
                />
                <MetricCard
                  title="Best Pose Score"
                  value={`${Math.max(...Object.values(analysis.poseScores as Record<string, number>))}%`}
                  icon={TrendingUp}
                  description="Top pose"
                />
              </div>

              <PosingCard poseScores={analysis.poseScores as Record<string, number>} />
              <DetailedScoreBreakdown analysis={analysis} />
              <JudgingNotes notes={(analysis.judgeNotes as any[]) || []} />

              <div className="space-y-3">
                <h3 className="font-heading font-semibold text-sm">Body Measurements</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-3 rounded-md bg-card border">
                    <span>Shoulder Width</span>
                    <span className="font-semibold">{(analysis.measurements as any).shoulderWidth}cm</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-md bg-card border">
                    <span>Waist Width</span>
                    <span className="font-semibold">{(analysis.measurements as any).waistWidth}cm</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-md bg-card border">
                    <span>V-Taper Ratio</span>
                    <span className="font-semibold">{(analysis.measurements as any).vTaperRatio}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-md bg-card border">
                    <span>Upper/Lower Ratio</span>
                    <span className="font-semibold">{(analysis.measurements as any).upperLowerRatio}</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="corrections" className="mt-0 space-y-4 w-full max-w-full min-w-0">
              <PoseCorrections />
              <ConditioningCard measurements={analysis.measurements as any} />
              <MuscleGroupCard muscleGroups={analysis.muscleGroups as Record<string, string>} />
              <SymmetryCard measurements={analysis.measurements as any} />
            </TabsContent>

            <TabsContent value="progress" className="mt-0 space-y-4 w-full max-w-full min-w-0">
              <AIModelSelector
                visionModel={visionModel}
                coachingModel={coachingModel}
                onVisionModelChange={setVisionModel}
                onCoachingModelChange={setCoachingModel}
              />

              <Button
                onClick={() => runAIAnalysisMutation.mutate()}
                disabled={
                  runAIAnalysisMutation.isPending || 
                  (visionModel === "none" && coachingModel === "none") ||
                  (visionModel !== "none" && !isFrameReady)
                }
                className="w-full"
                data-testid="button-ai-analysis"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {runAIAnalysisMutation.isPending 
                  ? "Analyzing..." 
                  : !isFrameReady && visionModel !== "none"
                  ? "Loading video..."
                  : "Analyze with AI"}
              </Button>

              {!isFrameReady && visionModel !== "none" && (
                <p className="text-xs text-muted-foreground text-center">
                  Waiting for video to load for frame capture...
                </p>
              )}

              {aiResults && (
                <AIAnalysisResults results={aiResults} />
              )}

              <ComparisonMode />
              <FormScoreCard 
                score={analysis.overallScore}
                muscularityScore={analysis.muscularityScore}
                symmetryScore={analysis.symmetryScore}
                conditioningScore={analysis.conditioningScore}
                aestheticsScore={analysis.aestheticsScore}
              />
              <FrameTimeline />
            </TabsContent>

            <TabsContent value="recommendations" className="mt-0 space-y-4 hidden">
              {(analysis.recommendations as any[]).map((rec: any, index: number) => {
                const getIcon = () => {
                  switch (rec.type) {
                    case "strength": return CheckCircle;
                    case "weakness": return AlertCircle;
                    default: return TrendingUp;
                  }
                };
                return (
                  <RecommendationCard
                    key={index}
                    icon={getIcon()}
                    title={rec.title}
                    description={rec.description}
                  />
                );
              })}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
