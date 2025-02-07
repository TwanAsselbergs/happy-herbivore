import { useState } from "react";
import IdleScreen from "./components/views/IdleScreen";
import Menu from "./components/views/Menu";
import TopBar from "./components/global/TopBar";

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
            {currentView !== View.Idle && <TopBar key="TopBar" />}

            {currentView === View.Idle && (
                <IdleScreen setCurrentView={setCurrentView} />
            )}

            {currentView === View.Menu && (
                <Menu setCurrentView={setCurrentView} />
            )}
        </main>
    );
};

export default App;
