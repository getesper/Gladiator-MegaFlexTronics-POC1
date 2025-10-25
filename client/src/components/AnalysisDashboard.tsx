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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function AnalysisDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("bodybuilding");

  const handleExport = () => {
    console.log("Exporting analysis report...");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pt-4 pb-2 border-b">
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

      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <div className="px-6 pt-4 pb-2">
          <TabsList className="grid w-full grid-cols-4 text-xs" data-testid="tabs-analysis">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
            <TabsTrigger value="corrections">Fixes</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 pt-4">
            <TabsContent value="overview" className="mt-0 space-y-6">
              <CategorySelector
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />

              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="Poses Analyzed"
                  value={4}
                  icon={Target}
                  description="Mandatory poses"
                />
                <MetricCard
                  title="Video Duration"
                  value="0:24"
                  icon={Clock}
                  description="Total length"
                />
              </div>

              <FormScoreCard score={86} />
              <MuscleGroupCard />
              <SymmetryCard />
              <ConditioningCard />
              <FrameTimeline />
            </TabsContent>

            <TabsContent value="detailed" className="mt-0 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="V-Taper Ratio"
                  value="1.42"
                  icon={Ruler}
                  description="Shoulder to waist"
                />
                <MetricCard
                  title="Best Pose Score"
                  value="92%"
                  icon={TrendingUp}
                  description="Front double biceps"
                />
              </div>

              <PosingCard />
              <DetailedScoreBreakdown />
              <JudgingNotes />

              <div className="space-y-3">
                <h3 className="font-heading font-semibold text-sm">Body Measurements</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-3 rounded-md bg-card border">
                    <span>Shoulder Width</span>
                    <span className="font-semibold">48cm</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-md bg-card border">
                    <span>Waist Width</span>
                    <span className="font-semibold">34cm</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-md bg-card border">
                    <span>V-Taper Ratio</span>
                    <span className="font-semibold">1.42</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-md bg-card border">
                    <span>Upper/Lower Ratio</span>
                    <span className="font-semibold">1.15</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="corrections" className="mt-0 space-y-6">
              <PoseCorrections />
              <ConditioningCard />
              <MuscleGroupCard />
              <SymmetryCard />
            </TabsContent>

            <TabsContent value="progress" className="mt-0 space-y-6">
              <ComparisonMode />
              <FormScoreCard score={86} />
              <FrameTimeline />
            </TabsContent>

            <TabsContent value="recommendations" className="mt-0 space-y-4 hidden">
              <RecommendationCard
                icon={CheckCircle}
                title="Excellent Muscularity"
                description="Your chest and lats show exceptional development with clear separation. This aligns well with IFBB judging standards for mass and density."
              />
              <RecommendationCard
                icon={AlertCircle}
                title="Improve Calf Development"
                description="Calf muscles appear underdeveloped compared to upper body. Focus on proportional growth to enhance overall symmetry scores."
              />
              <RecommendationCard
                icon={TrendingUp}
                title="Enhance Conditioning"
                description="Reduce body fat by 1-2% to achieve better muscle striations and the 'dry' look judges favor in competition."
              />
              <RecommendationCard
                icon={Target}
                title="Refine Most Muscular Pose"
                description="Your most muscular pose scored 78/100. Work on highlighting your strengths while maintaining smooth transitions between poses."
              />
              <RecommendationCard
                icon={CheckCircle}
                title="Strong V-Taper Aesthetics"
                description="Your shoulder-to-waist ratio of 1.42 is excellent and meets the aesthetic ideal for bodybuilding competitions."
              />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
