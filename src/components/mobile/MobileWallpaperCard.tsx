"use client";

import { Heart } from "lucide-react";

export type MobileWallpaper = {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  rating?: string;
};

type MobileWallpaperCardProps = {
  wallpaper: MobileWallpaper;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onSelect?: (wallpaper: MobileWallpaper) => void;
};

export default function MobileWallpaperCard({
  wallpaper,
  isSaved = false,
  onToggleSave,
  onSelect,
}: MobileWallpaperCardProps) {
  return (
    <article className="mobile-wallpaper-card">
      <button
        type="button"
        className="mobile-wallpaper-image"
        style={{ backgroundImage: "url(" + wallpaper.imageUrl + ")" }}
        aria-label={"View " + wallpaper.title}
        onClick={() => onSelect?.(wallpaper)}
      >
        <span className="mobile-wallpaper-category">
          {wallpaper.category}
        </span>

        <span
          role="button"
          tabIndex={0}
          className={
            "mobile-card-heart" + (isSaved ? " is-saved" : "")
          }
          aria-label={
            isSaved ? "Remove from library" : "Save to library"
          }
          onClick={(event) => {
            event.stopPropagation();
            onToggleSave?.(wallpaper.id);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onToggleSave?.(wallpaper.id);
            }
          }}
        >
          <Heart
            size={19}
            fill={isSaved ? "currentColor" : "none"}
            strokeWidth={2}
          />
        </span>
      </button>

      <div className="mobile-wallpaper-info">
        <span className="mobile-wallpaper-title">
          {wallpaper.title}
        </span>

        <span className="mobile-wallpaper-rating">
          <span aria-hidden="true">★</span>
          {wallpaper.rating || "4.8"}
        </span>
      </div>
    </article>
  );
}