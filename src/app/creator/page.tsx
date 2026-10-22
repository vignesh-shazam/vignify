import Link from "next/link";

export default function CreatorPage() {
  return (
    <main className="container-vignify mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold">Creator Studio</h1>
      <p className="mt-4 text-white/65">
        Share your wallpapers with the Vignify community.
      </p>
      <Link
        href="/creator/upload"
        className="vignify-button-primary mt-8 inline-flex rounded-full px-6 py-3"
      >
        Upload a wallpaper
      </Link>
    </main>
  );
}
