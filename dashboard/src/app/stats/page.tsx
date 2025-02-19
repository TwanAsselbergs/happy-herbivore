"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	DollarSign,
	Users,
	ShoppingCart,
	Clock,
} from "lucide-react";
import { OrderList } from "@/components/order-list";
import { useEffect, useState } from "react";

const BEARER_TOKEN = process.env.API_TOKEN ?? "placeholder_value";

export default function StatisticsPage() {
	const [revenue, setRevenue] = useState<{
		thisMonth: number;
		lastMonth: number;
	} | null>(null);
	const [monthlyOrders, setMonthlyOrders] = useState<{
		lastMonth: number;
		thisMonth: number;
	} | null>(null);

	useEffect(() => {
		(async () => {
			const response = await fetch("http://localhost:3000/api/v1/stats/revenue", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${BEARER_TOKEN}`,
				},
			});
			const data = await response.json();
			setRevenue(data);
		})();

		(async () => {
			const response = await fetch("http://localhost:3000/api/v1/stats/orders", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${BEARER_TOKEN}`,
				},
			});
			const data = await response.json();
			setMonthlyOrders(data);
		})();
	}, []);

	const getDescription = (prev: number, current: number) =>
		`${(((current - prev) / prev) * 100).toFixed(2)}% ${
			current > prev ? "increase" : "decrease"
		} from last month`;

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
				<KpiCard
					description={getDescription(
						revenue?.lastMonth ?? 0,
						revenue?.thisMonth ?? 0
					)}
					title="Total Revenue"
					value={`€${revenue?.thisMonth.toFixed(2)}`}
					icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
					trend={
						revenue &&
						revenue.lastMonth !== undefined &&
						revenue.thisMonth > revenue.lastMonth
							? "up"
							: "down"
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
					value={monthlyOrders?.thisMonth.toString() ?? "Loading..."}
					description={getDescription(
						monthlyOrders?.lastMonth ?? 0,
						monthlyOrders?.thisMonth ?? 0
					)}
					icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
					trend={
						monthlyOrders &&
						monthlyOrders.lastMonth !== undefined &&
						monthlyOrders.thisMonth > monthlyOrders.lastMonth
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
						<OrderList />
					</CardContent>
				</Card>
			</div>

			<Card className="mt-6">
				<CardHeader>
					<CardTitle>Recent Transactions</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Transaction ID</TableHead>
								<TableHead>Date & Time</TableHead>
								<TableHead>Amount</TableHead>
								<TableHead>Status</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{recentTransactions.map((transaction) => (
								<TableRow key={transaction.id}>
									<TableCell>{transaction.id}</TableCell>
									<TableCell>{transaction.dateTime}</TableCell>
									<TableCell>${transaction.amount.toFixed(2)}</TableCell>
									<TableCell>{transaction.status}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}

function KpiCard({
	title,
	value,
	description,
	icon,
	trend,
}: {
	title: string;
	value: string;
	description: string;
	icon: React.ReactNode;
	trend: "up" | "down";
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-xs text-muted-foreground">
					{trend === "up" ? (
						<ArrowUpIcon className="mr-1 h-4 w-4 text-green-500 inline" />
					) : (
						<ArrowDownIcon className="mr-1 h-4 w-4 text-red-500 inline" />
					)}
					{description}
				</p>
			</CardContent>
		</Card>
	);
}

const recentTransactions = [
	{
		id: "TRX001",
		dateTime: "2023-06-15 14:30",
		amount: 25.99,
		status: "Completed",
	},
	{
		id: "TRX002",
		dateTime: "2023-06-15 15:45",
		amount: 12.5,
		status: "Completed",
	},
	{
		id: "TRX003",
		dateTime: "2023-06-15 16:20",
		amount: 8.75,
		status: "Pending",
	},
	{
		id: "TRX004",
		dateTime: "2023-06-15 17:10",
		amount: 35.0,
		status: "Completed",
	},
	{
		id: "TRX005",
		dateTime: "2023-06-15 18:05",
		amount: 15.25,
		status: "Failed",
	},
];
