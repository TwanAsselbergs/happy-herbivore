import { db } from "@/db/prisma-client";
import type { RevenueResponse } from "@/types/common";
import type { FastifyRequest } from "fastify";

// Route (GET): /api/v1/stats/revenue
export async function calculateRevenue(
	req: FastifyRequest
): Promise<RevenueResponse> {
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
export async function getOrdersAmount(
	req: FastifyRequest
): Promise<RevenueResponse> {
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
