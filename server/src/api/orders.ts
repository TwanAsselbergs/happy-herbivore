import { db } from "@/db/prisma-client";
import { orderSchema } from "@/schema";
import {
	Status,
	type OrderItem,
	type OrderWithoutStatus,
} from "@/types/common";
import { type Order, type OrderProduct } from "@/types/common";
import { broadcastMessage } from "@/utils/websocket";
import { OrderStatus } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";

// POST request for placing an order
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

		try {
			order.forEach((item) => {
				const price = productPriceMap.get(item.id);

				if (!price) {
					throw new Error("Product does not exist.");
				}

				item.price = productPriceMap.get(item.id);
			});
		} catch (e) {
			res.status(400).send({
				error:
					e instanceof Error ? e.message : "Something went wrong, please try again.",
			});
		}

		const totalPrice = order.reduce(
			(acc, item) => acc + (item.price ? Number(item.price) : 0) * item.quantity,
			0
		);

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

		const placedOrderProducts: OrderProduct[] = [
			...placedOrder.orderProducts.map((orderProduct) => ({
				...orderProduct,
				status: Status.PENDING,
			})),
		];

		const fullOrder: Order = {
			...placedOrder,
			orderProducts: placedOrderProducts,
			status: Status.PENDING,
		};
		broadcastMessage("order", {
			data: fullOrder,
		});

		res.status(200).send({
			order: placedOrder,
		});
	} catch (e) {
		res
			.status(400)
			.send({ error: e instanceof Error ? e.message : "Invalid request." });
	}
}

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
		orderBy: {
			createdAt: "desc",
		},
	});

	const ordersWithStatus: Order[] = ordersThisDay.map((order) =>
		addStatusToOrder(order)
	);

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
