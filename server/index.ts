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
	langQuery,
	productsSchema,
} from "@/utils/response-schemas";

const keys = (process.env.BEARER_TOKENS ?? "placeholder_value").split(", ");

const app = fastify({ logger: true });

await app.register(fastifySwagger, {
	swagger: {
		info: {
			title: "Happy Herbivore API",
			description:
				"API documentation for the Node.js back-end of the server. Make sure to provide your bearer token in the Authorization headers when making a request.",
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

		api.get(
			"/products",
			{
				schema: {
					description:
						"Get all products. Add a 'lang' value to the query params to retrieve the products in a certain language (default is English).",
					tags: ["Products"],
					response: {
						200: productsSchema,
					},
					...langQuery,
				},
			},
			productsIndex
		);
		api.get(
			"/products/:id",
			{
				schema: {
					description:
						"Get info about a specific product. Add a 'lang' value to the query params to retrieve the product in a certain language (default is English).",
					tags: ["Products"],
					response: {
						200: productSchema,
					},
					...langQuery,
				},
			},
			fetchSingleProduct
		);

		api.get(
			"/categories",
			{
				schema: {
					description:
						"Get all categories. Add a 'lang' value to the query params to retrieve the categories in a certain language (default is English).",
					tags: ["Categories"],
					...langQuery,
					response: {
						200: categoriesResponseSchema,
					},
				},
			},
			categoriesIndex
		);

		api.post(
			"/orders",
			{
				schema: {
					description: "Place a new order",
					tags: ["Orders"],
					body: {
						type: "object",
						properties: {
							order: {
								type: "array",
								items: {
									type: "object",
									properties: {
										id: { type: "number" },
										quantity: { type: "number" },
									},
									required: ["id", "quantity"],
								},
							},
						},
						required: ["order"],
					},
					response: {
						200: {
							description: "Order placed successfully",
							type: "object",
							properties: {
								order: {
									type: "object",
									properties: {
										id: { type: "number" },
										price: { type: "number" },
										pickupNumber: { type: "number" },
									},
								},
							},
						},
					},
				},
			},
			placeOrder
		);

		api.get(
			"/orders/today",
			{
				schema: {
					description: "Get today's orders",
					tags: ["Orders"],
					response: {
						200: {
							description: "Successful response",
							...ordersResponseSchema,
						},
					},
				},
			},
			fetchTodaysOrders
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
