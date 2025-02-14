import fastify from "fastify";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import { configureCors } from "./src/config/cors";
import { productsIndex } from "@/api/products";
import { websocketHandler } from "@/utils/websocket";
import { categoriesIndex } from "@/api/categories";
import { createOrder, getTodaysOrders } from "@/api/orders";

const app = fastify({ logger: true });

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

app.register(cors, configureCors(FRONTEND_URL));
app.register(websocket);
app.register(
	(api, _, done) => {
		api.get("/products", productsIndex);
		api.get("/categories", categoriesIndex);

		api.post("/orders", createOrder);
		api.get("/orders/today", getTodaysOrders);

		done();
	},
	{ prefix: "/api/v1" }
);
app.get("/", { websocket: true }, websocketHandler);

try {
	await app.listen({ port: 3000 });
	console.log("Server up!");
} catch (err) {
	app.log.error(err);
	process.exit(1);
}
