import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TopNav } from "@/components/TopNav";
import { BottomNav } from "@/components/BottomNav";
import { AuthInitializer } from "@/components/AuthInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BoxOffice | Premium Movie Tickets",
  description: "Book movie tickets, order snacks to your seat, and manage your cinematic experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-primary/30`}>
        <AuthInitializer />
        <TopNav />
        <main className="pb-20 sm:pb-0">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
