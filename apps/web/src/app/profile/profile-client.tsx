"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  Flame,
  FolderHeart,
  Heart,
  Home,
  Images,
  LayoutGrid,
  MapPin,
  MoreHorizontal,
  Settings,
  Sparkles,
  UserRound,
  UsersRound,
} from "lucide-react";
import styles from "./profile.module.css";

export type ProfileWallpaper = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
};

const imageUrl = (id: string, width = 700) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=88`;

type Props = {
  email: string;
  displayName: string;
  uploads: ProfileWallpaper[];
  loadError?: boolean;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function statusLabel(status: string) {
  switch (status) {
    case "published":
      return "LIVE";
    case "rejected":
      return "REJECTED";
    default:
      return "PENDING";
  }
}

export default function ProfileClient({
  email,
  displayName,
  uploads,
  loadError = false,
}: Props) {
  const [tab, setTab] = useState("My Uploads");
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(displayName);
  const [bio, setBio] = useState(
    "Wallpaper lover  ·  Creator  ·  Nature & Games enthusiast"
  );
  const [notice, setNotice] = useState("");

  const tabs = [
    { label: "My Uploads", Icon: Images },
    { label: "Liked", Icon: Heart },
    { label: "Collections", Icon: FolderHeart },
    { label: "Stats", Icon: LayoutGrid },
    { label: "Settings", Icon: Settings },
  ];

  const nav = [
    { label: "Home", href: "/home", Icon: Home },
    { label: "Explore", href: "/explore", Icon: Compass },
    { label: "Categories", href: "/explore", Icon: LayoutGrid },
    { label: "Trending", href: "/explore?sort=trending", Icon: Flame },
    { label: "Latest", href: "/explore?sort=latest", Icon: Sparkles },
    {
      label: "Following",
      href: "/explore?filter=following",
      Icon: UsersRound,
    },
  ];

  const library = [
    { label: "My Profile", href: "/profile", Icon: UserRound },
    { label: "My Uploads", href: "/creator/upload", Icon: Images },
    { label: "Liked", href: "/profile?tab=liked", Icon: Heart },
    {
      label: "Collections",
      href: "/profile?tab=collections",
      Icon: FolderHeart,
    },
    { label: "Settings", href: "/profile?tab=settings", Icon: Settings },
  ];

  const avatar = imageUrl("photo-1500648767791-00dcc994a43e", 220);

  return (
    <main className={styles.app}>
      <aside className={styles.sidebar}>
        <Link href="/home" className={styles.brand}>
          <span className={styles.brandMark}>V</span>
          Vigniti
        </Link>

        <nav className={styles.navGroup}>
          {nav.map(({ label, href, Icon }) => (
            <Link key={label} href={href} className={styles.navItem}>
              <Icon />
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.navDivider} />

        <nav className={styles.navGroup}>
          {library.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              className={`${styles.navItem} ${
                label === "My Profile" ? styles.active : ""
              }`}
            >
              <Icon />
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <i />
          Made for your screen
          <small>v1.0</small>
        </div>
      </aside>

      <section className={styles.main}>
        <header className={styles.topbar}>
          <label className={styles.search}>
            <Compass size={17} />
            <span>Search wallpapers, categories, creators...</span>
            <kbd>Ctrl K</kbd>
          </label>

          <div className={styles.topActions}>
            <button
              className={styles.iconButton}
              aria-label="Notifications"
              onClick={() => setNotice("You're all caught up!")}
            >
              <Bell size={20} />
            </button>

            <Link href="/profile" className={styles.userMenu}>
              <Image
                src={avatar}
                alt="Profile"
                width={36}
                height={36}
                unoptimized
              />
              <span>{name}</span>
              <ChevronDown size={15} />
            </Link>
          </div>
        </header>

        <section className={styles.cover}>
          <div className={styles.coverShade} />

          <div className={styles.profileIdentity}>
            <div className={styles.avatarWrap}>
              <Image
                src={avatar}
                alt="Creator avatar"
                width={120}
                height={120}
                unoptimized
              />
              <i />
            </div>

            <div className={styles.identityText}>
              <h1>
                {name}
                <span className={styles.verified}>
                  <Check size={12} />
                </span>
              </h1>

              <p className={styles.handle}>
                @{email.split("@")[0] || "creator"}
              </p>

              <p className={styles.bio}>{bio}</p>

              <div className={styles.meta}>
                <span>
                  <MapPin size={14} />
                  Noida, India
                </span>
                <span>
                  <CalendarDays size={14} />
                  Joined Vigniti
                </span>
              </div>
            </div>

            <button
              className={styles.editButton}
              onClick={() => setEditing(true)}
            >
              <Settings size={15} />
              Edit Profile
            </button>
          </div>
        </section>

        <section className={styles.profileSummary}>
          <div className={styles.stats}>
            <div>
              <strong>{uploads.length}</strong>
              <span>Uploads</span>
            </div>
            <div>
              <strong>—</strong>
              <span>Followers</span>
            </div>
            <div>
              <strong>—</strong>
              <span>Following</span>
            </div>
            <div>
              <strong>—</strong>
              <span>Total Likes</span>
            </div>
          </div>

          <div className={styles.tabs}>
            {tabs.map(({ label, Icon }) => (
              <button
                key={label}
                onClick={() => setTab(label)}
                className={tab === label ? styles.tabActive : ""}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </section>

        {notice && (
          <p className={styles.notice} role="status">
            {notice}
          </p>
        )}

        {editing && (
          <div
            className={styles.modalBackdrop}
            role="presentation"
            onClick={() => setEditing(false)}
          >
            <form
              className={styles.editModal}
              onSubmit={(event) => {
                event.preventDefault();
                setEditing(false);
                setNotice(
                  "Preview updated for this session. Profile changes are not saved to your account yet."
                );
              }}
              onClick={(event) => event.stopPropagation()}
            >
              <h2>Edit profile</h2>

              <label>
                Display name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  maxLength={60}
                  required
                />
              </label>

              <label>
                Bio
                <textarea
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  maxLength={160}
                  rows={3}
                />
              </label>

              <div>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.saveButton}>
                  Save preview
                </button>
              </div>
            </form>
          </div>
        )}

        {tab === "Settings" ? (
          <section className={styles.panel}>
            <h2>Account settings</h2>
            <p>{email}</p>
            <p>
              Profile visibility and account security settings will appear
              here.
            </p>
            <Link href="/creator/upload" className={styles.inlineLink}>
              Manage your uploads
            </Link>
          </section>
        ) : tab === "Stats" ? (
          <section className={styles.panel}>
            <h2>Creator statistics</h2>
            <p>
              Published wallpaper and engagement statistics will appear here
              when the relevant metrics are connected.
            </p>
          </section>
        ) : tab === "Liked" || tab === "Collections" ? (
          <section className={styles.panel}>
            <h2>{tab}</h2>
            <p>
              Your {tab.toLowerCase()} will appear here as those features are
              connected.
            </p>
            <Link href="/explore" className={styles.inlineLink}>
              Explore wallpapers
            </Link>
          </section>
        ) : (
          <section className={styles.gallerySection}>
            <div className={styles.galleryHeading}>
              <h2>
                <Images size={19} />
                My Uploads
              </h2>
              <Link href="/creator/upload" className={styles.uploadLink}>
                ＋ Upload wallpaper
              </Link>
            </div>

            {loadError ? (
              <div className={styles.emptyState} role="alert">
                <Images size={30} />
                <h3>Unable to load wallpapers</h3>
                <p>Please refresh the page and try again.</p>
              </div>
            ) : uploads.length === 0 ? (
              <div className={styles.emptyState}>
                <Images size={30} />
                <h3>No wallpapers yet</h3>
                <p>
                  Upload your first wallpaper and it will appear here.
                </p>
                <Link href="/creator/upload" className={styles.uploadLink}>
                  ＋ Upload your first wallpaper
                </Link>
              </div>
            ) : (
              <div className={styles.wallpaperGrid}>
                {uploads.map((item) => (
                  <article
                    key={item.id}
                    className={styles.wallpaperCard}
                  >
                    <Image
                      className={styles.wallpaperImage}
                      src={`/api/wallpapers/${item.id}/image`}
                      alt={item.title}
                      width={560}
                      height={800}
                      loading="lazy"
                      unoptimized
                    />

                    <span
                      className={`${styles.resolution} ${
                        item.status === "published"
                          ? styles.published
                          : item.status === "rejected"
                            ? styles.rejected
                            : ""
                      }`}
                    >
                      {statusLabel(item.status)}
                    </span>

                    <button
                      className={styles.cardMore}
                      aria-label={`View status for ${item.title}`}
                      onClick={() =>
                        setNotice(
                          `${item.title}: ${
                            item.status === "published"
                              ? "Published"
                              : item.status === "rejected"
                                ? "Rejected"
                                : "Waiting for review"
                          }`
                        )
                      }
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    <div className={styles.cardGradient} />

                    <div className={styles.cardMeta}>
                      <span className={styles.cardTitle}>{item.title}</span>
                      <span title={formatDate(item.createdAt)}>
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        <footer className={styles.footer}>
          Made with <span>♥</span> for wallpaper lovers
          <Link href="/help">Help</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </footer>
      </section>

      <nav className={styles.mobileNav}>
        <Link href="/home" aria-label="Home">
          <Home />
        </Link>
        <Link href="/explore" aria-label="Explore">
          <Compass />
        </Link>
        <Link
          href="/creator/upload"
          className={styles.mobilePlus}
          aria-label="Upload wallpaper"
        >
          <Images />
        </Link>
        <Link
          href="/profile"
          className={styles.mobileActive}
          aria-label="My profile"
        >
          <UserRound />
        </Link>
        <Link href="/profile?tab=collections" aria-label="Collections">
          <FolderHeart />
        </Link>
      </nav>
    </main>
  );
}