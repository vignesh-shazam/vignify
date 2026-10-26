"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bell,
  Check,
  Layers,
  Menu,
  Moon,
  Search,
  Sun,
  X,
} from "lucide-react";

import MobileBottomNav, {
  type MobileTab,
} from "@/components/mobile/MobileBottomNav";
import MobileHome from "@/components/mobile/MobileHome";
import OnboardingFlow from "@/components/mobile/OnboardingFlow";
import SplashScreen from "@/components/mobile/screens/SplashScreen";
import type { MobileWallpaper } from "@/components/mobile/MobileWallpaperCard";
import VignifyLogo from "@/components/mobile/VignifyLogo";

type MobileTheme = "dark" | "light" | "glass";

const THEME_STORAGE_KEY = "vignify-mobile-theme";
const ONBOARDING_STORAGE_KEY = "vignify-onboarding-complete";
const ONBOARDING_VERSION_STORAGE_KEY = "vignify-onboarding-version";

// Used when the app runs in a regular web browser rather than a native app.
const WEB_ONBOARDING_VERSION = "1.0.0";

const themes: {
  id: MobileTheme;
  label: string;
  Icon: typeof Moon;
}[] = [
    { id: "dark", label: "Dark theme", Icon: Moon },
    { id: "light", label: "Light theme", Icon: Sun },
    { id: "glass", label: "Glass theme", Icon: Layers },
  ];

async function getInstalledAppVersion(): Promise<string> {
  try {
    const { App } = await import("@capacitor/app");
    const info = await App.getInfo();

    // Android app version name + version code.
    return `${info.version}+${info.build}`;
  } catch {
    // Capacitor App information is unavailable in a regular browser.
    return WEB_ONBOARDING_VERSION;
  }
}

export default function MobileApp() {
  const [splashComplete, setSplashComplete] = useState(false);

  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingStatusLoaded, setOnboardingStatusLoaded] =
    useState(false);

  const [activeTab, setActiveTab] = useState<MobileTab>("home");
  const [selectedWallpaper, setSelectedWallpaper] =
    useState<MobileWallpaper | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [theme, setTheme] = useState<MobileTheme>("dark");

  // Load the saved theme.
  useEffect(() => {
    try {
      const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

      if (
        savedTheme === "dark" ||
        savedTheme === "light" ||
        savedTheme === "glass"
      ) {
        setTheme(savedTheme);
      }
    } catch {
      // Use the default dark theme when storage is unavailable.
    }
  }, []);

  // Show onboarding when it has not been completed for this app version.
  useEffect(() => {
    let cancelled = false;

    async function checkOnboardingStatus() {
      try {
        const installedVersion = await getInstalledAppVersion();

        const savedVersion = window.localStorage.getItem(
          ONBOARDING_VERSION_STORAGE_KEY,
        );

        // Support the versioned key as the source of truth.
        // The legacy completion flag alone is not enough after an update.
        const completedForCurrentVersion =
          savedVersion === installedVersion;

        if (!cancelled) {
          setOnboardingComplete(completedForCurrentVersion);
        }
      } catch {
        if (!cancelled) {
          setOnboardingComplete(false);
        }
      } finally {
        if (!cancelled) {
          setOnboardingStatusLoaded(true);
        }
      }
    }

    void checkOnboardingStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  const completeSplash = useCallback(() => {
    setSplashComplete(true);
  }, []);

  // Save completion against the actual installed app version.
  const completeOnboarding = useCallback(async () => {
    try {
      const installedVersion = await getInstalledAppVersion();

      window.localStorage.setItem(
        ONBOARDING_VERSION_STORAGE_KEY,
        installedVersion,
      );

      // Retain the old flag for compatibility with existing app code.
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch {
      // Onboarding can still finish for the current session.
    }

    setOnboardingComplete(true);
  }, []);

  function chooseTheme(nextTheme: MobileTheme) {
    setTheme(nextTheme);
    setThemeMenuOpen(false);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // The selected theme remains active for this session.
    }
  }

  function selectTab(tab: MobileTab) {
    setSelectedWallpaper(null);
    setActiveTab(tab);
    setMenuOpen(false);
    setNotificationOpen(false);
    setThemeMenuOpen(false);
  }

  function handleSelectWallpaper(wallpaper: MobileWallpaper) {
    setSelectedWallpaper(wallpaper);
  }

  const CurrentThemeIcon =
    themes.find((item) => item.id === theme)?.Icon ?? Moon;

  // Stage 1: Splash screen.
  if (!splashComplete) {
    return <SplashScreen onComplete={completeSplash} />;
  }

  // Wait until the saved onboarding status is known.
  if (!onboardingStatusLoaded) {
    return (
      <div
        className="vignify-mobile-root"
        role="status"
        aria-label="Preparing Vignify"
      />
    );
  }

  // Stage 2: Show onboarding for a new installation or app version.
  if (!onboardingComplete) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  // Stage 3: Main application.
  return (
    <main className="mobile-app" data-mobile-theme={theme}>
      <header className="mobile-header">
        <button
          type="button"
          className="mobile-icon-button mobile-menu-button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => {
            setMenuOpen((open) => !open);
            setThemeMenuOpen(false);
            setNotificationOpen(false);
          }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        <a
          className="mobile-brand"
          href="/mobile"
          aria-label="Vignify home"
          onClick={(event) => {
            event.preventDefault();
            selectTab("home");
          }}
        >
          <span className="mobile-brand-mark" aria-hidden="true">
            <VignifyLogo size={30} ariaLabel="Vignify logo" />
          </span>

          <span className="mobile-brand-name">Vignify</span>
        </a>

        <div className="mobile-theme-actions">
          <button
            type="button"
            className="mobile-theme-button"
            aria-label="Choose appearance theme"
            aria-haspopup="menu"
            aria-expanded={themeMenuOpen}
            title="Choose theme"
            onClick={() => {
              setThemeMenuOpen((open) => !open);
              setMenuOpen(false);
              setNotificationOpen(false);
            }}
          >
            <CurrentThemeIcon size={18} />
          </button>

          <button
            type="button"
            className="mobile-icon-button mobile-notification-button"
            aria-label="Notifications"
            aria-expanded={notificationOpen}
            onClick={() => {
              setNotificationOpen((open) => !open);
              setMenuOpen(false);
              setThemeMenuOpen(false);
            }}
          >
            <Bell size={19} />
            <span className="mobile-notification-dot" />
          </button>
        </div>

        {themeMenuOpen && (
          <div
            className="mobile-theme-menu"
            role="menu"
            aria-label="Choose theme"
          >
            {themes.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="menuitemradio"
                aria-checked={theme === id}
                className="mobile-theme-option"
                onClick={() => chooseTheme(id)}
              >
                <Icon size={16} />
                <span>{label}</span>
                {theme === id && <Check size={15} />}
              </button>
            ))}
          </div>
        )}
      </header>

      {menuOpen && (
        <nav className="mobile-quick-menu" aria-label="Quick menu">
          <button type="button" onClick={() => selectTab("home")}>
            Home
          </button>
          <button type="button" onClick={() => selectTab("explore")}>
            Explore
          </button>
          <button type="button" onClick={() => selectTab("saved")}>
            Library
          </button>
          <button type="button" onClick={() => selectTab("profile")}>
            Profile
          </button>
        </nav>
      )}

      {notificationOpen && (
        <section
          className="mobile-notification-panel"
          aria-label="Notifications"
        >
          <strong>Notifications</strong>
          <p>You’re all caught up.</p>
        </section>
      )}

      <form
        className="mobile-search-bar"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          selectTab("search");
        }}
      >
        <Search size={17} aria-hidden="true" />

        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search wallpapers, themes..."
          aria-label="Search wallpapers and themes"
        />
      </form>

      {selectedWallpaper ? (
        <section className="mobile-content mobile-detail-preview">
          <button
            type="button"
            className="mobile-text-link"
            onClick={() => setSelectedWallpaper(null)}
          >
            ← Back to collection
          </button>

          <div
            className="mobile-detail-image"
            style={{
              backgroundImage: `url("${selectedWallpaper.imageUrl}")`,
            }}
            role="img"
            aria-label={selectedWallpaper.title}
          />

          <h1>{selectedWallpaper.title}</h1>
          <p className="mobile-intro">{selectedWallpaper.category}</p>
        </section>
      ) : activeTab === "home" ? (
        <MobileHome
          searchQuery={searchQuery}
          onExplore={() => selectTab("explore")}
          onSelectWallpaper={handleSelectWallpaper}
        />
      ) : (
        <section className="mobile-content" key={activeTab}>
          <h1>
            {activeTab === "explore"
              ? "Explore"
              : activeTab === "search"
                ? "Search"
                : activeTab === "saved"
                  ? "Library"
                  : "Profile"}
          </h1>

          {activeTab === "search" ? (
            <p className="mobile-intro">
              Search for wallpapers, icon packs, and themes.
            </p>
          ) : activeTab === "saved" ? (
            <p className="mobile-intro">
              Your saved wallpapers and customizations will appear here.
            </p>
          ) : activeTab === "profile" ? (
            <p className="mobile-intro">
              Your account and creator tools.
            </p>
          ) : (
            <p className="mobile-intro">
              Discover wallpapers and customization collections.
            </p>
          )}
        </section>
      )}

      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={selectTab}
      />
    </main>
  );
}