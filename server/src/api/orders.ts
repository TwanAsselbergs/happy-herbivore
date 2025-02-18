import { db } from "@/db/prisma-client";
import { orderSchema } from "@/schema";
import {
	Status,
	type OrderItem,
	type OrderWithoutStatus,
	type Order,
	type OrderProduct,
} from "@/types/common";
import { broadcastMessage } from "@/utils/websocket";
import { OrderStatus } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

// Route (POST): /api/v1/orders
export async function placeOrder(req: FastifyRequest, res: FastifyReply) {
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

		// Get start of the day, to retrieve orders placed today
		const startOfDay = new Date();
		startOfDay.setHours(0, 0, 0, 0);

		const ordersThisDay = await db.order.count({
			where: {
				createdAt: {
					gte: startOfDay,
				},
			},
		});

		const productIds = order.map((item) => item.id);

		// Fetch associated products
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

		// Map product ID's to a price
		const productPriceMap = new Map(
			products.map((product) => [product.id, product.price])
		);

		order.forEach((item) => {
			const price = productPriceMap.get(item.id);

			if (!price) {
				throw new Error("Product does not exist.");
			}

			item.price = productPriceMap.get(item.id);
		});

		const totalPrice = order.reduce(
			(acc, item) => acc + (item.price ? Number(item.price) : 0) * item.quantity,
			0
		);

		const placedOrder = await db.order.create({
			data: {
				pickupNumber: (ordersThisDay % 99) + 1,
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
				pickupNumber: true,
				orderProducts: {
					select: {
						price: true,
						quantity: true,
						product: {
							select: {
								id: true,
								productTranslations: {
									select: {
										name: true,
									},
								},
								image: true,
							},
						},
					},
				},
			},
		});

		// Format the placed order so it matches the TypeScript type
		const placedOrderProducts: OrderProduct[] = [
			...placedOrder.orderProducts.map((orderProduct) => {
				const product: {
					id: number;
					name: string;
					productTranslations?: { name: string }[];
				} = {
					...orderProduct.product,
					name: orderProduct.product.productTranslations[0].name,
				};

				delete product["productTranslations"];

				const res: OrderProduct = {
					...orderProduct,
					status: Status.PENDING,
					product,
				};

				return res;
			}),
		];

		const fullOrder: Order = {
			...placedOrder,
			orderProducts: placedOrderProducts,
			status: Status.PENDING,
		};

		broadcastMessage("order", {
			data: fullOrder,
		});

		return res.status(200).send({
			order: fullOrder,
		});
	} catch (e) {
		return res
			.status(400)
			.send({ error: e instanceof Error ? e.message : "Invalid request." });
	}
}

// Route (GET): /api/v1/orders/today
export async function fetchTodaysOrders() {
	const startOfDay = new Date();
	startOfDay.setHours(0, 0, 0, 0);

	const ordersThisDay = await db.order.findMany({
		where: {
			createdAt: {
				gte: startOfDay,
			},
		},
		select: {
			id: true,
			createdAt: true,
			price: true,
			pickupNumber: true,
			orderProducts: {
				select: {
					price: true,
					quantity: true,
					product: {
						select: {
							id: true,
							productTranslations: {
								select: {
									name: true,
									description: true,
								},
							},
							image: true,
						},
					},
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	const ordersWithStatus: Order[] = ordersThisDay.map((order) => {
		const orderWithStatus = addStatusToOrder({
			...order,
			orderProducts: order.orderProducts.map((orderProduct) => ({
				...orderProduct,
				product: {
					...orderProduct.product,
					name: orderProduct.product.productTranslations[0].name,
				},
			})),
		});
		return orderWithStatus;
	});

	return {
		orders: ordersWithStatus,
	};
}

function addStatusToOrder(order: OrderWithoutStatus): Order {
	return {
		...order,
		status: Status.PENDING,
		orderProducts: order.orderProducts.map((orderProduct) => ({
			...orderProduct,
			status: Status.PENDING,
		})),
	};
}
