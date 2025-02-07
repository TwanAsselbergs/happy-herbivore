import React, { useEffect, useRef, useState } from "react";
import { Category } from "../lib/types";
import { ShoppingBag } from "lucide-react";
import { View } from "../App";
import { formatCurrency } from "../lib/utils";
import { motion } from "framer-motion";

export default function MenuSidebar({
    categories,
    setSelectedCategory,
    total,
    setCurrentView,
    setIsShowingOrderSummary,
    selectedCategory,
}: Readonly<{
    categories: Category[];
    setSelectedCategory: React.Dispatch<React.SetStateAction<number | null>>;
    total: number;
    setCurrentView: React.Dispatch<React.SetStateAction<View>>;
    setIsShowingOrderSummary: React.Dispatch<React.SetStateAction<boolean>>;
    selectedCategory: number | null;
}>) {
    const [highlightPos, setHighlightPos] = useState({ top: 0, height: 0 });
    const initialCategoryRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (selectedCategory !== null && initialCategoryRef.current) {
            const selectedButton =
                initialCategoryRef.current.parentElement?.querySelector(
                    `[data-category-id="${selectedCategory}"]`
                ) as HTMLButtonElement | null;
            if (selectedButton) {
                const { height } = selectedButton.getBoundingClientRect();
                setHighlightPos({ top: selectedButton.offsetTop, height });
            }
        }
    }, [selectedCategory]);

    return (
        <div className="basis-[230px] shrink-0 flex flex-col justify-between h-full bg-white-primary">
            <div className="relative">
                <motion.div
                    layoutId="category-highlight"
                    className="absolute inset-0 bg-orange-300 z-0"
                    animate={{
                        top: highlightPos.top,
                        height: highlightPos.height,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                />
                {categories.map((category, index) => (
                    <button
                        key={category.name}
                        className="relative flex flex-col items-center p-8 min-h-[300px] justify-center overflow-hidden"
                        onClick={() => {
                            setSelectedCategory(category.id);
                        }}
                        ref={index === 0 ? initialCategoryRef : undefined}
                        data-category-id={category.id}
                    >
                        <img
                            src={category.image.filename}
                            alt={category.image.description}
                            className="w-[80%] relative z-10"
                        />
                        <h2 className="font-bold text-center uppercase relative z-10">
                            {category.name}
                        </h2>
                    </button>
                ))}
            </div>
            <motion.button
                className="flex flex-col bg-lime text-white aspect-square justify-center items-center gap-6 font-bold"
                onClick={() => setIsShowingOrderSummary(true)}
                whileTap={{ scale: 0.95 }}
            >
                <ShoppingBag size={65} strokeWidth={1.5} />
                {formatCurrency(total)}
            </motion.button>
        </div>
    );
}
