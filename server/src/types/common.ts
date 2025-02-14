import Decimal from "decimal.js";

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
	price: Decimal;
	status: Status;
	orderProducts: OrderProduct[];
};

export interface OrderItem {
	id: number;
	quantity: number;
	price?: Decimal;
}

export type OrderWithoutStatus = {
	id: number;
	createdAt: Date;
	price: Decimal;
	orderProducts: Omit<OrderProduct, "status">[];
};

export type OrderProduct = {
	price: Decimal;
	quantity: number;
	product: Product;
	status: Status;
};
