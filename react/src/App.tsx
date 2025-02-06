import { useState } from "react";
import IdleScreen from "./components/views/IdleScreen";
import Menu from "./components/views/Menu";
import Order from "./components/views/Order";
import { AnimatePresence } from "framer-motion";

export enum View {
  Idle,
  Menu,
  Order,
  Payment,
  Confirmation,
}

const App = () => {
  const [currentView, setCurrentView] = useState<View>(View.Idle);

  return (
    <main className="flex flex-col justify-between text-md items-center w-full h-screen overflow-x-hidden">
      <AnimatePresence mode="sync">
        {currentView === View.Idle && (
          <IdleScreen setCurrentView={setCurrentView} key="IdleScreen" />
        )}
        {currentView === View.Menu && (
          <Menu setCurrentView={setCurrentView} key="Menu" />
        )}
        {currentView === View.Order && <Order key="Order" />}
      </AnimatePresence>
    </main>
  );
};

export default App;
