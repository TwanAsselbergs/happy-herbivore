import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "@popmotion/popcorn";
import { ShoppingBag } from "lucide-react";
import { View } from "../../App";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { IMAGES } from "./Images";
import { PickupType } from "../../lib/types";
import { transformImageUrl } from "../../lib/utils";

const sliderVariants = {
	incoming: (direction: number) => ({
		x: direction > 0 ? "50%" : "-50%",
		scale: 0.6,
		opacity: 0,
	}),
	active: { x: 0, scale: 1, opacity: 1 },
	exit: (direction: number) => ({
		x: direction > 0 ? "-50%" : "50%",
		scale: 0.6,
		opacity: 0,
	}),
};

const sliderTransition = {
	duration: 1,
	ease: [0.56, 0.03, 0.12, 1.04],
};

const IdleScreen = ({
	setCurrentView,
	setPickupType,
}: {
	setCurrentView: React.Dispatch<React.SetStateAction<View>>;
	setPickupType: React.Dispatch<React.SetStateAction<PickupType | null>>;
}) => {
	const { t } = useTranslation();
	const [[imageCount, direction], setImageCount] = useState([0, 0]);
	const scrollInterval = useRef<NodeJS.Timeout | null>(null);
	const activeImageIndex = wrap(0, IMAGES.length, imageCount);

	const swipeToImage = (swipeDirection: number) => {
		setImageCount((prev) => [prev[0] + swipeDirection, swipeDirection]);
	};

	useEffect(() => {
		scrollInterval.current = setInterval(() => swipeToImage(1), 10000);

		return () => {
			if (scrollInterval.current) {
				clearTimeout(scrollInterval.current);
			}
		};
	}, []);

	function handleSetPickupType(pickupType: PickupType) {
		setPickupType(pickupType);
		setCurrentView(View.Menu);
	}

	return (
		<div className="row-span-full flex flex-col justify-between text-xl items-center w-full h-screen bg-dark-blue">
			<div className="pt-24 flex w-full relative">
				<img
					src="./img/logo_big_happy_herbivore_transparent.webp"
					alt=""
					className="w-full max-w-[250px] mx-auto"
				/>
				<div className="absolute right-24 top-27">
					<LanguageSwitcher />
				</div>
			</div>
			<div className="grow flex flex-col items-center w-full p-24 h-full">
				<div className="relative w-full h-full">
					<AnimatePresence initial={false} custom={direction}>
						<motion.div
							key={imageCount}
							custom={direction}
							variants={sliderVariants}
							initial="incoming"
							animate="active"
							exit="exit"
							transition={sliderTransition}
							className="w-full h-full absolute will-change-[transform,opacity] flex items-center justify-center"
						>
							<img
								src={transformImageUrl(IMAGES[activeImageIndex].imageSrc)}
								alt=""
								className="w-full h-full object-contain aspect-square drop-shadow-2xl"
							/>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
			<div className="flex flex-col items-center pb-[12rem]">
				<h2 className="text-white-primary uppercase text-[4rem] font-bold text-center leading-[100%]">
					<span className="rotate-[-4deg] block">{t("idle_title")}</span>
					<br />
					<span className="flex items-center gap-6 -mt-10">
						{t("idle_span_1")}{" "}
						<span className="text-lime text-[8rem] block leading-[100%]">
							{" "}
							{t("idle_span_2")}
						</span>{" "}
						{t("idle_span_3")}
					</span>
				</h2>
				<h3 className=" text-white-primary mt-4">{t("idle_p")}</h3>
			</div>
			<div className="grid grid-cols-2 gap-16 mb-32">
				<IdleScreenButton
					onClick={() => handleSetPickupType(PickupType.TAKE_OUT)}
					text={t("takeaway")}
				/>
				<IdleScreenButton
					onClick={() => handleSetPickupType(PickupType.DINE_IN)}
					text={t("eat_in")}
				/>
			</div>
		</div>
	);
};

interface IdleScreenButtonProps
	extends React.HTMLAttributes<HTMLButtonElement> {
	text: string;
}

function IdleScreenButton({ text, ...props }: Readonly<IdleScreenButtonProps>) {
	return (
		<button
			className="font-bold bg-white-primary w-105 h-[200px] rounded-3xl uppercase flex items-center justify-center gap-4 p-24"
			{...props}
		>
			<ShoppingBag
				height={40}
				width={40}
				className="shrink-0"
				aria-label="Shopping Bag"
			/>
			{text}
		</button>
	);
}

export default IdleScreen;
