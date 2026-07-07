"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/Sidebar";
import { StatusPill, BiomarkerCard } from "@/components/UIPrimitives";
import { VitalityScoreCard, BiologicalAgeCard } from "@/components/HeroCards";
import { TimelineStrip } from "@/components/TimelineStrip";
import { Heart, Leaf, Activity } from "lucide-react";
import { useData } from "@/contexts/DataContext";

export default function DataPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const { data, loading, error } = useData();

  if (error) return (
    <div className="flex flex-col justify-center items-center h-[50vh] text-center max-w-md mx-auto">
      <div className="text-red-500 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-[20px] font-medium mb-2">Setup Required</h2>
      <p className="text-[15px] text-[var(--color-secondary)]">{error}</p>
    </div>
  );

  if (loading || !data) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const filteredBiomarkers = activeCategory === "all" 
    ? data.biomarkers 
    : data.biomarkers.filter((bm: any) => bm.category === activeCategory);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-12 pb-20">
      <Sidebar 
        categories={data.categories} 
        activeId={activeCategory} 
        onSelect={setActiveCategory} 
      />
      
      <div className="flex-1 min-w-0">
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-4 mb-10"
        >
          <h1 className="text-[44px] font-medium tracking-tight leading-tight">
            {data.user.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill variant="neutral">Total {data.summary.total}</StatusPill>
            <StatusPill variant="highlight">{data.summary.optimal} Optimal</StatusPill>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-12"
          >
            {activeCategory === "all" ? (
              <>
                <TimelineStrip 
                  history={data.trend.history} 
                  insightLabel={data.trend.label}
                  insightDelta={data.trend.delta}
                />
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <VitalityScoreCard value={data.scores.vitalityScore.value} status={data.scores.vitalityScore.status} />
                  <BiologicalAgeCard age={data.scores.biologicalAge.value} deltaLabel={data.scores.biologicalAge.deltaLabel} />
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-[28px] font-medium mb-1 tracking-tight">Biomarkers</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBiomarkers.map((bm: any, i: number) => (
                       <motion.div layoutId={`bm-${bm.label}`} key={bm.label}>
                         <BiomarkerCard 
                           icon={bm.category === "heart" ? Heart : (bm.category === "nutrients" ? Leaf : Activity)}
                           label={bm.label}
                           value={bm.value}
                           unit={bm.unit}
                           status={bm.status}
                         />
                       </motion.div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <h2 className="text-[28px] font-medium mb-1 tracking-tight capitalize">{activeCategory} Health</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBiomarkers.length > 0 ? filteredBiomarkers.map((bm: any, i: number) => (
                    <motion.div layoutId={`bm-${bm.label}`} key={bm.label}>
                       <BiomarkerCard 
                         icon={bm.category === "heart" ? Heart : (bm.category === "nutrients" ? Leaf : Activity)}
                         label={bm.label}
                         value={bm.value}
                         unit={bm.unit}
                         status={bm.status}
                       />
                    </motion.div>
                  )) : (
                    <div className="col-span-full py-12 text-center text-[var(--color-secondary)]">
                      No data available for this category yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
