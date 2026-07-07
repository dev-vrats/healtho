import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TopNav } from "@/components/TopNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Healtho",
  description: "Personal health-intelligence dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans tabular-nums bg-[var(--color-canvas)] text-[var(--color-primary)]">
        <TopNav />
        <main className="flex-1 w-full max-w-[1400px] mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
