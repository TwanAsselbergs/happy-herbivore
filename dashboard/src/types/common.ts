export enum Status {
	PENDING = "pending",
	PREPARING = "in-progress",
	COMPLETED = "completed",
}

export type Order = {
	id: number;
	createdAt: Date;
	price: number;
	status: Status;
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
