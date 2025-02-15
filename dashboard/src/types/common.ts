export enum Status {
	PENDING = "pending",
	PREPARING = "in-progress",
	COMPLETED = "completed",
}

export type Product = {
	id: number;
	name: string;
};
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
	product: Product;
	status: Status;
};
