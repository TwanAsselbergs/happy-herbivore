import React from "react";
import { Product as ProductType } from "../../lib/types";
import { formatCurrency } from "../../lib/utils";

export default function Product({
  selected,
  setShowingDetailsId,
  product,
}: {
  selected: number[];
  setShowingDetailsId: React.Dispatch<React.SetStateAction<number | null>>;
  product: ProductType;
}) {
  return (
    <div
      className={`relative rounded-2xl bg-white-primary ${
        selected.includes(product.id) ? "outline-lime outline-4" : ""
      }`}
      onClick={() => {
        setShowingDetailsId(product.id);
      }}
      role="button"
    >
      <div className={`overflow-hidden rounded-2xl shadow-md`}>
        <img src={product.image.filename} alt={product.image.description} />
        <div className="p-4">
          <h3 className="font-bold truncate text-start">{product.title}</h3>
          <div className="flex justify-between">
            <p>
              {formatCurrency(product.price)}
            </p>
            <p className="text-black/40">{product.kcal}kcal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
