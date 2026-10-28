"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileAudio,
  Grid2X2,
  Image as ImageIcon,
  Music2,
  Palette,
  Plus,
  RefreshCw,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import "./UploadContentFlow.css";

export type UploadCategory = "Wallpaper" | "Theme" | "Icons" | "Ringtone";

export type UploadedContent = {
  id: string;
  category: UploadCategory;
  title: string;
  description: string;
  tags: string[];
  fileName: string;
  fileType: string;
  previewUrl: string;
  createdAt: string;
};

type UploadContentFlowProps = {
  onBack: () => void;
  onSubmitted: (content: UploadedContent) => void;
};

const categories: {
  name: UploadCategory;
  description: string;
  Icon: typeof ImageIcon;
  color: string;
  accept: string;
}[] = [
  {
    name: "Wallpaper",
    description: "Share your amazing wallpapers with the community.",
    Icon: ImageIcon,
    color: "violet",
    accept: "image/jpeg,image/png,image/webp,image/avif",
  },
  {
    name: "Theme",
    description: "Share your custom themes and styles.",
    Icon: Palette,
    color: "green",
    accept: ".zip,.json,image/png,image/jpeg",
  },
  {
    name: "Icons",
    description: "Share your icon packs.",
    Icon: Grid2X2,
    color: "blue",
    accept: ".zip,.json,image/png,image/jpeg",
  },
  {
    name: "Ringtone",
    description: "Share short ringtones and notification sounds.",
    Icon: Music2,
    color: "pink",
    accept: "audio/mpeg,audio/mp4,audio/aac,audio/ogg,audio/wav,audio/x-wav,audio/flac,.mp3,.m4a,.aac,.ogg,.wav,.flac",
  },
];

const SUGGESTED_TAGS = ["Nature", "Dark", "Minimal", "Abstract", "4K"];
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_TITLE_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 100;
const MAX_TAGS = 10;

export default function UploadContentFlow({
  onBack,
  onSubmitted,
}: UploadContentFlowProps) {
  const [category, setCategory] = useState<UploadCategory | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const selectedCategory = categories.find((c) => c.name === category);

  const previewUrl = useMemo(() => {
    if (!file || !file.type.startsWith("image/")) return "";
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function selectCategory(next: UploadCategory) {
    setCategory(next);
    setFile(null);
    setTitle("");
    setDescription("");
    setTagInput("");
    setTags([]);
    setError("");
  }

  function addTag(raw?: string) {
    const next = (raw ?? tagInput).trim().replace(/^#/, "").slice(0, 30);
    if (!next) return;
    if (tags.length >= MAX_TAGS) { setError("You can add up to 10 tags."); return; }
    if (tags.some((t) => t.toLowerCase() === next.toLowerCase())) { setError("That tag is already added."); return; }
    setTags((cur) => [...cur, next]);
    setTagInput("");
    setError("");
  }

  function removeTag(tag: string) {
    setTags((cur) => cur.filter((t) => t !== tag));
  }

  function handleFile(nextFile?: File) {
    if (!nextFile || !selectedCategory) return;
    if (nextFile.size > MAX_FILE_SIZE) { setError("Choose a file smaller than 25 MB."); return; }
    if (selectedCategory.name === "Wallpaper" && !nextFile.type.startsWith("image/")) { setError("Please select an image file."); return; }
    if (selectedCategory.name === "Ringtone" && !nextFile.type.startsWith("audio/")) { setError("Please select an audio file."); return; }
    if ((selectedCategory.name === "Theme" || selectedCategory.name === "Icons") &&
      !nextFile.type.startsWith("image/") && !/\.(zip|json)$/i.test(nextFile.name)) {
      setError("Choose a preview image, ZIP, or JSON file."); return;
    }
    setFile(nextFile);
    setError("");
  }

  const canSubmit =
    !!category && !!file &&
    title.trim().length > 0 && title.trim().length <= MAX_TITLE_LENGTH &&
    description.trim().length > 0 && description.trim().length <= MAX_DESCRIPTION_LENGTH &&
    tags.length > 0 && tags.length <= MAX_TAGS;

  function submitUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!canSubmit || !category || !file) {
      setError("Complete every field and add at least one tag.");
      return;
    }
    onSubmitted({
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      category,
      title: title.trim(),
      description: description.trim(),
      tags,
      fileName: file.name,
      fileType: file.type || "application/octet-stream",
      previewUrl: file.type.startsWith("image/") ? previewUrl : "",
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div className="uc-flow">
      {/* Header */}
      <header className="uc-header">
        <button
          type="button"
          className="uc-back"
          onClick={() => { if (category) { setCategory(null); setError(""); } else { onBack(); } }}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="uc-header-text">
          <span className="uc-kicker">
            <Sparkles size={12} /> CREATOR STUDIO
          </span>
          <h1>{category ? `Upload ${category}` : "Upload Content"}</h1>
        </div>
      </header>

      {/* Screen 2 — Category selection */}
      {!category ? (
        <div className="uc-screen">
          <p className="uc-subtitle">Choose what you want to upload</p>

          <div className="uc-category-list">
            {categories.map(({ name, description: sub, Icon, color }) => (
              <button
                type="button"
                key={name}
                className="uc-category-card"
                onClick={() => selectCategory(name)}
              >
                <span className={`uc-category-icon uc-icon-${color}`}>
                  <Icon size={26} />
                </span>
                <span className="uc-category-copy">
                  <strong>Upload {name}</strong>
                  <small>{sub}</small>
                </span>
                <ArrowRight size={18} className="uc-chevron" />
              </button>
            ))}
          </div>

          <p className="uc-note">
            <CheckCircle2 size={14} />
            You can review your details before submitting.
          </p>
        </div>
      ) : (
        /* Screens 3 & 4 — Upload form */
        <form className="uc-form" onSubmit={submitUpload}>

          {/* File picker */}
          <label
            className={`uc-dropzone${dragActive ? " is-dragging" : ""}${file ? " has-file" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFile(e.dataTransfer.files?.[0]); }}
          >
            <input
              type="file"
              accept={selectedCategory?.accept}
              onChange={(e) => { handleFile(e.target.files?.[0]); e.currentTarget.value = ""; }}
              aria-label={`Pick ${category} file`}
            />

            {previewUrl ? (
              <>
                <img className="uc-preview-img" src={previewUrl} alt="Preview" />
                <span className="uc-change-image">
                  <RefreshCw size={14} /> Change Image
                </span>
              </>
            ) : (
              <>
                <span className="uc-file-icon">
                  {category === "Ringtone" ? <FileAudio size={30} /> : <ImageIcon size={30} />}
                </span>
                <strong>Tap to pick an image from your device</strong>
                <small>JPG, PNG, WEBP (Max 10MB)</small>
              </>
            )}
          </label>

          {/* Title */}
          <div className="uc-field">
            <div className="uc-field-head">
              <label htmlFor="uc-title">Title <span className="uc-max">(Max {MAX_TITLE_LENGTH} characters)</span></label>
              <span className="uc-count">{title.length}/{MAX_TITLE_LENGTH}</span>
            </div>
            <input
              id="uc-title"
              type="text"
              maxLength={MAX_TITLE_LENGTH}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`e.g. ${category === "Wallpaper" ? "Mountain Sunset" : category === "Theme" ? "Neon Dark Theme" : category === "Icons" ? "Minimal Icon Set" : "Chill Vibes"}`}
              required
            />
          </div>

          {/* Description */}
          <div className="uc-field">
            <div className="uc-field-head">
              <label htmlFor="uc-desc">Description <span className="uc-max">(Max {MAX_DESCRIPTION_LENGTH} characters)</span></label>
              <span className="uc-count">{description.length}/{MAX_DESCRIPTION_LENGTH}</span>
            </div>
            <textarea
              id="uc-desc"
              maxLength={MAX_DESCRIPTION_LENGTH}
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description..."
              required
            />
          </div>

          {/* Tags */}
          <div className="uc-field">
            <div className="uc-field-head">
              <label htmlFor="uc-tag">Tags <span className="uc-max">(Max {MAX_TAGS} tags)</span></label>
              <span className="uc-count">{tags.length}/{MAX_TAGS}</span>
            </div>
            <div className="uc-tag-entry">
              <input
                id="uc-tag"
                type="text"
                maxLength={30}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag and press Enter"
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
              />
              <button
                type="button"
                onClick={() => addTag()}
                disabled={!tagInput.trim() || tags.length >= MAX_TAGS}
                aria-label="Add tag"
                className="uc-tag-add"
              >
                <Plus size={18} />
              </button>
            </div>

            {/* Active tags */}
            {tags.length > 0 && (
              <div className="uc-tags">
                {tags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className="uc-tag"
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag}`}
                  >
                    {tag} <X size={12} />
                  </button>
                ))}
              </div>
            )}

            {/* Suggested tags */}
            <div className="uc-suggested">
              <span className="uc-suggested-label">Suggested Tags</span>
              <div className="uc-suggested-tags">
                {SUGGESTED_TAGS.filter((s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase())).map((s) => (
                  <button
                    type="button"
                    key={s}
                    className="uc-suggested-tag"
                    onClick={() => addTag(s)}
                    disabled={tags.length >= MAX_TAGS}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p className="uc-error" role="alert">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="uc-submit"
            disabled={!canSubmit}
          >
            <Upload size={17} />
            Submit
          </button>

          <p className="uc-disclaimer">
            This prepares a local preview. Cloud publishing connects when storage is enabled.
          </p>
        </form>
      )}
    </div>
  );
}
