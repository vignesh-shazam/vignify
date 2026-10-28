"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bell,
  Check,
  CheckCircle2,
  Layers,
  LogOut,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
  X,
} from "lucide-react";

import UploadContentFlow, {
  type UploadedContent,
} from "@/features/mobile/components/UploadContentFlow";
import MobileBottomNav, {
  type MobileTab,
} from "@/features/mobile/components/MobileBottomNav";
import MobileHome from "@/features/mobile/components/MobileHome";
import OnboardingFlow from "@/features/mobile/components/OnboardingFlow";
import SplashScreen from "@/features/mobile/components/screens/SplashScreen";
import type { MobileWallpaper } from "@/features/mobile/components/MobileWallpaperCard";
import VignifyLogo from "@/features/mobile/components/VignifyLogo";
import MobileAuth, {
  type MobileAuthScreen,
} from "@/features/mobile/components/auth/MobileAuth";
import MobilePasswordRecovery, {
  type RecoveryScreen,
} from "@/features/mobile/components/auth/MobilePasswordRecovery";
import { GlassyThemeDemo } from "@/features/mobile/screens/GlassyThemeDemo";
import { createMobileSupabaseClient } from "@/lib/supabase";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import { parseTheme, type VignitiThemeV1 } from "@/features/mobile/themes/types";
import { applyTheme, removeCustomTheme, restoreCustomTheme, getSavedCustomThemeId } from "@/features/mobile/themes/engine";
import ThemeCard from "@/features/mobile/themes/ThemeCard";
import "@/features/mobile/themes/ThemeCard.css";

type MobileTheme = "dark" | "light" | "glass";
type AuthScreen = MobileAuthScreen | RecoveryScreen;

const THEME_STORAGE_KEY = "vignify-mobile-theme";
const ONBOARDING_STORAGE_KEY = "vignify-onboarding-complete";
const ONBOARDING_VERSION_STORAGE_KEY = "vignify-onboarding-version";
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
    // Use "version+build" so both a version bump AND a build number bump trigger onboarding.
    return `${info.version}+${info.build}`;
  } catch {
    // Running in a web browser — Capacitor native plugin unavailable.
    // Return a stable token so normal web reloads never re-trigger onboarding.
    // Change this string intentionally when you want to force onboarding on web too.
    return WEB_ONBOARDING_VERSION;
  }
}

export default function MobileApp() {
  const [splashComplete, setSplashComplete] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingStatusLoaded, setOnboardingStatusLoaded] = useState(false);

  const mainRef = useRef<HTMLElement>(null);

  const [uploadFlowOpen, setUploadFlowOpen] = useState(false);
  const [lastUploadedContent, setLastUploadedContent] =
    useState<UploadedContent | null>(null);
  const [library, setLibrary] = useState<UploadedContent[]>(() => {
    // Restore library from localStorage on mount
    try {
      const saved = window.localStorage.getItem("vigniti-library");
      return saved ? (JSON.parse(saved) as UploadedContent[]) : [];
    } catch {
      return [];
    }
  });

  // Parsed theme objects keyed by upload id
  const [parsedThemes, setParsedThemes] = useState<Record<string, VignitiThemeV1 | null>>({});
  const [activeCustomThemeId, setActiveCustomThemeId] = useState<string | null>(
    () => getSavedCustomThemeId()
  );

  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");
  const [session, setSession] = useState<Session | null>(null);
  const [authStatusLoaded, setAuthStatusLoaded] = useState(false);
  const [authConfigurationError, setAuthConfigurationError] = useState("");

  const [activeTab, setActiveTab] = useState<MobileTab>("home");
  const [selectedWallpaper, setSelectedWallpaper] =
    useState<MobileWallpaper | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [theme, setTheme] = useState<MobileTheme>("dark");

  // Restore the saved appearance.
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
      // Keep the default theme if storage is unavailable.
    }
  }, []);

  // Restore a custom theme from localStorage on mount, and parse any
  // theme JSON files already in the library.
  useEffect(() => {
    // Parse themes already in library (restored from localStorage)
    if (library.length > 0) {
      const initial: Record<string, VignitiThemeV1 | null> = {};
      library.forEach((item) => {
        if (item.category === "Theme") {
          try {
            // fileType will be application/json for .json files
            // We stored the fileName — if it ends .json we can try
            // But previewUrl was blanked on save. For now mark as needing parse.
            initial[item.id] = null; // will be populated when user views library
          } catch {
            initial[item.id] = null;
          }
        }
      });
      if (Object.keys(initial).length > 0) {
        setParsedThemes((prev) => ({ ...initial, ...prev }));
      }
    }

    // Restore custom theme if one was applied last session
    if (mainRef.current) {
      const restored = restoreCustomTheme(mainRef.current);
      if (restored) {
        setActiveCustomThemeId(restored.id);
        setParsedThemes((prev) => ({ ...prev, [restored.id]: restored.theme }));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Determine whether onboarding should be shown.
  //
  // Rules:
  //   • Fresh install  → no saved version at all         → SHOW onboarding
  //   • App update     → saved version ≠ installed       → SHOW onboarding
  //   • Normal open    → saved version === installed     → SKIP onboarding
  useEffect(() => {
    let cancelled = false;

    async function checkOnboardingStatus() {
      try {
        const installedVersion = await getInstalledAppVersion();
        const savedVersion = window.localStorage.getItem(
          ONBOARDING_VERSION_STORAGE_KEY,
        );

        // Show onboarding on fresh install (null) or after an update (mismatch).
        const shouldSkip = savedVersion !== null && savedVersion === installedVersion;

        if (!cancelled) {
          setOnboardingComplete(shouldSkip);
        }
      } catch {
        // Cannot determine version — show onboarding to be safe.
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

  // Restore the Supabase session and listen for login, logout, and recovery.
  useEffect(() => {
    let cancelled = false;
    let supabase: SupabaseClient | null = null;
    let authSubscription:
      | ReturnType<
          SupabaseClient["auth"]["onAuthStateChange"]
        >["data"]["subscription"]
      | null = null;
    let appUrlListener: { remove: () => Promise<void> } | null = null;

    async function initializeAuthentication() {
      try {
        supabase = createMobileSupabaseClient();

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!cancelled) {
          setSession(data.session);
          setAuthStatusLoaded(true);
        }

        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, nextSession) => {
            if (cancelled) return;

            setSession(nextSession);

            if (event === "PASSWORD_RECOVERY") {
              setAuthScreen("reset");
            }
          },
        );

        authSubscription = authListener.subscription;

        // Handle recovery links opened by the native Android app.
        try {
          const { App } = await import("@capacitor/app");

          appUrlListener = await App.addListener(
            "appUrlOpen",
            async ({ url }) => {
              try {
                const parsedUrl = new URL(url);
                const hashParams = new URLSearchParams(
                  parsedUrl.hash.replace(/^#/, ""),
                );
                const queryParams = parsedUrl.searchParams;

                const accessToken =
                  hashParams.get("access_token") ??
                  queryParams.get("access_token");
                const refreshToken =
                  hashParams.get("refresh_token") ??
                  queryParams.get("refresh_token");
                const recoveryType =
                  hashParams.get("type") ?? queryParams.get("type");

                if (
                  accessToken &&
                  refreshToken &&
                  recoveryType === "recovery" &&
                  supabase
                ) {
                  const { error: sessionError } =
                    await supabase.auth.setSession({
                      access_token: accessToken,
                      refresh_token: refreshToken,
                    });

                  if (sessionError) {
                    throw sessionError;
                  }

                  setAuthScreen("reset");
                }
              } catch (error) {
                console.error(
                  "Unable to process the authentication link:",
                  error,
                );
              }
            },
          );
        } catch {
          // The native app plugin is unavailable in a regular browser.
        }
      } catch (error) {
        console.error("Unable to initialize Supabase authentication:", error);

        if (!cancelled) {
          setSession(null);
          setAuthConfigurationError(
            error instanceof Error
              ? error.message
              : "Authentication could not be initialized. Check your mobile Supabase configuration.",
          );
          setAuthStatusLoaded(true);
        }
      }
    }

    void initializeAuthentication();

    return () => {
      cancelled = true;
      authSubscription?.unsubscribe();

      if (appUrlListener) {
        void appUrlListener.remove();
      }
    };
  }, []);

  const completeSplash = useCallback(() => {
    setSplashComplete(true);
  }, []);

  const completeOnboarding = useCallback(async () => {
    try {
      const installedVersion = await getInstalledAppVersion();
      // Save the version the user just saw onboarding for.
      // Next open: same version → skip. New version → show again.
      window.localStorage.setItem(
        ONBOARDING_VERSION_STORAGE_KEY,
        installedVersion,
      );
      window.localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch {
      // Onboarding can still finish in this session even if storage fails.
    }

    setOnboardingComplete(true);
  }, []);

  function chooseTheme(nextTheme: MobileTheme) {
    setTheme(nextTheme);
    setThemeMenuOpen(false);

    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {
      // Keep the selected theme for the current session.
    }
  }

  function selectTab(tab: MobileTab) {
    setSelectedWallpaper(null);
    setUploadFlowOpen(false);
    setLastUploadedContent(null); // always clear success screen when changing tab
    setActiveTab(tab);
    setMenuOpen(false);
    setNotificationOpen(false);
    setThemeMenuOpen(false);
  }

  function handleSelectWallpaper(wallpaper: MobileWallpaper) {
    setSelectedWallpaper(wallpaper);
    setUploadFlowOpen(false);
    setLastUploadedContent(null);
  }

  function handleOpenUpload() {
    setSelectedWallpaper(null);
    setLastUploadedContent(null);
    setUploadFlowOpen(true);
    setMenuOpen(false);
    setNotificationOpen(false);
    setThemeMenuOpen(false);
  }

  function handleUploadBack() {
    setUploadFlowOpen(false);
  }

  function handleUploadSubmitted(content: UploadedContent) {
    setLastUploadedContent(content);
    setLibrary((prev) => {
      const updated = [content, ...prev];
      // Persist to localStorage — strip blob URLs (they die on refresh)
      try {
        const toSave = updated.map((item) => ({
          ...item,
          // blob: URLs are session-only — clear them before saving
          previewUrl: item.previewUrl.startsWith("blob:") ? "" : item.previewUrl,
        }));
        window.localStorage.setItem("vigniti-library", JSON.stringify(toSave));
      } catch {
        // Storage full or unavailable — keep in-memory only
      }
      return updated;
    });

    // If a Theme JSON was uploaded, try to parse it immediately
    if (content.category === "Theme" && content.fileName.endsWith(".json")) {
      // The file content isn't available post-submit — we mark for parse attempt
      // when the user views the library. Mark as null for now.
      setParsedThemes((prev) => ({ ...prev, [content.id]: null }));
    }

    setUploadFlowOpen(false);
  }

  function handleApplyTheme(
    item: UploadedContent,
    parsedTheme: VignitiThemeV1,
  ) {
    if (!mainRef.current) return;
    applyTheme(parsedTheme, item.id, mainRef.current);
    setActiveCustomThemeId(item.id);
    setParsedThemes((prev) => ({ ...prev, [item.id]: parsedTheme }));
  }

  function handleRemoveTheme() {
    if (!mainRef.current) return;
    removeCustomTheme(mainRef.current, theme);
    setActiveCustomThemeId(null);
  }

  async function handleSignOut() {
    try {
      const supabase = createMobileSupabaseClient();
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setSession(null);
      setAuthScreen("login");
      setSelectedWallpaper(null);
      setUploadFlowOpen(false);
      setLastUploadedContent(null);
      setLibrary([]);
      try { window.localStorage.removeItem("vigniti-library"); } catch { /* ignore */ }
      setActiveTab("home");
    } catch (error) {
      console.error("Unable to sign out:", error);
    }
  }

  const CurrentThemeIcon =
    themes.find((item) => item.id === theme)?.Icon ?? Moon;

  // Stage 1: Splash.
  if (!splashComplete) {
    return <SplashScreen onComplete={completeSplash} />;
  }

  if (!onboardingStatusLoaded) {
    return (
      <div
        className="vignify-mobile-root"
        role="status"
        aria-label="Preparing Vigniti"
      />
    );
  }

  // Stage 2: Onboarding.
  if (!onboardingComplete) {
    return <OnboardingFlow onComplete={completeOnboarding} />;
  }

  // Stage 3: Wait for Supabase to restore the saved session.
  if (!authStatusLoaded) {
    return (
      <div
        className="vignify-mobile-root"
        role="status"
        aria-label="Checking your account"
      />
    );
  }

  // Stage 4: Authentication and recovery screens.
  if (!session || authScreen === "forgot" || authScreen === "reset") {
    if (authScreen === "forgot" || authScreen === "reset") {
      return (
        <MobilePasswordRecovery
          screen={authScreen as RecoveryScreen}
          onBackToLogin={() => setAuthScreen("login")}
          onResetComplete={() => setAuthScreen("login")}
        />
      );
    }

    return (
      <>
        {authConfigurationError && (
          <div role="alert" className="vignify-auth-config-error">
            Authentication setup issue: {authConfigurationError}
          </div>
        )}

        <MobileAuth
          onAuthenticated={() => {
            setAuthConfigurationError("");
            setAuthScreen("login");
          }}
          onForgotPassword={() => setAuthScreen("forgot")}
          onScreenChange={(screen) => setAuthScreen(screen)}
        />
      </>
    );
  }

  // Stage 5: Main application.
  return (
    <main className="mobile-app" data-mobile-theme={theme} ref={mainRef}>
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
          aria-label="Vigniti home"
          onClick={(event) => {
            event.preventDefault();
            selectTab("home");
          }}
        >
          <span className="mobile-brand-mark" aria-hidden="true">
            <VignifyLogo size={30} ariaLabel="Vigniti logo" />
          </span>
          <span className="mobile-brand-name">Vigniti</span>
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
          <button type="button" onClick={handleOpenUpload}>
            Upload content
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

      {!uploadFlowOpen && !lastUploadedContent && !selectedWallpaper && (
        <button
          type="button"
          className="mobile-upload-content-cta"
          onClick={handleOpenUpload}
          aria-label="Upload content"
        >
          <Plus size={20} strokeWidth={2.5} aria-hidden="true" />
          <span>Upload content</span>
        </button>
      )}
      {uploadFlowOpen ? (
        <UploadContentFlow
          onBack={handleUploadBack}
          onSubmitted={handleUploadSubmitted}
        />
      ) : lastUploadedContent ? (
        <section className="mobile-content mobile-upload-success">
          <div className="uc-success-icon" aria-hidden="true">
            <CheckCircle2 size={52} />
          </div>
          <h1 className="uc-success-title">Upload Successful!</h1>
          <p className="uc-success-body">
            <strong>{lastUploadedContent.title}</strong> has been uploaded and added to your library.
          </p>
          <button
            type="button"
            className="uc-success-primary"
            onClick={() => {
              setLastUploadedContent(null);
              setActiveTab("saved");
            }}
          >
            View in Library
          </button>
          <button
            type="button"
            className="uc-success-secondary"
            onClick={() => {
              setLastUploadedContent(null);
              handleOpenUpload();
            }}
          >
            Upload Another
          </button>
        </section>
      ) : selectedWallpaper ? (
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
          onUploadContent={handleOpenUpload}
          uploadedItems={library}
        />
      ) : activeTab === "demo" ? (
        <GlassyThemeDemo />
      ) : activeTab === "saved" ? (
        <section className="mobile-content mobile-library" key="saved">
          <div className="mobile-library-header">
            <h1>Library</h1>
            <div className="mobile-library-tabs">
              {["Wallpapers","Themes","Icons","Ringtones"].map((cat) => (
                <button key={cat} type="button" className={`mobile-library-tab${cat === "Wallpapers" ? " active" : ""}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {library.length === 0 ? (
            <div className="mobile-library-empty">
              <p>No uploads yet.</p>
              <button type="button" className="mobile-library-upload-btn" onClick={handleOpenUpload}>
                + Upload content
              </button>
            </div>
          ) : (
            <>
              {/* Theme items */}
              {library.filter((i) => i.category === "Theme").length > 0 && (
                <div className="mobile-library-section">
                  <p className="mobile-library-section-title">Themes</p>
                  <div className="mobile-library-themes-grid">
                    {library.filter((i) => i.category === "Theme").map((item) => (
                      <div key={item.id}>
                        {/* JSON file loader input — hidden, triggered by ThemeCard */}
                        <label className="vt-theme-json-loader" aria-label={`Load theme file for ${item.title}`}>
                          <input
                            type="file"
                            accept=".json,application/json"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                try {
                                  const parsed = parseTheme(JSON.parse(ev.target?.result as string));
                                  setParsedThemes((prev) => ({ ...prev, [item.id]: parsed }));
                                } catch {
                                  setParsedThemes((prev) => ({ ...prev, [item.id]: null }));
                                }
                              };
                              reader.readAsText(f);
                              e.currentTarget.value = "";
                            }}
                          />
                          {parsedThemes[item.id] === undefined && (
                            <span className="vt-theme-load-btn">📂 Load theme JSON</span>
                          )}
                        </label>
                        <ThemeCard
                          item={item}
                          theme={parsedThemes[item.id] ?? null}
                          isActive={activeCustomThemeId === item.id}
                          onApply={handleApplyTheme}
                          onRemove={handleRemoveTheme}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Non-theme items — wallpapers, icons, ringtones */}
              {library.filter((i) => i.category !== "Theme").length > 0 && (
                <div className="mobile-library-section">
                  <p className="mobile-library-section-title">Uploads</p>
                  <div className="mobile-library-grid">
                    {library.filter((i) => i.category !== "Theme").map((item) => (
                      <div key={item.id} className="mobile-library-card">
                        {item.previewUrl ? (
                          <img src={item.previewUrl} alt={item.title} className="mobile-library-card-img" />
                        ) : (
                          <div className="mobile-library-card-placeholder">
                            <span>{item.category[0]}</span>
                          </div>
                        )}
                        <div className="mobile-library-card-info">
                          <p className="mobile-library-card-title">{item.title}</p>
                          <p className="mobile-library-card-cat">{item.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      ) : (
        <section className="mobile-content" key={activeTab}>
          <h1>
            {activeTab === "explore"
              ? "Explore"
              : activeTab === "search"
                ? "Search"
                : "Profile"}
          </h1>

          {activeTab === "search" ? (
            <p className="mobile-intro">
              Search for wallpapers, icon packs, and themes.
            </p>
          ) : activeTab === "profile" ? (
            <>
              <p className="mobile-intro">
                Your account and creator tools.
              </p>
              <button
                type="button"
                className="mobile-text-link"
                onClick={() => void handleSignOut()}
              >
                <LogOut size={16} />
                Sign out
              </button>
            </>
          ) : (
            <p className="mobile-intro">
              Discover wallpapers and customization collections.
            </p>
          )}
        </section>
      )}

      {!uploadFlowOpen && !lastUploadedContent && (
        <MobileBottomNav activeTab={activeTab} onTabChange={selectTab} />
      )}
    </main>
  );
}