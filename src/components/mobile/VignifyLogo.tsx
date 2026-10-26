"use client";

import type { CSSProperties } from "react";

type VignifyLogoProps = {
  size?: number;
  className?: string;
  ariaLabel?: string;
};

export default function VignifyLogo({
  size = 36,
  className,
  ariaLabel = "Vignify",
}: VignifyLogoProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    display: "block",
    flexShrink: 0,
  };

  return (
    <svg
      className={className}
      style={style}
      viewBox="0 0 64 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient
          id="vignify-pink-gradient"
          x1="5"
          y1="4"
          x2="30"
          y2="49"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#FF62D0" />
          <stop offset="1" stopColor="#C522F4" />
        </linearGradient>

        <linearGradient
          id="vignify-cyan-gradient"
          x1="39"
          y1="49"
          x2="60"
          y2="4"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#21D5FF" />
          <stop offset="1" stopColor="#00B8F0" />
        </linearGradient>
      </defs>

      {/* Pink left arm */}
      <path
        d="M9 4.5C12.2 3.1 15.9 4.5 17.5 7.6L34.1 38.8C36 42.4 34.6 46.8 31 48.7C27.4 50.6 23 49.2 21.1 45.6L4.5 14.4C2.6 10.8 4 6.4 7.6 4.5C8.1 4.3 8.5 4.3 9 4.5Z"
        fill="url(#vignify-pink-gradient)"
      />

      {/* Cyan right arm; overlaps the pink arm to form one connected V */}
      <path
        d="M55 4.5C58.6 6.4 60 10.8 58.1 14.4L42.4 44.9C40.5 48.5 36.1 49.9 32.5 48C28.9 46.1 27.5 41.7 29.4 38.1L45.1 7.6C47 4 51.4 2.6 55 4.5Z"
        fill="url(#vignify-cyan-gradient)"
      />
    </svg>
  );
}