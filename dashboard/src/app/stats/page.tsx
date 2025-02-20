"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, ShoppingCart, Clock } from "lucide-react";
import { OrderList } from "@/components/order-list";
import { Order, OrderStatus } from "@/types/common";
import KpiCard from "@/components/kpi-card";

const API_BASE_URL = "http://localhost:3000/api/v1/stats";
const BEARER_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? "placeholder_value";
const WEBSOCKET_URL = "ws://localhost:3000?token=your-secret-token";

export default function StatisticsPage() {
	const [revenue, setRevenue] = useState<{
		thisMonth: number;
		lastMonth: number;
	} | null>(null);
	const [monthlyOrders, setMonthlyOrders] = useState<{
		thisMonth: number;
		lastMonth: number;
	} | null>(null);
	const [orders, setOrders] = useState<Order[]>([]);
	const wsRef = useRef<WebSocket | null>(null);

	// Fetch API Data
	useEffect(() => {
		const fetchData = async (endpoint: string, setter: Function) => {
			try {
				const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${BEARER_TOKEN}`,
					},
				});
				const data = await response.json();
				setter(data);
			} catch (error) {
				console.error(`Error fetching ${endpoint}:`, error);
			}
		};

		fetchData("revenue", setRevenue);
		fetchData("orders", setMonthlyOrders);
	}, []);

	// WebSocket Connection
	useEffect(() => {
		wsRef.current = new WebSocket(WEBSOCKET_URL);

		wsRef.current.onmessage = (event) => {
			const { type, message } = JSON.parse(event.data);

			if (type === "order") handleNewOrder(message.data);
			else if (type === "status_update") handleStatusUpdate(message.data);
		};

		return () => wsRef.current?.close();
	}, []);

	const handleNewOrder = (newOrder: Order) => {
		setRevenue((prev) => ({
			lastMonth: prev?.lastMonth ?? 0,
			thisMonth: (prev?.thisMonth ?? 0) + Number(newOrder?.price),
		}));

		setMonthlyOrders((prev) => ({
			lastMonth: prev?.lastMonth ?? 0,
			thisMonth: (prev?.thisMonth ?? 0) + 1,
		}));

		setOrders((prev) => [newOrder, ...prev]);
	};

	const handleStatusUpdate = ({
		id,
		newStatus,
	}: {
		id: number;
		newStatus: OrderStatus;
	}) => {
		if (!Object.values(OrderStatus).includes(newStatus)) {
			console.error("Invalid order status:", newStatus);
			return;
		}

		if (newStatus === OrderStatus.PICKED_UP) {
			setOrders((prev) => prev.filter((order) => order.id != id));
			return;
		}

		setOrders((prev) =>
			prev.map((order) =>
				order.id === id ? { ...order, status: newStatus } : order
			)
		);
	};

	const getDescription = (prev: number, current: number) =>
		`${(((current - prev) / prev) * 100).toFixed(2)}% ${
			current > prev ? "increase" : "decrease"
		} from last month`;

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<KpiCard
					title="Total Revenue"
					value={`€${revenue?.thisMonth?.toFixed(2) ?? "Loading..."}`}
					description={getDescription(
						revenue?.lastMonth ?? 0,
						revenue?.thisMonth ?? 0
					)}
					icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
					trend={
						(revenue?.thisMonth ?? 0) > (revenue?.lastMonth ?? 0) ? "up" : "down"
					}
				/>
				<KpiCard
					title="Total Users"
					value="1,234"
					description="5% increase from last month"
					icon={<Users className="h-4 w-4 text-muted-foreground" />}
					trend="up"
				/>
				<KpiCard
					title="Total Transactions"
					value={monthlyOrders?.thisMonth?.toString() ?? "Loading..."}
					description={getDescription(
						monthlyOrders?.lastMonth ?? 0,
						monthlyOrders?.thisMonth ?? 0
					)}
					icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
					trend={
						(monthlyOrders?.thisMonth ?? 0) > (monthlyOrders?.lastMonth ?? 0)
							? "up"
							: "down"
					}
				/>
				<KpiCard
					title="Avg. Transaction Time"
					value="2m 15s"
					description="10% faster than last month"
					icon={<Clock className="h-4 w-4 text-muted-foreground" />}
					trend="up"
				/>
			</div>

			<div className="mt-6">
				<Card>
					<CardHeader>
						<CardTitle>Recent orders</CardTitle>
					</CardHeader>
					<CardContent>
						<OrderList orders={orders} setOrders={setOrders} ws={wsRef.current} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
