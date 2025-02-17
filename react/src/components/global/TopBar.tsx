import { Trash2, Undo2 } from "lucide-react";
import { View } from "../../App";
import { useState } from "react";
import Popup from "../reusable/Popup";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";

export default function TopBar({
	cancelOrder,
	currentView,
}: {
	cancelOrder: () => void;
	currentView: View;
}) {
	const { t } = useTranslation();
	const [isShowingPopup, setIsShowingPopup] = useState(false);
	const iconProps = {
		width: 30,
		height: 30,
		strokeWidth: 2,
	};

	return (
		<>
			<div className="bg-white-primary px-4 z-10 relative w-full flex justify-between items-center py-10">
				<div className="flex gap-12 items-center">
					<img
						src="/img/logo_big_happy_herbivore_transparent.webp"
						alt=""
						className="w-full max-w-[170px] ml-5"
					/>
					<LanguageSwitcher />
				</div>
				{currentView !== View.Confirmation && (
					<button
						className="w-[350px] h-fit px-6 py-4.5 rounded-full bg-red-500 text-white-primary font-bold flex justify-center items-center gap-4 mr-4"
						onClick={() => setIsShowingPopup(true)}
					>
						<Trash2 {...iconProps} />
						{t("cancel_order")}
					</button>
				)}
			</div>
			<AnimatePresence>
				{isShowingPopup && (
					<Popup setIsVisible={setIsShowingPopup}>
						<div className="flex flex-col gap-16 w-full items-center">
							<h2 className="text-xl">{t("cancel_popup")}</h2>
							<div className="w-full grid grid-cols-2 gap-8 font-semibold">
								<button
									className="flex items-center justify-center gap-4 border-2 py-5 rounded-full"
									onClick={() => setIsShowingPopup(false)}
								>
									<Undo2 {...iconProps} />
									{t("keep_ordering")}
								</button>
								<button
									className="bg-red-500 py-5 gap-4 flex justify-center items-center rounded-full text-white-primary"
									onClick={cancelOrder}
								>
									<Trash2 {...iconProps} />
									{t("cancel_confirm")}
								</button>
							</div>
						</div>
					</Popup>
				)}
			</AnimatePresence>
		</>
	);
}
