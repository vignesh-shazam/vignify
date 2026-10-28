"use client";

import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  CloudUpload,
  Compass,
  Flame,
  FolderHeart,
  Globe2,
  Heart,
  Home,
  Image as ImageIcon,
  Images,
  LayoutGrid,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  UploadCloud,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import styles from "./upload.module.css";

const TITLE_MAX_LENGTH = 25;
const DESCRIPTION_MAX_LENGTH = 500;

// English letters, whitespace, Unicode punctuation and symbols.
// Digits and other letters outside A-Z are rejected.
const ALLOWED_TEXT_PATTERN = /^[A-Za-z\s\p{P}\p{S}]*$/u;

const navMain = [
  { label: "Home", href: "/home", Icon: Home },
  { label: "Explore", href: "/explore", Icon: Compass },
  { label: "Categories", href: "/explore", Icon: LayoutGrid },
  { label: "Trending", href: "/explore?sort=trending", Icon: Flame },
  { label: "Latest", href: "/explore?sort=latest", Icon: Sparkles },
  { label: "Following", href: "/explore?filter=following", Icon: UsersRound },
];

const navLibrary = [
  { label: "My Profile", href: "/profile", Icon: UserRound },
  { label: "My Uploads", href: "/creator/upload", Icon: Images },
  { label: "Liked", href: "/profile?tab=liked", Icon: Heart },
  { label: "Collections", href: "/profile?tab=collections", Icon: FolderHeart },
  { label: "Settings", href: "/profile?tab=settings", Icon: Settings },
];

const art = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=500&q=90",
  "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=500&q=90",
  "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=500&q=90",
  "https://images.unsplash.com/photo-1500530850859-6b6b5c4a0f7b?auto=format&fit=crop&w=500&q=90",
];

export default function CreatorUploadClient({
  email,
}: {
  email: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!preview) return;

    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function chooseFile(next: File | undefined) {
    if (!next) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type)) {
      setStatus("Choose a JPG, PNG or WebP image.");
      return;
    }

    if (next.size === 0) {
      setStatus("The selected image is empty.");
      return;
    }

    if (next.size > 10 * 1024 * 1024) {
      setStatus("The image must be 10 MB or smaller.");
      return;
    }

    setFile(next);
    setPreview(URL.createObjectURL(next));
    setStatus("");
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    chooseFile(event.target.files?.[0]);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files?.[0]);
  }

  function handleTitleChange(value: string) {
    if (!ALLOWED_TEXT_PATTERN.test(value)) {
      setStatus(
        "Use letters, spaces and special characters only. Numbers are not allowed.",
      );
      return;
    }

    if (value.length > TITLE_MAX_LENGTH) {
      setStatus(`The title cannot exceed ${TITLE_MAX_LENGTH} characters.`);
      return;
    }

    setTitle(value);
    setStatus("");
  }

  function handleDescriptionChange(value: string) {
    if (!ALLOWED_TEXT_PATTERN.test(value)) {
      setStatus(
        "Use letters, spaces and special characters only. Numbers are not allowed.",
      );
      return;
    }

    if (value.length > DESCRIPTION_MAX_LENGTH) {
      setStatus(
        `The description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters.`,
      );
      return;
    }

    setDescription(value);
    setStatus("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanTitle = title.trim();
    const cleanDescription = description.trim();

    if (!file) {
      setStatus("Choose a wallpaper image first.");
      return;
    }

    if (!cleanTitle) {
      setStatus("Please provide a wallpaper title.");
      return;
    }

    if (cleanTitle.length > TITLE_MAX_LENGTH) {
      setStatus(`The title cannot exceed ${TITLE_MAX_LENGTH} characters.`);
      return;
    }

    if (cleanDescription.length > DESCRIPTION_MAX_LENGTH) {
      setStatus(
        `The description cannot exceed ${DESCRIPTION_MAX_LENGTH} characters.`,
      );
      return;
    }

    if (
      !ALLOWED_TEXT_PATTERN.test(cleanTitle) ||
      !ALLOWED_TEXT_PATTERN.test(cleanDescription)
    ) {
      setStatus(
        "Use letters, spaces and special characters only. Numbers are not allowed.",
      );
      return;
    }

    setBusy(true);
    setStatus("");

    try {
      const body = new FormData();

      // Keep "image" in sync with the API route.
      body.append("image", file);
      body.append("title", cleanTitle);
      body.append("description", cleanDescription);

      const response = await fetch("/api/wallpapers/upload", {
        method: "POST",
        body,
        credentials: "same-origin",
      });

      const result: {
        error?: string;
        message?: string;
      } = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error ||
            result.message ||
            `Upload failed (HTTP ${response.status}).`,
        );
      }

      setStatus(result.message || "Wallpaper submitted for review.");

      setFile(null);
      setPreview("");
      setTitle("");
      setDescription("");

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Upload failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className={styles.app}>
      <aside className={styles.sidebar}>
        <Link href="/home" className={styles.brand}>
          <span className={styles.brandMark}>V</span>
          <span>Vigniti</span>
        </Link>

        <nav className={styles.navGroup}>
          {navMain.map(({ label, href, Icon }) => (
            <Link key={label} href={href} className={styles.navItem}>
              <Icon />
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.navDivider} />

        <nav className={styles.navGroup}>
          {navLibrary.map(({ label, href, Icon }) => (
            <Link
              key={label}
              href={href}
              className={`${styles.navItem} ${
                label === "My Uploads" ? styles.active : ""
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
            <ImageIcon size={18} />
            <span>Search wallpapers, categories, creators...</span>
            <kbd>Ctrl K</kbd>
          </label>

          <div className={styles.topActions}>
            <button
              className={styles.iconButton}
              type="button"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>

            <Link href="/profile" className={styles.userMenu}>
              <Image
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&q=85"
                alt="Profile"
                width={32}
                height={32}
                unoptimized
              />
              <span>{email.split("@")[0] || "Creator"}</span>
              <ChevronDown size={15} />
            </Link>
          </div>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroGlow} />

          <div className={styles.heroText}>
            <p className={styles.eyebrow}>
              <span>◉</span> SHARE YOUR CREATIVITY
            </p>

            <h1>
              Create. Share. <em>Inspire.</em>
            </h1>

            <p className={styles.subheading}>
              Upload your wallpapers and showcase your work
              <br className={styles.desktopOnly} /> to a global community of
              creators.
            </p>

            <div className={styles.benefits}>
              <div>
                <span className={styles.benefitIcon}>
                  <ImageIcon />
                </span>
                <p>
                  Showcase
                  <br />
                  your creativity
                </p>
              </div>

              <div>
                <span className={`${styles.benefitIcon} ${styles.purple}`}>
                  <UsersRound />
                </span>
                <p>
                  Reach the
                  <br />
                  community
                </p>
              </div>

              <div>
                <span className={`${styles.benefitIcon} ${styles.gold}`}>
                  <Star />
                </span>
                <p>
                  Build your
                  <br />
                  creator profile
                </p>
              </div>
            </div>
          </div>

          <div className={styles.artwork} aria-label="Wallpaper artwork">
            <Image
              className={styles.artOne}
              src={art[0]}
              alt="Mountain wallpaper preview"
              width={500}
              height={700}
              unoptimized
            />
            <Image
              className={styles.artTwo}
              src={art[1]}
              alt="Forest wallpaper preview"
              width={500}
              height={700}
              unoptimized
            />
            <Image
              className={styles.artThree}
              src={art[2]}
              alt="Night sky wallpaper preview"
              width={500}
              height={700}
              unoptimized
            />

            <div className={styles.floatBadge}>
              <UploadCloud />
              <span>4K Quality</span>
            </div>

            <div className={styles.floatBadge2}>
              <Globe2 />
              <span>Global Audience</span>
            </div>

            <div className={styles.floatBadge3}>
              <Star />
              <span>Get Featured</span>
            </div>
          </div>
        </section>

        <section className={styles.uploadLayout}>
          <form className={styles.uploadCard} onSubmit={submit}>
            <div className={styles.sectionTitle}>
              <div>
                <h2>Upload your wallpaper</h2>
                <p>Share your next favorite with the community.</p>
              </div>

              <span className={styles.secure}>
                <ShieldCheck size={15} />
                Secure upload
              </span>
            </div>

            <input
              ref={inputRef}
              className={styles.fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileChange}
            />

            <div
              className={`${styles.dropzone} ${
                dragging ? styles.dragging : ""
              }`}
              onClick={(event) => {
                if ((event.target as HTMLElement).closest("button")) return;
                if (!preview) inputRef.current?.click();
              }}
              onKeyDown={(event) => {
                if (
                  !preview &&
                  (event.key === "Enter" || event.key === " ")
                ) {
                  event.preventDefault();
                  inputRef.current?.click();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={
                preview
                  ? "Selected wallpaper preview"
                  : "Choose a wallpaper image"
              }
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
            >
              {preview ? (
                <div className={styles.previewWrap}>
                  <Image
                    src={preview}
                    alt="Selected wallpaper preview"
                    width={1200}
                    height={1200}
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview("");
                      setStatus("");
                      if (inputRef.current) inputRef.current.value = "";
                    }}
                    aria-label="Remove selected image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <CloudUpload className={styles.uploadCloud} />
                  <strong>Drag &amp; drop your wallpaper here</strong>
                  <span>or click to browse files</span>

                  <button
                    type="button"
                    className={styles.chooseButton}
                    onClick={() => inputRef.current?.click()}
                  >
                    Choose Files
                  </button>

                  <small>
                    Supports JPG, PNG, WEBP · Max size 10MB · Recommended:
                    4K (3840×2160)
                  </small>
                </>
              )}
            </div>

            {file && (
              <p className={styles.selectedFile}>
                {file.name} · {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            )}

            <div className={styles.fields}>
              <label>
                Wallpaper title

                <input
                  name="title"
                  required
                  maxLength={TITLE_MAX_LENGTH}
                  value={title}
                  onChange={(event) =>
                    handleTitleChange(event.target.value)
                  }
                  placeholder="Give your wallpaper a name"
                  aria-describedby="title-counter"
                />

                <small id="title-counter" aria-live="polite">
                  {title.length}/{TITLE_MAX_LENGTH} characters
                </small>
              </label>

              <label>
                Description <span>(optional)</span>

                <textarea
                  name="description"
                  maxLength={DESCRIPTION_MAX_LENGTH}
                  value={description}
                  onChange={(event) =>
                    handleDescriptionChange(event.target.value)
                  }
                  placeholder="Tell the community about your creation"
                  rows={3}
                  aria-describedby="description-counter"
                />

                <small id="description-counter" aria-live="polite">
                  {description.length}/{DESCRIPTION_MAX_LENGTH} characters
                </small>
              </label>
            </div>

            {status && (
              <p className={styles.statusMessage} role="status">
                {status}
              </p>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={busy}
            >
              {busy ? "Submitting…" : "Submit for review"}
            </button>

            <p className={styles.reviewNote}>
              Your wallpaper will be reviewed before it appears publicly.
            </p>
          </form>

          <aside className={styles.guidelines}>
            <h2>
              <ShieldCheck size={18} />
              Upload Guidelines
            </h2>

            <ul>
              <li>
                <CheckCircle2 />
                High-quality images (minimum 1920×1080)
              </li>
              <li>
                <CheckCircle2 />
                Original content or proper licensing
              </li>
              <li>
                <CheckCircle2 />
                No sensitive or inappropriate content
              </li>
              <li>
                <CheckCircle2 />
                Clear and descriptive title
              </li>
              <li>
                <CheckCircle2 />
                Add relevant categories and tags
              </li>
            </ul>

            <div className={styles.tip}>
              <Star size={16} />
              <p>
                <strong>Creator tip</strong>
                <br />
                Beautiful, high-resolution images help your work stand out.
              </p>
            </div>
          </aside>
        </section>

        <footer className={styles.footer}>
          Made with <span>♥</span> for wallpaper lovers
          <Link href="/help">Help</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/privacy">Privacy</Link>
        </footer>
      </section>

      <nav className={styles.mobileNav}>
        <Link href="/home">
          <Home />
        </Link>
        <Link href="/explore">
          <Compass />
        </Link>
        <Link href="/creator/upload" className={styles.mobilePlus}>
          <UploadCloud />
        </Link>
        <Link href="/profile">
          <UserRound />
        </Link>
        <Link href="/profile?tab=collections">
          <FolderHeart />
        </Link>
      </nav>
    </main>
  );
}
