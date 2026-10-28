// Pure utility functions with no framework dependencies.

/**
 * Formats a price in Indian Rupees, or returns "Free" for zero.
 */
export function formatPrice(price: number): string {
  return price === 0 ? "Free" : `₹${price}`;
}

/**
 * Returns a URL-safe slug from an arbitrary string.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
