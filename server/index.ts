import fastify from "fastify";
import { PrismaClient, OrderStatus } from "@prisma/client";
import websocket, { type WebSocket } from "@fastify/websocket";
import cors from "@fastify/cors";
import { orderSchema } from "./src/schema";
import type { Decimal } from "@prisma/client/runtime/library";

const db = new PrismaClient();
const app = fastify({ logger: true });

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.register(cors, {
	origin: FRONTEND_URL,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	credentials: true,
});

interface OrderItem {
	id: number;
	quantity: number;
	price?: Decimal;
}

await app.register(websocket);

const clients: Set<WebSocket> = new Set();

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

		api.post("/orders", async (req, res) => {
			const body = req.body as { order: OrderItem[] };

			const order = body?.order;

			try {
				if (!order) {
					throw new Error("Order is required.");
				}

				const parseRes = orderSchema.safeParse(order);

				if (!parseRes.success) {
					res.status(400).send(parseRes.error.flatten());
					return;
				}

				const startOfDay = new Date();
				startOfDay.setHours(0, 0, 0, 0);

				const ordersThisDay = await db.order.count({
					where: {
						createdAt: {
							gte: startOfDay,
						},
					},
				});

				console.log(`${ordersThisDay} orders placed today.`);

				const productIds = order.map((item) => item.id);

				const products = await db.product.findMany({
					where: {
						id: {
							in: productIds,
						},
					},
					select: {
						id: true,
						price: true,
					},
				});

				const productPriceMap = new Map(
					products.map((product) => [product.id, product.price])
				);

				order.forEach((item) => {
					item.price = productPriceMap.get(item.id) ?? undefined;
				});

				const totalPrice = order.reduce(
					(acc, item) => acc + (item.price ? Number(item.price) : 0) * item.quantity,
					0
				);

				console.log(`Total price: ${totalPrice}`);

				const placedOrder = await db.order.create({
					data: {
						pickupNumber: ordersThisDay + 1,
						price: totalPrice,
						orderProducts: {
							createMany: {
								data: order.map((item) => ({
									price: item.price ?? 0,
									quantity: item.quantity,
									productId: item.id,
								})),
							},
						},
						orderStatus: OrderStatus.PLACED_AND_PAID,
					},
					select: {
						id: true,
						createdAt: true,
						price: true,
						orderProducts: {
							select: {
								price: true,
								quantity: true,
								product: {
									select: {
										id: true,
										name: true,
										image: true,
									},
								},
							},
						},
					},
				});

				broadcastMessage("order", {
					data: placedOrder,
				});

				res.status(200).send({
					order: placedOrder,
				});
			} catch (e) {
				res
					.status(400)
					.send({ error: e instanceof Error ? e.message : "Invalid request." });
			}
		});

		done();
	},
	{ prefix: "/api/v1" }
);

try {
	await app.listen({ port: 3000 });
	console.log("Server up!");
} catch (err) {
	app.log.error(err);
	process.exit(1);
}

function broadcastMessage(type: string, message: object) {
	clients.forEach((client) => {
		if (client.readyState === 1) {
			client.send(JSON.stringify({ type, message }));
		}
	});
}
