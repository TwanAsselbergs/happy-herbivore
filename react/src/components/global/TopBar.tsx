import { Trash } from "lucide-react";

export default function TopBar() {
	return (
		<div className="bg-white-primary px-4 z-10 relative w-full flex items-center justify-between">
			<img
				src="/img/logo_big_happy_herbivore_transparent.webp"
				alt=""
				className="w-full max-w-[225px]"
			/>
			<button className=" h-fit px-8 py-3 rounded-xl bg-red-400 text-white font-bold flex items-center gap-4">
				<Trash width={25} height={25} strokeWidth={2} />
				Cancel Order
			</button>
		</div>
	);
}
