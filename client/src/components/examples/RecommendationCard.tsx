import { RecommendationCard } from "../RecommendationCard";
import { CheckCircle } from "lucide-react";

export default function RecommendationCardExample() {
  return (
    <div className="max-w-md p-4">
      <RecommendationCard
        icon={CheckCircle}
        title="Strong Core Stability"
        description="Your core engagement is excellent throughout the pose. Maintain this level of tension for consistent results."
      />
    </div>
  );
}
