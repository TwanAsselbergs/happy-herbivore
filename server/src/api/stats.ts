import { db } from "@/db/prisma-client";
import type { MostOrderedProductType, RevenueResponse } from "@/types/common";
import { isDate, transformProduct } from "@/utils/misc";
import type { FastifyRequest } from "fastify";

// Route (GET): /api/v1/stats/revenue
export async function calculateRevenue(): Promise<RevenueResponse> {
	const prevMonth = new Date();
	prevMonth.setMonth(prevMonth.getMonth() - 1);

	const twoMonthsAgo = new Date();
	twoMonthsAgo.setMonth(new Date().getMonth() - 2);

	const revenueThisMonth = await db.order.aggregate({
		_sum: {
			price: true,
		},
		where: {
			createdAt: {
				gte: prevMonth,
			},
		},
	});

	const revenueLastMonth = await db.order.aggregate({
		_sum: {
			price: true,
		},
		where: {
			createdAt: {
				gte: twoMonthsAgo,
				lte: prevMonth,
			},
		},
	});

	return {
		thisMonth: Number(revenueThisMonth._sum.price),
		lastMonth: Number(revenueLastMonth._sum.price),
	};
}

// Route (GET): /api/v1/stats/
export async function getOrdersAmount(): Promise<RevenueResponse> {
	const prevMonth = new Date();
	prevMonth.setMonth(prevMonth.getMonth() - 1);

	const twoMonthsAgo = new Date();
	twoMonthsAgo.setMonth(new Date().getMonth() - 2);

	const ordersThisMonth = await db.order.count({
		where: {
			createdAt: {
				gte: prevMonth,
			},
		},
	});

	const ordersLastMonth = await db.order.count({
		where: {
			createdAt: {
				gte: twoMonthsAgo,
				lte: prevMonth,
			},
		},
	});

	return {
		thisMonth: ordersThisMonth,
		lastMonth: ordersLastMonth,
	};
}

export async function getMostOrderedProducts(req: FastifyRequest) {
	const query = req.query as {
		startDate: string | undefined;
		endDate: string | undefined;
	};

	const rawStartDate = query.startDate;
	const rawEndDate = query.endDate;

	const hasValidStartDate = isDate(rawStartDate ?? "");
	const hasValidEndDate = isDate(rawEndDate ?? "");

	const startDate: Date | undefined = hasValidStartDate
		? new Date(rawStartDate ?? "")
		: undefined;
	if (startDate) startDate.setHours(0, 0, 0, 0);

	const endDate: Date | undefined = hasValidEndDate
		? new Date(rawEndDate ?? "")
		: undefined;
	if (endDate) endDate.setHours(23, 59, 59);

	if (startDate && hasValidEndDate && endDate) {
		if (startDate > endDate) {
			return {
				valid: false,
			};
		}
	}

	const mostOrderedProducts = await db.orderProduct.groupBy({
		by: ["productId"],
		_sum: {
			quantity: true,
		},
		orderBy: {
			_sum: {
				quantity: "desc",
			},
		},
		where: {
			order: {
				createdAt: {
					gte: startDate,
					lte: endDate,
				},
			},
		},
	});

	const productIds = mostOrderedProducts.map((product) => product.productId);

	const correspondingProducts: MostOrderedProductType[] = (
		await db.product.findMany({
			where: {
				id: {
					in: productIds,
				},
			},
			select: {
				id: true,
				productTranslations: {
					where: { language: { code: "en" } },
					select: {
						name: true,
						description: true,
					},
				},
			},
		})
	).map((product) => ({
		...transformProduct({
			...product,
		}),
		quantity:
			mostOrderedProducts.find(
				(orderedProduct) => product.id === orderedProduct.productId
			)?._sum.quantity ?? 0,
	}));

	return correspondingProducts;
}
