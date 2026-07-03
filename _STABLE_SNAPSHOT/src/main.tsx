
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";

import { engine, EngineProvider } from './engine';

// SAFE ENGINE BOOT (non-crashing)
try {
  engine?.initialize?.();
} catch (e) {
  console.warn("Engine init failed:", e);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EngineProvider>
      <App />
    </EngineProvider>
  </StrictMode>
);

