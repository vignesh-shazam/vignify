import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./anime-night.css";
import "./admin.css";

export const metadata: Metadata = {
  title: {
    default: "Vigniti Admin Panel",
    template: "%s | Vigniti Admin",
  },
  description: "Vigniti platform administration.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#080f1a",
  colorScheme: "dark",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#080f1a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
