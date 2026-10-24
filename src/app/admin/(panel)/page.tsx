
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChartNoAxesColumnIncreasing,
  Eye,
  Heart,
  Image as ImageIcon,
  ShieldCheck,
  UsersRound,
  UserRoundCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Metric = {
  label: string;
  value: number | null;
  detail: string;
  icon: LucideIcon;
  color: string;
  glow: string;
};

type RecentWallpaper = {
  id: string;
  title: string | null;
  status: string | null;
  created_at: string | null;
  creator_id: string | null;
  image_path: string | null;
  imageUrl: string | null;
};

function formatNumber(value: number | null) {
  if (value === null) return "—";

  return new Intl.NumberFormat("en-IN", {
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function MetricCard({ metric }: { metric: Metric }) {
  const Icon = metric.icon;

  return (
    <article
      className="vignify-metric-card group relative min-w-0 overflow-hidden rounded-2xl border p-4 transition duration-300 hover:-translate-y-1 sm:p-5"
      style={{
        borderColor: `${metric.color}65`,
        background: `linear-gradient(135deg, ${metric.color}18, rgba(8,16,24,.96) 65%)`,
        boxShadow: `inset 0 1px 0 ${metric.color}20`,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full opacity-20 blur-3xl transition group-hover:opacity-40"
        style={{ background: metric.glow }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-slate-300">{metric.label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {formatNumber(metric.value)}
          </p>
        </div>

        <span
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border"
          style={{
            color: metric.color,
            borderColor: `${metric.color}80`,
            background: `${metric.color}20`,
            boxShadow: `0 0 24px ${metric.color}20`,
          }}
        >
          <Icon size={22} strokeWidth={1.8} />
        </span>
      </div>

      <p className="relative mt-4 text-[11px] text-slate-400">
        {metric.detail}
      </p>

      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(90deg, ${metric.color}, transparent)`,
        }}
      />
    </article>
  );
}

function WallpaperViewsChart() {
  return (
    <div className="mt-5">
      <div className="relative h-[250px] w-full overflow-hidden sm:h-[285px]">
        <svg
          viewBox="0 0 620 220"
          preserveAspectRatio="none"
          role="img"
          aria-label="Illustrative wallpaper views chart preview"
          className="h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id="vignifyCyanArea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#25e7df" stopOpacity=".3" />
              <stop offset="100%" stopColor="#25e7df" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id="vignifyPurpleArea"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#b16cff" stopOpacity=".23" />
              <stop offset="100%" stopColor="#b16cff" stopOpacity="0" />
            </linearGradient>

            <filter
              id="vignifyCyanGlow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[24, 65, 106, 147, 188].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="620"
              y2={y}
              stroke="#cbd5e1"
              strokeOpacity=".12"
              strokeDasharray="3 6"
            />
          ))}

          {[0, 124, 248, 372, 496, 620].map((x) => (
            <line
              key={x}
              x1={x}
              y1="15"
              x2={x}
              y2="188"
              stroke="#cbd5e1"
              strokeOpacity=".07"
            />
          ))}

          <path
            d="M0 151 C24 135 34 171 60 151 S94 121 120 143 S153 164 180 126 S216 103 242 124 S272 157 298 94 S333 124 359 140 S390 159 416 104 S451 84 478 111 S510 142 536 82 S573 91 596 58 L620 38 L620 188 L0 188 Z"
            fill="url(#vignifyCyanArea)"
          />

          <path
            d="M0 151 C24 135 34 171 60 151 S94 121 120 143 S153 164 180 126 S216 103 242 124 S272 157 298 94 S333 124 359 140 S390 159 416 104 S451 84 478 111 S510 142 536 82 S573 91 596 58 L620 38"
            fill="none"
            stroke="#25e7df"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#vignifyCyanGlow)"
            vectorEffect="non-scaling-stroke"
          />

          <path
            d="M0 169 C25 153 42 179 65 163 S101 146 127 166 S163 153 188 163 S223 179 249 150 S285 161 310 168 S345 154 370 164 S404 143 430 153 S464 169 490 147 S524 160 550 135 S589 151 620 119 L620 188 L0 188 Z"
            fill="url(#vignifyPurpleArea)"
          />

          <path
            d="M0 169 C25 153 42 179 65 163 S101 146 127 166 S163 153 188 163 S223 179 249 150 S285 161 310 168 S345 154 370 164 S404 143 430 153 S464 169 490 147 S524 160 550 135 S589 151 620 119"
            fill="none"
            stroke="#b16cff"
            strokeWidth="2.2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          <line
            x1="478"
            y1="22"
            x2="478"
            y2="188"
            stroke="#25e7df"
            strokeOpacity=".45"
            strokeDasharray="3 4"
          />

          <circle cx="478" cy="111" r="5" fill="#25e7df" />
          <circle
            cx="478"
            cy="111"
            r="11"
            fill="none"
            stroke="#25e7df"
            strokeOpacity=".38"
          />
        </svg>
      </div>

      <div className="mt-2 flex justify-between border-t border-white/[0.07] pt-3 text-[10px] text-slate-500">
        <span>Oct 01</span>
        <span>Oct 05</span>
        <span>Oct 10</span>
        <span>Oct 15</span>
        <span>Oct 20</span>
        <span>Oct 22</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-slate-300">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#25e7df]" />
          Wallpaper views
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#b16cff]" />
          Unique visitors
        </span>

        <span className="ml-auto text-slate-500">Visual preview</span>
      </div>

      <p className="mt-3 text-[10px] text-slate-500">
        Chart styling preview. Connect historical analytics to display real
        values.
      </p>
    </div>
  );
}

function WallpaperThumbnail({
  imageUrl,
  title,
}: {
  imageUrl: string | null;
  title: string;
}) {
  return (
    <span className="relative block h-10 w-14 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-slate-900 shadow-lg sm:h-11 sm:w-[58px]">
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 hover:scale-110"
        />
      ) : (
        <span
          aria-label="Image preview unavailable"
          className="absolute inset-0 grid place-items-center text-center text-[9px] text-slate-400"
        >
          No preview
        </span>
      )}
    </span>
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
    supabase.from("wallpapers").select("id", {
      count: "exact",
      head: true,
    }),
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
      .select("id, title, status, created_at, creator_id, image_path")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const metrics: Metric[] = [
    {
      label: "Total Users",
      value: null,
      detail: "User analytics not connected",
      icon: UsersRound,
      color: "#25e7df",
      glow: "#00e5c3",
    },
    {
      label: "Active Creators",
      value: null,
      detail: "Creator analytics not connected",
      icon: UserRoundCheck,
      color: "#a879ff",
      glow: "#8b5cf6",
    },
    {
      label: "Total Views",
      value: null,
      detail: "View tracking not connected",
      icon: Eye,
      color: "#00d9ff",
      glow: "#00d9ff",
    },
    {
      label: "Total Likes",
      value: null,
      detail: "Like tracking not connected",
      icon: Heart,
      color: "#ff4fa3",
      glow: "#ff1684",
    },
  ];

  const moderation = [
    {
      label: "Pending review",
      value: pendingResult.error ? null : pendingResult.count ?? 0,
      color: "#fbbf24",
    },
    {
      label: "Published",
      value: publishedResult.error ? null : publishedResult.count ?? 0,
      color: "#43e982",
    },
    {
      label: "Rejected",
      value: rejectedResult.error ? null : rejectedResult.count ?? 0,
      color: "#ff3e7f",
    },
  ];

  const recentError = recentResult.error;

  // Generate short-lived URLs for the images in the private Storage bucket.
  const recentWallpapers: RecentWallpaper[] = await Promise.all(
    (recentResult.data ?? []).map(async (wallpaper) => {
      let imageUrl: string | null = null;

      if (wallpaper.image_path) {
        const { data, error } = await supabase.storage
          .from("wallpapers")
          .createSignedUrl(wallpaper.image_path, 600);

        if (!error) {
          imageUrl = data.signedUrl;
        }
      }

      return {
        ...wallpaper,
        imageUrl,
      };
    }),
  );

  return (

<main className="vignify-dashboard relative min-h-screen overflow-hidden bg-transparent text-white">

      <div
        aria-hidden="true"
        className="vignify-ambient vignify-ambient-green"
      />
      <div
        aria-hidden="true"
        className="vignify-ambient vignify-ambient-purple"
      />
      <div
        aria-hidden="true"
        className="vignify-ambient vignify-ambient-cyan"
      />
      <div
        aria-hidden="true"
        className="vignify-particle vignify-particle-one"
      />
      <div
        aria-hidden="true"
        className="vignify-particle vignify-particle-two"
      />
      <div
        aria-hidden="true"
        className="vignify-particle vignify-particle-three"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1800px] px-3 py-3 sm:px-5 sm:py-4 lg:px-6">
        <section
          aria-label="Platform analytics"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4"
        >
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[1.8fr_0.9fr]">
          <article className="vignify-glass-panel min-w-0 rounded-2xl border border-emerald-300/25 p-4 sm:p-5 lg:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-400/10 text-[#b9f56b]">
                  <ChartNoAxesColumnIncreasing size={22} />
                </span>

                <div>
                  <h2 className="text-base font-bold">Wallpaper Views</h2>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Historical views and visitor activity
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3 py-2.5 text-xs text-slate-200">
                <CalendarDays size={15} />
                Last 30 days
                <span className="text-slate-500">⌄</span>
              </div>
            </div>

            <WallpaperViewsChart />
          </article>

          <article className="vignify-glass-panel rounded-2xl border border-emerald-300/30 p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-lime-300/20 bg-lime-400/10 text-[#b9f56b]">
                  <ShieldCheck size={22} />
                </span>

                <div>
                  <h2 className="text-base font-bold">
                    Moderation overview
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Current review workload
                  </p>
                </div>
              </div>

              <ShieldCheck size={21} className="text-[#b9f56b]" />
            </div>

            <div className="mt-7 space-y-6">
              {moderation.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="text-slate-300">{item.label}</span>
                    <span className="font-bold text-white">
                      {formatNumber(item.value)}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-700/50">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        background: `linear-gradient(90deg, ${item.color}, ${item.color}aa)`,
                        width:
                          item.value === null
                            ? "0%"
                            : item.value === 0
                              ? "0%"
                              : `${Math.max(6, Math.min(item.value, 100))}%`,
                        boxShadow: `0 0 12px ${item.color}55`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/admin/wallpapers"
              className="mt-8 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#b9f56b] px-4 py-3 text-sm font-bold text-[#081006] shadow-[0_0_30px_rgba(185,245,107,0.16)] transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Review wallpapers <ArrowRight size={17} />
            </Link>

            <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500">
              <ImageIcon size={13} />
              Total wallpapers:{" "}
              {formatNumber(
                totalResult.error ? null : totalResult.count ?? 0,
              )}
            </div>
          </article>
        </section>

        <section className="vignify-glass-panel mt-4 overflow-hidden rounded-2xl border border-emerald-300/25">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] p-4 sm:px-5 sm:py-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-lime-300/20 bg-lime-400/10 text-[#b9f56b]">
                <ImageIcon size={21} />
              </span>

              <div>
                <h2 className="text-base font-bold">Recent Wallpapers</h2>
                <p className="mt-1 text-[11px] text-slate-400">
                  Latest submissions in your database
                </p>
              </div>
            </div>

            <Link
              href="/admin/wallpapers"
              className="flex items-center gap-2 text-xs font-semibold text-cyan-300 transition hover:text-white"
            >
              Manage all <ArrowRight size={15} />
            </Link>
          </div>

          {recentError ? (
            <p className="p-5 text-xs text-amber-300">
              Unable to load recent wallpapers. Check the admin SELECT policy
              and database schema.
            </p>
          ) : !recentWallpapers.length ? (
            <p className="p-5 text-xs text-slate-400">
              No wallpaper submissions found yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-xs">
                <thead className="bg-white/[0.035] text-slate-300">
                  <tr>
                    <th className="px-5 py-3.5 font-medium">Wallpaper</th>
                    <th className="px-5 py-3.5 font-medium">Creator ID</th>
                    <th className="px-5 py-3.5 font-medium">Status</th>
                    <th className="px-5 py-3.5 font-medium">Submitted</th>
                    <th className="px-5 py-3.5 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentWallpapers.map((wallpaper) => {
                    const status = (
                      wallpaper.status ?? "pending"
                    ).toLowerCase();

                    const statusClass =
                      status === "published"
                        ? "border-green-400/30 bg-green-400/10 text-green-300"
                        : status === "rejected"
                          ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
                          : "border-amber-400/30 bg-amber-400/10 text-amber-300";

                    return (
                      <tr
                        key={wallpaper.id}
                        className="border-t border-white/[0.07] transition hover:bg-white/[0.025]"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <WallpaperThumbnail
                              imageUrl={wallpaper.imageUrl}
                              title={wallpaper.title || "Untitled wallpaper"}
                            />

                            <span className="max-w-[240px] truncate font-semibold text-slate-100">
                              {wallpaper.title || "Untitled wallpaper"}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-3 font-mono text-slate-400">
                          {wallpaper.creator_id
                            ? `${wallpaper.creator_id.slice(0, 8)}…`
                            : "—"}
                        </td>

                        <td className="px-5 py-3">
                          <span
                            className={`inline-flex rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold capitalize ${statusClass}`}
                          >
                            {status}
                          </span>
                        </td>

                        <td className="px-5 py-3 text-slate-400">
                          {wallpaper.created_at
                            ? new Date(
                                wallpaper.created_at,
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </td>

                        <td className="px-5 py-3">
                          <div className="flex justify-end gap-2">
                            <Link
                              href="/admin/wallpapers"
                              aria-label={`View ${wallpaper.title || "wallpaper"}`}
                              title="View wallpaper"
                              className="grid h-9 w-9 place-items-center rounded-lg border border-cyan-300/20 bg-cyan-400/[0.07] text-cyan-200 transition hover:bg-cyan-400/15"
                            >
                              <Eye size={16} />
                            </Link>

                            {status === "pending" ? (
                              <Link
                                href="/admin/wallpapers"
                                aria-label={`Review ${wallpaper.title || "wallpaper"}`}
                                title="Review wallpaper"
                                className="grid h-9 w-9 place-items-center rounded-lg border border-green-400/20 bg-green-400/[0.07] text-green-300 transition hover:bg-green-400/15"
                              >
                                <CheckCircle2 size={16} />
                              </Link>
                            ) : status === "rejected" ? (
                              <span
                                title="Wallpaper rejected"
                                className="grid h-9 w-9 place-items-center rounded-lg border border-rose-400/20 bg-rose-400/[0.07] text-rose-300"
                              >
                                <XCircle size={16} />
                              </span>
                            ) : (
                              <span
                                title="Wallpaper published"
                                className="grid h-9 w-9 place-items-center rounded-lg border border-green-400/20 bg-green-400/[0.07] text-green-300"
                              >
                                <CheckCircle2 size={16} />
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] py-4 text-[10px] text-slate-500">
          <span>Vignify Admin Panel</span>

          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#b9f56b] shadow-[0_0_10px_rgba(185,245,107,.6)]" />
            Authenticated admin session
          </span>
        </footer>
      </div>
    </main>
  );
}
