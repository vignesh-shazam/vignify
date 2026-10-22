
import Image from "next/image";
import Link from "next/link";
import LeavesBackground from "@/components/LeavesBackground";
import LiveClock from "@/components/LiveClock";

const categories = [
  {
    name: "Wallpapers",
    description: "Give your screen a new vibe",
    icon: "◈",
    href: "/explore/wallpapers",
    color: "from-lime-300/20 to-transparent",
  },
  {
    name: "Icon Packs",
    description: "Every icon, reimagined",
    icon: "▦",
    href: "/explore/icon-packs",
    color: "from-cyan-300/20 to-transparent",
  },
  {
    name: "Themes",
    description: "A complete visual makeover",
    icon: "✳",
    href: "/explore/themes",
    color: "from-purple-400/20 to-transparent",
  },
  {
    name: "Widgets",
    description: "Make your home screen useful",
    icon: "▣",
    href: "/explore/widgets",
    color: "from-orange-300/20 to-transparent",
  },
  {
    name: "Setups",
    description: "Discover complete home-screen setups",
    icon: "⌘",
    href: "/explore/setups",
    color: "from-pink-300/20 to-transparent",
  },
];

const wallpapers = [
  {
    id: "midnight-mountains",
    title: "Midnight Mountains",
    creator: "Studio North",
    category: "Wallpapers",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85",
    tag: "TRENDING",
  },
  {
    id: "forest-calm",
    title: "Forest Calm",
    creator: "Nature Lab",
    category: "Wallpapers",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85",
    tag: "FREE",
  },
  {
    id: "ocean-blue",
    title: "Ocean Blue",
    creator: "Pixel Harbor",
    category: "Wallpapers",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=85",
    tag: "POPULAR",
  },
  {
    id: "desert-dusk",
    title: "Desert Dusk",
    creator: "Mono Studio",
    category: "Wallpapers",
    image:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=900&q=85",
    tag: "NEW",
  },
];

function Brand() {
  return (
    <Link
      href="/"
      aria-label="Vignify home"
      className="group inline-flex items-center gap-2.5"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B9F56B] text-lg font-black text-[#10160b] transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
        V
      </span>
      <span className="text-xl font-bold tracking-tight text-white">
        vignify<span className="text-[#B9F56B]">.</span>
      </span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <LeavesBackground />

      <div className="vignify-glow -left-40 top-[200px] z-[-1] h-96 w-96 bg-[#B9F56B]" />
      <div className="vignify-glow -right-45 top-125 z-[-1] h-96 w-96 bg-[#55E6DC]" />

      <header className="relative z-20 border-b border-white/[0.07] bg-[#080b09]/80 backdrop-blur-xl">
        <div className="container-vignify flex min-h-19 items-center justify-between gap-4">
          <Brand />

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-7 md:flex"
          >
            <Link
              href="/explore"
              className="text-sm text-white/60 transition-colors hover:text-[#B9F56B]"
            >
              Explore
            </Link>
            <Link
              href="/explore?sort=price-high"
              className="text-sm text-white/60 transition-colors hover:text-[#B9F56B]"
            >
              Trending
            </Link>
            <Link
              href="/about"
              className="text-sm text-white/60 transition-colors hover:text-[#B9F56B]"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="vignify-interactive vignify-button-ghost hidden sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/explore"
              className="vignify-interactive vignify-button-primary"
            >
              Explore now
              <span className="vignify-button-icon-right">↗</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10">
        <div className="container-vignify grid min-h-[640px] items-center gap-12 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#B9F56B]/20 bg-[#B9F56B]/[0.06] px-3.5 py-2 text-xs font-medium text-[#B9F56B]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#B9F56B]" />
              YOUR PHONE. YOUR PERSONALITY.
            </div>

            <h1 className="max-w-3xl text-5xl leading-[1.06] font-semibold tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Your phone.
              <br />
              Your <span className="text-gradient">universe.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              Discover wallpapers, icon packs, themes, and widgets that turn
              your Android into something unmistakably yours.
            </p>

            <form
              action="/explore"
              method="GET"
              className="mt-9 flex max-w-xl flex-col gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-2 shadow-2xl shadow-black/20 sm:flex-row"
            >
              <label htmlFor="home-search" className="sr-only">
                Search Android customizations
              </label>
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                <span aria-hidden="true" className="text-lg text-white/40">
                  ⌕
                </span>
                <input
                  id="home-search"
                  name="q"
                  type="search"
                  placeholder="Find your next vibe..."
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/35"
                />
              </div>
              <button
                type="submit"
                className="vignify-interactive vignify-button-primary"
              >
                Explore
                <span className="vignify-button-icon-right">↗</span>
              </button>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/40">
              <span>Popular:</span>
              <Link
                href="/explore?category=Wallpapers&style=AMOLED"
                className="transition-colors hover:text-[#B9F56B]"
              >
                AMOLED
              </Link>
              <Link
                href="/explore?style=Minimal"
                className="transition-colors hover:text-[#B9F56B]"
              >
                Minimal
              </Link>
              <Link
                href="/explore?style=Nature"
                className="transition-colors hover:text-[#B9F56B]"
              >
                Nature
              </Link>
              <Link
                href="/explore?style=Dark"
                className="transition-colors hover:text-[#B9F56B]"
              >
                Dark aesthetic
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-white/[0.08] pt-6">
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  Your way
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Personalized looks
                </p>
              </div>
              <div className="h-9 w-px bg-white/10" />
              <div>
                <p className="text-2xl font-semibold tracking-tight">
                  One place
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Discover new styles
                </p>
              </div>
            </div>
          </div>

          {/* Phone preview */}
          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="absolute inset-8 rounded-full bg-[#B9F56B]/10 blur-[80px]" />

            <div className="vignify-float relative mx-auto max-w-[330px] rounded-[42px] border border-white/15 bg-[#131813] p-3 shadow-[0_30px_100px_rgba(0,0,0,0.5)]">
              <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#0a110e]">
                <div className="absolute left-1/2 top-3 z-20 h-5 w-20 -translate-x-1/2 rounded-full bg-black" />

                <div className="relative h-[490px] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=90"
                    alt="Mountain lake wallpaper preview"
                    fill
                    priority
                    sizes="330px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/70" />

                  <div className="absolute inset-x-5 top-12 z-10">
                    <LiveClock />
                  </div>

                  <div className="absolute inset-x-5 bottom-6 z-10">
                    <p className="text-xs tracking-[0.25em] text-white/70 uppercase">
                      Find your calm
                    </p>
                    <p className="mt-1 text-4xl font-light tracking-tight">
                      Anywhere.
                    </p>

                    <div className="mt-5 flex items-center justify-between rounded-2xl border border-white/20 bg-black/25 p-3 backdrop-blur-xl">
                      <div>
                        <p className="text-xs font-medium">
                          Your next setup
                        </p>
                        <p className="mt-1 text-[10px] text-white/55">
                          A look that feels like you
                        </p>
                      </div>
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B9F56B] text-lg text-[#10160b]">
                        ↗
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-3 top-24 rounded-2xl border border-white/10 bg-[#111611]/90 p-3 shadow-xl backdrop-blur-xl sm:-left-12">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B9F56B]/10 text-lg text-[#B9F56B]">
                  ◈
                </span>
                <div>
                  <p className="text-xs font-semibold">Your aesthetic</p>
                  <p className="mt-1 text-[10px] text-white/45">
                    Made personal
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -right-2 bottom-24 rounded-2xl border border-white/10 bg-[#111611]/90 p-3 shadow-xl backdrop-blur-xl sm:-right-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#55E6DC]/10 text-lg text-[#55E6DC]">
                  ✳
                </span>
                <div>
                  <p className="text-xs font-semibold">Fresh finds</p>
                  <p className="mt-1 text-[10px] text-white/45">
                    Discover something new
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live clock strip */}
      <section className="relative z-10 border-y border-white/[0.07] bg-white/[0.015] py-7">
        <div className="container-vignify flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-white/50">
            Built for people who love making things their own.
          </p>
          <LiveClock />
        </div>
      </section>

      {/* Categories */}
      <section className="relative z-10 py-20 md:py-28">
        <div className="container-vignify">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-[#B9F56B] uppercase">
                EXPLORE YOUR STYLE
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                What&apos;s your vibe?
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/50">
                Start with a category. Find the pieces that make your phone
                feel like yours.
              </p>
            </div>

            <Link
              href="/explore"
              className="vignify-interactive self-start sm:self-auto"
            >
              Browse everything
              <span className="vignify-button-icon-right">↗</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="vignify-card group relative p-6"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-50 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-2xl text-[#B9F56B] transition-transform duration-300 group-hover:scale-110">
                    {category.icon}
                  </span>
                  <h3 className="mt-6 text-lg font-semibold">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/45">
                    {category.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-[#B9F56B]">
                    Explore category
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured wallpapers */}
      <section className="relative z-10 border-y border-white/[0.07] bg-white/[0.015] py-20 md:py-24">
        <div className="container-vignify">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-[#55E6DC] uppercase">
                HANDPICKED FOR YOU
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Fresh on the feed
                <span className="text-[#B9F56B]">.</span>
              </h2>
              <p className="mt-3 text-sm text-white/50">
                Inspiration for your next home-screen makeover.
              </p>
            </div>
            <Link
              href="/explore"
              className="vignify-interactive hidden sm:inline-flex"
            >
              View all
              <span className="vignify-button-icon-right">↗</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {wallpapers.map((wallpaper) => (
              <Link
                key={wallpaper.id}
                href={`/item/${wallpaper.id}`}
                className="vignify-card group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-[#151a15]">
                  <Image
                    src={wallpaper.image}
                    alt={wallpaper.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[9px] font-semibold tracking-wider text-white/85 backdrop-blur-md">
                    {wallpaper.tag}
                  </span>
                  <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-[#B9F56B] text-lg text-[#10160b] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    ↗
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="truncate text-sm font-semibold">
                    {wallpaper.title}
                  </h3>
                  <p className="mt-1 text-xs text-white/45">
                    by {wallpaper.creator}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Creator CTA */}
      <section className="relative z-10 py-20 md:py-28">
        <div className="container-vignify">
          <div className="relative overflow-hidden rounded-[28px] border border-[#B9F56B]/20 bg-[#111811] px-6 py-12 sm:px-12 md:py-16">
            <div className="absolute right-[-80px] top-[-120px] h-72 w-72 rounded-full bg-[#B9F56B]/10 blur-[80px]" />
            <div className="absolute bottom-[-130px] left-[35%] h-64 w-64 rounded-full bg-[#55E6DC]/10 blur-[80px]" />

            <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <p className="mb-4 text-xs font-semibold tracking-[0.22em] text-[#B9F56B] uppercase">
                  MADE SOMETHING AWESOME?
                </p>
                <h2 className="max-w-2xl text-3xl leading-tight font-semibold tracking-tight sm:text-4xl md:text-5xl">
                  Your creativity belongs here.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
                  Share your wallpapers, themes, and setups with people who
                  appreciate great design.
                </p>
              </div>

              <Link
                href="/signup"
                className="vignify-interactive vignify-button-primary justify-self-start"
              >
                Become a creator
                <span className="vignify-button-icon-right">↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.08]">
        <div className="container-vignify flex flex-col gap-8 py-9 md:flex-row md:items-center md:justify-between">
          <div>
            <Brand />
            <p className="mt-3 max-w-sm text-xs leading-5 text-white/40">
              A little inspiration for a phone that feels like you.
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-white/45"
          >
            <Link
              className="transition-colors hover:text-[#B9F56B]"
              href="/explore"
            >
              Explore
            </Link>
            <Link
              className="transition-colors hover:text-[#B9F56B]"
              href="/about"
            >
              About
            </Link>
            <Link
              className="transition-colors hover:text-[#B9F56B]"
              href="/help"
            >
              Help
            </Link>
            <Link
              className="transition-colors hover:text-[#B9F56B]"
              href="/privacy"
            >
              Privacy
            </Link>
            <Link
              className="transition-colors hover:text-[#B9F56B]"
              href="/terms"
            >
              Terms
            </Link>
          </nav>

          <p className="text-xs text-white/35">
            © {new Date().getFullYear()} Vignify
          </p>
        </div>
      </footer>
    </main>
  );
}
