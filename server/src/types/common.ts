import type { OrderStatus, PickupType } from "@prisma/client";
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
	status: OrderStatus;
	orderProducts: OrderProduct[];
	pickupNumber: number;
	pickupType: PickupType;
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
	pickupType: PickupType;
	orderStatus: OrderStatus;
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
	description: string | null;
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

export interface CategoryTranslation {
	name: string;
	description?: string | null;
}

export interface RevenueResponse {
	lastMonth: number;
	thisMonth: number;
}

export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export interface MostOrderedProductType {
	name: string;
	quantity: number;
	id: number;
	description: string | null;
}
