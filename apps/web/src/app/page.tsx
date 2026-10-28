import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Play, Search, Star, Heart, Menu, X } from "lucide-react";
import VignitiLogo from "@vignify/ui/components/VignitiLogo";

// Logo imported from @vignify/ui
const QualityIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4L6 8V16C6 21.52 10.44 26.74 16 28C21.56 26.74 26 21.52 26 16V8L16 4Z" fill="url(#gradient1)" />
    <path d="M16 8L10 10.5V15C10 18.5 12.5 21.5 16 22.5C19.5 21.5 22 18.5 22 15V10.5L16 8Z" fill="rgba(255,255,255,0.3)" />
    <defs>
      <linearGradient id="gradient1" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B2CFF" />
        <stop offset="1" stopColor="#176DFF" />
      </linearGradient>
    </defs>
  </svg>
);

const UpdatesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4C9.37 4 4 9.37 4 16C4 22.63 9.37 28 16 28C22.63 28 28 22.63 28 16C28 9.37 22.63 4 16 4ZM16 26C10.48 26 6 21.52 6 16C6 10.48 10.48 6 16 6C21.52 6 26 10.48 26 16C26 21.52 21.52 26 16 26Z" fill="url(#gradient2)" />
    <path d="M16 10V16L20 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <defs>
      <linearGradient id="gradient2" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#8B2CFF" />
        <stop offset="1" stopColor="#176DFF" />
      </linearGradient>
    </defs>
  </svg>
);

const CreatorsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="10" r="4" fill="url(#gradient3)" />
    <path d="M12 16C8.69 16 6 18.69 6 22V24H18V22C18 18.69 15.31 16 12 16Z" fill="url(#gradient3)" />
    <circle cx="22" cy="12" r="3" fill="url(#gradient3)" opacity="0.8" />
    <path d="M22 17C19.79 17 18 18.79 18 21V22H26V21C26 18.79 24.21 17 22 17Z" fill="url(#gradient3)" opacity="0.8" />
    <defs>
      <linearGradient id="gradient3" x1="6" y1="6" x2="26" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#176DFF" />
        <stop offset="1" stopColor="#8B2CFF" />
      </linearGradient>
    </defs>
  </svg>
);

const SecureIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="2.5" fill="#F000E8" />
    <circle cx="22" cy="10" r="2.5" fill="#F000E8" />
    <circle cx="16" cy="22" r="2.5" fill="#F000E8" />
    <path d="M10 10L16 22L22 10" stroke="#F000E8" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 10L22 10" stroke="#F000E8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    <path d="M10 10L16 22" stroke="#F000E8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
    <path d="M22 10L16 22" stroke="#F000E8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
  </svg>
);

const categories = [
  { name: "Wallpapers", icon: "🖼️", href: "/explore/wallpapers" },
  { name: "Themes", icon: "🎨", href: "/explore/themes" },
  { name: "Icon Packs", icon: "📦", href: "/explore/icon-packs" },
  { name: "Ringtones", icon: "🔔", href: "/explore/ringtones" },
  { name: "Widgets", icon: "📱", href: "/explore/widgets" },
  { name: "Live Wallpapers", icon: "✨", href: "/explore/live-wallpapers" },
];

const wallpapers = [
  {
    id: "neon-city",
    title: "Neon City",
    rating: 4.8,
    downloads: "12.5K",
    tag: "PRO",
    image: "https://images.unsplash.com/photo-1514539079130-25950c84af65?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: "mountain-serenity",
    title: "Mountain Serenity",
    rating: 4.9,
    downloads: "8.7K",
    tag: "FREE",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: "galaxy-dreams",
    title: "Galaxy Dreams",
    rating: 4.7,
    downloads: "15.2K",
    tag: "PRO",
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: "nature-flow",
    title: "Nature Flow",
    rating: 4.8,
    downloads: "9.1K",
    tag: "FREE",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: "minimal-dark",
    title: "Minimal Dark",
    rating: 4.6,
    downloads: "5.2K",
    tag: "FREE",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=600&q=85",
  },
  {
    id: "anime-night",
    title: "Anime Night",
    rating: 4.9,
    downloads: "7.4K",
    tag: "PRO",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=85",
  },
];

const features = [
  { icon: "🛡️", title: "High Quality", description: "4K & 8K resolution wallpapers" },
  { icon: "🔄", title: "Regular Updates", description: "New content every day" },
  { icon: "👥", title: "By Creators", description: "Community-driven platform" },
  { icon: "🔒", title: "Safe & Secure", description: "Verified content only" },
];

function Brand() {
  return (
    <Link
      href="/"
      aria-label="Vigniti home"
      className="group inline-flex items-center gap-2"
      style={{ textDecoration: "none" }}
    >
      <VignitiLogo size={30} />
      <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff" }}>
        Vigniti
      </span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden" style={{ background: 'var(--vignify-bg)', color: 'var(--vignify-text)' }}>
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-(--vignify-purple)/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-(--vignify-blue)/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[var(--vignify-purple)]/10 to-[var(--vignify-blue)]/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b" style={{ borderColor: 'var(--vignify-border)', background: 'rgba(3, 8, 23, 0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="container mx-auto px-6 py-4 flex items-center justify-between max-w-7xl">
          <Brand />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/explore/wallpapers" className="text-sm font-medium transition-colors" style={{ color: 'var(--vignify-text-secondary)', position: 'relative' }}>
              Wallpapers
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-[var(--vignify-purple)] to-[var(--vignify-magenta)]" style={{ boxShadow: 'var(--vignify-shadow-glow)' }} />
            </Link>
            <Link href="/explore/themes" className="text-sm font-medium transition-colors hover:text-[var(--vignify-text)]" style={{ color: 'var(--vignify-text-secondary)' }}>
              Themes
            </Link>
            <Link href="/explore/icon-packs" className="text-sm font-medium transition-colors hover:text-[var(--vignify-text)]" style={{ color: 'var(--vignify-text-secondary)' }}>
              Icons
            </Link>
            <Link href="/explore/ringtones" className="text-sm font-medium transition-colors hover:text-[var(--vignify-text)]" style={{ color: 'var(--vignify-text-secondary)' }}>
              Ringtones
            </Link>
            <Link href="/explore/creators" className="text-sm font-medium transition-colors hover:text-[var(--vignify-text)]" style={{ color: 'var(--vignify-text-secondary)' }}>
              Creators
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border" style={{ borderColor: 'var(--vignify-border)', background: 'var(--vignify-surface)' }}>
              <Search size={18} style={{ color: 'var(--vignify-text-muted)' }} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm outline-none placeholder-[var(--vignify-text-muted)]"
                style={{ color: 'var(--vignify-text)', width: '160px' }}
              />
            </div>

            <ThemeSwitcher />

            <Link href="/login" className="text-sm font-medium transition-colors hover:text-[var(--vignify-text)]" style={{ color: 'var(--vignify-text-secondary)' }}>
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:shadow-xl"
              style={{ background: 'var(--vignify-gradient-primary)', boxShadow: 'var(--vignify-shadow-glow)' }}
            >
              Sign Up
            </Link>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" style={{ color: 'var(--vignify-text)' }}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 md:py-32 overflow-hidden animate-fade-in">
        {/* Cosmic Background - Matching Reference */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[#030817] via-[#0a0a1f] to-[#030817]" />
          {/* Nebula/Cosmic Background Image */}
          <div
            className="absolute inset-0 opacity-25 bg-cover bg-center"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1920&q=80)' }}
          />
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030817]/80 via-transparent to-[#030817]/60" />
          {/* Stars */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(2px 2px at 20px 30px, white, transparent), radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 90px 40px, white, transparent), radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.6), transparent), radial-gradient(1px 1px at 160px 120px, white, transparent), radial-gradient(2px 2px at 200px 50px, rgba(255,255,255,0.7), transparent), radial-gradient(1px 1px at 250px 160px, white, transparent), radial-gradient(2px 2px at 300px 90px, rgba(255,255,255,0.8), transparent), radial-gradient(1px 1px at 350px 130px, white, transparent), radial-gradient(2px 2px at 400px 60px, rgba(255,255,255,0.6), transparent)',
            backgroundSize: '550px 550px',
            animation: 'stars 100s linear infinite'
          }} />
          {/* Nebula effects with stronger glow */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--vignify-purple)]/30 rounded-full blur-3xl animate-glow-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--vignify-blue)]/30 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-[var(--vignify-magenta)]/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-[var(--vignify-cyan)]/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[var(--vignify-purple)]/15 to-[var(--vignify-blue)]/15 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '4s' }} />
        </div>

        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {/* Marketplace Label */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 animate-scale-in" style={{ background: 'var(--vignify-surface)', border: '1px solid var(--vignify-border)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--vignify-cyan)', boxShadow: '0 0 8px var(--vignify-cyan)' }} />
                <span className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--vignify-text-muted)' }}>
                  Android Customization Marketplace
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: 'var(--vignify-text)' }}>
                <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Make Your Android Uniquely For Yours
                </span>
              </h1>
              <p className="text-lg md:text-xl mb-10 max-w-xl" style={{ color: 'var(--vignify-text-secondary)' }}>
                Discover thousands of wallpapers, themes, icon packs, and widgets to personalize your Android device like never before.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-16">
                <Link
                  href="/explore"
                  className="px-8 py-4 rounded-full text-white font-semibold transition-all duration-300 hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 group"
                  style={{ background: 'var(--vignify-gradient-primary)', boxShadow: 'var(--vignify-shadow-glow)' }}
                >
                  Explore Now
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-6 rounded-2xl animate-scale-in" style={{ background: 'var(--vignify-surface)', border: '1px solid var(--vignify-border)', animationDelay: '0.4s' }}>
                <div className="text-center group hover:scale-110 transition-transform duration-300">
                  <p className="text-3xl md:text-4xl font-bold" style={{ background: 'var(--vignify-gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    10K+
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--vignify-text-muted)' }}>Wallpapers</p>
                </div>
                <div className="text-center group hover:scale-110 transition-transform duration-300">
                  <p className="text-3xl md:text-4xl font-bold" style={{ background: 'var(--vignify-gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    200+
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--vignify-text-muted)' }}>Themes</p>
                </div>
                <div className="text-center group hover:scale-110 transition-transform duration-300">
                  <p className="text-3xl md:text-4xl font-bold" style={{ background: 'var(--vignify-gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    1K+
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--vignify-text-muted)' }}>Icon Packs</p>
                </div>
                <div className="text-center group hover:scale-110 transition-transform duration-300">
                  <p className="text-3xl md:text-4xl font-bold" style={{ background: 'var(--vignify-gradient-brand)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    500+
                  </p>
                  <p className="text-sm mt-2" style={{ color: 'var(--vignify-text-muted)' }}>Creators</p>
                </div>
              </div>
            </div>

            {/* 4 Smartphones Showcase */}
            <div className="relative h-[600px] md:h-[700px] flex items-center justify-center">
              {/* Phone 1 - Left */}
              <div className="absolute left-0 md:left-5 top-20 w-[200px] h-[400px] md:w-[240px] md:h-[480px] rounded-[35px] border-4 overflow-hidden transform -rotate-12 -translate-x-8 translate-y-8 scale-85 z-10 animate-float" style={{ borderColor: '#1a1a2e', background: '#0a0a0f', boxShadow: '0 0 50px rgba(139, 44, 255, 0.25)', animationDelay: '0s' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl z-10" style={{ background: '#1a1a2e' }} />
                <div className="relative w-full h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=90"
                    alt="Cosmic wallpaper"
                    fill
                    sizes="240px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </div>

              {/* Phone 2 - Center Left */}
              <div className="absolute left-1/4 top-0 w-[220px] h-[440px] md:w-[260px] md:h-[520px] rounded-[35px] border-4 overflow-hidden transform -rotate-6 -translate-y-4 scale-90 z-20 animate-float" style={{ borderColor: '#1a1a2e', background: '#0a0a0f', boxShadow: '0 0 60px rgba(0, 217, 255, 0.3)', animationDelay: '1s' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl z-10" style={{ background: '#1a1a2e' }} />
                <div className="relative w-full h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=400&q=90"
                    alt="Mountain wallpaper"
                    fill
                    sizes="260px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </div>

              {/* Phone 3 - Center Right */}
              <div className="absolute right-1/4 top-10 w-[220px] h-[440px] md:w-[260px] md:h-[520px] rounded-[35px] border-4 overflow-hidden transform rotate-8 -translate-y-2 scale-95 z-30 animate-float" style={{ borderColor: '#1a1a2e', background: '#0a0a0f', boxShadow: '0 0 60px rgba(240, 50, 150, 0.3)', animationDelay: '2s' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 rounded-b-2xl z-10" style={{ background: '#1a1a2e' }} />
                <div className="relative w-full h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=400&q=90"
                    alt="Abstract wallpaper"
                    fill
                    sizes="260px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
              </div>

              {/* Phone 4 - Right (Main) */}
              <div className="absolute right-0 md:right-5 bottom-0 w-[240px] h-[480px] md:w-[300px] md:h-[600px] rounded-[40px] border-4 overflow-hidden transform rotate-12 translate-x-8 translate-y-4 z-40 animate-float" style={{ borderColor: '#1a1a2e', background: '#0a0a0f', boxShadow: '0 0 80px rgba(139, 44, 255, 0.5)', animationDelay: '3s' }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 rounded-b-2xl z-10" style={{ background: '#1a1a2e' }} />
                <div className="relative w-full h-full">
                  <Image
                    src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=500&q=90"
                    alt="Landscape wallpaper"
                    fill
                    sizes="300px"
                    loading="eager"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  <div className="absolute top-8 left-6 right-6">
                    <div className="text-white text-2xl font-light">9:41</div>
                  </div>
                  <div className="absolute bottom-8 left-6 right-6">
                    <div className="text-white text-sm tracking-widest uppercase mb-2">NEW WALLPAPER</div>
                    <div className="text-white text-3xl font-light">Mountain Lake</div>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'var(--vignify-gradient-primary)' }}>PRO</span>
                      <span className="text-sm" style={{ color: 'var(--vignify-text-secondary)' }}>5K+ downloads</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="relative z-10 py-20" style={{ background: 'var(--vignify-surface)' }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Trending Now</span>
            </h2>
            <Link
              href="/explore"
              className="px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-300 hover:shadow-xl"
              style={{ background: 'var(--vignify-gradient-primary)', boxShadow: 'var(--vignify-shadow-glow)' }}
            >
              View All
            </Link>
          </div>

          {/* Category Buttons */}
          <div className="flex gap-3 mb-12 overflow-x-auto pb-2">
            {categories.map((category, index) => (
              <button
                key={category.name}
                className="px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border hover:scale-105 hover:shadow-lg animate-scale-in"
                style={{
                  background: 'var(--vignify-surface-raised)',
                  borderColor: 'var(--vignify-border)',
                  color: 'var(--vignify-text-secondary)',
                  animationDelay: `${1.0 + index * 0.05}s`
                }}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>

          {/* Wallpaper Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {wallpapers.map((wallpaper) => (
              <Link
                key={wallpaper.id}
                href={`/item/${wallpaper.id}`}
                className="group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl"
                style={{ borderColor: 'var(--vignify-border)', background: 'var(--vignify-surface)' }}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={wallpaper.image}
                    alt={wallpaper.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Favorite Button */}
                  <button className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
                    <Heart size={16} className="text-white" />
                  </button>

                  {/* Tag */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${wallpaper.tag === 'PRO'
                      ? 'text-white'
                      : 'text-green-400 border border-green-400/30'
                      }`} style={wallpaper.tag === 'PRO' ? { background: 'var(--vignify-gradient-primary)' } : { background: 'rgba(34, 197, 94, 0.2)' }}>
                      {wallpaper.tag}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--vignify-text)' }}>{wallpaper.title}</h3>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--vignify-text-secondary)' }}>
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span>{wallpaper.rating}</span>
                      <span style={{ color: 'var(--vignify-text-muted)' }}>•</span>
                      <span style={{ color: 'var(--vignify-text-muted)' }}>{wallpaper.downloads}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Matching Reference Design */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="relative rounded-3xl overflow-hidden p-8 md:p-12" style={{ background: 'linear-gradient(135deg, #8B2CFF 0%, #176DFF 50%, #F000E8 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left: Logo and Text */}
              <div className="flex items-center gap-6">
                {/* Vigniti Logo */}
                <div className="flex-shrink-0">
                  <VignitiLogo size={56} />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold">
                    <span className="bg-gradient-to-r from-cyan-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Personalize Every Moment</span>
                  </h2>
                  <p className="text-white/80 text-sm md:text-base">Why choose Vignify for your Android customization</p>
                </div>
              </div>

              {/* Right: Feature Icons */}
              <div className="flex items-center gap-6 md:gap-8 flex-wrap justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <QualityIcon />
                  </div>
                  <span className="text-white text-xs md:text-sm font-medium">High Quality</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <UpdatesIcon />
                  </div>
                  <span className="text-white text-xs md:text-sm font-medium">Regular Updates</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <CreatorsIcon />
                  </div>
                  <span className="text-white text-xs md:text-sm font-medium">By Creators</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <SecureIcon />
                  </div>
                  <span className="text-white text-xs md:text-sm font-medium">Safe & Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t py-12" style={{ borderColor: 'var(--vignify-border)' }}>
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <Brand />
            <nav className="flex items-center gap-6 text-sm" style={{ color: 'var(--vignify-text-muted)' }}>
              <Link href="/explore" className="hover:text-[var(--vignify-text)] transition-colors">Explore</Link>
              <Link href="/about" className="hover:text-[var(--vignify-text)] transition-colors">About</Link>
              <Link href="/help" className="hover:text-[var(--vignify-text)] transition-colors">Help</Link>
              <Link href="/privacy" className="hover:text-[var(--vignify-text)] transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-[var(--vignify-text)] transition-colors">Terms</Link>
            </nav>
            <p className="text-sm" style={{ color: 'var(--vignify-text-muted)' }}>
              © {new Date().getFullYear()} Vignify. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
