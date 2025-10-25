import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DetectedPose {
  poseName: string;
  timestamp: number;
  score: number;
  frameSnapshot: string | null;
}

interface DetectedPosesListProps {
  poses: DetectedPose[];
}

export function DetectedPosesList({ poses }: DetectedPosesListProps) {
  const formatPoseName = (name: string) => {
    return name
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-chart-4 text-white";
    if (score >= 75) return "bg-chart-3 text-black";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card data-testid="card-detected-poses">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">
          Detected Poses ({poses.length})
        </h3>
        <div className="rounded-md bg-primary/10 p-2">
          <User className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {poses.map((pose, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-md border hover-elevate"
            data-testid={`pose-item-${index}`}
          >
            <div className="flex-1 space-y-1">
              <p className="text-sm font-body font-semibold">
                {formatPoseName(pose.poseName)}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTimestamp(pose.timestamp)}</span>
              </div>
            </div>
            <Badge 
              className={`${getScoreBadgeColor(pose.score)} no-default-hover-elevate no-default-active-elevate`}
              data-testid={`badge-score-${index}`}
            >
              {pose.score}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
