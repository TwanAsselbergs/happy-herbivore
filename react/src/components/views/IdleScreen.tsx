import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { wrap } from "@popmotion/popcorn";
import { ShoppingBag } from "lucide-react";

import { IMAGES } from "./Images";

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

const IdleScreen = () => {
  const [[imageCount, direction], setImageCount] = useState([0, 0]);
  const scrollInterval = useRef<number | null>(null);
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

  return (
    <main className="flex flex-col justify-between text-3xl items-center w-full h-screen overflow-x-hidden">
      <img
        src="/img/logo_big_happy_herbivore_transparent.webp"
        alt=""
        className="w-full max-w-[300px]"
      />
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
              className="w-full h-full absolute will-change-[transform,opacity] flex items-center justify-center">
              <img
                src={IMAGES[activeImageIndex].imageSrc}
                alt=""
                className="w-full h-full object-contain aspect-square drop-shadow-2xl"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="flex flex-col items-center pb-[12rem]">
        <h2 className="text-white uppercase text-[4rem] font-bold text-center leading-[100%]">
          <span className="rotate-[-4deg] block">Healthy up your day,</span>
          <br />
          <span className="flex items-center gap-6 -mt-10">
            the{" "}
            <span className="text-lime text-[8rem] block leading-[100%]">
              green
            </span>{" "}
            way
          </span>
        </h2>
        <h3 className="text-3xl text-white mt-4">
          Happy Herbivore - Healthy in a Hurry
        </h3>
      </div>
      <button className="font-bold bg-white w-[80%] h-[370px] rounded-t-3xl uppercase text-4xl flex items-center justify-center gap-4">
        <ShoppingBag height={40} width={40} />
        Start ordering
      </button>
    </main>
  );
};

export default IdleScreen;
