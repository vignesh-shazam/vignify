type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

  return (
    <main className="container-vignify mx-auto px-6 py-16">
      <p className="text-sm uppercase tracking-widest text-[#B9F56B]">
        Wallpaper Categories
      </p>
      <h1 className="mt-3 text-4xl font-bold">{category}</h1>
      <p className="mt-4 text-white/65">
        Wallpapers in this category will appear here when category data is connected.
      </p>
    </main>
  );
}
