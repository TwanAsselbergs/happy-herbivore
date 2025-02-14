import { db } from "@/db/prisma-client";
import type { FastifyRequest, FastifyReply } from "fastify";

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
