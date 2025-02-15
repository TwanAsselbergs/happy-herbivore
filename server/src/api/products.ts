import { db } from "@/db/prisma-client";
import type { FastifyRequest, FastifyReply } from "fastify";
import { type Product } from "@/types/common";

export async function productsIndex(req: FastifyRequest, res: FastifyReply) {
	const products = await db.product.findMany({
		select: {
			category: {
				select: {
					name: true,
					id: true,
				},
			},
			description: true,
			image: {
				select: {
					filename: true,
					description: true,
				},
			},
			kcal: true,
			id: true,
			name: true,
			price: true,
		},
	});
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

	const product: Product | null = await db.product.findUnique({
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
			description: true,
			image: {
				select: {
					filename: true,
					description: true,
				},
			},
			kcal: true,
			id: true,
			name: true,
			price: true,
		},
	});

	if (!product) {
		return res.status(404).send({ error: "Product does not exist" });
	}

	return product;
}
