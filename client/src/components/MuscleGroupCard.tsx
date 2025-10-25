import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell } from "lucide-react";

interface MuscleGroupCardProps {
  muscleGroups?: Record<string, string>;
}

export function MuscleGroupCard({ muscleGroups: muscleGroupsData }: MuscleGroupCardProps) {
  const getColor = (level: string) => {
    if (level === "high") return "bg-chart-4 text-white";
    if (level === "medium") return "bg-chart-3 text-black";
    return "bg-muted text-muted-foreground";
  };

  const muscleGroups = muscleGroupsData 
    ? Object.entries(muscleGroupsData).map(([name, level]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        level,
        color: getColor(level),
      }))
    : [
        { name: "Chest", level: "high", color: "bg-chart-4 text-white" },
        { name: "Shoulders", level: "high", color: "bg-chart-4 text-white" },
        { name: "Lats", level: "high", color: "bg-chart-4 text-white" },
        { name: "Arms", level: "medium", color: "bg-chart-3 text-black" },
        { name: "Quads", level: "medium", color: "bg-chart-3 text-black" },
        { name: "Calves", level: "low", color: "bg-muted text-muted-foreground" },
      ];

  return (
    <Card data-testid="card-muscle-groups">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">
          Muscularity Development
        </h3>
        <div className="rounded-md bg-primary/10 p-2">
          <Dumbbell className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {muscleGroups.map((group) => (
            <Badge
              key={group.name}
              className={`${group.color} no-default-hover-elevate no-default-active-elevate`}
              data-testid={`badge-muscle-${group.name.toLowerCase()}`}
            >
              {group.name}
            </Badge>
          ))}
        </div>
        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-4" />
            <span>Well-developed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-chart-3" />
            <span>Moderate development</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted" />
            <span>Needs improvement</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
