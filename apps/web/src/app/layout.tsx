
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "Vigniti — Make Your Android Uniquely Yours",
    template: "%s | Vigniti",
  },
  description:
    "Discover wallpapers, icon packs, themes, widgets, and Android home-screen setups. Make your phone uniquely yours with Vignify.",
  applicationName: "Vigniti",
  keywords: [
    "Android customization",
    "wallpapers",
    "icon packs",
    "Android themes",
    "widgets",
    "home screen setups",
    "Vigniti",
  ],
  openGraph: {
    title: "Vigniti — Make Your Android Uniquely Yours",
    description:
      "Discover beautiful Android wallpapers, themes, icon packs, and setups.",
    siteName: "Vigniti",
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
    <html lang="en" data-theme="dark">
      <body className="min-h-screen bg-[#080b09] text-white antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
