"use client";

import { SetStateAction } from "react";
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
import { Status, Order, OrderStatus, OrderProduct } from "@/types/common";
import { motion } from "framer-motion";
import { formatOrderNumber } from "@/lib/utils";

const BEARER_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? "placeholder_value";

export function OrderList({
	orders,
	setOrders,
	ws,
}: Readonly<{
	orders: Order[];
	ws: WebSocket | null;
	setOrders: React.Dispatch<SetStateAction<Order[]>>;
}>) {
	const updateProductStatus = (
		orderId: number,
		productId: number,
		newStatus: Status
	) => {
		setOrders((prevOrders) =>
			prevOrders.map((order) => {
				if (order.id !== orderId) return order;

				const updatedProducts = getUpdatedProducts(
					order.orderProducts,
					productId,
					newStatus
				);
				const newOrderStatus = determineOrderStatus(order, updatedProducts);

				if (newOrderStatus) updateOrderStatus(order.id, newOrderStatus);

				return {
					...order,
					orderProducts: updatedProducts,
				};
			})
		);
	};

	const determineOrderStatus = (
		order: Order,
		updatedProducts: OrderProduct[]
	) => {
		const allCompleted = updatedProducts.every(
			(product) => product.status === Status.COMPLETED
		);

		if (allCompleted) return OrderStatus.READY_FOR_PICKUP;
		if (order.status === OrderStatus.PLACED_AND_PAID)
			return OrderStatus.PREPARING;

		return null;
	};

	const getUpdatedProducts = (
		orderProducts: OrderProduct[],
		productId: number,
		newStatus: Status
	) => {
		return orderProducts.map((orderProduct) =>
			orderProduct.product.id === productId
				? { ...orderProduct, status: newStatus }
				: orderProduct
		);
	};

	function transformOrderStatus(status: OrderStatus) {
		switch (status) {
			case OrderStatus.PICKED_UP:
				return "Picked up";
			case OrderStatus.PLACED_AND_PAID:
				return "Placed and Paid";
			case OrderStatus.READY_FOR_PICKUP:
				return "Ready for Pickup";
			case OrderStatus.PREPARING:
				return "Preparing...";
			case OrderStatus.STARTED:
				return "Started";
		}
	}

	function getStatusColor(status: OrderStatus) {
		switch (status) {
			case OrderStatus.PLACED_AND_PAID:
				return "secondary";
			case OrderStatus.PREPARING:
				return "orange";
			case OrderStatus.READY_FOR_PICKUP:
				return "lime";
			default:
				return "secondary";
		}
	}

	const updateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
		if (!ws) return;

		setOrders((prevOrders) =>
			prevOrders.map((order) =>
				order.id === orderId ? { ...order, status: newStatus } : order
			)
		);

		ws.send(
			JSON.stringify({
				type: "update_order_status",
				data: {
					id: orderId,
					newStatus,
				},
			})
		);
	};

	function removeOrder(orderId: number) {
		updateOrderStatus(orderId, OrderStatus.PICKED_UP);
	}

	return (
		<div className="space-y-4 w-full">
			{orders.length === 0 && (
				<h3 className="text-gray-500">No outstanding orders.</h3>
			)}
			{orders.map((order) => (
				<motion.div
					key={order.id}
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ type: "spring", damping: 20, stiffness: 300 }}
					layout
				>
					<Card className="w-full">
						<CardHeader>
							<CardTitle className="flex justify-between items-center">
								<span>
									Order #{formatOrderNumber(order.pickupNumber)}{" "}
									<span className="text-gray-400 font-medium" suppressHydrationWarning>
										- Placed at: {order.createdAt.toLocaleTimeString()}
									</span>
								</span>
								<div className="flex gap-2">
									<Badge variant={getStatusColor(order.status)}>
										{transformOrderStatus(order.status)}
									</Badge>
									{order.status == OrderStatus.READY_FOR_PICKUP && (
										<Badge variant="destructive">
											<button onClick={() => removeOrder(order.id)}>
												Mark as picked up
											</button>
										</Badge>
									)}
								</div>
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
												<TableHead className="w-fit">Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{order.orderProducts.map((orderProduct) => (
												<TableRow key={orderProduct.product.id}>
													<TableCell>
														{orderProduct.product.name} x{orderProduct.quantity}
													</TableCell>
													<TableCell>
														<Badge
															variant={
																orderProduct.status === "completed" ? "lime" : "secondary"
															}
														>
															{orderProduct.status}
														</Badge>
													</TableCell>
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
				</motion.div>
			))}
		</div>
	);
}
