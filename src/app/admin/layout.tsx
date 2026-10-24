import type { Metadata } from "next";
import "./anime-night.css";
import "./admin.css";
export const metadata: Metadata = { title: "Vignify Admin Panel", robots: { index: false, follow: false } };
export default function AdminRootLayout({children}:{children:React.ReactNode}) { return children; }
