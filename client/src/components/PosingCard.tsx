import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PosingCardProps {
  poseScores?: Record<string, number>;
}

export function PosingCard({ poseScores }: PosingCardProps) {
  const getStatus = (score: number) => {
    if (score >= 90) return "excellent";
    if (score >= 80) return "good";
    return "fair";
  };

  const formatPoseName = (key: string) => {
    return key
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const poses = poseScores
    ? Object.entries(poseScores).map(([name, score]) => ({
        name: formatPoseName(name),
        score,
        status: getStatus(score),
      }))
    : [
        { name: "Front Double Biceps", score: 92, status: "excellent" },
        { name: "Side Chest", score: 85, status: "good" },
        { name: "Back Double Biceps", score: 88, status: "good" },
        { name: "Most Muscular", score: 78, status: "fair" },
      ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-chart-4 text-white";
      case "good":
        return "bg-chart-3 text-black";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card data-testid="card-posing" className="w-full max-w-full min-w-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">
          Mandatory Poses
        </h3>
        <div className="rounded-md bg-primary/10 p-2">
          <User className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {poses.map((pose) => (
          <div key={pose.name} className="flex items-center justify-between p-2 rounded-md border">
            <div className="space-y-1">
              <p className="text-sm font-body font-semibold">{pose.name}</p>
              <p className="text-xs text-muted-foreground">Score: {pose.score}/100</p>
            </div>
            <Badge 
              className={`${getStatusColor(pose.status)} no-default-hover-elevate no-default-active-elevate`}
            >
              {pose.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
