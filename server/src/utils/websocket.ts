import { type WebSocket } from "@fastify/websocket";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatus } from "@/api/orders";

const clients: Set<WebSocket> = new Set();

export async function websocketHandler(socket: WebSocket) {
	clients.add(socket);
	console.log("Client connected");

	socket.on("message", async (msg) => {
		const message = JSON.parse(msg.toString());

		if (message.type === "update_order_status") {
			const { id, newStatus } = message.data;

			if (!Object.values(OrderStatus).includes(newStatus)) {
				console.error("Invalid order status:", newStatus);
				return;
			}

			await updateOrderStatus(newStatus, Number(id));

			broadcastMessage("status_update", {
				data: { id: Number(id), newStatus },
			});
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
