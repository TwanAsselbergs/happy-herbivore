"use server";

import { Order } from "@/types/common";

const BEARER_TOKEN = process.env.BEARER_TOKEN ?? "placeholder_value";
const API_BASE_URL =
	(process.env.NEXT_PUBLIC_API_BASE_URL ??
		"https://happyherbivore.noeycodes.com") + "/api/v1";

const fetchData = async (endpoint: string) => {
	try {
		const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${BEARER_TOKEN}`,
			},
		});
		const data = await response.json();

		return data;
	} catch (error) {
		console.error(`Error fetching ${endpoint}:`, error);
	}
};

export async function fetchKpis() {
	const [revenue, orders, mostOrderedProducts] = await Promise.all([
		fetchData("stats/revenue"),
		fetchData("stats/orders"),
		fetchData("stats/products"),
	]);

	return {
		revenue,
		orders,
		mostOrderedProducts,
	};
}

export async function fetchMostOrderedProducts({
	startDate,
	endDate,
}: {
	startDate?: Date;
	endDate?: Date;
}) {
	const mostOrderedProducts = await fetchData(
		`stats/products?startDate=${startDate}&endDate=${endDate}`
	);

	return mostOrderedProducts;
}

export async function fetchTodaysOrders(): Promise<Order[]> {
	const {
		orders,
	}: { orders: (Omit<Order, "createdAt"> & { createdAt: string })[] } =
		await fetchData("orders/today");

	const formattedOrders: Order[] = orders.map((order) => ({
		...order,
		createdAt: new Date(order.createdAt),
	}));

	return formattedOrders;
}
