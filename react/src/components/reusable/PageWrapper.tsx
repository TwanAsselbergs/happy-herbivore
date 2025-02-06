import React from "react";
import { motion, MotionProps } from "framer-motion";

interface PageWrapperProps extends MotionProps {
  children: React.ReactNode;
}

export default function PageWrapper({ children, ...props }: PageWrapperProps) {
  return (
    <motion.div
      className="bg-white-primary w-full h-screen absolute"
      exit={{ x: "-100%" }}
      transition={{ duration: 0.5, ease: [0.56, 0.03, 0.12, 1.04] }}
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
