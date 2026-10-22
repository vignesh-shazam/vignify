import Link from "next/link";

const adminFeatures = [
  { icon: "⬡", title: "Secure access", description: "Keep administration tools restricted to authorized users." },
  { icon: "▥", title: "Content management", description: "Manage wallpaper submissions and platform content." },
  { icon: "⚙", title: "Platform settings", description: "Configure and maintain the Vignify experience." },
];

export default function AdminPage() {
  return (
    <main className="v-auth relative min-h-screen overflow-hidden bg-[#080b09] text-white">
      <div className="v-auth-ambient" />
      <div className="v-auth-grid" />
      <div className="v-auth-orb v-auth-orb-one" />
      <div className="v-auth-orb v-auth-orb-two" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[url('/images/vignify/admin-bg.jpg')] bg-cover bg-top opacity-30"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-[#080b09]/25 via-[#080b09]/65 to-[#080b09]" />

      <header className="container-vignify relative z-10 flex items-center justify-between py-6">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <span className="text-3xl text-[#B9F56B]">◢</span> Vignify
        </Link>
        <Link href="/" className="vignify-interactive">
          <span>⌂</span> Home <span className="vignify-button-icon-right">→</span>
        </Link>
      </header>

      <section className="container-vignify relative z-10 mx-auto flex max-w-2xl flex-col items-center pb-16 pt-6 text-center sm:pt-10">
        <div className="v-auth-form-enter w-full">
          <div className="relative mx-auto mb-7 grid h-36 w-36 place-items-center rounded-[2rem] border border-[#B9F56B]/25 bg-gradient-to-br from-[#B9F56B]/10 via-white/[0.03] to-[#55E6DC]/10 shadow-[0_0_70px_rgba(185,245,107,0.08)]">
            <div className="absolute inset-3 rounded-[1.5rem] border border-white/10" />
            <div className="absolute -inset-3 rounded-[2.5rem] border border-dashed border-[#55E6DC]/20 animate-[spin_30s_linear_infinite]" />
            <span className="text-6xl text-[#B9F56B]">♙</span>
            <span className="absolute -right-2 -top-2 grid h-11 w-11 place-items-center rounded-xl border border-[#B9F56B]/30 bg-[#101510] text-xl text-[#B9F56B]">✓</span>
          </div>

          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.4em] text-[#55E6DC]">
            Restricted area · Administrator access
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Admin <span className="text-gradient">Access</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-white/60 sm:text-base">
            The Vignify administration area is reserved for authorized administrators.
            Management tools will be available after secure access verification is implemented.
          </p>

          <div className="surface-card mt-9 space-y-2 p-4 text-left sm:p-6">
            {adminFeatures.map((feature) => (
              <div key={feature.title} className="group flex gap-4 rounded-xl p-3 transition duration-300 hover:bg-white/[0.03]">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-2xl text-[#B9F56B] transition group-hover:border-[#B9F56B]/40 group-hover:bg-[#B9F56B]/10">
                  {feature.icon}
                </div>
                <div>
                  <h2 className="text-sm font-semibold">{feature.title}</h2>
                  <p className="mt-1 text-xs leading-5 text-white/45 sm:text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link href="/login" className="vignify-interactive vignify-button-primary flex-1 py-3.5">
              Sign in <span className="vignify-button-icon-right">→</span>
            </Link>
            <Link href="/" className="vignify-interactive flex-1 py-3.5">⌂ Back to home</Link>
          </div>

          <Link href="/explore" className="mt-7 inline-block text-sm text-white/50 transition hover:text-[#B9F56B]">
            Explore wallpapers instead ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
