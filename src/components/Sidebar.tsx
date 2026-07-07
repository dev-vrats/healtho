"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Activity, Heart, Shield, Flame, Droplet, Leaf, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  longevity: TrendingUp,
  heart: Heart,
  thyroid: Activity,
  immune: Shield,
  hormone: Flame,
  metabolic: Activity,
  nutrients: Leaf,
  blood: Droplet,
  all: Activity
};

interface SidebarProps {
  categories: any[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ categories, activeId, onSelect }: SidebarProps) {
  const allItems = [{ id: "all", label: "All Data" }, ...categories];

  return (
    <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-1">
      {allItems.map(cat => {
        const isActive = activeId === cat.id;
        const Icon = ICONS[cat.id] || Activity;
        
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "relative flex items-center justify-between w-full text-left px-4 py-3 rounded-[var(--radius-pill)] transition-colors group",
              isActive ? "text-[var(--color-primary)]" : "text-[var(--color-secondary)] hover:text-[var(--color-primary)]"
            )}
          >
            {/* Animated Background Pill */}
            {isActive && (
              <motion.div
                layoutId="sidebarActive"
                className="absolute inset-0 bg-[var(--color-surface-alt)] rounded-[var(--radius-pill)] z-0"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            
            <div className="relative z-10 flex items-center gap-3">
               <Icon size={18} strokeWidth={1.5} />
               <span className="text-[15px] font-medium">{cat.label}</span>
            </div>
            
            {cat.meta && (
              <div className="relative z-10">
                 <span className="text-[12px] font-medium bg-[var(--color-surface)] px-2.5 py-1 rounded-full shadow-sm text-[var(--color-secondary)]">
                   {cat.meta}
                 </span>
              </div>
            )}
          </button>
        );
      })}

      <div className="mt-8 px-4">
        <button className="w-full py-3.5 px-4 bg-[var(--color-accent-lime)] text-[var(--color-accent-lime-ink)] rounded-[var(--radius-pill)] text-[14px] font-medium shadow-sm hover:opacity-90 transition-opacity">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}
