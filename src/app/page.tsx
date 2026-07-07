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
import { UploadModal } from "@/components/UploadModal";

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
  const { data, loading, error } = useData();
  const [insight, setInsight] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (data && data.biomarkers) {
      generateHealthInsight(data.biomarkers).then(setInsight);
    }
  }, [data]);

  if (error) return (
    <div className="flex flex-col justify-center items-center h-[50vh] text-center max-w-md mx-auto">
      <div className="text-red-500 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-[20px] font-medium mb-2">Setup Required</h2>
      <p className="text-[15px] text-[var(--color-secondary)]">{error}</p>
      <div className="mt-6 text-[14px] bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-hairline)] text-left w-full">
        <p className="font-medium mb-2">How to fix:</p>
        <ol className="list-decimal pl-4 space-y-1 text-[var(--color-secondary)]">
          <li>Go to Firebase Console</li>
          <li>Select <strong>Firestore Database</strong></li>
          <li>Click the <strong>Rules</strong> tab</li>
          <li>Replace everything with:</li>
        </ol>
        <pre className="mt-3 bg-black/5 p-3 rounded-lg overflow-x-auto text-xs font-mono text-[var(--color-primary)]">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}`}
        </pre>
      </div>
    </div>
  );

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
        <div onClick={() => setIsUploadModalOpen(true)} className="cursor-pointer">
          <QuickActionCard 
            icon={Upload} 
            title="Upload Records" 
            description="Add historical data or external lab results." 
          />
        </div>
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

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />
    </motion.div>
  );
}
