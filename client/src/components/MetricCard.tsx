import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down";
}

export function MetricCard({ title, value, icon: Icon, description, trend }: MetricCardProps) {
  return (
    <Card className="hover-elevate min-w-0" data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2 space-y-0">
        <h3 className="text-xs sm:text-sm font-heading font-semibold text-muted-foreground truncate">
          {title}
        </h3>
        <div className="rounded-md bg-primary/10 p-1.5 sm:p-2 flex-shrink-0">
          <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 min-w-0">
          <div className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold truncate" data-testid={`text-value-${title.toLowerCase().replace(/\s+/g, "-")}`}>
            {value}
          </div>
          {description && (
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
