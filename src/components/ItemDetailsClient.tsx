"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import {
  formatPrice,
  getRelatedCustomizations,
  type CustomizationItem,
} from "@/lib/mock-data";

type Props = {
  item: CustomizationItem;
};

const FAVORITES_KEY = "vignify-favorites";
const FAVORITES_EVENT = "vignify-favorites-updated";

function readFavorites(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value: unknown = JSON.parse(
      window.localStorage.getItem(FAVORITES_KEY) ?? "[]",
    );

    return Array.isArray(value)
      ? value.filter((id): id is string => typeof id === "string")
      : [];
  } catch {
    return [];
  }
}

function subscribeFavorites(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(FAVORITES_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(FAVORITES_EVENT, callback);
  };
}

function getServerFavorites(): string[] {
  return [];
}

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
        vignify<span className="text-[#B9F56B]"></span>
      </span>
    </Link>
  );
}

export default function ItemDetailsClient({ item }: Props) {
  const [notice, setNotice] = useState("");

  const favorites = useSyncExternalStore(
    subscribeFavorites,
    readFavorites,
    getServerFavorites,
  );

  const isFavorite = favorites.includes(item.id);
  const relatedItems = getRelatedCustomizations(item, 4);

  function toggleFavorite() {
    try {
      const currentFavorites = readFavorites();
      const currentlyFavorite = currentFavorites.includes(item.id);

      const updatedFavorites = currentlyFavorite
        ? currentFavorites.filter((id) => id !== item.id)
        : [...new Set([...currentFavorites, item.id])];

      window.localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updatedFavorites),
      );

      window.dispatchEvent(new Event(FAVORITES_EVENT));

      setNotice(
        currentlyFavorite
          ? "Removed from your favorites."
          : "Added to your favorites.",
      );
    } catch {
      setNotice("Favorites could not be saved in this browser.");
    }
  }

  function handleDownload() {
    setNotice(
      "Demo only: a real download will be enabled when asset files and download APIs are connected.",
    );
  }

  function handlePurchase() {
    setNotice(
      "Purchase preview only. Checkout will be connected in the monetization milestone.",
    );
  }

  async function handleShare() {
    const url = window.location.href;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({
          title: item.title,
          text: `Check out ${item.title} on Vignify.`,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);
      setNotice("Item link copied to clipboard.");
    } catch {
      setNotice("Sharing was cancelled or is unavailable in this browser.");
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <div className="vignify-glow left-[-180px] top-40 z-[-1] h-96 w-96 bg-[#B9F56B]" />
      <div className="vignify-glow right-[-180px] top-[600px] z-[-1] h-96 w-96 bg-[#55E6DC]" />

      <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b09]/90 backdrop-blur-xl">
        <div className="container-vignify flex min-h-[72px] items-center justify-between gap-4">
          <Brand />

          <Link href="/explore" className="vignify-interactive">
            <span className="vignify-button-icon">←</span>
            Back to Explore
          </Link>
        </div>
      </header>

      <section className="container-vignify relative z-10 py-8 sm:py-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-7 flex flex-wrap items-center gap-2 text-xs text-white/40"
        >
          <Link href="/" className="transition-colors hover:text-[#B9F56B]">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/explore"
            className="transition-colors hover:text-[#B9F56B]"
          >
            Explore
          </Link>
          <span>/</span>
          <span className="text-white/70">{item.title}</span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(340px,0.9fr)] lg:gap-12">
          <div>
            <div className="surface-card relative overflow-hidden p-2 sm:p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#121812] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />

                <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-[10px] font-medium text-white/85 backdrop-blur-md">
                  {item.category}
                </span>

                <span className="absolute bottom-4 right-4 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-semibold text-[#B9F56B] backdrop-blur-md">
                  {formatPrice(item.price)}
                </span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/55"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-[#B9F56B] uppercase">
              DISCOVER YOUR NEXT VIBE
            </p>

            <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              {item.title}
            </h1>

            <p className="mt-3 text-sm text-white/50">
              Created by{" "}
              <span className="font-medium text-white/80">{item.creator}</span>
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/65">
                {item.category}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/65">
                {item.style}
              </span>
            </div>

            <p className="mt-7 text-sm leading-7 text-white/60">
              {item.description}
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
              <p className="text-xs text-white/45">ITEM PRICE</p>

              <div className="mt-2 flex items-end justify-between gap-4">
                <p className="text-3xl font-semibold tracking-tight">
                  {formatPrice(item.price)}
                </p>
                <span className="pb-1 text-xs text-white/40">
                  {item.price === 0 ? "Free item" : "One-time price preview"}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {item.price === 0 ? (
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="vignify-interactive vignify-button-primary w-full"
                  >
                    Download
                    <span className="vignify-button-icon-right">↓</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePurchase}
                    className="vignify-interactive vignify-button-primary w-full"
                  >
                    Purchase
                    <span className="vignify-button-icon-right">↗</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={toggleFavorite}
                  aria-pressed={isFavorite}
                  className={`vignify-interactive w-full ${
                    isFavorite ? "vignify-chip-active" : ""
                  }`}
                >
                  <span aria-hidden="true">
                    {isFavorite ? "♥" : "♡"}
                  </span>
                  {isFavorite ? "Favorited" : "Add to favorites"}
                </button>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="vignify-interactive mt-3 w-full"
              >
                Share or copy item link
                <span className="vignify-button-icon-right">↗</span>
              </button>

              {notice && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mt-4 rounded-xl border border-[#B9F56B]/20 bg-[#B9F56B]/[0.06] p-3 text-sm leading-6 text-white/75"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p>{notice}</p>
                    <button
                      type="button"
                      onClick={() => setNotice("")}
                      aria-label="Dismiss message"
                      className="shrink-0 text-white/45 transition-colors hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <p className="mt-4 text-[11px] leading-5 text-white/35">
                Vignify MVP preview. Downloads and checkout are demonstrations
                until the asset storage and payment services are connected.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <p className="text-xs text-white/40">STYLE</p>
                <p className="mt-2 text-sm font-medium">{item.style}</p>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                <p className="text-xs text-white/40">CONTENT TYPE</p>
                <p className="mt-2 text-sm font-medium">{item.category}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-vignify relative z-10 py-12 sm:py-16">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-[#55E6DC] uppercase">
              KEEP EXPLORING
            </p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              You might also like<span className="text-[#B9F56B]">.</span>
            </h2>
          </div>

          <Link
            href="/explore"
            className="vignify-interactive hidden sm:inline-flex"
          >
            Explore all
            <span className="vignify-button-icon-right">↗</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {relatedItems.map((related) => (
            <Link
              key={related.id}
              href={`/item/${related.id}`}
              className="vignify-card group"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-[#151a15]">
                <Image
                  src={related.image}
                  alt={related.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-semibold backdrop-blur-md">
                  {formatPrice(related.price)}
                </span>
              </div>

              <div className="p-3.5 sm:p-4">
                <h3 className="truncate text-sm font-semibold transition-colors group-hover:text-[#B9F56B]">
                  {related.title}
                </h3>
                <p className="mt-1 truncate text-xs text-white/45">
                  by {related.creator}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.08]">
        <div className="container-vignify flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
          <Brand />
          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Vignify
          </p>
        </div>
      </footer>
    </main>
  );
}