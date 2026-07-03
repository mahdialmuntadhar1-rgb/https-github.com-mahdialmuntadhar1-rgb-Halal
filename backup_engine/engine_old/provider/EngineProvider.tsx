import React, { createContext, useContext } from "react";
import { engine } from '../core/Engine';

const EngineContext = createContext(engine);

export function EngineProvider({ children }: { children: React.ReactNode }) {
    return (
        <EngineContext.Provider value={engine}>
            {children}
        </EngineContext.Provider>
    );
}

export function useEngine() {
    return useContext(EngineContext);
}














