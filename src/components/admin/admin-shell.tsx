"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import { AnimeNightEffects } from "@/app/admin/anime-night-effects";
import {
  House,
  Image as ImageIcon,
  Tags,
  PanelsTopLeft,
  GalleryVerticalEnd,
  UsersRound,
  ShieldAlert,
  MessageCircle,
  Bell,
  ChartNoAxesColumnIncreasing,
  ChartNoAxesCombined,
  BadgeCheck,
  Wrench,
  ShieldCheck,
  Settings,
  Search,
  Sun,
  Moon,
  LogOut,
  Menu,
  ExternalLink,
  ChevronDown,
  Command,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  soon?: boolean;
  notice?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const groups: NavGroup[] = [
  {
    label: "",
    items: [{ label: "Dashboard", href: "/admin", icon: House }],
  },
  {
    label: "CONTENT",
    items: [
      { label: "Wallpapers", href: "/admin/wallpapers", icon: ImageIcon },
      { label: "Categories & Tags", href: "/admin/categories", icon: Tags },
      { label: "Homepage & Featured", href: "/admin/featured", icon: PanelsTopLeft },
      { label: "Collections", href: "/admin/collections", icon: GalleryVerticalEnd },
    ],
  },
  {
    label: "COMMUNITY",
    items: [
      { label: "Users & Creators", href: "/admin/users", icon: UsersRound },
      { label: "Reports & Moderation", href: "/admin/reports", icon: ShieldAlert },
      { label: "Support & Feedback", href: "/admin/support", icon: MessageCircle },
      { label: "Notifications", href: "/admin/notifications", icon: Bell, notice: true },
    ],
  },
  {
    label: "ANALYTICS",
    items: [
      {
        label: "Analytics & Reports",
        href: "/admin/analytics",
        icon: ChartNoAxesColumnIncreasing,
      },
      {
        label: "Revenue & Monetization",
        href: "/admin/revenue",
        icon: ChartNoAxesCombined,
        soon: true,
      },
      {
        label: "Subscriptions & Plans",
        href: "/admin/subscriptions",
        icon: BadgeCheck,
        soon: true,
      },
    ],
  },
  {
    label: "PLATFORM",
    items: [
      { label: "SEO & Content Pages", href: "/admin/seo", icon: Wrench, soon: true },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldCheck },
      { label: "Settings & Security", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminShell({
  children,
  email,
}: {
  children: React.ReactNode;
  email: string;
}) {
  const path = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [sidebarPinned, setSidebarPinned] = useState(false);
  const [dark, setDark] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [search, setSearch] = useState("");

  function handleSidebarEnter() {
    if (!sidebarPinned) setSidebarExpanded(true);
  }

  function handleSidebarLeave() {
    if (!sidebarPinned) setSidebarExpanded(false);
  }

  function toggleSidebarPin() {
    setSidebarPinned((pinned) => {
      const nextPinned = !pinned;
      setSidebarExpanded(nextPinned);
      return nextPinned;
    });
  }

  async function signOut() {
    if (signingOut) return;

    setSigningOut(true);
    setLogoutError("");

    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });

      if (!response.ok) throw new Error("Logout failed");

      router.replace("/admin/login");
      router.refresh();
    } catch {
      setLogoutError("Unable to sign out. Please try again.");
      setSigningOut(false);
    }
  }

  const initials = (email[0] || "V").toUpperCase();
  const sidebarClassName = [
    "admin-sidebar",
    sidebarExpanded || sidebarPinned ? "sidebar-wide" : "sidebar-narrow",
    mobileOpen ? "mobile-open" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
  className={[
    "admin-root",
    dark ? "" : "light-mode",
    sidebarExpanded || sidebarPinned ? "sidebar-is-expanded" : "",
  ]
    .filter(Boolean)
    .join(" ")}
>
      <div className="anime-night-background" aria-hidden="true" />
      <AnimeNightEffects />
      <aside
        id="admin-sidebar"
        className={sidebarClassName}
        onMouseEnter={handleSidebarEnter}
        onMouseLeave={handleSidebarLeave}
        onFocusCapture={handleSidebarEnter}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            handleSidebarLeave();
          }
        }}
      >
        <div className="admin-brand-row">
          <Link
            href="/admin"
            className="brand"
            aria-label="Vignify Admin Dashboard"
            onClick={() => setMobileOpen(false)}
          >
            <span className="brand-mark">V</span>
            <span className="brand-copy">
              <strong>Vignify</strong>
              <small>Admin Panel</small>
            </span>
          </Link>

          <button
            type="button"
            className="sidebar-pin-button"
            onClick={toggleSidebarPin}
            aria-label={sidebarPinned ? "Unpin sidebar" : "Pin sidebar open"}
            aria-pressed={sidebarPinned}
            title={sidebarPinned ? "Unpin sidebar" : "Pin sidebar open"}
          >
            {sidebarPinned ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
          </button>
        </div>

        <nav className="admin-navigation" aria-label="Admin navigation">
          {groups.map((group) => (
            <section
              className="nav-group"
              key={group.label || "overview"}
              aria-label={group.label || "Overview"}
            >
              {group.label && <div className="nav-heading">{group.label}</div>}

              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/admin"
                    ? path === "/admin"
                    : path === item.href || path.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={!sidebarExpanded ? item.label : undefined}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`nav-item ${active ? "active" : ""}`}
                  >
                    <span className="nav-icon-wrap">
                      <Icon size={19} strokeWidth={1.8} />
                    </span>
                    <span className="nav-label">{item.label}</span>

                    {item.soon && <em className="nav-soon">Soon</em>}
                    {item.notice && (
                      <span className="nav-notice" aria-label="3 notifications">
                        3
                      </span>
                    )}
                    <span className="nav-tooltip" aria-hidden="true">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </section>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="owner-card">
            <div className="owner-avatar">V</div>
            <div className="owner-meta">
              <strong>Vignify Owner</strong>
              <span>Owner</span>
            </div>
            <ChevronDown size={16} className="owner-chevron" />
          </div>

          {logoutError && (
            <p className="admin-logout-error" role="alert">
              {logoutError}
            </p>
          )}

          <button
            type="button"
            className="admin-logout-button"
            onClick={signOut}
            disabled={signingOut}
            aria-label={signingOut ? "Signing out" : "Logout"}
            title={!sidebarExpanded ? "Logout" : undefined}
          >
            <LogOut size={18} />
            <span className="nav-label">
              {signingOut ? "Signing out..." : "Logout"}
            </span>
            <span className="nav-tooltip" aria-hidden="true">
              {signingOut ? "Signing out..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <button
          type="button"
          className="mobile-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="icon-button mobile-menu"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            aria-controls="admin-sidebar"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <PanelLeftClose size={20} /> : <Menu size={20} />}
          </button>

          <label className="global-search">
            <Search size={19} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search wallpapers, users, categories..."
              aria-label="Search admin dashboard"
            />
            <kbd>
              <Command size={11} /> K
            </kbd>
          </label>

          <div className="top-actions">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="view-website"
            >
              View website
              <ExternalLink size={15} />
            </Link>

            <button
              type="button"
              className="icon-button theme-toggle"
              aria-label="Toggle theme"
              aria-pressed={!dark}
              onClick={() => setDark((value) => !value)}
            >
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </button>

            <Link
              href="/admin/notifications"
              className="icon-button notification-button"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="notification-count">3</span>
            </Link>

            <div className="top-user">
              <div className="top-user-copy">
                <strong title={email}>{email}</strong>
                <span>Owner access</span>
              </div>
              <div className="top-avatar">{initials}</div>
              <ChevronDown size={15} className="top-chevron" />
            </div>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
