/**
 * Vigniti Custom Theme — JSON format v1
 *
 * Upload as a .json file via Upload Content → Theme.
 * The app reads this and applies CSS variables + background to the shell.
 */
export type VignitiThemeV1 = {
  /** Must be "vigniti-theme-v1" */
  schema: "vigniti-theme-v1";

  /** Display name shown in Library */
  name: string;

  /** Short description */
  description: string;

  /** Author name */
  author: string;

  /** Optional preview image URL (shown as card thumbnail) */
  previewUrl?: string;

  /** Tag list for discovery */
  tags?: string[];

  colors: {
    /** App background */
    bg: string;
    /** Card / surface background */
    surface: string;
    /** Raised surface (menus, modals) */
    surfaceRaised: string;
    /** Primary text */
    text: string;
    /** Muted / secondary text */
    muted: string;
    /** Border color */
    border: string;
    /** Accent color (buttons, highlights) */
    accent: string;
    /** Strong accent */
    accentStrong: string;
    /** Cyan highlight */
    cyan: string;
    /** Bottom nav background */
    navBg: string;
    /** Header background */
    headerBg: string;
    /** Search bar background */
    searchBg: string;
  };

  /**
   * Optional full-screen background.
   * Accepts any valid CSS background value:
   *   - solid color: "#0a1a0a"
   *   - linear-gradient: "linear-gradient(135deg, #0a1a0a, #1a2a1a)"
   *   - radial-gradient: "radial-gradient(ellipse at top, ...)"
   *   - url: "url('/images/your-bg.jpg') center/cover no-repeat"
   */
  background?: string;

  /**
   * Optional backdrop-filter (e.g. "blur(20px) saturate(150%)")
   * Applied to cards and header.
   */
  backdropFilter?: string;

  /**
   * Optional hero gradient override
   * Format: [startColor, midColor, endColor]
   */
  heroGradient?: [string, string, string];
};

/** Parse and validate a JSON object as a VignitiThemeV1 */
export function parseTheme(json: unknown): VignitiThemeV1 | null {
  if (!json || typeof json !== "object") return null;
  const t = json as Record<string, unknown>;
  if (t["schema"] !== "vigniti-theme-v1") return null;
  if (typeof t["name"] !== "string") return null;
  if (typeof t["colors"] !== "object" || !t["colors"]) return null;
  return json as VignitiThemeV1;
}
