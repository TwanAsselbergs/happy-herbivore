import { View } from "../../App";
import { SetStateAction } from "react";

const Confirmation = ({
	setCurrentView,
}: {
	setCurrentView: React.Dispatch<SetStateAction<View>>;
}) => {
	return (
		<div className="w-full h-full flex flex-col justify-center items-center text-center">
			<img
				src="img/logo_big_complete_transparent.webp"
				alt="Logo"
				className="w-full max-w-[500px] mb-20"
			/>
			<h1 className="font-bold text-7xl max-w-lg mb-16">
				Thank you for your order!
			</h1>
			<p className="text-5xl text-gray-400 mb-12">Your order number is #12345</p>
			<button
				className="text-white text-xl bg-lime px-20 py-10 rounded-full my-24 font-bold"
				onClick={() => setCurrentView(View.Idle)}
			>
				Back to the homepage
			</button>
		</div>
	);
};

export default Confirmation;
