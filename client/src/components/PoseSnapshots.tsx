import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Award, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DetectedPose {
  poseName: string;
  timestamp: number;
  score: number;
  frameSnapshot: string | null;
}

interface PoseSnapshotsProps {
  detectedPoses: DetectedPose[];
}

// Convert pose name to readable format
const formatPoseName = (poseName: string): string => {
  const poseNames: Record<string, string> = {
    frontDoubleBiceps: "Front Double Biceps",
    backDoubleBiceps: "Back Double Biceps",
    frontLatSpread: "Front Lat Spread",
    backLatSpread: "Back Lat Spread",
    sideChest: "Side Chest",
    sideTriceps: "Side Triceps",
    absAndThighs: "Abs & Thighs",
    mostMuscular: "Most Muscular",
    generalPose: "Transition",
  };
  return poseNames[poseName] || poseName;
};

// Get score color based on value
const getScoreColor = (score: number): string => {
  if (score >= 90) return "text-chart-2";
  if (score >= 80) return "text-chart-1";
  if (score >= 70) return "text-chart-3";
  return "text-chart-5";
};

export function PoseSnapshots({ detectedPoses }: PoseSnapshotsProps) {
  const [selectedPose, setSelectedPose] = useState<DetectedPose | null>(null);
  
  // Filter out poses without snapshots and general transitions
  const posesWithSnapshots = detectedPoses.filter(
    pose => pose.frameSnapshot && pose.poseName !== "generalPose"
  );

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (posesWithSnapshots.length === 0) {
    return (
      <Card data-testid="card-pose-snapshots">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Maximize2 className="h-4 w-4" />
            Pose Snapshots
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Detected bodybuilding poses with frame captures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-xs sm:text-sm text-muted-foreground text-center py-4">
            No pose snapshots captured. Upload a new video for analysis.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card data-testid="card-pose-snapshots">
        <CardHeader>
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <Maximize2 className="h-4 w-4" />
            Pose Snapshots ({posesWithSnapshots.length})
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Click any pose to view detailed analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {posesWithSnapshots.map((pose, index) => (
                <button
                  key={`${pose.poseName}-${pose.timestamp}-${index}`}
                  onClick={() => setSelectedPose(pose)}
                  className="group relative overflow-hidden rounded-md border hover-elevate active-elevate-2 transition-all bg-card"
                  data-testid={`button-pose-snapshot-${index}`}
                >
                  <div className="aspect-video relative">
                    {pose.frameSnapshot ? (
                      <img
                        src={pose.frameSnapshot}
                        alt={formatPoseName(pose.poseName)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No snapshot</span>
                      </div>
                    )}
                    
                    <div className="absolute top-1 right-1">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                        <Award className="h-2.5 w-2.5 mr-0.5" />
                        <span className={getScoreColor(pose.score)}>{pose.score}</span>
                      </Badge>
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <div className="text-[10px] sm:text-xs font-medium text-white line-clamp-1">
                        {formatPoseName(pose.poseName)}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-white/80">
                        <Clock className="h-2.5 w-2.5" />
                        {formatTime(pose.timestamp)}
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-background/90 rounded-full p-2">
                        <Maximize2 className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Expanded View Dialog */}
      <Dialog open={!!selectedPose} onOpenChange={(open) => !open && setSelectedPose(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto" data-testid="dialog-pose-detail">
          {selectedPose && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
                  {formatPoseName(selectedPose.poseName)}
                  <Badge variant="outline" className="ml-2">
                    <Award className="h-3 w-3 mr-1" />
                    <span className={getScoreColor(selectedPose.score)}>{selectedPose.score}/100</span>
                  </Badge>
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-xs sm:text-sm">
                  <Clock className="h-3 w-3" />
                  {formatTime(selectedPose.timestamp)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden border bg-muted">
                  {selectedPose.frameSnapshot && (
                    <img
                      src={selectedPose.frameSnapshot}
                      alt={formatPoseName(selectedPose.poseName)}
                      className="w-full h-auto"
                      data-testid="img-pose-snapshot-expanded"
                    />
                  )}
                </div>

                <div className="grid gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Pose Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Form Score</span>
                        <span className={`text-sm font-semibold ${getScoreColor(selectedPose.score)}`}>
                          {selectedPose.score}/100
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Pose Type</span>
                        <Badge variant="outline" className="text-xs">
                          {formatPoseName(selectedPose.poseName)}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Timestamp</span>
                        <span className="text-xs font-mono">{formatTime(selectedPose.timestamp)}</span>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          This pose was automatically detected using MediaPipe pose estimation during video analysis.
                          The score reflects form quality, symmetry, and execution.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Judging Criteria</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-chart-2 mt-1.5" />
                          <div>
                            <div className="font-medium">Muscle Definition</div>
                            <div className="text-muted-foreground">Clear separation and striations visible</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-chart-1 mt-1.5" />
                          <div>
                            <div className="font-medium">Symmetry</div>
                            <div className="text-muted-foreground">Balanced left and right development</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-chart-3 mt-1.5" />
                          <div>
                            <div className="font-medium">Posing Execution</div>
                            <div className="text-muted-foreground">Proper form and technique</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedPose(null)}
                  data-testid="button-close-pose-detail"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    if (selectedPose.frameSnapshot) {
                      const link = document.createElement('a');
                      link.href = selectedPose.frameSnapshot;
                      link.download = `${formatPoseName(selectedPose.poseName)}-${selectedPose.timestamp}s.jpg`;
                      link.click();
                    }
                  }}
                  data-testid="button-download-snapshot"
                >
                  Download Snapshot
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
