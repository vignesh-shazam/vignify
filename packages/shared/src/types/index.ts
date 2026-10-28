// Shared domain types used across Admin, Web, and Mobile apps.
// Do NOT import anything from application-specific code here.

export type ContentCategory =
  | "Wallpapers"
  | "Icon Packs"
  | "Themes"
  | "Widgets"
  | "Setups";

export type ContentStyle = "Minimal" | "Nature" | "AMOLED" | "Dark";

export type CustomizationItem = {
  id: string;
  title: string;
  creator: string;
  category: ContentCategory;
  style: ContentStyle;
  price: number;
  image: string;
  tags: string[];
  description: string;
};
