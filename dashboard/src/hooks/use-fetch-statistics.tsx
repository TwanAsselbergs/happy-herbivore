import { useEffect, useState } from "react";
import {
	fetchKpis,
	fetchTodaysOrders,
	fetchMostOrderedProducts,
} from "@/db/fetcher";
import type { MostOrderedProductType, Order } from "@/types/common";

export function useFetchStatistics() {
	const [revenue, setRevenue] = useState<{
		thisMonth: number;
		lastMonth: number;
	} | null>(null);
	const [monthlyOrders, setMonthlyOrders] = useState<{
		thisMonth: number;
		lastMonth: number;
	} | null>(null);
	const [mostOrderedProducts, setMostOrderedProducts] = useState<
		MostOrderedProductType[]
	>([]);
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		async function fetchData() {
			const { revenue, orders, mostOrderedProducts } = await fetchKpis();
			const todaysOrders = await fetchTodaysOrders();

			setRevenue(revenue);
			setMonthlyOrders(orders);
			setMostOrderedProducts(mostOrderedProducts);
			setOrders(todaysOrders);
		}

		fetchData();
	}, []);

	return {
		revenue,
		monthlyOrders,
		mostOrderedProducts,
		orders,
		setRevenue,
		setMonthlyOrders,
		setMostOrderedProducts,
		setOrders,
	};
}
