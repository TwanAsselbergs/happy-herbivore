import { db } from "@/db/prisma-client";
import { transformCategory, getLanguage } from "@/utils/misc";
import type { FastifyRequest } from "fastify";

// Route (GET): /api/v1/categories
export async function categoriesIndex(req: FastifyRequest) {
	const lang = await getLanguage(req.query as { lang?: string });

	const categories = (
		await db.category.findMany({
			select: {
				id: true,
				image: {
					select: {
						filename: true,
					},
				},
				categoryTranslations: { where: { language: { code: lang } } },
			},
		})
	).map(transformCategory);

	return categories;
}
