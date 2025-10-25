import { Clock, Target, Activity, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { FormScoreCard } from "./FormScoreCard";
import { SymmetryCard } from "./SymmetryCard";
import { MuscleGroupCard } from "./MuscleGroupCard";
import { FrameTimeline } from "./FrameTimeline";
import { RecommendationCard } from "./RecommendationCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AnalysisDashboard() {
  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <div className="px-6 pt-6 pb-2">
          <TabsList className="grid w-full grid-cols-3" data-testid="tabs-analysis">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
            <TabsTrigger value="recommendations">Tips</TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 pt-4">
            <TabsContent value="overview" className="mt-0 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="Poses Detected"
                  value={12}
                  icon={Target}
                  description="Total unique poses"
                />
                <MetricCard
                  title="Video Duration"
                  value="0:24"
                  icon={Clock}
                  description="Analyzed length"
                />
              </div>

              <FormScoreCard score={86} />
              <SymmetryCard />
              <MuscleGroupCard />
              <FrameTimeline />
            </TabsContent>

            <TabsContent value="detailed" className="mt-0 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="Avg Joint Angle"
                  value="142°"
                  icon={Activity}
                  description="Elbow flexion"
                />
                <MetricCard
                  title="Peak Performance"
                  value="94%"
                  icon={TrendingUp}
                  description="Best frame score"
                />
              </div>

              <FormScoreCard score={86} />
              <SymmetryCard />
              <MuscleGroupCard />

              <div className="space-y-3">
                <h3 className="font-heading font-semibold text-sm">Joint Angles</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-3 rounded-md bg-card border">
                    <span>Left Elbow</span>
                    <span className="font-semibold">138°</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-md bg-card border">
                    <span>Right Elbow</span>
                    <span className="font-semibold">146°</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-md bg-card border">
                    <span>Left Shoulder</span>
                    <span className="font-semibold">92°</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-md bg-card border">
                    <span>Right Shoulder</span>
                    <span className="font-semibold">88°</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="mt-0 space-y-4">
              <RecommendationCard
                icon={CheckCircle}
                title="Strong Core Stability"
                description="Your core engagement is excellent throughout the pose. Maintain this level of tension for consistent results."
              />
              <RecommendationCard
                icon={AlertCircle}
                title="Balance Right Shoulder"
                description="Your right shoulder is slightly lower than the left. Focus on symmetrical positioning to improve overall balance."
              />
              <RecommendationCard
                icon={TrendingUp}
                title="Improve Leg Definition"
                description="Consider adding more quad flexion in your poses. This will enhance muscle definition and create better visual impact."
              />
              <RecommendationCard
                icon={Target}
                title="Posture Alignment"
                description="Your posture is generally good, but maintaining a straighter back will improve your form score by 5-8 points."
              />
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
