import { db } from "@/db/prisma-client";

// Route (GET): /api/v1/categories
export async function categoriesIndex() {
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
