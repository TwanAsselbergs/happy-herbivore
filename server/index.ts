import fastify from "fastify";
import websocket, { type WebSocket } from "@fastify/websocket";
import cors from "@fastify/cors";
import { configureCors } from "./src/config/cors";
import { productsIndex, fetchSingleProduct } from "@/api/products";
import { websocketHandler } from "@/utils/websocket";
import { categoriesIndex } from "@/api/categories";
import { placeOrder, fetchTodaysOrders } from "@/api/orders";

const app = fastify({ logger: true });

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

// Register CORS and initialize WebSocket server
app.register(cors, configureCors(FRONTEND_URL));
await app.register(websocket);

// Register routes
app.get("/", { websocket: true }, websocketHandler);
app.register(
	(api, _, done) => {
		api.get("/products", productsIndex);
		api.get("/products/:id", fetchSingleProduct);

		api.get("/categories", categoriesIndex);

		api.post("/orders", placeOrder);
		api.get("/orders/today", fetchTodaysOrders);

		done();
	},
	{ prefix: "/api/v1" }
);

// Start server
try {
	await app.listen({ port: 3000 });
	console.log("Server up!");
} catch (err) {
	app.log.error(err);
	process.exit(1);
}
