import React, {
	createContext,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import IdleScreen from "./components/views/IdleScreen";
import Menu from "./components/views/Menu";
import Order from "./components/views/Order";
import Confirmation from "./components/views/Confirmation";
import TopBar from "./components/global/TopBar";
import { Product, Category } from "./lib/types";

export enum View {
	Idle,
	Menu,
	Order,
	Payment,
	Confirmation,
}

interface CartType {
	id: number;
	quantity: number;
}

type CartContextType = {
	cart: CartType[];
	setCart: React.Dispatch<SetStateAction<CartType[]>>;
};

export const CartContext = createContext<CartContextType>({
	cart: [],
	setCart: () => {},
});

const App = () => {
	const [currentView, setCurrentView] = useState<View>(View.Idle);
	const [cart, setCart] = useState<CartType[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);

	function cancelOrder() {
		setCart([]);
		setCurrentView(View.Idle);
	}

	const fetchData = async () => {
		fetchProducts();
		fetchCategories();
	};

	const fetchProducts = async () => {
		const res = await fetch("http://localhost:3000/api/v1/products");

		if (!res.ok) {
			return;
		}

		const data = await res.json();
		setProducts(data);
	};

	const fetchCategories = async () => {
		const res = await fetch("http://localhost:3000/api/v1/categories");

		if (!res.ok) {
			return;
		}

		const data = await res.json();

		setCategories(data);
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<CartContext.Provider value={{ cart, setCart }}>
			<main className="grid grid-cols-[min-content_auto] grid-rows-[min-content_auto] justify-between text-md items-start w-full h-screen overflow-x-hidden">
				{currentView !== View.Idle && (
					<TopBar key="TopBar" cancelOrder={cancelOrder} currentView={currentView} />
				)}

				{currentView === View.Idle && (
					<IdleScreen setCurrentView={setCurrentView} />
				)}

				{currentView === View.Menu && (
					<Menu
						setCurrentView={setCurrentView}
						categories={categories}
						products={products}
					/>
				)}

				{currentView === View.Order && (
					<Order setCurrentView={setCurrentView} products={products} />
				)}

				{currentView === View.Confirmation && (
					<Confirmation setCurrentView={setCurrentView} />
				)}
			</main>
		</CartContext.Provider>
	);
};

export default App;
