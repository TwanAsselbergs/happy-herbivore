import { type WebSocket } from "@fastify/websocket";
import { db } from "@/db/prisma-client";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/api/orders";

const clients: Set<WebSocket> = new Set();

export async function websocketHandler(socket: WebSocket) {
	clients.add(socket);
	console.log("Client connected");

	socket.on("message", async (msg) => {
		const message = JSON.parse(msg.toString());

		switch (message.type) {
			case "complete_order":
				await updateOrderStatus(
					OrderStatus.READY_FOR_PICKUP,
					Number(message.data.id)
				);

				broadcastMessage("status_update", {
					data: {
						id: Number(message.data.id),
						newStatus: OrderStatus.READY_FOR_PICKUP,
					},
				});
				break;
			case "mark_order_as_preparing":
				await updateOrderStatus(OrderStatus.PREPARING, Number(message.data.id));

				broadcastMessage("status_update", {
					data: {
						id: Number(message.data.id),
						newStatus: OrderStatus.PREPARING,
					},
				});
				break;
		}
	});

	socket.on("close", () => {
		console.log("Client disconnected");
		clients.delete(socket);
	});
}

export function broadcastMessage(type: string, message: object) {
	clients.forEach((client) => {
		if (client.readyState === 1) {
			client.send(JSON.stringify({ type, message }));
		}
	});
}
