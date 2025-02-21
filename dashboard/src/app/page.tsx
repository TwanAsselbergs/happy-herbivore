"use client";

import { DollarSign, ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import KpiCard from "@/components/kpi-card";
import { OrderList } from "@/components/order-list";
import ProductsChart from "@/components/products-chart";
import { useWebSocketOrders } from "@/hooks/use-websocket-orders";
import { useFetchStatistics } from "@/hooks/use-fetch-statistics";

export default function StatisticsPage() {
	const {
		revenue,
		monthlyOrders,
		mostOrderedProducts,
		orders,
		setRevenue,
		setMonthlyOrders,
		setMostOrderedProducts,
		setOrders,
	} = useFetchStatistics();
	const wsRef = useWebSocketOrders(
		setOrders,
		setRevenue,
		setMonthlyOrders,
		setMostOrderedProducts
	);

	const getDescription = (prev: number, current: number) =>
		`${(((current - prev) / prev) * 100)
			.toFixed(2)
			.replace("Infinity", "\u221e")}% ${
			current > prev ? "increase" : "decrease"
		} from last month`;

	const calculateTrend = (
		val: { thisMonth: number; lastMonth: number } | null
	) => {
		if (!val) return undefined;

		if (val.thisMonth > val.lastMonth) {
			return "up";
		} else {
			return "down";
		}
	};

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-semibold text-gray-800 mb-6">
				Happy Herbivore Dashboard
			</h1>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<KpiCard
					title="Total Revenue"
					value={revenue ? `\u20ac${revenue?.thisMonth?.toFixed(2)}` : null}
					description={getDescription(
						revenue?.lastMonth ?? 0,
						revenue?.thisMonth ?? 0
					)}
					icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
					trend={calculateTrend(revenue)}
				/>
				<KpiCard
					title="Total Transactions"
					value={monthlyOrders?.thisMonth?.toString() ?? null}
					description={getDescription(
						monthlyOrders?.lastMonth ?? 0,
						monthlyOrders?.thisMonth ?? 0
					)}
					icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
					trend={calculateTrend(monthlyOrders)}
				/>
			</div>

			<Card className="mt-6">
				<CardHeader>
					<CardTitle>Recent Orders</CardTitle>
				</CardHeader>
				<CardContent>
					<OrderList orders={orders} setOrders={setOrders} ws={wsRef.current} />
				</CardContent>
			</Card>

			<div className="mt-6 grid lg:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Most Ordered Products</CardTitle>
					</CardHeader>
					<CardContent>
						<ProductsChart products={mostOrderedProducts} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
