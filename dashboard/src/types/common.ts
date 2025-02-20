export enum Status {
	PENDING = "pending",
	PREPARING = "in-progress",
	COMPLETED = "completed",
}

export type Order = {
	id: number;
	createdAt: Date;
	price: number;
	status: OrderStatus;
	orderProducts: OrderProduct[];
	pickupNumber: number;
};

export interface OrderItem {
	id: number;
	quantity: number;
	price?: number;
}

export type OrderWithoutStatus = {
	id: number;
	pickupNumber: number;
	createdAt: Date;
	price: number;
	orderProducts: Omit<OrderProduct, "status">[];
};

export type OrderProduct = {
	price: number;
	quantity: number;
	product: {
		id: number;
		name: string;
	};
	status: Status;
};

export interface Product {
	id: number;
	name: string;
	category: {
		id: number;
		name: string;
	};
	image: Image | null;
	description: string | null;
	price: number;
	kcal: number;
}

export interface Category {
	id: number;
	name: string;
	description?: string;
	image: Image | null;
}

export interface Image {
	filename: string;
	description?: string | null;
}

export interface RevenueResponse {
	lastMonth: number;
	thisMonth: number;
}

export enum OrderStatus {
	STARTED = "STARTED",
	PLACED_AND_PAID = "PLACED_AND_PAID",
	PREPARING = "PREPARING",
	READY_FOR_PICKUP = "READY_FOR_PICKUP",
	PICKED_UP = "PICKED_UP",
}
