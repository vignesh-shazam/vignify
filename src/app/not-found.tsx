
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080b09] px-6 text-white">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#b9f56b] text-3xl font-black text-[#10160b]">
          V
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.25em] text-[#b9f56b]">
          Error 404
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Lost your way?
        </h1>

        <p className="mx-auto mt-4 max-w-sm leading-7 text-white/60">
          This page doesn't exist yet. Let's get you back to discovering
          something uniquely yours.
        </p>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[#b9f56b] px-6 py-3 font-semibold text-[#10160b] transition hover:bg-[#cdfb91] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b9f56b]"
        >
          Back to Vignify
        </Link>
      </div>
    </main>
  );
}
