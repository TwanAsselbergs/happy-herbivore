import { db } from "@/db/prisma-client";
import type { FastifyRequest, FastifyReply } from "fastify";
import { type Product } from "@/types/common";

export async function productsIndex(req: FastifyRequest, res: FastifyReply) {
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
	).map((product) => ({
		...product,
		name: product.productTranslations[0].name,
		description: product.productTranslations[0].description,
		productTranslations: undefined,
	}));

	return products;
}

export async function fetchSingleProduct(
	req: FastifyRequest,
	res: FastifyReply
) {
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

	const product: Product = {
		...fetchedProduct,
		image: {
			filename: fetchedProduct.image?.filename ?? "",
			description: fetchedProduct.image?.description ?? "",
		},
		name: fetchedProduct.productTranslations[0].name,
		description: fetchedProduct.productTranslations[1].description ?? null,
	};

	return product;
}
