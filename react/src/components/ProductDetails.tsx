import { Product } from "../lib/types";
import { formatCurrency } from "../lib/utils";
import { Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import { ArcElement, Chart } from "chart.js";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CartContext } from "../App";

Chart.register(ArcElement);

const overlayVariants = {
	incoming: () => ({
		opacity: 0,
	}),
	active: { opacity: 1 },
	exit: () => ({
		opacity: 0,
	}),
};

const overlayTransition = {
	duration: 0.3,
	ease: "easeInOut",
};

export default function ProductDetails({
	product,
	setCart,
	setShowingDetailsId,
}: Readonly<{
	product: Product;
	setCart: React.Dispatch<
		React.SetStateAction<{ id: number; quantity: number }[]>
	>;
	setShowingDetailsId: React.Dispatch<React.SetStateAction<number | null>>;
}>) {
	const { t } = useTranslation();
	const [productQuantity, setProductQuantity] = useState(1);

	const { cart } = useContext(CartContext);

	useEffect(() => {
		const cartItem = cart.find((cartItem) => cartItem.id === product.id);

		setProductQuantity(cartItem?.quantity ?? 1);
	}, [cart]);

	function handleAddToCart() {
		setCart((prev) => {
			const index = prev.findIndex((item) => item.id === product.id);
			if (index === -1) {
				return [...prev, { id: product.id, quantity: productQuantity }];
			} else {
				return prev.map((item) =>
					item.id === product.id ? { ...item, quantity: productQuantity } : item
				);
			}
		});

		toast.success(t("basket_confirmation"));

		setShowingDetailsId(null);
	}

	return (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center  z-20">
			<motion.div
				className="bg-black/30 absolute w-full h-full"
				onClick={() => setShowingDetailsId(null)}
				variants={overlayVariants}
				initial="incoming"
				animate="active"
				exit="exit"
				transition={overlayTransition}
			></motion.div>
			<motion.div
				initial={{ y: "100%" }}
				exit={{ y: "100%" }}
				animate={{ y: 0 }}
				transition={{ type: "tween" }}
				className="h-full w-full flex justify-center items-center"
			>
				<div className="bg-white-primary rounded-4xl relative z-10 p-10 w-11/12 flex flex-col items-center justify-center">
					<div className="flex justify-end mb-6 font-bold w-full">
						<button
							onClick={() => setShowingDetailsId(null)}
							className="bg-[#EDEFE9] rounded-full p-2"
						>
							<X height={30} width={30} strokeWidth={4} className="text-gray-500" />
						</button>
					</div>
					<div className="grid grid-cols-[3fr_5fr] gap-12 py-12">
						<img
							src={product.image?.filename}
							alt={product.image?.description}
							className="rounded-2xl"
						/>
						<div className="flex gap-2 flex-col justify-between">
							<div>
								<h2 className="text-xl font-bold">{product.name}</h2>
								<p>{product.description}</p>
							</div>
							<div className="flex items-end">
								<div className="w-[200px] relative">
									<Pie
										data={{
											datasets: [
												{
													data: [product.kcal, 2250 - product.kcal],
													backgroundColor: ["#8CD003", "#D9D9D9"],
												},
											],
										}}
									/>
									<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
										<p>{product.kcal}kcal*</p>
									</div>
								</div>

								<p>
									*({+((product.kcal / 2000) * 100).toFixed(2)}% {t("daily_intake")})
								</p>
							</div>
						</div>
						<div className="flex justify-between items-center ml-2">
							<div className="flex gap-8 items-center">
								<button
									className="bg-[#EDEFE9] aspect-square h-18 rounded-full font-bold active:scale-95 active:bg-black/5 transition-all"
									onClick={() =>
										setProductQuantity((prev) => (prev > 1 ? prev - 1 : prev))
									}
								>
									-
								</button>
								<p>{productQuantity}</p>
								<button
									className="bg-[#EDEFE9] aspect-square h-18 rounded-full font-semibold active:scale-95 active:bg-black/5 transition-all"
									onClick={() => setProductQuantity((prev) => prev + 1)}
								>
									+
								</button>
							</div>
							<p className="">{formatCurrency(product.price * productQuantity)}</p>
						</div>
						<div>
							<button
								className="text-white-primary font-bold bg-lime w-full py-6 rounded-full"
								onClick={handleAddToCart}
							>
								{t("basket_add")}
							</button>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
