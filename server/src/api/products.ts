import { db } from "@/db/prisma-client";
import type { FastifyRequest, FastifyReply } from "fastify";
import { type Product } from "@/types/common";
import { transformProduct } from "@/utils/misc";

export async function productsIndex(
	req: FastifyRequest,
	res: FastifyReply
): Promise<Product[]> {
	let { lang } = req.query as { lang?: string };

	const correspondingLanguage = await db.language.findFirst({
		where: {
			code: lang,
		},
	});

	if (!correspondingLanguage) {
		lang = "en";
	}

	const products: Product[] = (
		await db.product.findMany({
			select: {
				category: {
					select: {
						name: true,
						id: true,
						image: true,
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
				productTranslations: {
					where: { language: { code: lang } },
					select: {
						name: true,
						description: true,
					},
				},
			},
		})
	).map(transformProduct);

	return products;
}

export async function fetchSingleProduct(
	req: FastifyRequest,
	res: FastifyReply
): Promise<Product> {
	const id = Number((req.params as { id?: number }).id);

	if (!id) {
		return res.status(400).send({ error: "Id is required" });
	}

	let { lang } = req.query as { lang?: string };

	const correspondingLanguage = await db.language.findFirst({
		where: {
			code: lang,
		},
	});

	if (!correspondingLanguage) {
		lang = "en";
	}

	const fetchedProduct = await db.product.findUnique({
		where: {
			id,
		},
		select: {
			category: {
				select: {
					name: true,
					id: true,
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

	const product: Product = transformProduct(fetchedProduct);

	return product;
}
