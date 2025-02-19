import { db } from "@/db/prisma-client";
import type {
	AtLeast,
	Category,
	CategoryTranslation,
	Product,
	ProductTranslation,
} from "@/types/common";

// Helper function to return product with 'name' and 'description' in the right language
export function transformProduct(
	product: AtLeast<Product, "id"> & {
		productTranslations: ProductTranslation[];
	}
) {
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

// Helper function to return category with 'name' and 'description' in the right language
export function transformCategory(
	category: AtLeast<Category, "id"> & {
		categoryTranslations: CategoryTranslation[];
	}
) {
	const res = {
		...category,
		name: category.categoryTranslations[0].name,
		description: category.categoryTranslations[0].description,
		categoryTranslations: undefined,
	};

	delete res["categoryTranslations"];

	return res;
}

// Helper function to get the language from the query params, and use English as a fallback
export async function getLanguage(query: { lang?: string }): Promise<string> {
	let { lang } = query;

	if (lang) {
		const correspondingLanguage = await db.language.findFirst({
			where: {
				code: lang,
			},
		});

		lang = correspondingLanguage?.code;
	}

	if (!lang) {
		lang = "en";
	}

	return lang;
}
