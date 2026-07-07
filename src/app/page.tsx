"use client";

import { motion, Variants } from "framer-motion";
import { Upload, Target, Heart, Leaf, ChevronRight } from "lucide-react";
import { TimelineStrip } from "@/components/TimelineStrip";
import { VitalityScoreCard, BiologicalAgeCard, PendingResultCard } from "@/components/HeroCards";
import { QuickActionCard, BiomarkerCard, ProductCard, StatusPill } from "@/components/UIPrimitives";
import Link from "next/link";
import { useData } from "@/contexts/DataContext";
import { useEffect, useState } from "react";
import { generateHealthInsight } from "@/lib/ai";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Dashboard() {
  const { data, loading } = useData();
  const [insight, setInsight] = useState("");

  useEffect(() => {
    if (data && data.biomarkers) {
      // Fetch AI insight when data is ready
      generateHealthInsight(data.biomarkers).then(setInsight);
    }
  }, [data]);

  if (loading || !data) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

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
          {data.user.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill variant="neutral">Total {data.summary.total}</StatusPill>
          <StatusPill variant="highlight">{data.summary.optimal} Optimal</StatusPill>
          <StatusPill variant="neutral">{data.summary.inRange} In range</StatusPill>
          <StatusPill variant="neutral">{data.summary.outOfRange} Out of range</StatusPill>
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div variants={itemVariants} className="w-full">
        <TimelineStrip 
          history={data.trend.history} 
          insightLabel={insight || "Analyzing your data..."}
          insightDelta={data.trend.delta}
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
        <VitalityScoreCard value={data.scores.vitalityScore.value} status={data.scores.vitalityScore.status} />
        <BiologicalAgeCard age={data.scores.biologicalAge.value} deltaLabel={data.scores.biologicalAge.deltaLabel} />
        <PendingResultCard min={data.pendingResults.etaDaysMin} max={data.pendingResults.etaDaysMax} note={data.pendingResults.note} />
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
          {data.biomarkers.map((bm: any, i: number) => (
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
          {data.recommendations.map((rec: any, i: number) => (
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
