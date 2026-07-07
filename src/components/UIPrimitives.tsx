"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import { DotMatrixNumber } from "./DotMatrixNumber";

export function StatusPill({ 
  children, 
  variant = "neutral", 
  className 
}: { 
  children: React.ReactNode; 
  variant?: "neutral" | "highlight"; 
  className?: string;
}) {
  return (
    <span className={cn(
      "inline-flex items-center px-3.5 py-1.5 rounded-[var(--radius-pill)] text-[12px] font-medium transition-colors",
      variant === "neutral" 
        ? "bg-[var(--color-surface-alt)] text-[var(--color-secondary)]" 
        : "bg-[var(--color-accent-lime)] text-[var(--color-accent-lime-ink)]",
      className
    )}>
      {children}
    </span>
  );
}

interface BiomarkerCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  status: "optimal" | "in-range" | "out-of-range";
}

export function BiomarkerCard({ icon: Icon, label, value, unit, status }: BiomarkerCardProps) {
  return (
    <div className="bg-[var(--color-surface)] p-5 rounded-[var(--radius-md)] shadow-[var(--shadow-card)] flex flex-col h-full hover:-translate-y-1 transition-transform duration-200">
      <div className="flex items-center gap-2 mb-6">
        <Icon size={18} className="text-[var(--color-primary)]" strokeWidth={1.5} />
        <span className="text-[14px] font-medium">{label}</span>
      </div>
      
      <div className="flex items-end gap-1.5 mb-5 mt-auto">
        <DotMatrixNumber value={value} color="var(--color-primary)" dotSize={4.5} gap={1.5} />
        <span className="text-[12px] font-medium text-[var(--color-secondary)] mb-0.5">{unit}</span>
      </div>
      
      <div className="flex h-1 gap-1 w-full opacity-80">
        <div className={cn("h-full rounded-full flex-1", status === "optimal" ? "bg-[var(--color-green-soft)]" : "bg-[var(--color-canvas)]")} />
        <div className={cn("h-full rounded-full flex-[2]", status === "in-range" || status === "optimal" ? "bg-[var(--color-green-deep)]" : "bg-[var(--color-canvas)]")} />
        <div className={cn("h-full rounded-full flex-1", status === "out-of-range" ? "bg-[var(--color-pink-deep)]" : "bg-[var(--color-canvas)]")} />
      </div>
    </div>
  );
}

export function ProductCard({ name, price, tag }: { name: string, price: number, tag: "Best Seller" | "Fair Price" }) {
  return (
    <div className="bg-[var(--color-surface)] p-4 rounded-[var(--radius-md)] shadow-[var(--shadow-card)] hover:-translate-y-1 transition-transform duration-200">
      <div className="relative aspect-square rounded-[var(--radius-sm)] mb-4 overflow-hidden bg-[var(--color-canvas)]">
        {/* Abstract product visual (sphere) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#EBEBE9] to-[#F7F7F5] flex items-center justify-center">
           <div className="w-2/3 h-2/3 rounded-full bg-gradient-to-br from-white to-[#D2D2CF] shadow-inner" />
        </div>
        <div className="absolute top-3 left-3">
          <StatusPill variant={tag === "Best Seller" ? "highlight" : "neutral"}>{tag}</StatusPill>
        </div>
      </div>
      <h4 className="text-[15px] font-medium mb-1 truncate">{name}</h4>
      <div className="text-[14px] text-[var(--color-secondary)] tabular-nums">${price.toFixed(2)}</div>
    </div>
  );
}

export function QuickActionCard({ 
  icon: Icon, 
  title, 
  description, 
  colorClass = "text-[var(--color-primary)]" 
}: { 
  icon: LucideIcon; 
  title: string; 
  description: string; 
  colorClass?: string;
}) {
  return (
    <div className="bg-[var(--color-surface)] p-6 rounded-[var(--radius-md)] shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow cursor-pointer flex flex-col justify-between min-h-[160px] flex-1 min-w-[200px]">
      <div className="flex justify-end">
        <div className="w-10 h-10 rounded-full bg-[var(--color-canvas)] flex items-center justify-center hover:bg-[var(--color-surface-alt)] transition-colors">
          <Icon size={18} className={colorClass} strokeWidth={1.5} />
        </div>
      </div>
      <div>
        <h4 className="text-[15px] font-medium mb-1">{title}</h4>
        <p className="text-[14px] text-[var(--color-secondary)]">{description}</p>
      </div>
    </div>
  );
}
