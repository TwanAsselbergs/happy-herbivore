import { ArrowLeft } from "lucide-react";
import { Product } from "../../lib/types";
import { View } from "../../App";
import { formatCurrency } from "../../lib/utils";
import { SetStateAction, useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { motion } from "framer-motion";
import { CartContext } from "../../App";
import Popup from "../reusable/Popup";

const Order = ({
	setCurrentView,
	products,
}: {
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

	useEffect(() => {
		if (isPaying) {
			payingTimeout.current = setTimeout(() => {
				setCurrentView(View.Confirmation);
			}, 5000);
		} else {
			if (payingTimeout.current) {
				clearTimeout(payingTimeout.current);
			}
		}
	}, [isPaying]);

	return (
		<>
			<motion.div
				initial={{ x: 100, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				exit={{ x: 100, opacity: 0 }}
				transition={{ type: "spring", stiffness: 200, damping: 17.5 }}
				className="bg-white-secondary w-full h-full flex justify-center"
			>
				<div className="bg-white-secondary w-full h-full flex justify-center">
					<div className="flex flex-col items-center bg-white-primary rounded-2xl w-11/12 h-[1400px] mx-auto mt-28 px-16">
						<div className="flex relative w-full justify-center">
							<ArrowLeft
								height={50}
								width={50}
								strokeWidth={2}
								className="absolute left-0 top-[50%] -translate-y-1/2"
								onClick={() => setCurrentView(View.Menu)}
							/>
							<h2 className="text-2xl font-bold flex items-center my-20">
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
						{cartItems.length > 0 && (
							<>
								<div className="w-full text-right mt-16">
									<h3 className="text-xl font-bold">
										Total: {formatCurrency(totalPrice)}
									</h3>
								</div>
								<div className="mt-auto">
									<button
										className="text-white-primary bg-lime px-54 py-8 rounded-full my-20 font-bold"
										onClick={() => setIsPaying(true)}
									>
										Proceed to checkout
									</button>
								</div>
							</>
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
