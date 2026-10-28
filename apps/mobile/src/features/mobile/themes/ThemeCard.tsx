"use client";

import { Check, Palette } from "lucide-react";
import type { UploadedContent } from "@/features/mobile/components/UploadContentFlow";
import type { VignitiThemeV1 } from "./types";

type ThemeCardProps = {
  item: UploadedContent;
  theme: VignitiThemeV1 | null;
  isActive: boolean;
  onApply: (item: UploadedContent, theme: VignitiThemeV1) => void;
  onRemove: () => void;
};

export default function ThemeCard({
  item,
  theme,
  isActive,
  onApply,
  onRemove,
}: ThemeCardProps) {
  const preview = theme?.previewUrl || item.previewUrl;

  return (
    <div className={`vt-theme-card${isActive ? " is-active" : ""}`}>
      {/* Preview */}
      <div className="vt-theme-preview">
        {preview ? (
          <img src={preview} alt={item.title} className="vt-theme-preview-img" />
        ) : (
          <div className="vt-theme-preview-placeholder">
            <Palette size={28} />
          </div>
        )}

        {/* Color swatches from the theme */}
        {theme && (
          <div className="vt-theme-swatches">
            <span style={{ background: theme.colors.bg }} />
            <span style={{ background: theme.colors.accent }} />
            <span style={{ background: theme.colors.cyan }} />
            <span style={{ background: theme.colors.surface }} />
          </div>
        )}

        {isActive && (
          <div className="vt-theme-active-badge">
            <Check size={12} /> Applied
          </div>
        )}
      </div>

      {/* Info */}
      <div className="vt-theme-info">
        <p className="vt-theme-name">{theme?.name || item.title}</p>
        {theme?.author && (
          <p className="vt-theme-author">by {theme.author}</p>
        )}
        {theme?.tags && (
          <div className="vt-theme-tags">
            {theme.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="vt-theme-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="vt-theme-actions">
        {!theme ? (
          <p className="vt-theme-invalid">Invalid theme file</p>
        ) : isActive ? (
          <button
            type="button"
            className="vt-theme-btn vt-theme-btn-remove"
            onClick={onRemove}
          >
            Remove
          </button>
        ) : (
          <button
            type="button"
            className="vt-theme-btn vt-theme-btn-apply"
            onClick={() => onApply(item, theme)}
          >
            Apply Theme
          </button>
        )}
      </div>
    </div>
  );
}
