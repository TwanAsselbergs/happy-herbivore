export interface Product {
	id: number;
	name: string;
	category: Category;
	image?: Image;
	description?: string;
	price: number;
	kcal: number;
	dietType: "VEGGIE" | "VEGAN";
}

export interface Category {
	id: number;
	name: string;
	description?: string;
	image: Image;
}

export interface Image {
	filename: string;
	description?: string;
}
