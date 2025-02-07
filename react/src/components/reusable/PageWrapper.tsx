import React from "react";
import { motion, MotionProps } from "framer-motion";

interface PageWrapperProps extends MotionProps {
    children: React.ReactNode;
}

export default function PageWrapper({
    children,
    ...props
}: Readonly<PageWrapperProps>) {
    return (
        <motion.div
            className="bg-white-primary w-full absolute h-full flex flex-col pt-[225px]"
            {...props}
        >
            {children}
        </motion.div>
    );
}
