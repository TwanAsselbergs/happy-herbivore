import { db } from "@/db/prisma-client";
import type { FastifyReply, FastifyRequest } from "fastify";

export async function categoriesIndex(req: FastifyRequest, res: FastifyReply) {
	const categories = await db.category.findMany({
		select: {
			name: true,
			id: true,
			image: {
				select: {
					filename: true,
				},
			},
		},
	});
	return categories;
}
