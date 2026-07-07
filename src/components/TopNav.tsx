"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Activity, LogOut } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "@/contexts/AuthContext";

export function TopNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const links = [
    { href: "/", label: "Dashboard" },
    { href: "/data", label: "Data" },
    { href: "/records", label: "Records" },
  ];

  return (
    <nav className="w-full border-b border-[var(--color-hairline)] bg-[var(--color-canvas)] sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-[var(--color-primary)] font-medium">
            <div className="w-7 h-7 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
              <Activity size={16} color="white" />
            </div>
            <span className="text-[17px] tracking-tight">Healtho</span>
          </Link>
          
          {/* Navigation Links - Only show if logged in */}
          {user && (
            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "text-[14px] font-medium transition-colors relative",
                      isActive ? "text-[var(--color-primary)]" : "text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute -bottom-[21px] left-0 w-full h-0.5 bg-[var(--color-primary)] rounded-t-sm" />
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Profile / Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button 
                onClick={signOut}
                className="text-[14px] font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-2"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
              <div className="w-9 h-9 rounded-full bg-[var(--color-surface)] border border-[var(--color-hairline)] flex items-center justify-center text-[var(--color-secondary)]">
                <User size={18} />
              </div>
            </>
          ) : (
            <Link 
              href="/login"
              className="text-[14px] font-medium text-white bg-[var(--color-primary)] px-4 py-2 rounded-[var(--radius-pill)] hover:opacity-90 transition-opacity"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
