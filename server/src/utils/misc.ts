import type { Product, ProductTranslation } from "@/types/common";

// Helper function to return product with 'name' and 'description' in the right language
export function transformProduct(
	product: Omit<Product, "name" | "description"> & {
		productTranslations: ProductTranslation[];
	}
): Product {
	const res = {
		...product,
		name: product.productTranslations[0].name,
		description: product.productTranslations[0].description,
		productTranslations: undefined,
	};

	// Delete inital productTranslations entry from object
	delete res["productTranslations"];

	return res;
}
