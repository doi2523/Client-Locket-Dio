import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import ErrorBoundary from "./components/pages/ErrorBoundary";
import { initChunkRecovery, initPWA, initReloadState } from "./utils";

// init PWA
initPWA();

// init chunk recovery
initReloadState();

// initChunkRecovery();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
