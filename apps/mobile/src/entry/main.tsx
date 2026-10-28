import React from "react";
import { createRoot } from "react-dom/client";
import MobileApp from "@/features/mobile/components/MobileApp";
import { MobileThemeProvider } from "@/features/mobile/components/MobileThemeProvider";
import "@/features/mobile/styles/mobile.css";

function StandaloneApp() {
  return (
    <MobileThemeProvider>
      <MobileApp />
    </MobileThemeProvider>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Vigniti root element was not found.");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <StandaloneApp />
  </React.StrictMode>,
);
