import { View } from "../../App";
import { SetStateAction, useContext, useEffect } from "react";
import { CartContext } from "../../App";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Confirmation = ({
	setCurrentView,
	orderNumber,
}: {
	setCurrentView: React.Dispatch<SetStateAction<View>>;
	orderNumber: number | null;
}) => {
	const { t } = useTranslation();
	const { setCart } = useContext(CartContext);

	function resetOrder() {
		setCart([]);
		setCurrentView(View.Idle);
	}

	useEffect(() => {
		setTimeout(resetOrder, 10000);
	}, []);

	return (
		<div className="w-full h-full flex flex-col justify-center items-center text-center gap-16 pb-64">
			<img
				src="img/logo_big_complete_transparent.webp"
				alt="Logo"
				className="w-full max-w-[500px]"
			/>
			<h1 className="font-bold text-4xl max-w-lg">{t("thank_you")}</h1>
			<p className="text-2xl text-gray-400 mb-4">
				{t("order_number")} #{orderNumber}
			</p>
			<button
				className="text-white-primary text-xl block bg-lime px-20 py-10 relative rounded-full overflow-hidden font-bold"
				onClick={resetOrder}
			>
				<motion.span
					className="block bg-lime-600 opacity-30 h-full w-full absolute top-0 left-0"
					initial={{ x: "-100%" }}
					animate={{ x: 0 }}
					transition={{ duration: 10, type: "tween" }}
				></motion.span>
				<span className="z-10 relative">{t("back_to_homepage")}</span>
			</button>
		</div>
	);
};

export default Confirmation;
