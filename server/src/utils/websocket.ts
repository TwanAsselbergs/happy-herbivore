import { type WebSocket } from "@fastify/websocket";
import type { FastifyRequest } from "fastify";

const clients: Set<WebSocket> = new Set();

export async function websocketHandler(socket: WebSocket, req: FastifyRequest) {
	clients.add(socket);
	console.log("Client connected");

	socket.on("message", (message) => {
		socket.send("hi from server");
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
