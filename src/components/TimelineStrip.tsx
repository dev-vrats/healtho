"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface HistoryData {
  date: string;
  value: number;
  status: "optimal" | "normal" | "out-of-range" | "neutral" | string;
}

interface TimelineStripProps {
  history: HistoryData[];
  insightLabel: string;
  insightDelta: string;
}

export function TimelineStrip({ history, insightLabel, insightDelta }: TimelineStripProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate dots to show a long timeline
  const dots = Array.from({ length: 14 }).map((_, i) => {
    const hIdx = i - (14 - history.length);
    if (hIdx >= 0 && history[hIdx]) {
      return history[hIdx];
    }
    return { date: `dummy-${i}`, status: 'neutral', value: 0 };
  });

  return (
    <div className="relative py-8 flex items-center w-full">
      {/* Baseline */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[var(--color-hairline)] -translate-y-1/2 rounded-full" />
      
      {/* Dots */}
      <div className="relative w-full flex justify-between items-center z-10 px-1">
        {dots.map((dot, i) => (
          <div key={dot.date} className="relative group">
             <div className={cn(
               "w-2 h-2 rounded-full ring-4 ring-[var(--color-canvas)] transition-transform duration-300",
               dot.status === 'optimal' ? "bg-[var(--color-green-deep)] hover:scale-150" :
               dot.status === 'normal' ? "bg-[var(--color-blue-soft)] hover:scale-150" :
               dot.status === 'out-of-range' ? "bg-[var(--color-pink-deep)] hover:scale-150" :
               "bg-[var(--color-hairline)]"
             )} />
          </div>
        ))}
      </div>

      {/* Floating Insight Pill */}
      <AnimatePresence>
        {mounted && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.92, y: 10, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="absolute left-[65%] top-1/2 -translate-y-[130%] z-20 origin-bottom"
          >
            <div className="bg-[var(--color-surface)] shadow-[var(--shadow-card-hover)] px-4 py-2.5 rounded-[var(--radius-pill)] flex items-center gap-2 whitespace-nowrap">
               <span className="w-2 h-2 rounded-full bg-[var(--color-green-soft)]" />
               <span className="text-[13px] font-medium text-[var(--color-primary)]">{insightLabel}</span>
               <span className="text-[13px] font-medium text-[var(--color-secondary)]">{insightDelta}</span>
            </div>
            {/* Little connector line dropping down */}
            <div className="absolute left-1/2 -bottom-2 w-[2px] h-3 bg-[var(--color-surface)] -translate-x-1/2 shadow-sm rounded-b-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
