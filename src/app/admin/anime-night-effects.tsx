"use client";

import { useEffect, useState } from "react";

/**
 * Decorative ambient layers for the Anime Night admin theme.
 * Render once inside .admin-root, before the sidebar and main content.
 */
export function AnimeNightEffects() {
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionAllowed(!query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  if (!motionAllowed) return null;

  return (
    <div className="anime-night-effects" aria-hidden="true">
      <div className="anime-night-effects__stars" />
      <div className="anime-night-effects__petals" />
    </div>
  );
}
