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

	const connectWs = () => {
		if (wsRef.current) return;

		const ws = new WebSocket(WEBSOCKET_URL);
		wsRef.current = ws;

		ws.onopen = () => console.log("Connected to WebSocket server.");
		ws.onmessage = handleMessage;
		ws.onclose = handleDisconnect;
		ws.onerror = () => wsRef.current?.close();
	};

	const handleMessage = (event: MessageEvent) => {
		const { type, message } = JSON.parse(event.data);
		const handlers: Record<string, (data: any) => void> = {
			order: handleNewOrder,
			status_update: handleStatusUpdate,
		};
		handlers[type]?.(message.data);
	};

	const handleDisconnect = () => {
		console.warn("WebSocket disconnected, reconnecting...");
		wsRef.current = null;
		pollingIntervalRef.current = setTimeout(connectWs, 2000);
	};

	const handleNewOrder = (newOrder: Order) => {
		setRevenue((prev) => ({
			lastMonth: prev?.lastMonth ?? 0,
			thisMonth: (prev?.thisMonth ?? 0) + Number(newOrder?.price),
		}));

		setMonthlyOrders((prev) => ({
			lastMonth: prev?.lastMonth ?? 0,
			thisMonth: (prev?.thisMonth ?? 0) + 1,
		}));

		setMostOrderedProducts((prev) => updateMostOrderedProducts(prev, newOrder));

		setOrders((prev) => [
			{ ...newOrder, createdAt: new Date(newOrder.createdAt) },
			...prev,
		]);
	};

	const updateMostOrderedProducts = (
		prev: MostOrderedProductType[],
		newOrder: Order
	) => {
		const updatedProducts = [...prev];

		newOrder.orderProducts.forEach(({ product, quantity }) => {
			const existingIndex = updatedProducts.findIndex((p) => product.id === p.id);

			if (existingIndex !== -1) {
				updatedProducts[existingIndex] = {
					...updatedProducts[existingIndex],
					quantity: updatedProducts[existingIndex].quantity + quantity,
				};
			} else {
				updatedProducts.push({
					name: product.name,
					id: product.id,
					description: null,
					quantity,
				});
			}
		});

		return updatedProducts;
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

		setOrders((prev) =>
			newStatus === OrderStatus.PICKED_UP
				? prev.filter((order) => order.id !== id)
				: prev.map((order) =>
						order.id === id ? { ...order, status: newStatus } : order
				  )
		);
	};

	useEffect(() => {
		connectWs();

		return () => {
			wsRef.current?.close();
			if (pollingIntervalRef.current) clearTimeout(pollingIntervalRef.current);
		};
	}, [setOrders, setRevenue, setMonthlyOrders, setMostOrderedProducts]);

	return wsRef;
}
