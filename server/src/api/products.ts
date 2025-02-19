import { db } from "@/db/prisma-client";
import type { FastifyRequest, FastifyReply } from "fastify";
import { type Category, type Product } from "@/types/common";
import { getLanguage, transformCategory, transformProduct } from "@/utils/misc";

// Route (GET): /api/v1/products
export async function productsIndex(req: FastifyRequest): Promise<Product[]> {
	const lang = await getLanguage(req.query as { lang?: string });

	const products: Product[] = (
		await db.product.findMany({
			select: {
				category: {
					select: {
						id: true,
						image: true,
						categoryTranslations: {
							select: { name: true },
							where: { language: { code: lang } },
						},
					},
				},
				image: {
					select: {
						filename: true,
						description: true,
					},
				},
				kcal: true,
				id: true,
				price: true,
				dietType: true,
				productTranslations: {
					where: { language: { code: lang } },
					select: {
						name: true,
						description: true,
					},
				},
			},
		})
	).map(
		(product) =>
			transformProduct({
				...product,
				category: transformCategory(product.category) as Category,
			}) as Product
	);

	return products;
}

// Route (GET): /api/v1/products/:id
export async function fetchSingleProduct(
	req: FastifyRequest,
	res: FastifyReply
): Promise<Product> {
	const id = Number((req.params as { id?: number }).id);

	if (!id) {
		return res.status(400).send({ error: "Id is required" });
	}

	const lang = await getLanguage(req.query as { lang?: string });

	const fetchedProduct = await db.product.findUnique({
		where: {
			id,
		},
		select: {
			category: {
				select: {
					id: true,
					categoryTranslations: {
						select: { name: true },
						where: { language: { code: lang } },
					},
				},
			},
			image: {
				select: {
					filename: true,
					description: true,
				},
			},
			kcal: true,
			id: true,
			price: true,
			dietType: true,
			productTranslations: {
				where: { language: { code: lang } },
				select: {
					name: true,
					description: true,
				},
			},
		},
	});

	if (!fetchedProduct) {
		return res.status(404).send({ error: "Product does not exist" });
	}

	// Transform database response so it doesn't include the ugly translations array
	const product: Product = transformProduct({
		...fetchedProduct,
		category: transformCategory(fetchedProduct.category) as Category,
	}) as Product;

	return product;
}
