import React from "react";
import { Product as ProductType } from "../../lib/types";
import { formatCurrency, transformImageUrl } from "../../lib/utils";

export default function Product({
	cart,
	setShowingDetailsId,
	product,
}: Readonly<{
	cart?: { id: number; quantity: number };
	setShowingDetailsId: React.Dispatch<React.SetStateAction<number | null>>;
	product: ProductType;
}>) {
	return (
		<article
			className={`relative rounded-2xl bg-white-primary p-4 shadow-md flex flex-col ${
				cart ? "outline-lime outline-4" : ""
			}`}
		>
			<button
				className="absolute inset-0 w-full h-full opacity-0"
				onClick={() => setShowingDetailsId(product.id)}
				aria-label={`View details of ${product.name}`}
			/>

			<figure className="overflow-hidden rounded-2xl">
				<img
					src={transformImageUrl(product.image?.filename ?? "")}
					alt={product.image?.description}
					className="w-full"
				/>
				<figcaption className="sr-only">{product.image?.description}</figcaption>
			</figure>

			<header className="mt-4 grow flex flex-col justify-between">
				<h3 className="font-bold text-start line-clamp-2 leading-7">
					{product.name}
				</h3>
				<p>{formatCurrency(product.price)}</p>
			</header>

			<dl className="text-black/40">
				<dt className="sr-only">Calories</dt>
				<dd>{product.kcal} kcal</dd>
			</dl>

			{cart && (
				<span className="absolute top-0 right-0 bg-lime text-white-primary rounded-full h-10 aspect-square p-2 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
					{cart.quantity}
				</span>
			)}
		</article>
	);
}
