import { ArrowLeft } from "lucide-react";
import { Product } from "../../lib/types";
import { View } from "../../App";
import { formatCurrency } from "../../lib/utils";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { motion } from "framer-motion";
import { CartContext } from "../../App";
import Popup from "../reusable/Popup";
import { Pie } from "react-chartjs-2";

const Order = ({
	setCurrentView,
	setOrderNumber,
	products,
}: {
	setOrderNumber: React.Dispatch<SetStateAction<number | null>>;
	setCurrentView: React.Dispatch<SetStateAction<View>>;
	products: Product[];
}) => {
	const { cart, setCart } = useContext(CartContext);
	const [isPaying, setIsPaying] = useState(false);
	const payingTimeout = useRef<number | null>(null);

	const cartItems = cart
		.map((cartItem) => {
			const product = products.find((product) => product.id === cartItem.id);
			return product ? { ...product, quantity: cartItem.quantity } : null;
		})
		.filter(Boolean) as (Product & { quantity: number })[];

	const handleIncrement = (id: number) => {
		setCart((prevCart) =>
			prevCart.map((item) =>
				item.id === id ? { ...item, quantity: item.quantity + 1 } : item
			)
		);
	};

	const handleDecrement = (id: number) => {
		setCart((prevCart) =>
			prevCart
				.map((item) =>
					item.id === id ? { ...item, quantity: item.quantity - 1 } : item
				)

				.filter((item) => item.quantity > 0)
		);
	};

	const totalPrice = cartItems.reduce(
		(total, item) => total + item.price * item.quantity,
		0
	);

	const totalKcal = cartItems.reduce(
		(total, item) => total + item.kcal * item.quantity,
		0
	);

	useEffect(() => {
		if (isPaying) {
			payingTimeout.current = setTimeout(placeOrder, 5000);
		} else if (payingTimeout.current) {
			clearTimeout(payingTimeout.current);
		}
	}, [isPaying]);

	async function placeOrder() {
		const res = await fetch("http://localhost:3000/api/v1/orders", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				order: cartItems.map((item) => ({
					id: item.id,
					quantity: item.quantity,
				})),
			}),
		});

		const data = await res.json();

		if (!res.ok) {
			console.error(data);
			return;
		}

		setOrderNumber(data.order.pickupNumber);
		setCurrentView(View.Confirmation);
	}

	return (
		<>
			<motion.div
				initial={{ x: 100, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				exit={{ x: 100, opacity: 0 }}
				transition={{ type: "spring", stiffness: 200, damping: 17.5 }}
				className="bg-white-secondary w-full h-full flex justify-center items-center"
			>
				<div className="bg-white-secondary w-full h-full flex justify-center items-center">
					<div className="grid grid-cols-1 grid-rows-[1fr_auto] items-center bg-white-primary justify-between rounded-2xl w-11/12 h-[1600px] mx-auto">
						<div className="px-16 h-full pt-14 overflow-y-hidden">
							<div className="overflow-y-auto hide-scrollbar h-full">
								<div className="flex w-full justify-center sticky top-0 bg-white-primary">
									<ArrowLeft
										height={50}
										width={50}
										strokeWidth={2}
										className="absolute left-0 top-[50%] -translate-y-1/2"
										onClick={() => setCurrentView(View.Menu)}
									/>
									<h2 className="text-2xl font-bold flex items-center my-8">
										Review your Order
									</h2>
								</div>
								{cartItems.length === 0 ? (
									<div className="flex flex-col items-center justify-center pb-96 h-full">
										<h3 className="text-center text-2xl text-gray-400 font-semibold">
											Your basket is empty
										</h3>
									</div>
								) : (
									<div className="flex flex-col w-full flex-grow space-y-14 mt-12 overflow-y-auto hide-scrollbar">
										{cartItems.map((item) => (
											<div
												key={item.id}
												className="flex justify-between items-center w-full"
											>
												<div className="flex items-center">
													<img
														src={item.image?.filename}
														alt={item.image?.description}
														className="w-40 h-40 object-cover rounded-2xl"
													/>
													<div className="ml-10">
														<h3 className="text-[28px] font-bold truncate max-w-[375px]">
															{item.name}
														</h3>
														<p className="text-[28px] font-bold mt-4">
															{formatCurrency(item.price * item.quantity)}{" "}
															<span className="text-gray-400 font-normal">
																({formatCurrency(item.price)} per piece)
															</span>
														</p>
													</div>
												</div>
												<div className="flex items-center space-x-4">
													<button
														className="bg-[#EDEFE9] aspect-square rounded-full h-20 text-xl font-bold"
														onClick={() => handleDecrement(item.id)}
													>
														-
													</button>
													<p className="w-12 text-center font-bold">{item.quantity}</p>
													<button
														className="bg-[#EDEFE9] aspect-square rounded-full h-20 text-xl font-semibold"
														onClick={() => handleIncrement(item.id)}
													>
														+
													</button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
						{cartItems.length > 0 && (
							<div className="w-full">
								<hr className="w-full h-[2px] bg-gray-300 mt-16" />
								<div className="px-16 pt-16 w-full">
									<div className="flex justify-between items-end w-full">
										<div className="flex flex-col gap-6 items-center">
											<h3 className="font-semibold">Calories</h3>
											<div className="w-[170px] relative">
												<Pie
													data={{
														datasets: [
															{
																data: [totalKcal, 2250 - totalKcal],
																backgroundColor: ["#8CD003", "#D9D9D9"],
															},
														],
													}}
												/>
												<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
													<p>{totalKcal}kcal*</p>
												</div>
											</div>
										</div>

										<div className="text-right mt-16">
											<h3 className="text-xl font-bold">
												Total: {formatCurrency(totalPrice)}
											</h3>
										</div>
									</div>
									<button
										className="text-white-primary bg-lime py-8 rounded-full my-20 font-bold w-full"
										onClick={() => setIsPaying(true)}
									>
										Proceed to checkout
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</motion.div>
			{isPaying && (
				<Popup setIsVisible={setIsPaying}>
					<div className="min-h-[400px] flex flex-col items-center justify-center">
						<h3 className="font-bold">
							Payable Amount: {formatCurrency(totalPrice)}
						</h3>
						<p>Please follow the instructions on the terminal</p>
					</div>
				</Popup>
			)}
		</>
	);
};

export default Order;
