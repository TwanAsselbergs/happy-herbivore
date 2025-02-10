import React, { useContext, useEffect, useState } from "react";
import { products, categories } from "./Products";
import ProductDetails from "../ProductDetails";
import MenuSidebar from "../MenuSidebar";
import Product from "../menu/Product";
import { View, CartContext } from "../../App";
import { AnimatePresence } from "framer-motion";

export default function Menu({
	setCurrentView,
}: Readonly<{
	setCurrentView: React.Dispatch<React.SetStateAction<View>>;
}>) {
	const [showingDetailsId, setShowingDetailsId] = useState<number | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(
		categories[0].id
	);
	const [total, setTotal] = useState(0);
	const [showingProducts, setShowingProducts] = useState(products);
	const { cart, setCart } = useContext(CartContext);

	useEffect(() => {
		setShowingProducts(
			products.filter(
				(product) =>
					selectedCategory === null || product.category.id === selectedCategory
			)
		);
	}, [selectedCategory]);

	useEffect(() => {
		setTotal(
			cart.reduce(
				(acc, { id, quantity }) =>
					acc + products.find((product) => product.id === id)!.price * quantity,
				0
			)
		);
	}, [cart]);

	return (
		<div className="h-full w-full">
			<AnimatePresence mode="sync">
				<div className="flex h-full">
					<MenuSidebar
						categories={categories}
						setSelectedCategory={setSelectedCategory}
						total={total}
						setCurrentView={setCurrentView}
						selectedCategory={selectedCategory}
					/>
					<div className="bg-white-secondary w-full">
						<h2 className="font-black text-center mb-4 mt-16 text-xl uppercase">
							{categories.find((category) => category.id === selectedCategory)?.name}
						</h2>
						<div className="grid grid-cols-3 gap-8 p-8">
							{showingProducts.map((product) => {
								return (
									<Product
										product={product}
										cart={cart.find((item) => item.id === product.id)}
										setShowingDetailsId={setShowingDetailsId}
										key={product.title}
									/>
								);
							})}
						</div>
					</div>
					<AnimatePresence>
						{showingDetailsId !== null && (
							<ProductDetails
								product={products.find((product) => product.id === showingDetailsId)!}
								setCart={setCart}
								setShowingDetailsId={setShowingDetailsId}
							/>
						)}
					</AnimatePresence>
				</div>
			</AnimatePresence>
		</div>
	);
}
