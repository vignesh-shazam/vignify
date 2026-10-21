
import Link from "next/link";

export default function ItemNotFound() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-5">
      <div className="vignify-glow -left-25 top-20 z-[-1] h-80 w-80 bg-[#B9F56B]" />

      <div className="surface-card w-full max-w-lg p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#B9F56B]/20 bg-[#B9F56B]/10 text-3xl text-[#B9F56B]">
          ?
        </div>

        <p className="mt-6 text-xs font-semibold tracking-[0.2em] text-[#B9F56B] uppercase">
          ITEM NOT FOUND
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          This vibe is missing.
        </h1>

        <p className="mt-4 text-sm leading-6 text-white/50">
          This item may no longer be available, or the link may be incorrect.
          Explore the collection to find something else.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/explore"
            className="vignify-interactive vignify-button-primary"
          >
            Explore items
            <span className="vignify-button-icon-right">↗</span>
          </Link>

          <Link href="/" className="vignify-interactive">
            <span className="vignify-button-icon">←</span>
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
