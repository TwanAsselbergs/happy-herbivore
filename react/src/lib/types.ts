export interface Product {
    id: number;
    title: string;
    category: Category
    image: Image;
    description: string;
    price: number;
    kcal: number;
    available: boolean;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    image: Image;
}

export interface Image {
    id: number;
    filename: string;
    description?: string;
}