import type { VignitiThemeV1 } from "./types";

const CUSTOM_THEME_KEY = "vigniti-custom-theme";
const CUSTOM_THEME_ID_KEY = "vigniti-custom-theme-id";

/**
 * Apply a VignitiThemeV1 to the app by injecting CSS variables onto the
 * <main data-mobile-theme="custom"> element.
 * Also saves it to localStorage so it survives refreshes.
 */
export function applyTheme(
  theme: VignitiThemeV1,
  themeId: string,
  rootEl: HTMLElement,
): void {
  const { colors } = theme;

  // Switch the data-mobile-theme to "custom" so the base CSS variables
  // don't conflict with the injected custom ones.
  rootEl.setAttribute("data-mobile-theme", "custom");

  // Inject every color token as a CSS custom property directly on the element.
  rootEl.style.setProperty("--mobile-bg",            colors.bg);
  rootEl.style.setProperty("--mobile-surface",       colors.surface);
  rootEl.style.setProperty("--mobile-surface-raised", colors.surfaceRaised);
  rootEl.style.setProperty("--mobile-text",          colors.text);
  rootEl.style.setProperty("--mobile-muted",         colors.muted);
  rootEl.style.setProperty("--mobile-border",        colors.border);
  rootEl.style.setProperty("--mobile-accent",        colors.accent);
  rootEl.style.setProperty("--mobile-accent-strong", colors.accentStrong);
  rootEl.style.setProperty("--mobile-cyan",          colors.cyan);
  rootEl.style.setProperty("--mobile-nav-bg",        colors.navBg);
  rootEl.style.setProperty("--mobile-header-bg",     colors.headerBg);
  rootEl.style.setProperty("--mobile-search-bg",     colors.searchBg);

  // Apply background
  if (theme.background) {
    rootEl.style.setProperty("--mobile-custom-bg", theme.background);
    rootEl.style.background = theme.background;
  }

  // Apply hero gradient
  if (theme.heroGradient) {
    const [a, b, c] = theme.heroGradient;
    rootEl.style.setProperty(
      "--mobile-hero-gradient",
      `linear-gradient(112deg, ${a} 0%, ${b} 46%, ${c} 100%)`,
    );
  }

  // Apply backdrop filter to cards/header if specified
  if (theme.backdropFilter) {
    rootEl.style.setProperty("--mobile-backdrop", theme.backdropFilter);
  }

  // Persist for next session
  try {
    window.localStorage.setItem(CUSTOM_THEME_KEY, JSON.stringify(theme));
    window.localStorage.setItem(CUSTOM_THEME_ID_KEY, themeId);
  } catch {
    // Storage unavailable — theme applied for this session only
  }
}

/** Remove a custom theme and restore the given base theme (dark/light/glass) */
export function removeCustomTheme(
  rootEl: HTMLElement,
  fallback: "dark" | "light" | "glass" = "dark",
): void {
  rootEl.removeAttribute("style");
  rootEl.setAttribute("data-mobile-theme", fallback);

  try {
    window.localStorage.removeItem(CUSTOM_THEME_KEY);
    window.localStorage.removeItem(CUSTOM_THEME_ID_KEY);
  } catch {
    // ignore
  }
}

/** Restore a persisted custom theme from localStorage, if any. */
export function restoreCustomTheme(rootEl: HTMLElement): {
  theme: VignitiThemeV1;
  id: string;
} | null {
  try {
    const raw = window.localStorage.getItem(CUSTOM_THEME_KEY);
    const id  = window.localStorage.getItem(CUSTOM_THEME_ID_KEY);
    if (!raw || !id) return null;
    const parsed = JSON.parse(raw) as VignitiThemeV1;
    if (parsed.schema !== "vigniti-theme-v1") return null;
    applyTheme(parsed, id, rootEl);
    return { theme: parsed, id };
  } catch {
    return null;
  }
}

/** Get the saved custom theme id from localStorage (without applying) */
export function getSavedCustomThemeId(): string | null {
  try {
    return window.localStorage.getItem(CUSTOM_THEME_ID_KEY);
  } catch {
    return null;
  }
}
