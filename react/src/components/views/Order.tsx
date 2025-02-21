import { ArrowLeft } from "lucide-react";
import { PickupType, Product } from "../../lib/types";
import { formatCurrency } from "../../lib/utils";
import React, {
	SetStateAction,
	useEffect,
	useRef,
	useState,
	useContext,
} from "react";
import { motion } from "framer-motion";
import { CartContext, View } from "../../App";
import Popup from "../reusable/Popup";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";

const Order = ({
	setCurrentView,
	setOrderNumber,
	products,
	pickupType,
}: {
	setOrderNumber: React.Dispatch<SetStateAction<number | null>>;
	setCurrentView: React.Dispatch<SetStateAction<View>>;
	products: Product[];
	pickupType: PickupType | null;
}) => {
	const { t } = useTranslation();
	const { cart, setCart } = useContext(CartContext);
	const [isPaying, setIsPaying] = useState(false);
	const payingTimeout = useRef<NodeJS.Timeout | null>(null);
	const cartContainerRef = useRef<HTMLDivElement>(null);
	const [maskSize, setMaskSize] = useState<string>(
		"-webkit-gradient(linear, left 90%, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))"
	);
	const [topMaskSize, setTopMaskSize] = useState(0);
	const [bottomMaskSize, setBottomMaskSize] = useState(0);

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
		const el = cartContainerRef.current;
		if (!el) return;

		const setClasses = () => {
			const isScrollable = el.scrollHeight > el.clientHeight;
			if (!isScrollable) {
				setTopMaskSize(0);
				setBottomMaskSize(0);
				return;
			}

			const isScrolledToBottom =
				el.scrollHeight <= el.clientHeight + el.scrollTop + 1;
			const isScrolledToTop = isScrolledToBottom ? false : el.scrollTop === 0;

			setTopMaskSize(isScrolledToTop ? 0 : 100);
			setBottomMaskSize(isScrolledToBottom ? 0 : 300);
		};

		el.addEventListener("scroll", setClasses);
		setClasses();

		return () => el.removeEventListener("scroll", setClasses);
	}, []);

	useEffect(() => {
		if (isPaying) {
			payingTimeout.current = setTimeout(placeOrder, 5000);
		} else if (payingTimeout.current) {
			clearTimeout(payingTimeout.current);
		}
	}, [isPaying]);

	async function placeOrder() {
		const headers = new Headers();

		headers.append(
			"authorization",
			`Bearer ${import.meta.env.VITE_API_TOKEN ?? "placeholder_value"}`
		);

		headers.append("Content-Type", "application/json");

		const res = await fetch("http://localhost:3000/api/v1/orders", {
			method: "POST",
			headers,
			body: JSON.stringify({
				order: cartItems.map((item) => ({
					id: item.id,
					quantity: item.quantity,
				})),
				pickupType,
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

	const calculateCalorieChartColor = (kcal: number) => {
		if (kcal < 2250 * 0.75) {
			return "#8CD003";
		} else if (kcal < 2250) {
			return "orange";
		} else {
			return "#FB2C36";
		}
	};

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
					<div className="grid grid-cols-1 grid-rows-[min-content_1fr_auto] items-center bg-white-primary justify-between rounded-2xl w-11/12 h-[1600px] mx-auto px-16">
						<div className="flex w-full justify-center bg-white-primary relative min-h-0 mt-14">
							<ArrowLeft
								height={50}
								width={50}
								strokeWidth={3}
								className="bg-[#EDEFE9] p-2 text-gray-600 rounded-full absolute left-0 top-[50%] -translate-y-1/2"
								onClick={() => setCurrentView(View.Menu)}
							/>
							<h2 className="text-2xl font-bold flex items-center my-8">
								{t("review_order")}
							</h2>
						</div>
						<div className="h-full min-h-0">
							<div className="overflow-y-hidden h-full">
								<div
									className="overflow-y-auto hide-scrollbar h-full"
									style={{
										WebkitMaskImage: `linear-gradient(to bottom, transparent 0, black ${topMaskSize}px, black calc(100% - ${bottomMaskSize}px), transparent 100%)`,
										maskImage: `linear-gradient(to bottom, transparent 0, black ${topMaskSize}px, black calc(100% - ${bottomMaskSize}px), transparent 100%)`,
									}}
									ref={cartContainerRef}
								>
									{cartItems.length === 0 ? (
										<div className="flex flex-col items-center justify-center pb-96 h-full">
											<h3 className="text-center text-2xl text-gray-300 font-semibold">
												{t("basket_empty")}
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
																	({formatCurrency(item.price)} {t("per_piece")})
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
						</div>
						{cartItems.length > 0 && (
							<div className="w-full">
								<hr className="w-5/6 mx-auto border-gray-400 mt-16" />
								<div className="pt-16 w-full">
									<div className="flex justify-between items-end w-full">
										<div className="flex flex-col gap-6 items-center">
											<h3 className="font-semibold">{t("order_calories")}</h3>
											<div className="w-[170px] relative">
												<Pie
													data={{
														datasets: [
															{
																data: [
																	Math.min(totalKcal, 2250),
																	Math.max(2250 - totalKcal, 0),
																],
																backgroundColor: [
																	calculateCalorieChartColor(totalKcal),
																	"#D9D9D9",
																],
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
												{t("order_total")}
												{formatCurrency(totalPrice)}
											</h3>
										</div>
									</div>
									<button
										className="text-white-primary bg-lime py-8 rounded-full my-20 font-bold w-full"
										onClick={() => setIsPaying(true)}
									>
										{t("checkout")}
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
							{t("payable_amount")}
							{formatCurrency(totalPrice)}
						</h3>
						<p>{t("follow_terminal")}</p>
					</div>
				</Popup>
			)}
		</>
	);
};

export default Order;
