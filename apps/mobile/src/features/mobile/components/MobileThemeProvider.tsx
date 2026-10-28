"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type MobileTheme = "dark" | "light";

type MobileThemeContextValue = {
  theme: MobileTheme;
  toggleTheme: () => void;
};

const MobileThemeContext = createContext<MobileThemeContextValue | null>(null);

export function MobileThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<MobileTheme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem("vignify-mobile-theme");

      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
      }
    } catch {
      // Continue with the default dark theme if storage is unavailable.
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    document.documentElement.dataset.mobileTheme = theme;

    try {
      window.localStorage.setItem("vignify-mobile-theme", theme);
    } catch {
      // Theme still works for the current session if storage is unavailable.
    }
  }, [theme, ready]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return (
    <MobileThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="vignify-mobile-root" data-theme={theme}>
        {children}
      </div>
    </MobileThemeContext.Provider>
  );
}

export function useMobileTheme() {
  const context = useContext(MobileThemeContext);

  if (!context) {
    throw new Error(
      "useMobileTheme must be used inside MobileThemeProvider.",
    );
  }

  return context;
}