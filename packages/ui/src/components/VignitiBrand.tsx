import type { CSSProperties } from "react";
import VignitiLogo from "./VignitiLogo";

type VignitiBrandProps = {
  /** Icon size in px. Default 28. */
  size?: number;
  /** Extra class on the wrapper anchor/div. */
  className?: string;
  /** Rendered as an <a> if href is provided, otherwise a <span>. */
  href?: string;
  /** onClick handler (used when rendered as a button-like element). */
  onClick?: (e: React.MouseEvent) => void;
};

const wrapperBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  textDecoration: "none",
  userSelect: "none",
  WebkitTapHighlightColor: "transparent",
  cursor: "pointer",
};

const wordmarkStyle: CSSProperties = {
  fontSize: 18,
  fontWeight: 800,
  letterSpacing: "-0.02em",
  color: "#ffffff",
  lineHeight: 1,
};

/**
 * Full Vigniti brand lockup: V-mark icon + "Vigniti" wordmark.
 * Matches the dark navbar design (white text on dark bg).
 *
 * Usage:
 *   <VignitiBrand href="/" />          — renders an <a>
 *   <VignitiBrand onClick={goHome} />  — renders a <span>
 */
export default function VignitiBrand({
  size = 28,
  className,
  href,
  onClick,
}: VignitiBrandProps) {
  const inner = (
    <>
      <VignitiLogo size={size} ariaLabel="Vigniti logo" />
      <span style={wordmarkStyle}>Vigniti</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label="Vigniti home"
        className={className}
        style={wrapperBase}
        onClick={onClick}
      >
        {inner}
      </a>
    );
  }

  return (
    <span
      role="img"
      aria-label="Vigniti"
      className={className}
      style={wrapperBase}
      onClick={onClick}
    >
      {inner}
    </span>
  );
}
