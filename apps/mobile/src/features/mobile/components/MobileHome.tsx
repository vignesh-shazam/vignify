"use client";

import { useEffect, useMemo, useState } from "react";
import ThreeDPhoneHero from "./ThreeDPhoneHero";
import {
  ArrowRight,
  Grid2X2,
  Heart,
  Image as ImageIcon,
  Music2,
  Palette,
  Sparkles,
} from "lucide-react";
import MobileWallpaperCard, {
  type MobileWallpaper,
} from "@/features/mobile/components/MobileWallpaperCard";

const categories = [
  { name: "Wallpapers", Icon: ImageIcon, color: "wallpapers" },
  { name: "Icons", Icon: Grid2X2, color: "icons" },
  { name: "Themes", Icon: Palette, color: "themes" },
  { name: "Ringtones", Icon: Music2, color: "ringtones" },
];

const trendingWallpapers: MobileWallpaper[] = [
  {
    id: "neon-city",
    title: "Neon City",
    category: "City",
    imageUrl:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=600&q=90",
    rating: "4.8",
  },
  {
    id: "minimal-dark",
    title: "Minimal Dark",
    category: "Minimal",
    imageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=90",
    rating: "4.6",
  },
  {
    id: "nature-flow",
    title: "Nature Flow",
    category: "Nature",
    imageUrl:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=90",
    rating: "4.7",
  },
];

const recentWallpapers: MobileWallpaper[] = [
  {
    id: "violet-horizon",
    title: "Violet Horizon",
    category: "Abstract",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=90",
    rating: "4.9",
  },
  {
    id: "quiet-ocean",
    title: "Quiet Ocean",
    category: "Nature",
    imageUrl:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=600&q=90",
    rating: "4.8",
  },
  {
    id: "cosmic-night",
    title: "Cosmic Night",
    category: "Space",
    imageUrl:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=90",
    rating: "4.7",
  },
];

const dailyWallpapers: MobileWallpaper[] = [
  {
    id: "daily-cosmic-dream",
    title: "Cosmic Dream",
    category: "Space",
    imageUrl:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=90",
    rating: "4.9",
  },
  {
    id: "daily-neon-nights",
    title: "Neon Nights",
    category: "City",
    imageUrl:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=90",
    rating: "4.8",
  },
  {
    id: "daily-mountain-magic",
    title: "Mountain Magic",
    category: "Nature",
    imageUrl:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=90",
    rating: "4.9",
  },
  {
    id: "daily-ocean-blue",
    title: "Ocean Blue",
    category: "Nature",
    imageUrl:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=90",
    rating: "4.8",
  },
];

type MobileHomeProps = {
  searchQuery?: string;
  onUploadContent?: () => void;
  onExplore?: () => void;
  onSelectWallpaper?: (wallpaper: MobileWallpaper) => void;
  /** Items uploaded this session — shown in Recently Added */
  uploadedItems?: import("@/features/mobile/components/UploadContentFlow").UploadedContent[];
};

export default function MobileHome({
  searchQuery = "",
  onExplore,
  onSelectWallpaper,
  onUploadContent,
  uploadedItems = [],
}: MobileHomeProps) {
  const [activeCategory, setActiveCategory] = useState("Wallpapers");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [dailyIndex, setDailyIndex] = useState(0);

  useEffect(() => {
    const now = new Date();
    const dayNumber = Math.floor(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) /
      86400000,
    );

    setDailyIndex(dayNumber % dailyWallpapers.length);
  }, []);

  const dailyWallpaper = dailyWallpapers[dailyIndex];

  const filterWallpapers = (items: MobileWallpaper[]) => {
    const query = searchQuery.trim().toLowerCase();

    return items.filter((wallpaper) => {
      const matchesSearch =
        !query ||
        wallpaper.title.toLowerCase().includes(query) ||
        wallpaper.category.toLowerCase().includes(query);

      const matchesCategory =
        activeCategory === "Wallpapers" ||
        wallpaper.category.toLowerCase() === activeCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  };

  const trending = useMemo(
    () => filterWallpapers(trendingWallpapers),
    [activeCategory, searchQuery],
  );

  const recent = useMemo(() => {
    // Convert uploaded items (images only) to MobileWallpaper shape and prepend
    const uploaded: MobileWallpaper[] = uploadedItems
      .filter((item) => item.previewUrl)
      .map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        imageUrl: item.previewUrl,
        rating: "New",
      }));
    return [...uploaded, ...filterWallpapers(recentWallpapers)];
  }, [activeCategory, searchQuery, uploadedItems]);

  function toggleSaved(id: string) {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id],
    );
  }

  function renderWallpaperSection(
    title: string,
    items: MobileWallpaper[],
  ) {
    return (
      <section className="mobile-home-section">
        <div className="mobile-section-heading">
          <h2>{title}</h2>

          <button
            type="button"
            className="mobile-text-link"
            onClick={onExplore}
          >
            View All
          </button>
        </div>

        <div className="mobile-wallpaper-grid">
          {items.map((wallpaper) => (
            <MobileWallpaperCard
              key={wallpaper.id}
              wallpaper={wallpaper}
              isSaved={savedIds.includes(wallpaper.id)}
              onToggleSave={toggleSaved}
              onSelect={onSelectWallpaper}
            />
          ))}
        </div>

        {items.length === 0 && (
          <p className="mobile-empty-state">
            No matching wallpapers found.
          </p>
        )}
      </section>
    );
  }

  return (
    <div className="mobile-home">
      {/* Premium animated hero banner */}
      <section
        className="mobile-hero"
        aria-label="Discover stunning wallpapers"
      >
        <div className="mobile-hero-glow" aria-hidden="true" />
        <div className="mobile-hero-orb" aria-hidden="true" />

        <div className="mobile-hero-content">
          <span className="mobile-hero-eyebrow">
            <Sparkles size={12} />
            YOUR STYLE. YOUR WORLD.
          </span>

          <h1>
            Stunning
            <br />
            Wallpapers
          </h1>

          <p>Give your screen a fresh new look.</p>

          <button
            type="button"
            className="mobile-hero-button"
            onClick={onExplore}
          >
            Explore Now

            <span className="mobile-hero-arrow">
              <ArrowRight size={16} />
            </span>
          </button>
        </div>

        <div className="mobile-hero-art" aria-hidden="true">
          <div className="mobile-hero-ring" />

          <ThreeDPhoneHero />

          <Sparkles
            className="mobile-hero-sparkle mobile-hero-sparkle-one"
            size={20}
          />

          <Sparkles
            className="mobile-hero-sparkle mobile-hero-sparkle-two"
            size={12}
          />

          <span className="mobile-hero-light mobile-hero-light-one" />
          <span className="mobile-hero-light mobile-hero-light-two" />
        </div>
      </section>

      {/* Customization categories */}
      <section
        className="mobile-category-shortcuts"
        aria-label="Customization categories"
      >
        {categories.map(({ name, Icon, color }) => (
          <button
            key={name}
            type="button"
            className={`mobile-category-shortcut ${color}${activeCategory === name ? " is-selected" : ""
              }`}
            aria-pressed={activeCategory === name}
            onClick={() => setActiveCategory(name)}
          >
            <span className="mobile-category-icon">
              <Icon size={21} strokeWidth={2.2} />
            </span>

            <span className="mobile-category-label">{name}</span>
          </button>
        ))}
      </section>

      {renderWallpaperSection("Trending Now", trending)}
      {renderWallpaperSection("Recently Added", recent)}

      {/* Wallpaper of the Day */}
      <section className="mobile-home-section mobile-daily-section">
        <div className="mobile-section-heading">
          <h2>
            <Sparkles size={17} />
            Wallpaper of the Day
          </h2>

          <span className="mobile-daily-badge">DAILY PICK</span>
        </div>

        <article className="mobile-daily-card">
          <button
            type="button"
            className="mobile-daily-image"
            style={{
              backgroundImage: `url("${dailyWallpaper.imageUrl}")`,
            }}
            aria-label={`View ${dailyWallpaper.title}`}
            onClick={() => onSelectWallpaper?.(dailyWallpaper)}
          >
            <span className="mobile-daily-image-label">
              TODAY'S PICK
            </span>
          </button>

          <div className="mobile-daily-details">
            <div className="mobile-daily-copy">
              <span className="mobile-daily-category">
                {dailyWallpaper.category}
              </span>

              <h3>{dailyWallpaper.title}</h3>

              <p>A fresh look for your screen, every day.</p>
            </div>

            <button
              type="button"
              className={`mobile-daily-save${savedIds.includes(dailyWallpaper.id) ? " is-saved" : ""
                }`}
              aria-label={
                savedIds.includes(dailyWallpaper.id)
                  ? "Remove daily wallpaper from library"
                  : "Save daily wallpaper"
              }
              aria-pressed={savedIds.includes(dailyWallpaper.id)}
              onClick={() => toggleSaved(dailyWallpaper.id)}
            >
              <Heart
                size={20}
                fill={
                  savedIds.includes(dailyWallpaper.id)
                    ? "currentColor"
                    : "none"
                }
              />
            </button>
          </div>

          <button
            type="button"
            className="mobile-daily-view-button"
            onClick={() => onSelectWallpaper?.(dailyWallpaper)}
          >
            View Wallpaper
            <ArrowRight size={16} />
          </button>
        </article>
      </section>

      <div className="mobile-library-shortcut">
        <Heart size={15} />
        <span>{savedIds.length} saved wallpapers</span>
      </div>
    </div>
  );
}

