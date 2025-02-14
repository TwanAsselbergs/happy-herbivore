import { X } from "lucide-react";
import React, { SetStateAction } from "react";
import { motion } from "framer-motion";

export default function Popup({
	children,
	setIsVisible,
}: {
	children: React.ReactNode;
	setIsVisible: React.Dispatch<SetStateAction<boolean>>;
}) {
	return (
		<div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-20">
			<motion.div
				className="bg-black/30 absolute w-full h-full"
				onClick={() => setIsVisible(false)}
				initial={{ opacity: 0 }}
				exit={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ type: "tween" }}
			></motion.div>
			<motion.div
				initial={{ y: "100%" }}
				exit={{ y: "100%" }}
				animate={{ y: 0 }}
				transition={{ type: "tween" }}
				className="h-full w-full flex justify-center items-center"
			>
				<div className="bg-white-primary rounded-4xl relative z-10 p-10 w-11/12 flex flex-col items-center justify-center">
					<div className="flex w-full justify-end">
						<button
							onClick={() => setIsVisible(false)}
							className="bg-[#EDEFE9] rounded-full p-2"
						>
							<X height={30} width={30} strokeWidth={4} className="text-gray-500" />
						</button>
					</div>
					{children}
				</div>
			</motion.div>
		</div>
	);
}
