
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
    customizationItems,
    formatPrice,
} from "@/lib/mock-data";

const categoryMap = {
    wallpapers: {
        name: "Wallpapers",
        description: "Discover wallpapers that make your Android home screen feel like yours.",
    },
    "icon-packs": {
        name: "Icon Packs",
        description: "Give every app a consistent look with carefully curated icon packs.",
    },
    themes: {
        name: "Themes",
        description: "Find a complete visual style for your Android device.",
    },
    widgets: {
        name: "Widgets",
        description: "Make your home screen useful, personal, and beautiful.",
    },
    setups: {
        name: "Setups",
        description: "Explore complete Android customization inspiration.",
    },
} as const;

type CategorySlug = keyof typeof categoryMap;

type CategoryPageProps = {
    params: Promise<{ category: string }>;
};

function getCategory(slug: string) {
    if (!Object.hasOwn(categoryMap, slug)) {
        return undefined;
    }

    return categoryMap[slug as CategorySlug];
}

export async function generateMetadata({
    params,
}: CategoryPageProps): Promise<Metadata> {
    const { category } = await params;
    const itemCategory = getCategory(category);

    if (!itemCategory) {
        return { title: "Category not found | Vignify" };
    }

    return {
        title: `${itemCategory.name} | Vignify`,
        description: itemCategory.description,
    };
}

export default async function CategoryPage({
    params,
}: CategoryPageProps) {
    const { category } = await params;
    const categoryInfo = getCategory(category);

    if (!categoryInfo) {
        notFound();
    }

    const items = customizationItems.filter(
        (item) => item.category === categoryInfo.name
    );

    return (
        <main className="relative isolate min-h-screen overflow-hidden">
            <div className="vignify-glow -left-40 top-40 z-[-1] h-96 w-96 bg-[#B9F56B]" />

            <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#080b09]/90 backdrop-blur-xl">
                <div className="container-vignify flex min-h-18 items-center justify-between gap-4">
                    <Link href="/" aria-label="Vignify home" className="inline-flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B9F56B] text-lg font-black text-[#10160b]">
                            V
                        </span>
                        <span className="text-xl font-bold tracking-tight">
                            vignify
                        </span>
                    </Link>

                    <nav aria-label="Main navigation" className="flex items-center gap-4">
                        <Link href="/explore" className="text-sm text-white/65 transition-colors hover:text-[#B9F56B]">
                            All items
                        </Link>
                        <Link href="/" className="text-sm text-white/65 transition-colors hover:text-[#B9F56B]">
                            Home
                        </Link>
                    </nav>
                </div>
            </header>


            <section className="container-vignify relative z-10 py-10 sm:py-14">
                <Link
                    href="/explore"
                    className="vignify-interactive mb-5 inline-flex"
                >
                    ← Back to Explore
                </Link>

                <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-[#B9F56B] uppercase">
                    EXPLORE CATEGORY
                </p>


                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                    {categoryInfo.name}
                    <span className="text-gradient"></span>
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
                    {categoryInfo.description}
                </p>

                <div className="mb-5 mt-10 flex items-center justify-between gap-4">
                    <p className="text-sm text-white/55">
                        <span className="font-semibold text-white">{items.length}</span>{" "}
                        {items.length === 1 ? "item" : "items"}
                    </p>

                    <Link href="/explore" className="vignify-interactive">
                        Search all items
                    </Link>
                </div>

                {items.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                        {items.map((item) => (
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

                                    <span className="mt-3 inline-block rounded-md bg-white/5 px-2 py-1 text-[10px] text-white/50">
                                        {item.style}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="surface-card flex min-h-64 flex-col items-center justify-center px-5 py-12 text-center">
                        <h2 className="text-xl font-semibold">
                            More {categoryInfo.name.toLowerCase()} coming soon
                        </h2>
                        <p className="mt-2 text-sm text-white/45">
                            We&apos;re preparing more customizations for this category.
                        </p>
                        <Link href="/explore" className="vignify-interactive vignify-button-primary mt-6">
                            Explore all items
                        </Link>
                    </div>
                )}
            </section>

            <footer className="relative z-10 border-t border-white/8">
                <div className="container-vignify flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
                    <Link href="/" className="text-xl font-bold tracking-tight">
                        vignify
                    </Link>
                    <p className="text-xs text-white/35">
                        © {new Date().getFullYear()} Vignify. Discover your next vibe.
                    </p>
                </div>
            </footer>
        </main>
    );
}
