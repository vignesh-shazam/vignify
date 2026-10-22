
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  ChartNoAxesCombined,
  CheckCircle2,
  Clock3,
  Eye,
  Heart,
  Image,
  LayoutDashboard,
  Layers3,
  MessageCircle,
  PanelsTopLeft,
  Search,
  SearchCheck,
  ShieldAlert,
  ShieldCheck,
  Settings,
  Tags,
  UserRoundCheck,
  UsersRound,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  soon?: boolean;
};

const navigation: { group: string; items: NavigationItem[] }[] = [
  {
    group: "OVERVIEW",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    group: "CONTENT",
    items: [
      { label: "Wallpapers", href: "/admin/wallpapers", icon: Image },
      { label: "Categories & Tags", href: "/admin/categories", icon: Tags },
      {
        label: "Homepage & Featured",
        href: "/admin/featured",
        icon: PanelsTopLeft,
      },
      { label: "Collections", href: "/admin/collections", icon: Layers3 },
    ],
  },
  {
    group: "COMMUNITY",
    items: [
      { label: "Users & Creators", href: "/admin/users", icon: UsersRound },
      {
        label: "Reports & Moderation",
        href: "/admin/reports",
        icon: ShieldAlert,
      },
      {
        label: "Support & Feedback",
        href: "/admin/support",
        icon: MessageCircle,
      },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
    ],
  },
  {
    group: "ANALYTICS",
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
    group: "PLATFORM",
    items: [
      {
        label: "SEO & Content Pages",
        href: "/admin/seo",
        icon: SearchCheck,
        soon: true,
      },
    ],
  },
  {
    group: "SYSTEM",
    items: [
      { label: "Audit Logs", href: "/admin/audit-logs", icon: ShieldCheck },
      {
        label: "Settings & Security",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

function formatNumber(value: number | null) {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-IN", {
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

type Metric = {
  label: string;
  value: number | null;
  detail: string;
  icon: LucideIcon;
  color: string;
  trend?: string;
  trendDirection?: "up" | "down";
};

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;

  return (
    <div className="group min-w-0 rounded-xl border border-[#263537]/80 bg-[#10191B] p-3 transition duration-200 hover:border-[#B9F56B]/35 sm:p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-[11px] text-white/65 sm:text-xs">
            {metric.label}
          </p>
          <p className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
            {formatNumber(metric.value)}
          </p>
        </div>

        <div
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg sm:h-10 sm:w-10"
          style={{
            backgroundColor: `${metric.color}20`,
            color: metric.color,
          }}
        >
          <Icon size={19} strokeWidth={1.8} />
        </div>
      </div>

      <div className="mt-3 flex min-h-4 items-center justify-between gap-1">
        <p className="truncate text-[10px] text-white/40 sm:text-[11px]">
          {metric.detail}
        </p>

        {metric.trend && (
          <span
            className={`flex shrink-0 items-center text-[10px] font-medium ${
              metric.trendDirection === "down"
                ? "text-rose-400"
                : "text-green-400"
            }`}
          >
            {metric.trendDirection === "down" ? (
              <ArrowDownRight size={12} />
            ) : (
              <ArrowUpRight size={12} />
            )}
            {metric.trend}
          </span>
        )}
      </div>
    </div>
  );
}

function WallpaperViewsChart() {
  return (
    <div className="mt-5">
      <div className="relative h-[190px] w-full overflow-hidden">
        <svg
          viewBox="0 0 620 190"
          preserveAspectRatio="none"
          role="img"
          aria-label="Wallpaper views chart preview with cyan and purple lines"
          className="h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id="cyanArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#55E6DC" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#55E6DC" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[20, 58, 96, 134, 172].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="620"
              y2={y}
              stroke="#FFFFFF"
              strokeOpacity="0.075"
              strokeDasharray="3 5"
            />
          ))}

          <path
            d="M0 135 C20 127 25 151 48 137 S77 115 95 128 S124 149 145 116 S177 98 198 112 S228 133 246 91 S275 103 296 116 S326 139 347 93 S377 82 397 98 S427 120 446 86 S477 71 496 96 S525 113 545 72 S580 80 600 53 L620 39 L620 172 L0 172 Z"
            fill="url(#cyanArea)"
          />

          <path
            d="M0 135 C20 127 25 151 48 137 S77 115 95 128 S124 149 145 116 S177 98 198 112 S228 133 246 91 S275 103 296 116 S326 139 347 93 S377 82 397 98 S427 120 446 86 S477 71 496 96 S525 113 545 72 S580 80 600 53 L620 39"
            fill="none"
            stroke="#55E6DC"
            strokeWidth="2.4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          <path
            d="M0 151 C20 143 37 158 56 146 S88 137 108 148 S145 137 163 143 S194 157 217 135 S253 145 272 151 S307 143 327 150 S360 131 383 140 S417 150 436 135 S471 143 490 131 S527 145 547 123 S586 137 620 111 L620 172 L0 172 Z"
            fill="url(#purpleArea)"
          />

          <path
            d="M0 151 C20 143 37 158 56 146 S88 137 108 148 S145 137 163 143 S194 157 217 135 S253 145 272 151 S307 143 327 150 S360 131 383 140 S417 150 436 135 S471 143 490 131 S527 145 547 123 S586 137 620 111"
            fill="none"
            stroke="#A78BFA"
            strokeWidth="2.1"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          <circle cx="496" cy="96" r="4" fill="#55E6DC" />
          <circle
            cx="496"
            cy="96"
            r="8"
            fill="none"
            stroke="#55E6DC"
            strokeOpacity="0.35"
          />
        </svg>
      </div>

      <div className="mt-2 flex justify-between border-t border-white/[0.06] pt-3 text-[10px] text-white/35">
        <span>Oct 01</span>
        <span>Oct 05</span>
        <span>Oct 10</span>
        <span>Oct 15</span>
        <span>Oct 20</span>
        <span>Oct 22</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-white/55">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#55E6DC]" />
          Wallpaper views
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#A78BFA]" />
          Unique visitors
        </span>
        <span className="ml-auto text-white/30">Visual preview</span>
      </div>
    </div>
  );
}

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  // Admin role must be assigned through trusted Supabase App Metadata.
  if (user.app_metadata?.role !== "admin") {
    redirect("/home?admin_error=unauthorized");
  }

  const [
    totalResult,
    pendingResult,
    publishedResult,
    rejectedResult,
    recentResult,
  ] = await Promise.all([
    supabase.from("wallpapers").select("id", { count: "exact", head: true }),

    supabase
      .from("wallpapers")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),

    supabase
      .from("wallpapers")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),

    supabase
      .from("wallpapers")
      .select("id", { count: "exact", head: true })
      .eq("status", "rejected"),

    supabase
      .from("wallpapers")
      .select("id, title, status, created_at, creator_id")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const metrics: Metric[] = [
    {
      label: "Total Wallpapers",
      value: totalResult.error ? null : totalResult.count ?? 0,
      detail: "All submitted wallpapers",
      icon: Image,
      color: "#A855F7",
    },
    {
      label: "Pending Review",
      value: pendingResult.error ? null : pendingResult.count ?? 0,
      detail: "Awaiting moderation",
      icon: Clock3,
      color: "#F59E0B",
    },
    {
      label: "Published",
      value: publishedResult.error ? null : publishedResult.count ?? 0,
      detail: "Visible to the community",
      icon: CheckCircle2,
      color: "#22C55E",
    },
    {
      label: "Rejected",
      value: rejectedResult.error ? null : rejectedResult.count ?? 0,
      detail: "Not approved for publishing",
      icon: XCircle,
      color: "#F43F5E",
    },
    {
      label: "Total Users",
      value: null,
      detail: "User analytics not connected",
      icon: UsersRound,
      color: "#55E6DC",
    },
    {
      label: "Active Creators",
      value: null,
      detail: "Creator analytics not connected",
      icon: UserRoundCheck,
      color: "#A78BFA",
    },
    {
      label: "Total Views",
      value: null,
      detail: "View tracking not connected",
      icon: Eye,
      color: "#38BDF8",
    },
    {
      label: "Total Likes",
      value: null,
      detail: "Like tracking not connected",
      icon: Heart,
      color: "#EC4899",
    },
  ];

  const recentWallpapers = recentResult.data;
  const recentError = recentResult.error;

  return (
    <main className="min-h-screen bg-[#080B09] text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-[200px] shrink-0 border-r border-white/[0.08] bg-[#080D0D] lg:flex lg:flex-col xl:w-[220px]">
          <Link
            href="/admin"
            className="flex h-[60px] items-center gap-2.5 border-b border-white/[0.08] px-4"
          >
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#B9F56B] text-lg font-black text-[#080B09]">
              V
            </span>
            <span>
              <span className="block text-sm font-bold">Vignify</span>
              <span className="block text-[10px] text-white/50">Admin Panel</span>
            </span>
          </Link>

          <nav className="flex-1 space-y-5 overflow-y-auto px-2 py-4">
            {navigation.map((section) => (
              <section key={section.group}>
                <p className="mb-2 px-2 text-[9px] font-semibold tracking-[0.14em] text-white/40">
                  {section.group}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = item.href === "/admin";

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-8 items-center gap-2 rounded-lg px-2 text-[10px] transition ${
                          active
                            ? "bg-[#B9F56B]/10 font-semibold text-[#B9F56B]"
                            : "text-white/65 hover:bg-white/[0.04] hover:text-white"
                        }`}
                      >
                        <Icon size={14} strokeWidth={1.8} />
                        <span className="min-w-0 flex-1">{item.label}</span>
                        {item.soon && (
                          <span className="rounded bg-[#B9F56B]/15 px-1 py-0.5 text-[8px] text-[#B9F56B]">
                            Soon
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </nav>

          <div className="border-t border-white/[0.08] p-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] p-2">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#B9F56B]/15 text-xs font-bold text-[#B9F56B]">
                {(user.email?.[0] ?? "A").toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold">
                  {user.user_metadata?.full_name ||
                    user.email?.split("@")[0] ||
                    "Administrator"}
                </p>
                <p className="mt-0.5 text-[9px] text-[#B9F56B]">Owner</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[56px] items-center justify-between gap-3 border-b border-white/[0.08] bg-[#080D0D]/95 px-4 backdrop-blur-xl sm:px-5">
            <div className="flex min-w-0 max-w-[480px] flex-1 items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">
              <Search size={15} className="shrink-0 text-white/50" />
              <span className="truncate text-[10px] text-white/45">
                Search wallpapers, users, categories...
              </span>
              <span className="ml-auto hidden rounded bg-white/[0.06] px-1.5 py-1 text-[9px] text-white/45 sm:block">
                Ctrl K
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <Link
                href="/"
                aria-label="Open website"
                title="Open website"
                className="hidden rounded-lg border border-white/10 px-2.5 py-2 text-[10px] text-white/65 transition hover:border-[#B9F56B]/30 hover:text-[#B9F56B] sm:block"
              >
                View website
              </Link>
              <Link
                href="/admin/notifications"
                aria-label="Notifications"
                className="text-white/60 transition hover:text-[#B9F56B]"
              >
                <Bell size={17} />
              </Link>
              <div className="hidden text-right xl:block">
                <p className="max-w-[150px] truncate text-[10px] font-medium">
                  {user.email}
                </p>
                <p className="mt-0.5 text-[9px] text-[#B9F56B]">Owner access</p>
              </div>
              <div className="grid h-8 w-8 place-items-center rounded-full border border-[#B9F56B]/50 bg-[#B9F56B]/10 text-xs font-bold text-[#B9F56B]">
                {(user.email?.[0] ?? "A").toUpperCase()}
              </div>
            </div>
          </header>

          <div className="mx-auto max-w-[1600px] p-4 sm:p-5 lg:p-6">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-[10px] text-white/40">
                  Overview <span className="px-1.5">›</span>
                  <span className="text-[#B9F56B]">Dashboard</span>
                </p>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Dashboard
                </h1>
                <p className="mt-1 text-[11px] text-white/50 sm:text-xs">
                  Welcome back,{" "}
                  <span className="font-semibold text-[#B9F56B]">
                    {user.user_metadata?.full_name ||
                      user.email?.split("@")[0] ||
                      "Administrator"}
                  </span>
                  . Here&apos;s what&apos;s happening across Vignify.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start rounded-lg border border-white/10 bg-[#10191B] px-2.5 py-2 text-[10px] text-white/65 sm:self-auto">
                <CalendarDays size={13} />
                <span>Oct 01, 2026 – Oct 22, 2026</span>
              </div>
            </div>

            <section
              aria-label="Platform metrics"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
            >
              {metrics.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </section>

            <section className="mt-5 grid gap-4 xl:grid-cols-[1.65fr_1fr]">
              <div className="min-w-0 rounded-xl border border-[#263537]/80 bg-[#10191B] p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold">Wallpaper Views</h2>
                    <p className="mt-1 text-[10px] text-white/40">
                      Historical views and visitor activity
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-2.5 py-2 text-[10px] text-white/65"
                    aria-label="Chart date range: last 30 days"
                  >
                    Last 30 days
                    <span className="text-white/40">⌄</span>
                  </button>
                </div>

                <WallpaperViewsChart />

                <p className="mt-3 text-[10px] text-white/30">
                  Chart styling preview. Connect historical analytics to display real values.
                </p>
              </div>

              <div className="rounded-xl border border-[#263537]/80 bg-[#10191B] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold">Moderation overview</h2>
                    <p className="mt-1 text-[10px] text-white/40">
                      Current review workload
                    </p>
                  </div>
                  <ShieldCheck size={18} className="text-[#B9F56B]" />
                </div>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      label: "Pending review",
                      value: pendingResult.error
                        ? null
                        : pendingResult.count ?? 0,
                      color: "#F59E0B",
                    },
                    {
                      label: "Published",
                      value: publishedResult.error
                        ? null
                        : publishedResult.count ?? 0,
                      color: "#22C55E",
                    },
                    {
                      label: "Rejected",
                      value: rejectedResult.error
                        ? null
                        : rejectedResult.count ?? 0,
                      color: "#F43F5E",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-[10px]">
                        <span className="text-white/60">{item.label}</span>
                        <span className="font-semibold">
                          {formatNumber(item.value)}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full"
                          style={{
                            backgroundColor: item.color,
                            width:
                              item.value === null
                                ? "0%"
                                : `${Math.min(item.value, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href="/admin/wallpapers"
                  className="mt-7 flex items-center justify-center gap-2 rounded-lg bg-[#B9F56B] px-4 py-3 text-[11px] font-bold text-[#080B09] transition hover:brightness-105"
                >
                  Review wallpapers <ArrowRight size={14} />
                </Link>
              </div>
            </section>

            <section className="mt-5 overflow-hidden rounded-xl border border-[#263537]/80 bg-[#10191B]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] p-4 sm:px-5">
                <div>
                  <h2 className="text-sm font-semibold">Recent Wallpapers</h2>
                  <p className="mt-1 text-[10px] text-white/40">
                    Latest submissions in your database
                  </p>
                </div>
                <Link
                  href="/admin/wallpapers"
                  className="text-[10px] text-[#B9F56B] transition hover:text-white"
                >
                  Manage all <ArrowRight className="ml-1 inline" size={12} />
                </Link>
              </div>

              {recentError ? (
                <p className="p-5 text-xs text-amber-300">
                  Unable to load recent wallpapers. Check the admin SELECT policy and database schema.
                </p>
              ) : !recentWallpapers?.length ? (
                <p className="p-5 text-xs text-white/45">
                  No wallpaper submissions found yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[580px] text-left text-[11px]">
                    <thead className="bg-white/[0.02] text-white/40">
                      <tr>
                        <th className="px-5 py-3 font-medium">Wallpaper</th>
                        <th className="px-5 py-3 font-medium">Creator ID</th>
                        <th className="px-5 py-3 font-medium">Status</th>
                        <th className="px-5 py-3 font-medium">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentWallpapers.map((wallpaper) => (
                        <tr
                          key={wallpaper.id}
                          className="border-t border-white/[0.06] transition hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-3.5 font-medium text-white/85">
                            {wallpaper.title}
                          </td>
                          <td className="px-5 py-3.5 font-mono text-white/40">
                            {wallpaper.creator_id.slice(0, 8)}…
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`rounded-full px-2 py-1 text-[9px] font-semibold ${
                                wallpaper.status === "published"
                                  ? "bg-green-400/10 text-green-300"
                                  : wallpaper.status === "rejected"
                                    ? "bg-rose-400/10 text-rose-300"
                                    : "bg-amber-400/10 text-amber-300"
                              }`}
                            >
                              {wallpaper.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-white/45">
                            {new Date(wallpaper.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] py-4 text-[10px] text-white/30">
              <span>Vignify Admin Panel</span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#B9F56B]" />
                Authenticated admin session
              </span>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
