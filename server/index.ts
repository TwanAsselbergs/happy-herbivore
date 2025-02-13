import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import websocket from "@fastify/websocket";

const db = new PrismaClient();
const app = fastify();

await app.register(websocket);

const clients = new Set();

app.get("/", { websocket: true }, function handler(socket, req) {
	clients.add(socket);

	socket.on("message", (message) => {
		socket.send("hi from server");
	});

	socket.on("close", () => {
		console.log("Client disconnected");

		clients.delete(socket);
	});
});

app.register(
	(api, _, done) => {
		api.get("/products", async () => {
			const products = await db.product.findMany({
				select: {
					category: {
						select: {
							name: true,
							id: true,
						},
					},
					description: true,
					image: {
						select: {
							filename: true,
							description: true,
						},
					},
					kcal: true,
					id: true,
					name: true,
					price: true,
				},
			});
			return products;
		});

		api.get("/categories", async () => {
			const categories = await db.category.findMany({
				select: {
					name: true,
					id: true,
					image: {
						select: {
							filename: true,
						},
					},
				},
			});
			return categories;
		});

		done();
	},
	{ prefix: "/api/v1" },
);

try {
	await app.listen({ port: 3000 });
	console.log("Server up!");
} catch (err) {
	app.log.error(err);
	process.exit(1);
}
