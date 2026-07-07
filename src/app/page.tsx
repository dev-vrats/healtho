"use client";

import { motion, Variants } from "framer-motion";
import { Upload, Target, Heart, Leaf, ChevronRight } from "lucide-react";
import { mockData } from "@/lib/mockData";
import { TimelineStrip } from "@/components/TimelineStrip";
import { VitalityScoreCard, BiologicalAgeCard, PendingResultCard } from "@/components/HeroCards";
import { QuickActionCard, BiomarkerCard, ProductCard, StatusPill } from "@/components/UIPrimitives";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function Dashboard() {
  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="show"
      className="max-w-4xl mx-auto flex flex-col gap-10 pb-20"
    >
      {/* Header section */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h1 className="text-[44px] font-medium tracking-tight leading-tight">
          {mockData.user.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill variant="neutral">Total {mockData.summary.total}</StatusPill>
          <StatusPill variant="highlight">{mockData.summary.optimal} Optimal</StatusPill>
          <StatusPill variant="neutral">{mockData.summary.inRange} In range</StatusPill>
          <StatusPill variant="neutral">{mockData.summary.outOfRange} Out of range</StatusPill>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={itemVariants} className="w-full">
        <TimelineStrip 
          history={mockData.trend.history} 
          insightLabel={mockData.trend.label}
          insightDelta={mockData.trend.delta}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActionCard 
          icon={Upload} 
          title="Upload Records" 
          description="Add historical data or external lab results." 
        />
        <QuickActionCard 
          icon={Target} 
          title="Connect Tracker" 
          description="Sync your wearable for continuous insights."
          colorClass="text-[var(--color-pink-soft)]"
        />
      </motion.div>

      {/* Hero Cards */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6">
        <VitalityScoreCard value={mockData.scores.vitalityScore.value} status={mockData.scores.vitalityScore.status} />
        <BiologicalAgeCard age={mockData.scores.biologicalAge.value} deltaLabel={mockData.scores.biologicalAge.deltaLabel} />
        <PendingResultCard min={mockData.pendingResults.etaDaysMin} max={mockData.pendingResults.etaDaysMax} note={mockData.pendingResults.note} />
      </motion.div>

      {/* Biomarkers */}
      <motion.div variants={itemVariants} className="space-y-6 pt-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-[28px] font-medium mb-1 tracking-tight">Biomarkers</h2>
            <p className="text-[15px] text-[var(--color-secondary)]">A snapshot of what's happening inside your body.</p>
          </div>
          <Link href="/data" className="text-[14px] font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors">
            See all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mockData.biomarkers.map((bm, i) => (
             <BiomarkerCard 
               key={i}
               icon={bm.category === "heart" ? Heart : Leaf}
               label={bm.label}
               value={bm.value}
               unit={bm.unit}
               status={bm.status}
             />
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div variants={itemVariants} className="space-y-6 pt-4">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-[28px] font-medium mb-1 tracking-tight">Recommended for You</h2>
          </div>
          <button className="text-[14px] font-medium text-[var(--color-secondary)] hover:text-[var(--color-primary)] flex items-center gap-1 transition-colors">
            See all <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {mockData.recommendations.map((rec, i) => (
             <ProductCard 
               key={i}
               name={rec.name}
               price={rec.price}
               tag={rec.tag}
             />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
