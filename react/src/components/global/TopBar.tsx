import { motion } from "framer-motion";

export default function TopBar() {
    return (
        <motion.div
            className="bg-white-primary px-4 z-10 relative w-full"
            // exit={{ x: "-100%" }}
            transition={{ duration: 0.5, ease: [0.56, 0.03, 0.12, 1.04] }}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            key={"TopBar"}
        >
            <img
                src="/img/logo_big_happy_herbivore_transparent.webp"
                alt=""
                className="w-full max-w-[225px]"
            />
        </motion.div>
    );
}
