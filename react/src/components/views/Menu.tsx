import React, { useContext, useEffect, useState } from "react";
import ProductDetails from "../ProductDetails";
import MenuSidebar from "../MenuSidebar";
import Product from "../menu/Product";
import { View, CartContext } from "../../App";
import { Category, Product as ProductType } from "../../lib/types";
import { AnimatePresence } from "framer-motion";
import { toggleFromArray } from "../../lib/utils";
import { Plus } from "lucide-react";

export default function Menu({
	setCurrentView,
	categories,
	products,
}: Readonly<{
	setCurrentView: React.Dispatch<React.SetStateAction<View>>;
	categories: Category[];
	products: ProductType[];
}>) {
	const [showingDetailsId, setShowingDetailsId] = useState<number | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<number | null>(
		categories[0].id
	);
	const [total, setTotal] = useState(0);
	const [showingProducts, setShowingProducts] = useState(products);
	const [dietType, setDietType] = useState<("VEGGIE" | "VEGAN")[]>([
		"VEGAN",
		"VEGGIE",
	]);
	const { cart, setCart } = useContext(CartContext);

	useEffect(() => {
		const filteredProducts = products.filter((product) => {
			const matchesCategory =
				selectedCategory === null || product.category.id === selectedCategory;
			const matchesDietType =
				dietType.length != 0 ? dietType.includes(product.dietType) : true;

			return matchesCategory && matchesDietType;
		});

		setShowingProducts(filteredProducts);
	}, [selectedCategory, products, dietType]);

	function handleDietToggle(diet: "VEGGIE" | "VEGAN") {
		const toggleRes = toggleFromArray(dietType, diet);

		setDietType(toggleRes);
	}

	useEffect(() => {
		setDietType(["VEGAN", "VEGGIE"]);
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
		<div className="flex min-h-0 h-full">
			<MenuSidebar
				categories={categories}
				setSelectedCategory={setSelectedCategory}
				total={total}
				setCurrentView={setCurrentView}
				selectedCategory={selectedCategory}
			/>
			<div className="bg-white-secondary w-full overflow-y-auto h-full">
				<div className="flex justify-between items-center px-8 pt-16 pb-2">
					<h2 className="font-black text-center text-xl uppercase">
						{categories.find((category) => category.id === selectedCategory)?.name}
					</h2>
					<div className="flex gap-4">
						<button
							className={`px-4 py-2 flex rounded-full items-center gap-2 transition-colors ${
								dietType.includes("VEGGIE")
									? "bg-lime/30 border-lime border-2"
									: "border-gray-300 border-2"
							}`}
							onClick={() => handleDietToggle("VEGGIE")}
						>
							<Plus
								className={`rotate-0 transition-transform ${
									dietType.includes("VEGGIE") ? "rotate-45" : ""
								}`}
							/>
							Veggie
						</button>
						<button
							className={`px-4 py-2 flex rounded-full items-center gap-2 ${
								dietType.includes("VEGAN")
									? "bg-lime/30 border-lime border-2"
									: "border-gray-300 border-2"
							}`}
							onClick={() => handleDietToggle("VEGAN")}
						>
							<Plus
								className={`rotate-0  transition-transform ${
									dietType.includes("VEGAN") ? "rotate-45" : ""
								}`}
							/>
							Vegan
						</button>
					</div>
				</div>
				<div className="grid grid-cols-3 gap-8 p-8">
					{showingProducts.map((product) => {
						return (
							<Product
								product={product}
								cart={cart.find((item) => item.id === product.id)}
								setShowingDetailsId={setShowingDetailsId}
								key={product.name}
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
	);
}
