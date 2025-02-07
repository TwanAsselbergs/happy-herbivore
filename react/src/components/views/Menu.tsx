import React, { useEffect, useState } from "react";
import { products, categories } from "./Products";
import ProductDetails from "../ProductDetails";
import MenuSidebar from "../MenuSidebar";
import Product from "../menu/Product";
import { View } from "../../App";
import PageWrapper from "../reusable/PageWrapper";

import { AnimatePresence } from "framer-motion";

export default function Menu({
    setCurrentView,
}: Readonly<{
    setCurrentView: React.Dispatch<React.SetStateAction<View>>;
}>) {
    const [showingDetailsId, setShowingDetailsId] = useState<number | null>(
        null
    );
    const [selectedCategory, setSelectedCategory] = useState<number | null>(
        categories[0].id
    );
    const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
    const [total, setTotal] = useState(0);
    const [showingProducts, setShowingProducts] = useState(products);

    useEffect(() => {
        setShowingProducts(
            products.filter(
                (product) =>
                    selectedCategory === null ||
                    product.category.id === selectedCategory
            )
        );
    }, [selectedCategory]);

    useEffect(() => {
        setTotal(
            cart.reduce(
                (acc, { id, quantity }) =>
                    acc +
                    products.find((product) => product.id === id)!.price *
                        quantity,
                0
            )
        );
    }, [cart]);

    return (
        <PageWrapper>
            <div className="h-full">
                <div className="flex h-full">
                    <MenuSidebar
                        categories={categories}
                        setSelectedCategory={setSelectedCategory}
                        total={total}
                        setCurrentView={setCurrentView}
                    />
                    <div className="bg-white-secondary w-full">
                        <h2 className="font-black text-center mb-4 mt-16 text-xl uppercase">
                            {
                                categories.find(
                                    (category) =>
                                        category.id === selectedCategory
                                )?.name
                            }
                        </h2>
                        <div className="grid grid-cols-3 gap-8 p-8">
                            {showingProducts.map((product) => {
                                return (
                                    <Product
                                        product={product}
                                        cart={cart.find(
                                            (item) => item.id === product.id
                                        )}
                                        setShowingDetailsId={
                                            setShowingDetailsId
                                        }
                                        key={product.title}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <AnimatePresence>
                        {showingDetailsId !== null && (
                            <ProductDetails
                                product={
                                    products.find(
                                        (product) =>
                                            product.id === showingDetailsId
                                    )!
                                }
                                setCart={setCart}
                                setShowingDetailsId={setShowingDetailsId}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </PageWrapper>
    );
}
