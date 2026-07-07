"use client";

import { motion } from "framer-motion";
import { DotMatrixNumber } from "./DotMatrixNumber";
import { X, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

const noiseBg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

export function VitalityScoreCard({ value, status }: { value: number, status: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-[var(--radius-lg)] p-8 text-white shadow-[var(--shadow-card)] transition-shadow bg-neutral-900 flex-1 min-w-[280px]"
    >
      <motion.div 
        className="absolute -inset-[20%] pointer-events-none opacity-90 mix-blend-screen"
        animate={{ 
          backgroundPosition: ['0% 0%', '15px 15px', '-15px -15px', '0% 0%'] 
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        style={{
          filter: "blur(50px) saturate(1.15)",
          background: `
            radial-gradient(circle at 25% 10%, var(--color-orange-soft) 0%, transparent 55%),
            radial-gradient(circle at 75% 85%, var(--color-green-deep) 0%, transparent 60%),
            radial-gradient(circle at 20% 90%, var(--color-green-soft) 0%, transparent 50%)
          `,
          backgroundSize: '120% 120%'
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: noiseBg }}
      />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <h3 className="text-[15px] font-medium opacity-90">Vitality Score</h3>
        <div className="mt-8 mb-4">
          <DotMatrixNumber value={value} color="white" dotSize={8} gap={3} />
        </div>
        <div className="text-[14px] font-medium opacity-90">{status}</div>
      </div>
    </motion.div>
  );
}

export function BiologicalAgeCard({ age, deltaLabel }: { age: number, deltaLabel: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-[var(--radius-lg)] p-8 text-white shadow-[var(--shadow-card)] transition-shadow bg-neutral-900 flex-1 min-w-[280px]"
    >
      <motion.div 
        className="absolute -inset-[20%] pointer-events-none opacity-90 mix-blend-screen"
        animate={{ 
          backgroundPosition: ['0% 0%', '-15px 15px', '15px -15px', '0% 0%'] 
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{
          filter: "blur(50px) saturate(1.15)",
          background: `
            radial-gradient(circle at 15% 30%, var(--color-blue-soft) 0%, transparent 55%),
            radial-gradient(circle at 85% 70%, var(--color-orange-deep) 0%, transparent 60%)
          `,
          backgroundSize: '120% 120%'
        }}
      />
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: noiseBg }}
      />
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <h3 className="text-[15px] font-medium opacity-90">Biological Age</h3>
        <div className="mt-8 mb-4">
          <DotMatrixNumber value={age} color="white" dotSize={8} gap={3} />
        </div>
        <div className="text-[14px] font-medium opacity-90">{deltaLabel}</div>
      </div>
    </motion.div>
  );
}

export function PendingResultCard({ min, max, note }: { min: number, max: number, note: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-[var(--radius-lg)] p-8 text-[var(--color-primary)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition-shadow flex-1 min-w-[280px]"
    >
      <button className="absolute top-6 right-6 text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors">
        <X size={20} strokeWidth={1.5} />
      </button>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <h3 className="text-[15px] font-medium">Results pending</h3>
        
        <div className="flex items-end gap-3 mt-8 mb-4">
           <DotMatrixNumber value={`${min}-${max}`} color="var(--color-primary)" dotSize={6} gap={2} />
           <span className="text-[13px] font-medium text-[var(--color-secondary)] mb-[2px] uppercase tracking-wide">Days</span>
        </div>
        
        <div className="relative w-full h-1 bg-[var(--color-canvas)] rounded-full overflow-hidden mb-4">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-secondary)] to-transparent opacity-20"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <p className="text-[14px] text-[var(--color-secondary)] pr-12 leading-relaxed">
          {note}
        </p>
      </div>

      <div className="absolute bottom-6 right-6 opacity-10">
        <FlaskConical size={64} strokeWidth={1} />
      </div>
    </motion.div>
  );
}
