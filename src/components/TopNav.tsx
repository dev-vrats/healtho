"use client";

import Link from "next/link";
import { User, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function TopNav() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/data", label: "Data" },
    { href: "/records", label: "Records" },
  ];

  return (
    <header className="w-full bg-[var(--color-surface)] z-50 sticky top-0 border-b border-[var(--color-hairline)] shadow-[0_4px_20px_rgba(20,20,15,0.02)]">
      <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="font-medium text-[20px] tracking-tight flex items-center gap-3 text-[var(--color-primary)]">
            <div className="w-7 h-7 rounded-full bg-[var(--color-accent-lime)]" />
            Healtho
          </Link>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "text-[15px] font-medium transition-colors",
                  pathname === link.href ? "text-[var(--color-primary)]" : "text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-canvas)] text-[var(--color-primary)] hover:bg-[var(--color-surface-alt)] transition-colors">
            <ShoppingCart size={18} strokeWidth={1.5} />
          </button>
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-canvas)] text-[var(--color-primary)] hover:bg-[var(--color-surface-alt)] transition-colors">
            <User size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
