import { CategorySelector } from "../CategorySelector";
import { useState } from "react";

export default function CategorySelectorExample() {
  const [category, setCategory] = useState("bodybuilding");
  
  return (
    <div className="max-w-sm p-4">
      <CategorySelector
        selectedCategory={category}
        onCategoryChange={setCategory}
      />
    </div>
  );
}
