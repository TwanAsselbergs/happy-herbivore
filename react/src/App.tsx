import React, { createContext, SetStateAction, useState } from "react";
import IdleScreen from "./components/views/IdleScreen";
import Menu from "./components/views/Menu";
import Order from "./components/views/Order";
import TopBar from "./components/global/TopBar";
import { products } from "./components/views/Products";

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

	function cancelOrder() {
		setCart([]);
		setCurrentView(View.Idle);
	}

	return (
		<CartContext.Provider value={{ cart, setCart }}>
			<main className="flex flex-col justify-between text-md items-center w-full h-screen overflow-x-hidden">
				{currentView !== View.Idle && (
					<TopBar key="TopBar" cancelOrder={cancelOrder} />
				)}

				{currentView === View.Idle && (
					<IdleScreen setCurrentView={setCurrentView} />
				)}

				{currentView === View.Menu && <Menu setCurrentView={setCurrentView} />}

				{currentView === View.Order && (
					<Order setCurrentView={setCurrentView} products={products} />
				)}
			</main>
		</CartContext.Provider>
	);
};

export default App;
