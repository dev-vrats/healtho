"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mockData } from "@/lib/mockData";
import { Sidebar } from "@/components/Sidebar";
import { StatusPill, BiomarkerCard } from "@/components/UIPrimitives";
import { VitalityScoreCard, BiologicalAgeCard } from "@/components/HeroCards";
import { TimelineStrip } from "@/components/TimelineStrip";
import { Heart, Leaf, Activity } from "lucide-react";

export default function DataPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredBiomarkers = activeCategory === "all" 
    ? mockData.biomarkers 
    : mockData.biomarkers.filter(bm => bm.category === activeCategory);

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-12 pb-20">
      <Sidebar 
        categories={mockData.categories} 
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
            {mockData.user.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <StatusPill variant="neutral">Total {mockData.summary.total}</StatusPill>
            <StatusPill variant="highlight">{mockData.summary.optimal} Optimal</StatusPill>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-12"
          >
            {activeCategory === "all" ? (
              <>
                <TimelineStrip 
                  history={mockData.trend.history} 
                  insightLabel={mockData.trend.label}
                  insightDelta={mockData.trend.delta}
                />
                
                <div className="flex flex-col sm:flex-row gap-6">
                  <VitalityScoreCard value={mockData.scores.vitalityScore.value} status={mockData.scores.vitalityScore.status} />
                  <BiologicalAgeCard age={mockData.scores.biologicalAge.value} deltaLabel={mockData.scores.biologicalAge.deltaLabel} />
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-[28px] font-medium mb-1 tracking-tight">Biomarkers</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBiomarkers.map((bm, i) => (
                       <BiomarkerCard 
                         key={i}
                         icon={bm.category === "heart" ? Heart : (bm.category === "nutrients" ? Leaf : Activity)}
                         label={bm.label}
                         value={bm.value}
                         unit={bm.unit}
                         status={bm.status}
                       />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-6">
                <h2 className="text-[28px] font-medium mb-1 tracking-tight capitalize">{activeCategory} Health</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBiomarkers.length > 0 ? filteredBiomarkers.map((bm, i) => (
                     <BiomarkerCard 
                       key={i}
                       icon={bm.category === "heart" ? Heart : (bm.category === "nutrients" ? Leaf : Activity)}
                       label={bm.label}
                       value={bm.value}
                       unit={bm.unit}
                       status={bm.status}
                     />
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
