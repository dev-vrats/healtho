"use client";

import { motion } from "framer-motion";
import { FileText, Upload, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UploadModal } from "@/components/UploadModal";

export default function RecordsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const records = [
    { id: 1, name: "Comprehensive Metabolic Panel", date: "June 01, 2026", type: "Lab Report" },
    { id: 2, name: "Lipid Panel", date: "May 15, 2026", type: "Lab Report" },
    { id: 3, name: "Vitamin D Status", date: "April 02, 2026", type: "Blood Test" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-4xl mx-auto pb-20"
    >
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-[44px] font-medium tracking-tight leading-tight">Records</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white px-5 py-2.5 rounded-[var(--radius-pill)] text-[14px] font-medium hover:opacity-90 transition-opacity"
        >
          <Upload size={16} strokeWidth={1.5} />
          Upload Record
        </button>
      </div>

      <div className="bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] overflow-hidden">
        {records.map((record) => (
          <div 
            key={record.id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-[var(--color-hairline)] last:border-0 hover:bg-[var(--color-surface-alt)] transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="w-12 h-12 rounded-full bg-[var(--color-canvas)] flex items-center justify-center text-[var(--color-primary)] group-hover:bg-white transition-colors">
                <FileText size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[16px] font-medium mb-1">{record.name}</h3>
                <div className="text-[14px] text-[var(--color-secondary)] flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} strokeWidth={1.5} />
                    {record.date}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[var(--color-hairline)]" />
                  <span>{record.type}</span>
                </div>
              </div>
            </div>
            <button className="text-[14px] font-medium text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-colors self-start sm:self-center">
              View
            </button>
          </div>
        ))}
      </div>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </motion.div>
  );
}
