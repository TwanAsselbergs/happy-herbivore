import React, { useEffect, useState } from "react";
import { products, categories } from "./Products";
import { formatCurrency } from "../../lib/utils";
import ProductDetails from "../ProductDetails";
import { ShoppingBag } from "lucide-react";

export default function Menu() {
  const [selected, setSelected] = useState<number[]>([]);
  const [showingDetailsId, setShowingDetailsId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    categories[0].id
  );
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(
      cart.reduce(
        (acc, { id, quantity }) =>
          acc + products.find((product) => product.id === id)!.price * quantity,
        0
      )
    );

    setTotalProducts(
      cart.reduce((acc, { quantity }) => acc + quantity, 0)
    );
  }, [cart]);

  return (
    <div className="bg-white w-full h-screen flex">
      <div className="basis-[230px] shrink-0 flex flex-col justify-between h-full">
        <div>
          {categories.map((category) => (
            <button
              key={category.name}
              className={`flex flex-col items-center p-8 min-h-[300px] justify-center ${
                selectedCategory == category.id ? "bg-orange-300" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <img
                src={category.image.filename}
                alt={category.image.description}
                className="w-[80%]"
              />
              <h2 className="font-bold text-center">{category.name}</h2>
            </button>
          ))}
        </div>
        <button className="flex flex-col bg-lime text-white aspect-square justify-center items-center gap-6 font-bold">
          <ShoppingBag size={65} strokeWidth={1.5} />
          {formatCurrency(total)}
        </button>
      </div>
      <div>
        <h2 className="font-bold text-4xl text-center mb-4 mt-16">
          {
            categories.find((category) => category.id === selectedCategory)
              ?.name
          }
        </h2>
        <div className="grid grid-cols-3 gap-8 p-8">
          {products.map((product) => {
            return (
              <button
                className={`relative rounded-2xl ${
                  selected.includes(product.id) ? "outline-lime outline-4" : ""
                }`}
                onClick={() => setShowingDetailsId(product.id)}
              >
                <div className={`overflow-hidden rounded-2xl shadow-md`}>
                  <img
                    src={product.image.filename}
                    alt={product.image.description}
                  />
                  <div className="p-4">
                    <h3 className="font-bold truncate">{product.title}</h3>
                    <div className="flex justify-between">
                      <p>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(product.price)}
                      </p>
                      <p className="text-black/40">{product.kcal}kcal</p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {showingDetailsId !== null && (
        <ProductDetails
          product={products.find((product) => product.id === showingDetailsId)!}
          setCart={setCart}
          setShowingDetailsId={setShowingDetailsId}
        />
      )}
    </div>
  );
}
