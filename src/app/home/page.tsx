"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell, Bookmark, ChevronDown, ChevronLeft, ChevronRight, Compass,
  Download, Flame, Grid2X2, Heart, Home, Image as ImageIcon, LayoutGrid,
  Search, Settings, Sparkles, UploadCloud, UserRound, X,
} from "lucide-react";
import styles from "./home.module.css";

type Wallpaper = {
  id: number;
  title: string;
  creator: string;
  downloads: string;
  resolution: string;
  category: string;
  image: string;
  avatar: string;
};

const categories = [
  { name: "All", image: "", icon: true },
  { name: "Nature", image: "photo-1500530855697-b586d89ba3ee" },
  { name: "Anime", image: "photo-1578632767115-351597cf2477" },
  { name: "Abstract", image: "photo-1550684848-fac1c5b4e853" },
  { name: "Cars", image: "photo-1503376780353-7e6692767b70" },
  { name: "Games", image: "photo-1542751371-adc38448a05e" },
  { name: "Minimal", image: "photo-1470252649378-9c29740c9fa8" },
  { name: "Space", image: "photo-1446776811953-b23d57bd21aa" },
  { name: "Animals", image: "photo-1514888286974-6c03e2ca1dba" },
  { name: "Technology", image: "photo-1518770660439-4636190af475" },
  { name: "City", image: "photo-1519608487953-e999c86e7455" },
  { name: "Quotes", image: "photo-1519681393784-d120267933ba" },
];

const wallpapers: Wallpaper[] = [
  { id: 1, title: "Alpine Afterglow", creator: "NatureSoul", downloads: "12.5K", resolution: "4K", category: "Nature", image: "photo-1464822759023-fed622ff2c3b", avatar: "photo-1534528741775-53994a69daeb" },
  { id: 2, title: "Starlit Journey", creator: "AnimeVerse", downloads: "8.7K", resolution: "4K", category: "Anime", image: "photo-1470252649378-9c29740c9fa8", avatar: "photo-1500648767791-00dcc994a43e" },
  { id: 3, title: "Neon Nights", creator: "PixelRider", downloads: "15.2K", resolution: "8K", category: "Cars", image: "photo-1519608487953-e999c86e7455", avatar: "photo-1506794778202-cad84cf45f1d" },
  { id: 4, title: "Hidden Falls", creator: "GreenEarth", downloads: "9.1K", resolution: "4K", category: "Nature", image: "photo-1448375240586-882707db888b", avatar: "photo-1531123897727-8f129e1688ce" },
  { id: 5, title: "Beyond Earth", creator: "SpaceArt", downloads: "11.3K", resolution: "4K", category: "Space", image: "photo-1446776811953-b23d57bd21aa", avatar: "photo-1507003211169-0a1dd7228f2d" },
  { id: 6, title: "Little Explorer", creator: "PawLens", downloads: "6.8K", resolution: "4K", category: "Animals", image: "photo-1514888286974-6c03e2ca1dba", avatar: "photo-1544005313-94ddf0286df2" },
  { id: 7, title: "Blue Horizon", creator: "SkyFrame", downloads: "5.2K", resolution: "8K", category: "Minimal", image: "photo-1470252649378-9c29740c9fa8", avatar: "photo-1506794778202-cad84cf45f1d" },
  { id: 8, title: "Circuit Dreams", creator: "TechNova", downloads: "7.4K", resolution: "4K", category: "Technology", image: "photo-1518770660439-4636190af475", avatar: "photo-1534528741775-53994a69daeb" },
  { id: 9, title: "Midnight City", creator: "UrbanPixel", downloads: "4.9K", resolution: "4K", category: "City", image: "photo-1519608487953-e999c86e7455", avatar: "photo-1500648767791-00dcc994a43e" },
  { id: 10, title: "Quiet Peaks", creator: "WildFrame", downloads: "3.8K", resolution: "4K", category: "Nature", image: "photo-1500530855697-b586d89ba3ee", avatar: "photo-1531123897727-8f129e1688ce" },
  { id: 11, title: "Cosmic Blue", creator: "SpaceArt", downloads: "6.1K", resolution: "8K", category: "Space", image: "photo-1462331940025-496dfbfc7564", avatar: "photo-1507003211169-0a1dd7228f2d" },
  { id: 12, title: "Golden Hour", creator: "NatureSoul", downloads: "4.2K", resolution: "4K", category: "Nature", image: "photo-1470770841072-f978cf4d019e", avatar: "photo-1534528741775-53994a69daeb" },
];

const photo = (id: string, width = 600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

export default function HomePage() {
  const router = useRouter();

  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState<number[]>([]);
  const [slide, setSlide] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const visibleWallpapers = useMemo(
    () =>
      wallpapers.filter((item) => {
        const matchesCategory =
          category === "All" || item.category === category;
        const query = search.trim().toLowerCase();

        return (
          matchesCategory &&
          (!query ||
            `${item.title} ${item.creator} ${item.category}`
              .toLowerCase()
              .includes(query))
        );
      }),
    [category, search]
  );

  const toggleLike = (id: number) =>
    setLiked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );

  return (
    <main className={styles.app}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} href="/home" aria-label="Vignify home">
          <span className={styles.brandMark} />
          Vignify
        </Link>

        <nav className={styles.navGroup} aria-label="Main navigation">
          <Link className={`${styles.navItem} ${styles.active}`} href="/home">
            <Home />
            Home
          </Link>

          <Link className={styles.navItem} href="/explore">
            <Compass />
            Explore
          </Link>

          <button
            className={styles.navItem}
            onClick={() =>
              document
                .getElementById("categories")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <LayoutGrid />
            Categories
            <ChevronRight className={styles.navEnd} />
          </button>

          <Link className={styles.navItem} href="/explore?sort=trending">
            <Flame />
            Trending
          </Link>

          <Link className={styles.navItem} href="/explore?sort=latest">
            <Sparkles />
            Latest
          </Link>

          <Link className={styles.navItem} href="/explore?filter=following">
            <Heart />
            Following
          </Link>
        </nav>

        <div className={styles.navDivider} />

        <nav className={styles.navGroup} aria-label="Your library">
          <Link className={styles.navItem} href="/profile">
            <UserRound />
            My Profile
          </Link>

          <Link className={styles.navItem} href="/creator/upload">
            <ImageIcon />
            My Uploads
          </Link>

          <Link className={styles.navItem} href="/profile?tab=liked">
            <Heart />
            Liked
          </Link>

          <Link className={styles.navItem} href="/profile?tab=collections">
            <Bookmark />
            Collections
          </Link>

          <Link className={styles.navItem} href="/profile?tab=settings">
            <Settings />
            Settings
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <span className={styles.onlineDot} />
          Made for your screen <span>v1.0</span>
        </div>
      </aside>

      <section className={styles.main}>
        <header className={styles.topbar}>
          <label className={styles.searchBox}>
            <Search size={20} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search wallpapers, categories, creators..."
              aria-label="Search wallpapers"
            />

            {search ? (
              <button
                className={styles.clearSearch}
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            ) : (
              <kbd>Ctrl&nbsp; K</kbd>
            )}
          </label>

          <div className={styles.topActions}>
            <Link className={styles.uploadButton} href="/creator/upload">
              <UploadCloud size={18} />
              Upload
            </Link>

            <button
              className={styles.iconButton}
              aria-label="Notifications"
              onClick={() =>
                setNotice(notice ? "" : "You're all caught up!")
              }
            >
              <Bell size={21} />
              <i />
            </button>

            <button
              className={styles.userMenu}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
            >
              <Image
                src={photo("photo-1500648767791-00dcc994a43e", 96)}
                alt="Profile"
                width={32}
                height={32}
                unoptimized
              />
              <span>Vignesh</span>
              <ChevronDown size={16} />
            </button>

            {menuOpen && (
              <div className={styles.profileMenu}>
                <Link href="/profile">My Profile</Link>
                <Link href="/creator/upload">My Uploads</Link>
                <Link href="/profile?tab=settings">Settings</Link>
                <Link href="/login">Sign out</Link>
              </div>
            )}

            {notice && <div className={styles.notice}>{notice}</div>}
          </div>
        </header>

        <section className={styles.hero} aria-label="Featured wallpapers">
          <div
            className={styles.heroImage}
            style={{
              backgroundImage: `url("${photo(
                slide % 2 === 0
                  ? "photo-1470770841072-f978cf4d019e"
                  : "photo-1464822759023-fed622ff2c3b",
                1800
              )}")`,
            }}
          />
          <div className={styles.heroShade} />

          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>
              DISCOVER <span>·</span> CREATE <span>·</span> INSPIRE
            </p>

            <h1>
              Stunning
              <br />
              <em>Wallpapers</em>
              <br />
              For Every Screen
            </h1>

            <p className={styles.heroDescription}>
              Explore a beautiful collection of high-quality wallpapers
              <br className={styles.desktopBreak} /> created by a global
              community of creators.
            </p>

            <div className={styles.heroButtons}>
              <Link className={styles.primaryButton} href="/explore">
                <Compass size={18} />
                Explore Wallpapers <span>→</span>
              </Link>

              <Link className={styles.secondaryButton} href="/creator/upload">
                <UploadCloud size={18} />
                Upload Your Creation
              </Link>
            </div>
          </div>

          <div className={styles.heroSlogan}>
            Good
            <br />
            Wallpapers
            <br />
            Brighter Days<span />
          </div>

          <div className={styles.heroControls}>
            <div className={styles.dots}>
              <i className={slide % 2 === 0 ? styles.dotActive : ""} />
              <i className={slide % 2 === 1 ? styles.dotActive : ""} />
              <i />
              <i />
            </div>

            <button
              aria-label="Previous featured wallpaper"
              onClick={() => setSlide((n) => (n + 1) % 2)}
            >
              <ChevronLeft />
            </button>

            <button
              aria-label="Next featured wallpaper"
              onClick={() => setSlide((n) => (n + 1) % 2)}
            >
              <ChevronRight />
            </button>
          </div>
        </section>

        <section
          id="categories"
          className={styles.categories}
          aria-label="Wallpaper categories"
        >
          {categories.map((item) => (
            <button
              key={item.name}
              onClick={() => setCategory(item.name)}
              className={`${styles.categoryCard} ${
                category === item.name ? styles.categorySelected : ""
              }`}
            >
              {item.icon ? (
                <span className={styles.allIcon}>
                  <Grid2X2 size={20} />
                </span>
              ) : (
                <Image
                  src={photo(item.image, 220)}
                  alt=""
                  width={220}
                  height={220}
                  unoptimized
                />
              )}
              <span>{item.name}</span>
            </button>
          ))}
        </section>

        <Gallery
          title="Trending Wallpapers"
          icon={<Flame size={23} fill="#ffd21f" stroke="#ffd21f" />}
          wallpapers={visibleWallpapers.slice(0, 6)}
          liked={liked}
          onLike={toggleLike}
          onDownload={(title) => setNotice(`Download selected: ${title}`)}
          onViewAll={() => {
            setCategory("All");
            router.push("/explore?sort=trending");
          }}
        />

        <Gallery
          title="Latest Wallpapers"
          icon={<Sparkles size={22} color="#B9F56B" />}
          wallpapers={[...visibleWallpapers].reverse().slice(0, 6)}
          liked={liked}
          onLike={toggleLike}
          onDownload={(title) => setNotice(`Download selected: ${title}`)}
          onViewAll={() => router.push("/explore?sort=latest")}
        />

        {visibleWallpapers.length === 0 && (
          <div className={styles.emptyState}>
            No wallpapers found. Try another search or category.
          </div>
        )}

        <footer className={styles.footer}>
          Made with <span>♥</span> for wallpaper lovers
          <Link href="/help">Help</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </footer>
      </section>
    </main>
  );
}

function Gallery({
  title,
  icon,
  wallpapers: items,
  liked,
  onLike,
  onDownload,
  onViewAll,
}: {
  title: string;
  icon: React.ReactNode;
  wallpapers: Wallpaper[];
  liked: number[];
  onLike: (id: number) => void;
  onDownload: (title: string) => void;
  onViewAll: () => void;
}) {
  return (
    <section className={styles.gallerySection}>
      <div className={styles.sectionHeading}>
        <h2>
          {icon}
          {title}
        </h2>
        <button onClick={onViewAll}>
          View all <span>→</span>
        </button>
      </div>

      <div className={styles.wallpaperGrid}>
        {items.map((item) => (
          <article
            key={`${title}-${item.id}`}
            className={styles.wallpaperCard}
          >
            <Image
              className={styles.wallpaperImage}
              src={photo(item.image, 560)}
              alt={item.title}
              width={560}
              height={800}
              loading="lazy"
              unoptimized
            />

            <span className={styles.resolution}>{item.resolution}</span>

            <button
              className={`${styles.likeButton} ${
                liked.includes(item.id) ? styles.liked : ""
              }`}
              onClick={() => onLike(item.id)}
              aria-label={
                liked.includes(item.id)
                  ? `Unlike ${item.title}`
                  : `Like ${item.title}`
              }
            >
              <Heart
                size={22}
                fill={liked.includes(item.id) ? "currentColor" : "none"}
              />
            </button>

            <div className={styles.cardGradient} />

            <div className={styles.cardMeta}>
              <Image
                src={photo(item.avatar, 64)}
                alt=""
                width={32}
                height={32}
                unoptimized
              />
              <span className={styles.creatorName}>{item.creator}</span>
              <span className={styles.downloadCount}>
                <Download size={12} />
                {item.downloads}
              </span>
              <button
                onClick={() => onDownload(item.title)}
                aria-label={`Download ${item.title}`}
              >
                <Download size={18} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}