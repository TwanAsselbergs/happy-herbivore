import { Order, OrderStatus, MostOrderedProductType } from "@/types/common";
import React, { useRef, useEffect } from "react";

const WEBSOCKET_URL = "ws://localhost:3000?token=your-secret-token";

export function useWebSocketOrders(
	setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
	setRevenue: React.Dispatch<
		React.SetStateAction<{ thisMonth: number; lastMonth: number } | null>
	>,
	setMonthlyOrders: React.Dispatch<
		React.SetStateAction<{ thisMonth: number; lastMonth: number } | null>
	>,
	setMostOrderedProducts: React.Dispatch<
		React.SetStateAction<MostOrderedProductType[]>
	>
) {
	const wsRef = useRef<WebSocket | null>(null);
	const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		function connectWs() {
			if (wsRef.current) return;

			wsRef.current = new WebSocket(WEBSOCKET_URL);

			wsRef.current.onopen = () => console.log("Connected to WebSocket server.");

			wsRef.current.onmessage = (event) => {
				const { type, message } = JSON.parse(event.data);
				if (type === "order") handleNewOrder(message.data);
				else if (type === "status_update") handleStatusUpdate(message.data);
			};

			wsRef.current.onclose = () => {
				console.warn("WebSocket disconnected, reconnecting...");
				wsRef.current = null;
				pollingIntervalRef.current = setTimeout(connectWs, 2000);
			};

			wsRef.current.onerror = () => wsRef.current?.close();
		}

		function handleNewOrder(newOrder: Order) {
			setRevenue((prev) => ({
				lastMonth: prev?.lastMonth ?? 0,
				thisMonth: (prev?.thisMonth ?? 0) + Number(newOrder?.price),
			}));

			setMonthlyOrders((prev) => ({
				lastMonth: prev?.lastMonth ?? 0,
				thisMonth: (prev?.thisMonth ?? 0) + 1,
			}));

			setMostOrderedProducts((prev) => {
				let updatedProducts = [...prev];

				newOrder.orderProducts.forEach((orderedProduct) => {
					const existingIndex = updatedProducts.findIndex(
						(p) => orderedProduct.product.id === p.id
					);

					if (existingIndex !== -1) {
						updatedProducts[existingIndex] = {
							...updatedProducts[existingIndex],
							quantity:
								updatedProducts[existingIndex].quantity + orderedProduct.quantity,
						};
					} else {
						updatedProducts.push({
							...orderedProduct.product,
							quantity: orderedProduct.quantity,
						});
					}
				});

				return updatedProducts;
			});

			setOrders((prev) => [
				{ ...newOrder, createdAt: new Date(newOrder.createdAt) },
				...prev,
			]);
		}

		function handleStatusUpdate({
			id,
			newStatus,
		}: {
			id: number;
			newStatus: OrderStatus;
		}) {
			if (!Object.values(OrderStatus).includes(newStatus)) {
				console.error("Invalid order status:", newStatus);
				return;
			}

			setOrders((prev) =>
				newStatus === OrderStatus.PICKED_UP
					? prev.filter((order) => order.id !== id)
					: prev.map((order) =>
							order.id === id ? { ...order, status: newStatus } : order
					  )
			);
		}

		connectWs();

		return () => {
			wsRef.current?.close();
			if (pollingIntervalRef.current) clearTimeout(pollingIntervalRef.current);
		};
	}, [setOrders, setRevenue, setMonthlyOrders, setMostOrderedProducts]);

	return wsRef;
}
