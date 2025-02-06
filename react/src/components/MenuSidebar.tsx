import React from "react";
import { Category } from "../lib/types";
import { ShoppingBag } from "lucide-react";
import { View } from "../App";
import { formatCurrency } from "../lib/utils";

export default function MenuSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  total,
  setCurrentView,
}: {
  categories: Category[];
  selectedCategory: number | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<number | null>>;
  total: number;
  setCurrentView: React.Dispatch<React.SetStateAction<View>>;
}) {
  return (
    <div className="basis-[230px] shrink-0 flex flex-col justify-between h-full">
      <div>
        {categories.map((category) => (
          <button
            key={category.name}
            className={`flex flex-col items-center transition-colors p-8 min-h-[300px] justify-center ${
              selectedCategory == category.id ? "bg-orange-300" : ""
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <img
              src={category.image.filename}
              alt={category.image.description}
              className="w-[80%]"
            />
            <h2 className="font-bold text-center uppercase">{category.name}</h2>
          </button>
        ))}
      </div>
      <button className="flex flex-col bg-lime text-white aspect-square justify-center items-center gap-6 font-bold" onClick={() => setCurrentView(View.Order)}>
        <ShoppingBag size={65} strokeWidth={1.5} />
        {formatCurrency(total)}
      </button>
    </div>
  );
}
