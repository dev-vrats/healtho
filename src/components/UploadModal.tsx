"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useRef } from "react";
import { analyzeMedicalReport } from "@/lib/ai";
import { useData } from "@/contexts/DataContext";
import { useAuth } from "@/contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "analyzing" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { data } = useData();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file || !user || !data) return;
    
    setStatus("analyzing");
    
    try {
      // 1. Convert file to Base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const result = reader.result as string;
          // Strip the data URL prefix (e.g., "data:image/jpeg;base64,")
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = error => reject(error);
      });

      // 2. Call Gemini
      const newBiomarkers = await analyzeMedicalReport(base64Data, file.type);
      
      if (!Array.isArray(newBiomarkers) || newBiomarkers.length === 0) {
        throw new Error("No data found in this report.");
      }

      // 3. Merge with existing data
      const existingBiomarkers = [...data.biomarkers];
      
      newBiomarkers.forEach((newBm) => {
        const index = existingBiomarkers.findIndex(bm => bm.label.toLowerCase() === newBm.label.toLowerCase());
        if (index >= 0) {
          existingBiomarkers[index] = newBm;
        } else {
          existingBiomarkers.push(newBm);
        }
      });

      // Calculate new summary
      const total = existingBiomarkers.length;
      const optimal = existingBiomarkers.filter(b => (b.status as string) === "optimal").length;
      const inRange = existingBiomarkers.filter(b => (b.status as string) === "in-range").length;
      const outOfRange = existingBiomarkers.filter(b => (b.status as string) === "out-of-range").length;

      // Update Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        biomarkers: existingBiomarkers,
        summary: { total, optimal, inRange, outOfRange }
      });

      setStatus("success");
      
      // Auto close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);

    } catch (error: any) {
      console.error(error);
      setStatus("error");
      setErrorMsg(error.message || "Failed to analyze document.");
    }
  };

  const handleClose = () => {
    setFile(null);
    setStatus("idle");
    setErrorMsg("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={status === "analyzing" ? undefined : handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[var(--color-surface)] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 relative">
                <button 
                  onClick={handleClose}
                  disabled={status === "analyzing"}
                  className="absolute right-6 top-6 text-[var(--color-secondary)] hover:text-black transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
                
                <h2 className="text-2xl font-medium tracking-tight mb-2">Upload Report</h2>
                <p className="text-[15px] text-[var(--color-secondary)] mb-6">
                  Upload a PDF or Image of your lab results. Gemini AI will instantly analyze and sync it.
                </p>

                {status === "success" ? (
                  <div className="flex flex-col items-center justify-center py-10 text-green-600">
                    <CheckCircle2 size={48} className="mb-4" />
                    <p className="text-lg font-medium">Successfully Synced!</p>
                  </div>
                ) : (
                  <>
                    <div 
                      onClick={() => status !== "analyzing" && fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
                        ${file ? 'border-[var(--color-primary)] bg-[var(--color-surface-alt)]' : 'border-gray-200 hover:border-gray-300'}
                        ${status === "analyzing" ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                        accept="application/pdf,image/png,image/jpeg,image/webp"
                        className="hidden"
                      />
                      
                      {file ? (
                        <>
                          <CheckCircle2 size={32} className="text-[var(--color-primary)] mb-3" />
                          <p className="font-medium text-black">{file.name}</p>
                          <p className="text-[13px] text-[var(--color-secondary)] mt-1">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={32} className="text-[var(--color-secondary)] mb-3" />
                          <p className="font-medium text-black mb-1">Click to browse</p>
                          <p className="text-[13px] text-[var(--color-secondary)]">PDF, PNG, or JPG (max 5MB)</p>
                        </>
                      )}
                    </div>

                    {status === "error" && (
                      <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {errorMsg}
                      </div>
                    )}

                    <div className="mt-6 flex gap-3">
                      <button 
                        onClick={handleClose}
                        disabled={status === "analyzing"}
                        className="flex-1 py-3 px-4 rounded-xl font-medium text-[var(--color-secondary)] hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleUpload}
                        disabled={!file || status === "analyzing"}
                        className="flex-1 py-3 px-4 rounded-xl font-medium bg-[var(--color-primary)] text-white hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {status === "analyzing" ? (
                          <>
                            <Loader2 size={18} className="animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          "Upload & Analyze"
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
