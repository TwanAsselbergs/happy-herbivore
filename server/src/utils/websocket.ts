import { type WebSocket } from "@fastify/websocket";

const clients: Set<WebSocket> = new Set();

export async function websocketHandler(socket: WebSocket) {
	clients.add(socket);
	console.log("Client connected");

	socket.on("message", (msg) => {
		socket.send("hi from server, you sent: " + JSON.stringify(msg));
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
