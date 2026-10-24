
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  SlidersHorizontal,
  Download,
  Image as ImageIcon,
  Clock3,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Heart,
  ArrowUpRight,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { WallpaperModerationActions } from "@/components/admin/wallpaper-moderation-actions";

type WallpaperStatus = "pending" | "published" | "rejected";

type Wallpaper = {
  id: string;
  title: string;
  description: string | null;
  image_path: string;
  status: WallpaperStatus;
  created_at: string;
  creator_id: string;
};

type SearchParams = Promise<{
  q?: string;
  status?: string;
}>;

const tabs = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Published", value: "published" },
  { label: "Rejected", value: "rejected" },
  { label: "Deleted", value: "deleted" },
] as const;

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "border-amber-400/20 bg-amber-400/10 text-amber-300",
    published: "border-lime-300/20 bg-lime-300/10 text-[#B9F56B]",
    rejected: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    deleted: "border-white/10 bg-white/5 text-white/50",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${styles[status] ?? styles.pending
        }`}
    >
      {status}
    </span>
  );
}

export default async function AdminWallpapersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const activeStatus = tabs.some((tab) => tab.value === params.status)
    ? params.status!
    : "all";

  const supabase = await createClient();

  // Authenticate the current user on the server.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  // Admin access must come from trusted Supabase App Metadata.
  if (user.app_metadata?.role !== "admin") {
    redirect("/home?admin_error=unauthorized");
  }

  // Load wallpapers using the authenticated Supabase client.
  const { data: wallpaperData, error } = await supabase
    .from("wallpapers")
    .select(
      "id, title, description, image_path, status, created_at, creator_id",
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin wallpaper query failed:", error.message);
  }

  const wallpapers = (wallpaperData ?? []) as Wallpaper[];

  // Search and status filtering are applied to the loaded results.
  const filteredWallpapers = wallpapers.filter((wallpaper) => {
    const normalizedQuery = query.toLowerCase();

    const matchesSearch =
      !normalizedQuery ||
      (wallpaper.title ?? "").toLowerCase().includes(normalizedQuery) ||
      wallpaper.id.toLowerCase().includes(normalizedQuery) ||
      wallpaper.creator_id.toLowerCase().includes(normalizedQuery);

    const matchesStatus =
      activeStatus === "all" || wallpaper.status === activeStatus;

    return matchesSearch && matchesStatus;
  });

  const counts = {
    all: wallpapers.length,
    pending: wallpapers.filter((item) => item.status === "pending").length,
    published: wallpapers.filter((item) => item.status === "published").length,
    rejected: wallpapers.filter((item) => item.status === "rejected").length,
    // Soft deletion is not implemented in the current database schema.
    deleted: 0,
  };

  const stats = [
    {
      label: "Total Wallpapers",
      value: counts.all,
      icon: ImageIcon,
      iconClass: "text-cyan-300 bg-cyan-300/10",
    },
    {
      label: "Pending Review",
      value: counts.pending,
      icon: Clock3,
      iconClass: "text-amber-300 bg-amber-300/10",
    },
    {
      label: "Published",
      value: counts.published,
      icon: CheckCircle2,
      iconClass: "text-[#B9F56B] bg-[#B9F56B]/10",
    },
    {
      label: "Rejected",
      value: counts.rejected,
      icon: XCircle,
      iconClass: "text-rose-300 bg-rose-300/10",
    },
  ];

  return (
    <main className="min-h-screen bg-transparent text-[#F5F7F6]">
      <div className="mx-auto max-w-[1600px] space-y-8 p-5 sm:p-8">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="mb-2 text-sm text-[#55E6DC]">
              Admin / Content Management
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              All Wallpapers
            </h1>

            <p className="mt-2 text-sm text-[#87969A]">
              Review, manage, and moderate creator submissions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              disabled
              title="Export functionality will be added in a later milestone"
              className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-[#263537] px-4 py-2.5 text-sm text-white/40"
            >
              <Download size={16} />
              Export
            </button>

            <Link
              href="/creator/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-[#B9F56B] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#cbff8c]"
            >
              <ImageIcon size={16} />
              Upload Wallpaper
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </header>

        {/* Database error */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-rose-400/20 bg-rose-400/5 p-4 text-sm text-rose-200"
          >
            Could not load wallpapers. Check your Supabase admin SELECT
            policy, database permissions, and schema.
          </div>
        )}

        {/* Overview statistics */}
        <section
          aria-label="Wallpaper statistics"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-[#263537] bg-[#10191B] p-5 transition hover:border-[#55E6DC]/25"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-[#87969A]">{stat.label}</p>

                    <p className="mt-3 text-3xl font-semibold tabular-nums">
                      {stat.value.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <span className={`rounded-xl p-3 ${stat.iconClass}`}>
                    <Icon size={20} />
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        {/* Tabs, search, and results */}
        <section className="space-y-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <nav
              className="flex gap-2 overflow-x-auto pb-1"
              aria-label="Filter wallpapers by status"
            >
              {tabs.map((tab) => {
                const isActive = activeStatus === tab.value;
                const count = counts[tab.value];

                return (
                  <Link
                    key={tab.value}
                    href={
                      tab.value === "all"
                        ? "/admin/wallpapers"
                        : `/admin/wallpapers?status=${tab.value}`
                    }
                    aria-current={isActive ? "page" : undefined}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition ${isActive
                        ? "border-[#B9F56B]/30 bg-[#B9F56B]/10 text-[#B9F56B]"
                        : "border-[#263537] text-[#87969A] hover:border-[#55E6DC]/40 hover:text-white"
                      }`}
                  >
                    {tab.label}
                    <span className="text-xs opacity-75">{count}</span>
                  </Link>
                );
              })}
            </nav>

            <form
              action="/admin/wallpapers"
              method="GET"
              className="flex flex-col gap-3 sm:flex-row"
            >
              {activeStatus !== "all" && (
                <input
                  type="hidden"
                  name="status"
                  value={activeStatus}
                />
              )}

              <label className="flex min-w-0 items-center gap-2 rounded-xl border border-[#263537] bg-[#10191B] px-3.5 sm:min-w-70">
                <Search
                  size={17}
                  aria-hidden="true"
                  className="shrink-0 text-[#87969A]"
                />

                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Search title, ID, creator..."
                  aria-label="Search wallpapers"
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#68777A]"
                />
              </label>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#263537] px-4 py-3 text-sm text-white/80 transition hover:border-[#55E6DC]/50 hover:text-white"
              >
                <SlidersHorizontal size={16} />
                Search
              </button>
            </form>
          </div>

          {/* Empty state */}
          {filteredWallpapers.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#263537] bg-[#10191B]/60 px-6 py-16 text-center">
              <ImageIcon
                size={32}
                aria-hidden="true"
                className="mx-auto text-[#68777A]"
              />

              <h2 className="mt-4 text-lg font-medium">
                No wallpapers found
              </h2>

              <p className="mt-2 text-sm text-[#87969A]">
                {error
                  ? "Resolve the database error to load wallpaper records."
                  : query
                    ? "Try a different search term."
                    : activeStatus === "deleted"
                      ? "Soft-delete and recovery support has not been implemented yet."
                      : "Wallpapers matching this status will appear here."}
              </p>

              {(query || activeStatus !== "all") && (
                <Link
                  href="/admin/wallpapers"
                  className="mt-5 inline-flex rounded-lg border border-[#263537] px-4 py-2 text-sm text-white/80 transition hover:border-[#55E6DC]/50 hover:text-white"
                >
                  Clear filters
                </Link>
              )}
            </div>
          ) : (
            /* Wallpaper cards */
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {filteredWallpapers.map((wallpaper) => (
                <article
                  key={wallpaper.id}
                  className="group overflow-hidden rounded-2xl border border-[#263537] bg-[#10191B] transition hover:border-[#55E6DC]/40"
                >
                  {/* Image preview */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#172123]">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 flex items-center justify-center text-[#68777A]"
                    >
                      <ImageIcon size={34} />
                    </div>

                    <Image
                      src={`/api/wallpapers/${wallpaper.id}/image`}
                      alt={wallpaper.title || "Wallpaper preview"}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute left-3 top-3 z-10">
                      <StatusBadge status={wallpaper.status} />
                    </div>
                  </div>

                  {/* Wallpaper metadata */}
                  <div className="space-y-4 p-4">
                    <div className="min-w-0">
                      <h2 className="truncate font-medium">
                        {wallpaper.title || "Untitled wallpaper"}
                      </h2>

                      <p className="mt-1 truncate text-xs text-[#87969A]">
                        Creator ID: {wallpaper.creator_id}
                      </p>
                    </div>

                    {wallpaper.description && (
                      <p className="line-clamp-2 text-sm leading-6 text-[#87969A]">
                        {wallpaper.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between gap-2 border-t border-[#263537] pt-3 text-xs text-[#87969A]">
                      <span>{formatDate(wallpaper.created_at)}</span>

                      <span className="flex items-center gap-1.5">
                        <Eye size={14} aria-hidden="true" />
                        <span title="View analytics not connected">—</span>

                        <Heart
                          size={14}
                          aria-hidden="true"
                          className="ml-2"
                        />
                        <span title="Like analytics not connected">—</span>
                      </span>
                    </div>

                    {/* Moderation actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      {wallpaper.status === "pending" && (
                        <WallpaperModerationActions
                          wallpaperId={wallpaper.id}
                          wallpaperTitle={
                            wallpaper.title || "Untitled wallpaper"
                          }
                        />
                      )}

                      <Link
                        href={`/admin/wallpapers/${wallpaper.id}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#263537] px-3 py-2 text-xs text-white/75 transition hover:border-[#55E6DC]/40 hover:text-white"
                      >
                        <Eye size={14} />
                        Details
                      </Link>

                      <button
                        type="button"
                        disabled
                        title="Audited soft-delete support is not implemented yet"
                        aria-label={`Delete ${wallpaper.title || "wallpaper"} (not available yet)`}
                        className="inline-flex cursor-not-allowed items-center rounded-lg border border-[#263537] px-3 py-2 text-[#68777A]"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Results summary */}
        <footer className="text-xs text-[#68777A]">
          Showing {filteredWallpapers.length.toLocaleString("en-IN")} of{" "}
          {wallpapers.length.toLocaleString("en-IN")} wallpapers
        </footer>
      </div>
    </main>
  );
}
