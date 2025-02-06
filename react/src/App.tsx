import { useState } from "react";
import IdleScreen from "./components/views/IdleScreen";
import Menu from "./components/views/Menu";
import Order from "./components/views/Order";

enum View {
  Idle,
  Menu,
  Order,
  Payment,
  Confirmation,
}

const App = () => {
  const [currentView, _] = useState<View>(View.Menu);

  return (
    <main className="flex flex-col justify-between text-md items-center w-full h-screen overflow-x-hidden">
      {currentView === View.Idle && <IdleScreen />}
      {currentView === View.Menu && <Menu />}
      {currentView === View.Order && <Order />}
    </main>
  );
};

export default App;
