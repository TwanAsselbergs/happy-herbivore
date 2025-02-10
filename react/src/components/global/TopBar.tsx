import { Trash2 } from "lucide-react";
import { View } from "../../App";

export default function TopBar({
	cancelOrder,
	currentView,
}: {
	cancelOrder: () => void;
	currentView: View;
}) {
	return (
		<div className="bg-white-primary px-4 z-10 relative w-full flex items-center justify-between py-10">
			<img
				src="/img/logo_big_happy_herbivore_transparent.webp"
				alt=""
				className="w-full max-w-[170px] ml-5"
			/>
			{currentView !== View.Confirmation && (
				<button
					className=" h-fit px-10 py-4 rounded-full bg-red-500 text-white font-bold flex items-center gap-4 mr-4"
					onClick={cancelOrder}
				>
					<Trash2 width={30} height={30} strokeWidth={2} />
					Cancel Order
				</button>
			)}
		</div>
	);
}
