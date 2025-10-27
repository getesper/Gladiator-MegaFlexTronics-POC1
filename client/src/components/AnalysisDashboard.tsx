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
import { DetailedMuscleAnalysis } from "./DetailedMuscleAnalysis";
import { MuscleRegionAnalysis } from "./MuscleRegionAnalysis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import type { VideoAnalysis } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
  const [poseIdentModel, setPoseIdentModel] = useState("gpt-4o");
  const [muscleAnalysisModel, setMuscleAnalysisModel] = useState("gpt-4o");
  const [muscleAnalysisResults, setMuscleAnalysisResults] = useState<any>(analysis.muscleAnalysis || null);
  const { toast } = useToast();

  const handleExport = () => {
    console.log("Exporting analysis report...");
  };

  const runPoseIdentificationMutation = useMutation({
    mutationFn: async () => {
      const result = await apiRequest(`/api/analyses/${analysis.id}/identify-poses`, {
        method: "POST",
        body: JSON.stringify({ model: poseIdentModel }),
      });
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Poses Re-Identified!",
        description: `Found ${data.summary.uniquePoses} unique poses using VLM analysis`,
      });
      // Refresh the page to show updated poses
      queryClient.invalidateQueries({ queryKey: ["/api/analyses"] });
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Pose Identification Failed",
        description: error.message || "Failed to identify poses",
        variant: "destructive",
      });
    },
  });

  const runMuscleAnalysisMutation = useMutation({
    mutationFn: async () => {
      if (!captureFrame) {
        throw new Error("Frame capture not available");
      }
      
      const frameBase64 = captureFrame();
      if (!frameBase64) {
        throw new Error("Failed to capture video frame");
      }

      const result = await apiRequest(`/api/analyses/${analysis.id}/muscle-analysis`, {
        method: "POST",
        body: JSON.stringify({ 
          model: muscleAnalysisModel,
          frameBase64,
        }),
      });
      return result;
    },
    onSuccess: (data) => {
      setMuscleAnalysisResults(data);
      toast({
        title: "Muscle Analysis Complete!",
        description: "Detailed per-muscle breakdown ready",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/analyses"] });
    },
    onError: (error: any) => {
      toast({
        title: "Muscle Analysis Failed",
        description: error.message || "Failed to analyze muscle groups",
        variant: "destructive",
      });
    },
  });

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

      <Tabs defaultValue="overview" className="flex-1 flex flex-col overflow-hidden min-h-0 w-full min-w-0">
        <div className="px-3 sm:px-4 pt-3 pb-2 flex-shrink-0 w-full min-w-0">
          <TabsList className="grid w-full grid-cols-4 text-xs" data-testid="tabs-analysis">
            <TabsTrigger value="overview" className="px-1 text-[10px] sm:text-xs min-w-0 truncate">Overview</TabsTrigger>
            <TabsTrigger value="detailed" className="px-1 text-[10px] sm:text-xs min-w-0 truncate">Detailed</TabsTrigger>
            <TabsTrigger value="corrections" className="px-1 text-[10px] sm:text-xs min-w-0 truncate">Fixes</TabsTrigger>
            <TabsTrigger value="progress" className="px-1 text-[10px] sm:text-xs min-w-0 truncate">Progress</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 min-h-0 w-full">
          <div className="p-3 sm:p-4 pt-2 space-y-4 w-full min-w-0">
            <TabsContent value="overview" className="mt-0 space-y-4 w-full min-w-0">
              <CategorySelector
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />

              <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full min-w-0">
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

            <TabsContent value="detailed" className="mt-0 space-y-4 w-full min-w-0">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full min-w-0">
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

              <MuscleRegionAnalysis />
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

            <TabsContent value="corrections" className="mt-0 space-y-4 w-full min-w-0">
              <PoseCorrections />
              <ConditioningCard measurements={analysis.measurements as any} />
              <MuscleGroupCard muscleGroups={analysis.muscleGroups as Record<string, string>} />
              <SymmetryCard measurements={analysis.measurements as any} />
            </TabsContent>

            <TabsContent value="progress" className="mt-0 space-y-4 w-full min-w-0">
              <Card data-testid="card-pose-identification" className="w-full min-w-0 border-primary/20 bg-primary/5">
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-heading font-semibold">VLM Pose Identification</h3>
                  <p className="text-xs text-muted-foreground">
                    Use Vision Language Models to accurately identify poses from video frames
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => runPoseIdentificationMutation.mutate()}
                    disabled={runPoseIdentificationMutation.isPending}
                    className="w-full"
                    variant="default"
                    data-testid="button-identify-poses"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {runPoseIdentificationMutation.isPending 
                      ? "Identifying Poses..." 
                      : "Re-Identify Poses with VLM"}
                  </Button>
                  <p className="text-[10px] text-muted-foreground italic">
                    ⚡ This replaces geometric pose detection with actual image analysis for accurate results
                  </p>
                </CardContent>
              </Card>

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

              <Card data-testid="card-muscle-analysis" className="w-full min-w-0 border-chart-2/20 bg-chart-2/5">
                <CardHeader className="pb-3">
                  <h3 className="text-sm font-heading font-semibold">Detailed Muscle Analysis</h3>
                  <p className="text-xs text-muted-foreground">
                    Get individual scores for each muscle group (pecs, biceps, triceps, abs, etc.)
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Select Model</label>
                    <select
                      value={muscleAnalysisModel}
                      onChange={(e) => setMuscleAnalysisModel(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-md border bg-background"
                      data-testid="select-muscle-model"
                    >
                      <option value="gpt-4o">GPT-4o (Replit Credits)</option>
                      <option value="gemini-2.5-pro">Gemini 2.5 Pro (Requires API Key)</option>
                      <option value="claude-sonnet-4">Claude Sonnet 4 (Requires API Key)</option>
                    </select>
                  </div>
                  
                  <Button
                    onClick={() => runMuscleAnalysisMutation.mutate()}
                    disabled={runMuscleAnalysisMutation.isPending || !isFrameReady}
                    className="w-full"
                    variant="default"
                    data-testid="button-muscle-analysis"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {runMuscleAnalysisMutation.isPending 
                      ? "Analyzing Muscles..." 
                      : !isFrameReady
                      ? "Loading video..."
                      : "Analyze Individual Muscles"}
                  </Button>
                  
                  <p className="text-[10px] text-muted-foreground italic">
                    ⚡ Analyzes 13 muscle groups: pecs, biceps, triceps, forearms, shoulders, abs, obliques, lats, traps, quads, hamstrings, glutes, calves
                  </p>
                </CardContent>
              </Card>

              {muscleAnalysisResults && (
                <DetailedMuscleAnalysis muscleData={muscleAnalysisResults} />
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
