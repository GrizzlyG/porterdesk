"use client";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
// ...existing code...

// ...existing code...

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700"],
});


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${roboto.className}`}>
        <main className="md:overflow-auto">
          <section>{children}</section>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
