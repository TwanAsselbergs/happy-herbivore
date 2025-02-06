import { useState } from "react";
import IdleScreen from "./components/views/IdleScreen";

enum View {
  Idle,
  Menu,
  Order,
  Payment,
  Confirmation,
}

const App = () => {
  const [currentView, _] = useState<View>(View.Idle);

  return (
    <main className="flex flex-col justify-between text-3xl items-center w-full h-screen overflow-x-hidden">
      {currentView === View.Idle && <IdleScreen />}
    </main>
  );
};

export default App;
