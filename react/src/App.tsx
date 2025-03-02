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
import { Product, Category, PickupType } from "./lib/types";
import { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";

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

const API_ENDPOINT =
	import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

const App = () => {
	const [currentView, setCurrentView] = useState<View>(View.Idle);
	const [cart, setCart] = useState<CartType[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [orderNumber, setOrderNumber] = useState<number | null>(null);
	const [pickupType, setPickupType] = useState<PickupType | null>(null);

	const language = useTranslation().i18n.language;

	function cancelOrder() {
		setCart([]);
		setCurrentView(View.Idle);
	}

	const fetchData = async () => {
		fetchProducts();
		fetchCategories();
	};

	const fetchProducts = async () => {
		const headers = new Headers();

		headers.append(
			"authorization",
			`Bearer ${import.meta.env.VITE_API_TOKEN ?? "placeholder_value"}`
		);

		const res = await fetch(`${API_ENDPOINT}/api/v1/products?lang=${language}`, {
			headers,
		});

		if (!res.ok) {
			return;
		}

		const data = await res.json();

		setProducts(data);
	};

	const fetchCategories = async () => {
		const headers = new Headers();

		headers.append(
			"authorization",
			`Bearer ${import.meta.env.VITE_API_TOKEN ?? "placeholder_value"}`
		);

		const res = await fetch(
			`${API_ENDPOINT}/api/v1/categories?lang=${language}`,
			{
				headers,
			}
		);

		if (!res.ok) {
			return;
		}

		const data = await res.json();

		setCategories(data);
	};

	useEffect(() => {
		fetchData();
	}, [language]);

	return (
		<CartContext.Provider value={{ cart, setCart }}>
			<Toaster
				position="bottom-center"
				containerStyle={{ bottom: "30px" }}
				toastOptions={{ className: "toast" }}
			/>
			<main className="grid grid-cols-1 grid-rows-[min-content_auto] justify-between text-md items-start w-full h-screen overflow-x-hidden">
				{currentView !== View.Idle && (
					<TopBar key="TopBar" cancelOrder={cancelOrder} currentView={currentView} />
				)}

				{currentView === View.Idle && (
					<IdleScreen
						setCurrentView={setCurrentView}
						setPickupType={setPickupType}
					/>
				)}

				{currentView === View.Menu && (
					<Menu
						setCurrentView={setCurrentView}
						categories={categories}
						products={products}
					/>
				)}

				{currentView === View.Order && (
					<Order
						setCurrentView={setCurrentView}
						products={products}
						setOrderNumber={setOrderNumber}
						pickupType={pickupType}
					/>
				)}

				{currentView === View.Confirmation && (
					<Confirmation setCurrentView={setCurrentView} orderNumber={orderNumber} />
				)}
			</main>
		</CartContext.Provider>
	);
};

export default App;
