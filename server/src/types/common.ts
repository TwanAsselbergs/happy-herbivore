import { Decimal } from "@prisma/client/runtime/library";

export enum Status {
	PENDING = "pending",
	PREPARING = "in-progress",
	COMPLETED = "completed",
}

export type Order = {
	id: number;
	createdAt: Date;
	price: Decimal;
	status: Status;
	orderProducts: OrderProduct[];
	pickupNumber: number;
};

export interface OrderItem {
	id: number;
	quantity: number;
	price?: Decimal;
}

export type OrderWithoutStatus = {
	id: number;
	pickupNumber: number;
	createdAt: Date;
	price: Decimal;
	orderProducts: Omit<OrderProduct, "status">[];
};

export type OrderProduct = {
	price: Decimal;
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
	price: Decimal;
	kcal: number;
	dietType: "VEGGIE" | "VEGAN";
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

export interface ProductTranslation {
	name: string;
	description: string | null;
}
