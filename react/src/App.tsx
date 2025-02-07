import { useState } from "react";
import IdleScreen from "./components/views/IdleScreen";
import Menu from "./components/views/Menu";
import Order from "./components/views/Order";
import { AnimatePresence, motion } from "framer-motion";
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
            <AnimatePresence mode="sync">
                {currentView !== View.Idle && <TopBar key="TopBar" />}

                {currentView === View.Idle && (
                    <motion.div
                        key="IdleScreen"
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                            duration: 0.5,
                            ease: [0.56, 0.03, 0.12, 1.04],
                        }}
                        className="w-full"
                    >
                        <IdleScreen setCurrentView={setCurrentView} />
                    </motion.div>
                )}

                {currentView === View.Menu && (
                    <motion.div
                        key="Menu"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{
                            duration: 0.5,
                            ease: [0.56, 0.03, 0.12, 1.04],
                        }}
                        className="bg-white-primary w-full absolute h-full flex flex-col"
                    >
                        <Menu setCurrentView={setCurrentView} />
                    </motion.div>
                )}

                {currentView === View.Order && (
                    <motion.div
                        key="Order"
                        initial={{ opacity: 1, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 1, x: "-100%" }}
                        transition={{
                            duration: 0.5,
                            ease: [0.56, 0.03, 0.12, 1.04],
                        }}
                        className="bg-white-primary w-full absolute h-full flex flex-col"
                    >
                        <Order />
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
};

export default App;
