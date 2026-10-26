import React from "react";
import { createRoot } from "react-dom/client";
import MobileApp from "../src/components/mobile/MobileApp";
import { MobileThemeProvider } from "../src/components/mobile/MobileThemeProvider";
import "../src/app/globals.css";

function StandaloneApp() {
  return (
    <MobileThemeProvider>
      <MobileApp />
    </MobileThemeProvider>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Vignify root element was not found.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <StandaloneApp />
  </React.StrictMode>,
);