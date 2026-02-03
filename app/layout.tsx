import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MainNav } from "@/components/main-nav";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CrowdReview - Discover Best Local Businesses",
  description: "Community driven reviews for local businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        <MainNav />
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
