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
};

export type OrderProduct = {
	price: number;
	quantity: number;
	product: Product;
	status: Status;
};
