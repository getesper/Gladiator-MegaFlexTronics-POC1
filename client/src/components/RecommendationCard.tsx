import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface RecommendationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function RecommendationCard({ icon: Icon, title, description }: RecommendationCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-recommendation-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardContent className="flex gap-4 p-4">
        <div className="flex-shrink-0 rounded-md bg-primary/10 p-3">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="space-y-1">
          <h4 className="font-heading font-semibold text-sm">{title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
