import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TopNav } from "@/components/TopNav";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Healtho | Your Body, Simplified",
  description: "A calm, single-glance picture of your health.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-[var(--color-primary)] antialiased`}>
        <Providers>
          <div className="min-h-screen bg-[var(--color-canvas)]">
            <TopNav />
            <main className="px-6 md:px-12 py-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
