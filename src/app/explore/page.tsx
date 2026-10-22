"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense,useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { customizationItems, formatPrice } from "@/lib/mock-data";

const categories = [
  "All",
  "Wallpapers",
  "Icon Packs",
  "Themes",
  "Widgets",
  "Setups",
];

const styles = ["All styles", "Minimal", "Nature", "AMOLED", "Dark"];
const prices = ["All", "Free", "Paid"];

const sortOptions = [
  "Featured",
  "Title A–Z",
  "Price: low to high",
  "Price: high to low",
];

const validSorts = [
  "featured",
  "title-az",
  "price-low",
  "price-high",
] as const;

type SortValue = (typeof validSorts)[number];

const sortToLabel: Record<SortValue, string> = {
  featured: "Featured",
  "title-az": "Title A–Z",
  "price-low": "Price: low to high",
  "price-high": "Price: high to low",
};

const labelToSort: Record<string, SortValue> = {
  Featured: "featured",
  "Title A–Z": "title-az",
  "Price: low to high": "price-low",
  "Price: high to low": "price-high",
};

function Brand() {
  return (
    <Link
      href="/"
      aria-label="Vignify home"
      className="inline-flex items-center gap-2.5"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B9F56B] text-lg font-black text-[#10160b] transition-transform duration-300 hover:rotate-[-8deg]">
        V
      </span>
      <span className="text-xl font-bold tracking-tight">
        vignify<span className="text-[#B9F56B]">\</span>
      </span>
    </Link>
  );
}

function isValidCategory(value: string | null): boolean {
  return categories.includes(value ?? "");
}

function isValidStyle(value: string | null): boolean {
  return styles.includes(value ?? "");
}

function isValidPrice(value: string | null): boolean {
  return prices.includes(value ?? "");
}

function getSortLabel(value: string | null): string {
  if (value && validSorts.includes(value as SortValue)) {
    return sortToLabel[value as SortValue];
  }

  return "Featured";
}

function ExploreContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // The URL is the source of truth for filters.
  const categoryParam = searchParams.get("category");
  const styleParam = searchParams.get("style");
  const priceParam = searchParams.get("price");
  const sortParam = searchParams.get("sort");

  const category = isValidCategory(categoryParam)
    ? categoryParam!
    : "All";

  const style = isValidStyle(styleParam)
    ? styleParam!
    : "All styles";

  const price = isValidPrice(priceParam)
    ? priceParam!
    : "All";

  const sort = getSortLabel(sortParam);

  // Search remains local while the user types.
  const [search, setSearch] = useState(searchParams.get("q") ?? "");

  // Keep the search input synchronized with browser Back/Forward navigation.
  useEffect(() => {
    function handlePopState() {
      setSearch(new URLSearchParams(window.location.search).get("q") ?? "");
    }

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const updateUrl = useCallback(
    (
      next: {
        q?: string;
        category?: string;
        style?: string;
        price?: string;
        sort?: string;
      },
      replace = false
    ) => {
      const params = new URLSearchParams();

      if (next.q?.trim()) {
        params.set("q", next.q.trim());
      }

      if (next.category && next.category !== "All") {
        params.set("category", next.category);
      }

      if (next.style && next.style !== "All styles") {
        params.set("style", next.style);
      }

      if (next.price && next.price !== "All") {
        params.set("price", next.price);
      }

      const sortValue = labelToSort[next.sort ?? "Featured"];

      if (sortValue && sortValue !== "featured") {
        params.set("sort", sortValue);
      }

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      if (replace) {
        router.replace(url, { scroll: false });
      } else {
        router.push(url, { scroll: false });
      }
    },
    [pathname, router]
  );

  // Debounce search updates so typing does not create history entries
  // for every character.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      updateUrl(
        {
          q: search,
          category,
          style,
          price,
          sort,
        },
        true
      );
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search, category, style, price, sort, updateUrl]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = customizationItems.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.creator.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.tags.some((tag) => tag.toLowerCase().includes(query));

      const matchesCategory =
        category === "All" || item.category === category;

      const matchesStyle =
        style === "All styles" || item.style === style;

      const matchesPrice =
        price === "All" ||
        (price === "Free" && item.price === 0) ||
        (price === "Paid" && item.price > 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStyle &&
        matchesPrice
      );
    });

    switch (sort) {
      case "Title A–Z":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;

      case "Price: low to high":
        result.sort(
          (a, b) =>
            a.price - b.price || a.title.localeCompare(b.title)
        );
        break;

      case "Price: high to low":
        result.sort(
          (a, b) =>
            b.price - a.price || a.title.localeCompare(b.title)
        );
        break;
    }

    return result;
  }, [search, category, style, price, sort]);

  function resetFilters() {
    setSearch("");
    router.push(pathname, { scroll: false });
  }

  function selectCategory(value: string) {
    if (value === "All") {
      router.push("/explore", { scroll: false });
      return;
    }

    const categorySlugs: Record<string, string> = {
      Wallpapers: "wallpapers",
      "Icon Packs": "icon-packs",
      Themes: "themes",
      Widgets: "widgets",
      Setups: "setups",
    };

    const slug = categorySlugs[value];

    if (slug) {
      router.push(`/explore/${slug}`);
    }
  }

  function selectStyle(value: string) {
    updateUrl({
      q: search,
      category,
      style: value,
      price,
      sort,
    });
  }

  function selectPrice(value: string) {
    updateUrl({
      q: search,
      category,
      style,
      price: value,
      sort,
    });
  }

  function selectSort(value: string) {
    updateUrl({
      q: search,
      category,
      style,
      price,
      sort: value,
    });
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <div className="vignify-glow -left-40 top-40 z-[-1] h-96 w-96 bg-[#B9F56B]" />

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b09]/90 backdrop-blur-xl">
        <div className="container-vignify flex min-h-18 items-center justify-between gap-4">
          <Brand />

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-6 md:flex"
          >
            <Link href="/explore" className="text-sm text-[#B9F56B]">
              Explore
            </Link>

            <Link
              href="/explore?sort=price-high"
              className="text-sm text-white/55 transition-colors hover:text-[#B9F56B]"
            >
              Trending
            </Link>
          </nav>

          <Link href="/" className="vignify-interactive">
            <span className="vignify-button-icon">←</span>
            Back to home
          </Link>
        </div>
      </header>

      <section className="container-vignify relative z-10 py-12 sm:py-16">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-[#B9F56B] uppercase">
            THE DISCOVERY FEED
          </p>

          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Explore your <span className="text-gradient">next vibe.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
            Browse wallpapers, icon packs, themes, widgets, and complete
            Android setups. Find the style that feels like you.
          </p>
        </div>

        <div className="surface-card mb-8 space-y-5 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="explore-search" className="sr-only">
              Search customizations
            </label>

            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4">
              <span aria-hidden="true" className="text-xl text-white/40">
                ⌕
              </span>

              <input
                id="explore-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search wallpapers, creators, tags..."
                className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-white/35"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="text-sm text-white/45 transition-colors hover:text-[#B9F56B]"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="vignify-interactive"
            >
              Reset filters
            </button>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium text-white/45">
              CATEGORY
            </p>

            <div className="flex flex-wrap gap-2">
              {categories.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => selectCategory(value)}
                  aria-pressed={category === value}
                  className={`vignify-chip ${
                    category === value ? "vignify-chip-active" : ""
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="style-filter"
                className="mb-2 block text-xs font-medium text-white/45"
              >
                AESTHETIC
              </label>

              <select
                id="style-filter"
                value={style}
                onChange={(event) => selectStyle(event.target.value)}
                className="vignify-input"
              >
                {styles.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="price-filter"
                className="mb-2 block text-xs font-medium text-white/45"
              >
                PRICE
              </label>

              <select
                id="price-filter"
                value={price}
                onChange={(event) => selectPrice(event.target.value)}
                className="vignify-input"
              >
                {prices.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="sort-filter"
                className="mb-2 block text-xs font-medium text-white/45"
              >
                SORT BY
              </label>

              <select
                id="sort-filter"
                value={sort}
                onChange={(event) => selectSort(event.target.value)}
                className="vignify-input"
              >
                {sortOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-white/55">
            <span className="font-semibold text-white">
              {filteredItems.length}
            </span>{" "}
            {filteredItems.length === 1 ? "result" : "results"}
          </p>

          <p className="hidden text-xs text-white/35 sm:block">
            Mock content for MVP development
          </p>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                href={`/item/${item.id}`}
                className="vignify-card group"
              >
                <div className="relative aspect-3/4 overflow-hidden bg-[#151a15]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/10" />

                  <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] text-white/85 backdrop-blur-md">
                    {item.category}
                  </span>

                  <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold backdrop-blur-md">
                    {item.price === 0 ? (
                      <span className="text-[#B9F56B]">Free</span>
                    ) : (
                      formatPrice(item.price)
                    )}
                  </span>
                </div>

                <div className="p-3.5 sm:p-4">
                  <h2 className="truncate text-sm font-semibold transition-colors group-hover:text-[#B9F56B]">
                    {item.title}
                  </h2>

                  <p className="mt-1 truncate text-xs text-white/45">
                    by {item.creator}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-white/50">
                      {item.style}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="surface-card flex min-h-72 flex-col items-center justify-center px-5 py-12 text-center">
            <span className="text-4xl text-white/30">⌕</span>

            <h2 className="mt-4 text-xl font-semibold">Nothing found yet</h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
              Try a different search term or remove one of your filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="vignify-interactive vignify-button-primary mt-6"
            >
              Clear all filters{" "}
              <span className="vignify-button-icon-right">↗</span>
            </button>
          </div>
        )}
      </section>

      <footer className="relative z-10 border-t border-white/8">
        <div className="container-vignify flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <Brand />

          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Vignify Discover your next vibe.
          </p>
        </div>
      </footer>
    </main>
  );
}
export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <main className="relative isolate min-h-screen overflow-hidden">
          <div className="container-vignify py-16">
            <p className="text-sm text-white/50">
              Loading explore...
            </p>
          </div>
        </main>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}