import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ClipboardList, Check, X, AlertTriangle } from "lucide-react";

interface JudgingNotesProps {
  notes?: Array<{ type: string; text: string }>;
}

export function JudgingNotes({ notes: notesData }: JudgingNotesProps) {
  const notes = notesData || [
    { type: "strength", text: "V-taper meets IFBB ideal standards" },
    { type: "strength", text: "Excellent chest striations and separation" },
    { type: "strength", text: "Good vascularity throughout upper body" },
    { type: "weakness", text: "Calf development lagging behind quads" },
    { type: "weakness", text: "Right shoulder slightly lower in poses" },
    { type: "attention", text: "Body fat at 6.2% - consider reducing to 5%" },
    { type: "attention", text: "Most muscular pose needs refinement" },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "strength":
        return <Check className="h-3 w-3 text-chart-4" />;
      case "weakness":
        return <X className="h-3 w-3 text-destructive" />;
      default:
        return <AlertTriangle className="h-3 w-3 text-chart-3" />;
    }
  };

  return (
    <Card data-testid="card-judging-notes" className="w-full max-w-full min-w-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">
          Judge's Notes
        </h3>
        <div className="rounded-md bg-primary/10 p-2">
          <ClipboardList className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {notes.map((note, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-2 rounded-md hover-elevate"
          >
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(note.type)}
            </div>
            <p className="text-xs font-body leading-relaxed">{note.text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
