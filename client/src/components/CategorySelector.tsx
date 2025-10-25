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
    <Card data-testid="card-category-selector">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-sm font-heading font-semibold text-muted-foreground">
          Competition Category
        </h3>
        <div className="rounded-md bg-primary/10 p-2">
          <Trophy className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`w-full text-left p-3 rounded-md border transition-all hover-elevate active-elevate-2 ${
              selectedCategory === category.id
                ? "border-primary bg-primary/5"
                : "border-border"
            }`}
            data-testid={`button-category-${category.id}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="space-y-1">
                <p className="text-sm font-heading font-semibold">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.focus}</p>
              </div>
              {selectedCategory === category.id && (
                <Badge variant="default" className="bg-primary">
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
