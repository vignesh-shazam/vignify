export default function SearchPage() {
  return (
    <main className="container-vignify mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold">Search Wallpapers</h1>
      <form action="/search" method="get" className="mt-8 flex max-w-xl gap-3">
        <input
          type="search"
          name="q"
          placeholder="Search wallpapers..."
          className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-white outline-none focus:border-[#B9F56B]"
        />
        <button
          type="submit"
          className="rounded-full bg-[#B9F56B] px-6 py-3 font-semibold text-black"
        >
          Search
        </button>
      </form>
      <p className="mt-5 text-sm text-white/50">
        Search results will appear here once wallpaper search is connected.
      </p>
    </main>
  );
}
