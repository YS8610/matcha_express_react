// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Web Matcha - Find Your Perfect Match",
  description: "Modern dating app to find meaningful connections.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased bg-gray-50 text-gray-900">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
