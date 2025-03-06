import fastify from "fastify";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import { configureCors } from "./src/config/cors";
import { productsIndex, fetchSingleProduct } from "@/api/products";
import { websocketHandler } from "@/utils/websocket";
import fastifyBearerAuth from "@fastify/bearer-auth";
import { categoriesIndex } from "@/api/categories";
import { placeOrder, fetchTodaysOrders } from "@/api/orders";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
	categoriesResponseSchema,
	ordersResponseSchema,
	productSchema,
	productsSchema,
	ordersRequestSchema,
	revenueResponseSchema,
	mostOrderedProductsResponseSchema,
	orderAmountResponseSchema,
} from "@/utils/response-schemas";
import {
	calculateRevenue,
	getMostOrderedProducts,
	getOrdersAmount,
} from "@/api/stats";

const keys = (process.env.BEARER_TOKENS ?? "placeholder_value").split(", ");

const app = fastify({ logger: true });

await app.register(fastifySwagger, {
	swagger: {
		info: {
			title: "Happy Herbivore API",
			description: `API documentation for the Node.js back-end of the server. 
				**Make sure to provide your bearer token in the Authorization headers** when making a request.`,
			version: "1.0.0",
		},
	},
});

await app.register(fastifySwaggerUi, {
	routePrefix: "/docs",
	staticCSP: true,
	transformSpecificationClone: true,
});

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

// Register CORS and initialize WebSocket server
app.register(cors, configureCors(FRONTEND_URL));
await app.register(websocket);

// Register routes
app.get(
	"/",
	{
		websocket: true,
		schema: {
			hide: true,
		},
	},
	websocketHandler
);
app.register(
	(api, _, done) => {
		api.register(fastifyBearerAuth, { keys });

		api.get("/products", productsSchema, productsIndex);
		api.get("/products/:id", productSchema, fetchSingleProduct);

		api.get("/categories", categoriesResponseSchema, categoriesIndex);

		api.post("/orders", ordersRequestSchema, placeOrder);

		api.get("/orders/today", ordersResponseSchema, fetchTodaysOrders);

		api.get(
			"/stats/revenue",
			{
				schema: revenueResponseSchema,
			},
			calculateRevenue
		);
		api.get(
			"/stats/orders",
			{
				schema: orderAmountResponseSchema,
			},
			getOrdersAmount
		);
		api.get(
			"/stats/products",
			{
				schema: mostOrderedProductsResponseSchema,
			},
			getMostOrderedProducts
		);

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
