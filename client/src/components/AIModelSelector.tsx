import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, Eye } from "lucide-react";

interface AIModelSelectorProps {
  visionModel: string;
  coachingModel: string;
  onVisionModelChange: (model: string) => void;
  onCoachingModelChange: (model: string) => void;
}

export function AIModelSelector({
  visionModel,
  coachingModel,
  onVisionModelChange,
  onCoachingModelChange,
}: AIModelSelectorProps) {
  return (
    <Card data-testid="card-ai-model-selector">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3 space-y-0">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">
          AI Analysis Models
        </h3>
        <div className="rounded-md bg-primary/10 p-2">
          <Brain className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            <label className="text-xs font-medium text-muted-foreground">
              Vision Analysis
            </label>
          </div>
          <Select value={visionModel} onValueChange={onVisionModelChange}>
            <SelectTrigger 
              className="w-full text-xs h-9" 
              data-testid="select-vision-model"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o - Fast</SelectItem>
              <SelectItem value="gemini-2.5-pro">Gemini 2.5 Pro</SelectItem>
              <SelectItem value="claude-sonnet-4">Claude Sonnet 4</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground">
            Analyzes muscle definition & conditioning from key frames
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="h-3.5 w-3.5 text-muted-foreground" />
            <label className="text-xs font-medium text-muted-foreground">
              Coaching Feedback
            </label>
          </div>
          <Select value={coachingModel} onValueChange={onCoachingModelChange}>
            <SelectTrigger 
              className="w-full text-xs h-9" 
              data-testid="select-coaching-model"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
              <SelectItem value="claude-sonnet-4">Claude Sonnet 4</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground">
            Generates personalized recommendations from measurements
          </p>
        </div>

        <div className="pt-2 border-t">
          <p className="text-[10px] text-muted-foreground italic">
            💡 Privacy: Only measurements & optional frames sent to AI, never full video
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
