import { Trash2, Undo2 } from "lucide-react";
import { View } from "../../App";
import { useState } from "react";
import Popup from "../reusable/Popup";
import { AnimatePresence } from "framer-motion";

export default function TopBar({
	cancelOrder,
	currentView,
}: {
	cancelOrder: () => void;
	currentView: View;
}) {
	const [isShowingPopup, setIsShowingPopup] = useState(false);

	return (
		<>
			<div className="bg-white-primary px-4 z-10 relative w-full flex items-center justify-between py-10">
				<img
					src="/img/logo_big_happy_herbivore_transparent.webp"
					alt=""
					className="w-full max-w-[170px] ml-5"
				/>
				{currentView !== View.Confirmation && (
					<button
						className=" h-fit px-10 py-4 rounded-full bg-red-500 text-white font-bold flex items-center gap-4 mr-4"
						onClick={() => setIsShowingPopup(true)}
					>
						<Trash2 width={30} height={30} strokeWidth={2} />
						Cancel Order
					</button>
				)}
			</div>
			<AnimatePresence>
				{isShowingPopup && (
					<Popup setIsVisible={setIsShowingPopup}>
						<div className="flex flex-col gap-8 w-full">
							<h2>Are you sure you want to cancel this order?</h2>
							<div className="w-full grid grid-cols-2 gap-8 font-semibold">
								<button
									className="flex items-center justify-center gap-4 border-2 py-5 rounded-full"
									onClick={() => setIsShowingPopup(false)}
								>
									<Undo2 />
									No, keep ordering
								</button>
								<button
									className="bg-red-500 py-5 gap-4 flex justify-center items-center rounded-full text-white"
									onClick={cancelOrder}
								>
									<Trash2 />
									Yes, cancel order
								</button>
							</div>
						</div>
					</Popup>
				)}
			</AnimatePresence>
		</>
	);
}
