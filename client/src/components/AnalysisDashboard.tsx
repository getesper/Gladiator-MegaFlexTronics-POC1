import { useState } from "react";
import { Clock, Target, TrendingUp, AlertCircle, CheckCircle, Ruler } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { VideoAnalysis } from "@shared/schema";

interface AnalysisDashboardProps {
  analysis: VideoAnalysis;
}

export function AnalysisDashboard({ analysis }: AnalysisDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState(analysis.category);

  const handleExport = () => {
    console.log("Exporting analysis report...");
  };

  return (
    <div className="h-full flex flex-col min-w-0">
      <div className="px-4 lg:px-6 pt-4 pb-2 border-b">
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

      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-w-0">
        <div className="px-4 lg:px-6 pt-4 pb-2">
          <TabsList className="grid w-full grid-cols-4 text-xs sm:text-sm" data-testid="tabs-analysis">
            <TabsTrigger value="overview" className="px-2 sm:px-3">Overview</TabsTrigger>
            <TabsTrigger value="detailed" className="px-2 sm:px-3">Detailed</TabsTrigger>
            <TabsTrigger value="corrections" className="px-2 sm:px-3">Fixes</TabsTrigger>
            <TabsTrigger value="progress" className="px-2 sm:px-3">Progress</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 lg:p-6 pt-4">
            <TabsContent value="overview" className="mt-0 space-y-6">
              <CategorySelector
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {analysis.detectedPoses && (analysis.detectedPoses as any[]).length > 0 && (
                <DetectedPosesList poses={analysis.detectedPoses as any[]} />
              )}

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

            <TabsContent value="detailed" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <TabsContent value="corrections" className="mt-0 space-y-6">
              <PoseCorrections />
              <ConditioningCard measurements={analysis.measurements as any} />
              <MuscleGroupCard muscleGroups={analysis.muscleGroups as Record<string, string>} />
              <SymmetryCard measurements={analysis.measurements as any} />
            </TabsContent>

            <TabsContent value="progress" className="mt-0 space-y-6">
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
