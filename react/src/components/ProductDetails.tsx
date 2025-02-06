import { Product } from "../lib/types";
import { formatCurrency } from "../lib/utils";
import { Pie } from "react-chartjs-2";
import { AnimatePresence, motion } from "framer-motion";
import { ArcElement, Chart } from "chart.js";
import { useState } from "react";

Chart.register(ArcElement);

const sliderVariants = {
  incoming: () => ({
    y: "100%",
  }),
  active: { y: 0, opacity: 1 },
  exit: () => ({
    y: "100%",
  }),
};

const overlayVariants = {
  incoming: () => ({
    opacity: 0,
  }),
  active: { opacity: 1 },
  exit: () => ({
    opacity: 0,
  }),
};

const sliderTransition = {
  duration: 0.3,
  ease: "easeInOut",
};

const overlayTransition = {
  duration: 0.3,
  ease: "easeInOut",
};

export default function ProductDetails({
  product,
  setCart,
  setShowingDetailsId,
}: {
  product: Product;
  setCart: React.Dispatch<
    React.SetStateAction<{ id: number; quantity: number }[]>
  >;
  setShowingDetailsId: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const [productQuantity, setProductQuantity] = useState(1);

  function handleAddToCart() {
    setCart((prev) => {
      const index = prev.findIndex((item) => item.id === product.id);
      if (index === -1) {
        return [...prev, { id: product.id, quantity: productQuantity }];
      } else {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + productQuantity }
            : item
        );
      }
    });

    setShowingDetailsId(null);
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-end justify-center">
      <motion.div
        className="bg-black/50 absolute w-full h-full z-0"
        onClick={() => setShowingDetailsId(null)}
        variants={overlayVariants}
        initial="incoming"
        animate="active"
        exit="exit"
        transition={overlayTransition}
      ></motion.div>
      <motion.div
        variants={sliderVariants}
        initial="incoming"
        animate="active"
        exit="exit"
        transition={sliderTransition}
        className="bg-white w-full rounded-t-4xl p-14 relative z-10"
      >
        <div className="row-span-full flex justify-end mb-12">
          <button onClick={() => setShowingDetailsId(null)}>X</button>
        </div>
        <div className="grid grid-cols-[3fr_5fr] gap-12 ">
          <img
            src={product.image.filename}
            alt={product.image.description}
            className="rounded-2xl"
          />
          <div className="flex gap-2 flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold">{product.title}</h2>
              <p>{product.description}</p>
            </div>
            <div className="flex items-end">
              <div className="w-[200px] relative">
                <Pie
                  data={{
                    datasets: [
                      {
                        data: [product.kcal, 2000],
                        backgroundColor: ["#8CD003", "#D9D9D9"],
                      },
                    ],
                  }}
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <p>{product.kcal}kcal*</p>
                </div>
              </div>

              <p>*({(product.kcal / 2000) * 100}% of daily intake)</p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-8 items-center">
              <button
                className="bg-[#EDEFE9] aspect-square h-14 rounded-full"
                onClick={() =>
                  setProductQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                }
              >
                -
              </button>
              <p>{productQuantity}</p>
              <button
                className="bg-[#EDEFE9] aspect-square h-14 rounded-full"
                onClick={() => setProductQuantity((prev) => prev + 1)}
              >
                +
              </button>
            </div>
            <p>{formatCurrency(product.price)}</p>
          </div>
          <div>
            <button
              className="bg-lime w-full py-6 rounded-full"
              onClick={handleAddToCart}
            >
              Add to basket
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
