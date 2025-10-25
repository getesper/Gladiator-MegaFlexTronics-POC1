import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Film } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function FrameTimeline() {
  const frames = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    timestamp: `0:${String(i * 2).padStart(2, "0")}`,
    quality: i % 3 === 0 ? "excellent" : i % 2 === 0 ? "good" : "fair",
  }));

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "excellent":
        return "bg-chart-4";
      case "good":
        return "bg-chart-3";
      default:
        return "bg-muted";
    }
  };

  return (
    <Card data-testid="card-frame-timeline">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">
          Frame Timeline
        </h3>
        <div className="rounded-md bg-primary/10 p-2">
          <Film className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2">
            {frames.map((frame) => (
              <button
                key={frame.id}
                className="flex-shrink-0 hover-elevate active-elevate-2 rounded-md overflow-hidden border border-border transition-all focus:ring-2 focus:ring-primary"
                onClick={() => console.log(`Jump to frame ${frame.id}`)}
                data-testid={`button-frame-${frame.id}`}
              >
                <div className="relative w-20 h-14 bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                    Frame {frame.id}
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${getQualityColor(frame.quality)}`} />
                  <div className="absolute top-1 right-1">
                    <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                      {frame.timestamp}
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
