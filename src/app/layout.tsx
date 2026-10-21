
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Vignify — Make Your Android Uniquely Yours",
    template: "%s | Vignify",
  },
  description:
    "Discover wallpapers, icon packs, themes, widgets, and Android home-screen setups. Make your phone uniquely yours with Vignify.",
  applicationName: "Vignify",
  keywords: [
    "Android customization",
    "wallpapers",
    "icon packs",
    "Android themes",
    "widgets",
    "home screen setups",
    "Vignify",
  ],
  openGraph: {
    title: "Vignify — Make Your Android Uniquely Yours",
    description:
      "Discover beautiful Android wallpapers, themes, icon packs, and setups.",
    siteName: "Vignify",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#080b09",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#080b09] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
