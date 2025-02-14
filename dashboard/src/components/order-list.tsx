"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import { Status, Order, OrderProduct } from "@/types/common";

const WEBSOCKET_URL = "ws://localhost:3000?token=your-secret-token";

export function OrderList() {
	const [orders, setOrders] = useState<Order[]>([]);

	useEffect(() => {
		const ws = new WebSocket(WEBSOCKET_URL);

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);

			if (data.type === "order") {
				const newOrder = data.message.data;

				setOrders((prev) => [
					{
						...data.message.data,
						status: Status.PENDING,
						createdAt: new Date(newOrder.createdAt),
					},
					...prev,
				]);
			}
		};

		return () => ws.close();
	}, []);

	const updateProductStatus = (
		orderId: number,
		productId: number,
		newStatus: Status
	) => {
		setOrders((prevOrders) =>
			prevOrders.map((order) => {
				if (order.id === orderId) {
					const updatedProducts = order.orderProducts.map((orderProduct) => {
						console.log(orderProduct);

						return orderProduct.product.id === productId
							? { ...orderProduct, status: newStatus }
							: orderProduct;
					});
					const allCompleted = updatedProducts.every(
						(product) => product.status === Status.COMPLETED
					);
					return {
						...order,
						orderProducts: updatedProducts,
						status: allCompleted ? Status.COMPLETED : Status.PREPARING,
					};
				}
				return order;
			})
		);
	};

	useEffect(() => {
		fetchInitialOrders();
	}, []);

	async function fetchInitialOrders() {
		const res = await fetch("http://localhost:3000/api/v1/orders/today");

		const { orders } = await res.json();

		if (orders) {
			setOrders(
				orders.map((order: any) => ({
					...order,
					createdAt: new Date(order.createdAt),
				}))
			);
		}
	}

	// console.log(orders[0].createdAt.toLocaleTimeString());

	const completeOrder = (orderId: number) => {
		setOrders((prevOrders) =>
			prevOrders.map((order) =>
				order.id === orderId
					? {
							...order,
							status: Status.COMPLETED,
							orderProducts: order.orderProducts.map((product) => ({
								...product,
								status: Status.COMPLETED,
							})),
					  }
					: order
			)
		);
	};

	return (
		<div className="space-y-4 w-full">
			{orders.map((order) => (
				<Card key={order.id} className="w-full">
					<CardHeader>
						<CardTitle className="flex justify-between items-center">
							<span>
								Order #{order.id}{" "}
								<span className="text-gray-400 font-medium" suppressHydrationWarning>
									- Placed at: {order.createdAt.toLocaleTimeString()}
								</span>
							</span>
							<Badge
								variant={
									order.status === Status.COMPLETED
										? "lime"
										: order.status === Status.PENDING
										? "secondary"
										: "orange"
								}
							>
								{order.status}
							</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<Collapsible>
							<CollapsibleTrigger asChild>
								<Button variant="ghost" className="flex w-full justify-between">
									View Products
									<ChevronDown className="h-4 w-4" />
								</Button>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Product</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Quantity</TableHead>
											<TableHead className="w-fit">Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{order.orderProducts.map((orderProduct) => (
											<TableRow key={orderProduct.product.id}>
												<TableCell>{orderProduct.product.name}</TableCell>
												<TableCell>
													<Badge
														variant={
															orderProduct.status === "completed" ? "lime" : "secondary"
														}
													>
														{orderProduct.status}
													</Badge>
												</TableCell>
												<TableCell>{orderProduct.quantity}</TableCell>
												<TableCell className="w-fit">
													{orderProduct.status !== "completed" && (
														<span className="flex">
															<Button
																variant="orange"
																size="sm"
																className="mr-2"
																onClick={() =>
																	updateProductStatus(
																		order.id,
																		orderProduct.product.id,
																		Status.PREPARING
																	)
																}
																disabled={orderProduct.status === Status.PREPARING}
															>
																Prepare
															</Button>
															<Button
																variant="green"
																size="sm"
																onClick={() =>
																	updateProductStatus(
																		order.id,
																		orderProduct.product.id,
																		Status.COMPLETED
																	)
																}
															>
																Complete
															</Button>
														</span>
													)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CollapsibleContent>
						</Collapsible>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
