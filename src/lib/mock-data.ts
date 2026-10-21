
export type CustomizationItem = {
  id: string;
  title: string;
  creator: string;
  category: "Wallpapers" | "Icon Packs" | "Themes" | "Widgets" | "Setups";
  style: "Minimal" | "Nature" | "AMOLED" | "Dark";
  price: number;
  image: string;
  tags: string[];
  description: string;
};

export const customizationItems: CustomizationItem[] = [
  {
    id: "midnight-mountains",
    title: "Midnight Mountains",
    creator: "Studio North",
    category: "Wallpapers",
    style: "Nature",
    price: 0,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=90",
    tags: ["mountains", "minimal", "outdoors"],
    description:
      "Bring the quiet beauty of the mountains to your home screen with this atmospheric landscape wallpaper.",
  },
  {
    id: "forest-calm",
    title: "Forest Calm",
    creator: "Nature Lab",
    category: "Wallpapers",
    style: "Nature",
    price: 0,
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=90",
    tags: ["forest", "green", "calm"],
    description:
      "A calming forest-inspired wallpaper for a natural, peaceful phone aesthetic.",
  },
  {
    id: "ocean-blue",
    title: "Ocean Blue",
    creator: "Pixel Harbor",
    category: "Wallpapers",
    style: "Minimal",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=90",
    tags: ["ocean", "blue", "water"],
    description:
      "A clean ocean-inspired design with rich blue tones for a refreshing home screen.",
  },
  {
    id: "desert-dusk",
    title: "Desert Dusk",
    creator: "Mono Studio",
    category: "Wallpapers",
    style: "Minimal",
    price: 0,
    image:
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1200&q=90",
    tags: ["desert", "sand", "warm"],
    description:
      "Warm desert colors and open landscapes make this a simple, understated wallpaper.",
  },
  {
    id: "night-drive",
    title: "Night Drive",
    creator: "Dark Matter",
    category: "Wallpapers",
    style: "AMOLED",
    price: 29,
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=90",
    tags: ["night", "dark", "stars"],
    description:
      "A dark, cinematic night aesthetic designed for a dramatic phone home screen.",
  },
  {
    id: "misty-lake",
    title: "Misty Lake",
    creator: "Quiet Pixels",
    category: "Wallpapers",
    style: "Nature",
    price: 0,
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=90",
    tags: ["lake", "mist", "mountains"],
    description:
      "Soft mist, mountain silhouettes, and a quiet lake create a peaceful visual escape.",
  },
  {
    id: "soft-icons",
    title: "Soft Icons",
    creator: "Form & Function",
    category: "Icon Packs",
    style: "Minimal",
    price: 79,
    image:
      "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1200&q=90",
    tags: ["icons", "pastel", "clean"],
    description:
      "A coordinated pastel-inspired icon pack concept for a softer, more consistent home screen.",
  },
  {
    id: "aurora-theme",
    title: "Aurora Theme",
    creator: "Pixel Harbor",
    category: "Themes",
    style: "Dark",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=1200&q=90",
    tags: ["aurora", "night", "colorful"],
    description:
      "A vibrant night-sky aesthetic concept for a distinctive dark-themed phone setup.",
  },
  {
    id: "nature-widgets",
    title: "Nature Widgets",
    creator: "Green Pixel",
    category: "Widgets",
    style: "Nature",
    price: 0,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=90",
    tags: ["widgets", "green", "nature"],
    description:
      "A nature-inspired widget collection concept for a clean, coordinated home screen.",
  },
  {
    id: "dark-setup",
    title: "Midnight Setup",
    creator: "Dark Matter",
    category: "Setups",
    style: "AMOLED",
    price: 149,
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=90",
    tags: ["setup", "dark", "amoled"],
    description:
      "A complete dark aesthetic concept for users who prefer a minimal, night-inspired setup.",
  },
];

export function getCustomizationById(
  id: string,
): CustomizationItem | undefined {
  return customizationItems.find((item) => item.id === id);
}

export function getRelatedCustomizations(
  item: CustomizationItem,
  limit = 4,
): CustomizationItem[] {
  const sameCategory = customizationItems.filter(
    (candidate) =>
      candidate.id !== item.id && candidate.category === item.category,
  );

  const otherItems = customizationItems.filter(
    (candidate) =>
      candidate.id !== item.id && candidate.category !== item.category,
  );

  return [...sameCategory, ...otherItems].slice(0, limit);
}

export function formatPrice(price: number): string {
  return price === 0 ? "Free" : `₹${price}`;
}
