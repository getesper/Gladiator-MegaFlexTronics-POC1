import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategorySelector({ selectedCategory, onCategoryChange }: CategorySelectorProps) {
  const categories = [
    { id: "bodybuilding", name: "Men's Bodybuilding", focus: "Extreme size & conditioning" },
    { id: "physique", name: "Men's Physique", focus: "V-taper & aesthetics" },
    { id: "classic", name: "Classic Physique", focus: "Golden era proportions" },
    { id: "figure", name: "Women's Figure", focus: "Balance & femininity" },
    { id: "bikini", name: "Bikini", focus: "Tone & presentation" },
  ];

  return (
    <Card data-testid="card-category-selector" className="w-full max-w-full min-w-0">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-xs sm:text-sm font-heading font-semibold text-muted-foreground">
          Competition Category
        </h3>
        <div className="rounded-md bg-primary/10 p-1.5 sm:p-2">
          <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full text-left p-2 sm:p-3 rounded-md border transition-all hover-elevate active-elevate-2 ${
              selectedCategory === category.id
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
            data-testid={`button-category-${category.id}`}
          >
            <div className="flex items-center justify-between gap-1.5 sm:gap-2">
              <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1 overflow-hidden">
                <p className="text-[11px] sm:text-sm font-heading font-semibold truncate">{category.name}</p>
                <p className="text-[9px] sm:text-xs text-muted-foreground truncate">{category.focus}</p>
              </div>
              {selectedCategory === category.id && (
                <Badge variant="default" className="bg-primary text-[9px] sm:text-xs flex-shrink-0 px-1.5 sm:px-2">
                  Active
                </Badge>
              )}
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
