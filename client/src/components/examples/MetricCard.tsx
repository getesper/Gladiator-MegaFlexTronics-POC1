import { MetricCard } from "../MetricCard";
import { Target } from "lucide-react";

export default function MetricCardExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <MetricCard
        title="Poses Detected"
        value={12}
        icon={Target}
        description="Total unique poses"
      />
    </div>
  );
}
