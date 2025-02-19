import { db } from "@/db/prisma-client";
import type { FastifyRequest } from "fastify";

// Route (GET): /api/v1/categories
export async function categoriesIndex(req: FastifyRequest) {
	let { lang } = req.query as { lang?: string };

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

	console.log(lang);

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
	).map((category) => ({
		...category,
		name: category.categoryTranslations[0].name,
		categoryTranslations: undefined,
	}));

	return categories;
}
