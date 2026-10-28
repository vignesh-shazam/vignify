"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Sparkles } from "lucide-react";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<"dark" | "light" | "glassy">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme") as "dark" | "light" | "glassy" | null;
    if (saved && (saved === "dark" || saved === "light" || saved === "glassy")) {
      setTheme(saved);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 p-1 rounded-full bg-[var(--muted)] border border-[var(--border)]">
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-full transition-all duration-300 ${
          theme === "dark"
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        }`}
        aria-label="Dark mode"
      >
        <Moon size={18} />
      </button>
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-full transition-all duration-300 ${
          theme === "light"
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        }`}
        aria-label="Light mode"
      >
        <Sun size={18} />
      </button>
      <button
        onClick={() => setTheme("glassy")}
        className={`p-2 rounded-full transition-all duration-300 ${
          theme === "glassy"
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg"
            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
        }`}
        aria-label="Glassy mode"
      >
        <Sparkles size={18} />
      </button>
    </div>
  );
}
