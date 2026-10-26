
import type { Metadata, Viewport } from "next";
import { MobileThemeProvider } from "@/components/mobile/MobileThemeProvider";
import styles from "./mobile.module.css";

export const metadata: Metadata = {
  title: "Vignify Mobile",
  description: "Discover wallpapers and Android customizations with Vignify.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#090a12",
};

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.mobileLayout}>
      <MobileThemeProvider>{children}</MobileThemeProvider>
    </div>
  );
}
