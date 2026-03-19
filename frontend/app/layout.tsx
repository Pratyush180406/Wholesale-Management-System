import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WMS — Warehouse Management System",
  description: "Charcoal neumorphism warehouse management dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
