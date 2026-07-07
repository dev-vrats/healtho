"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="bg-[var(--color-surface)] p-8 rounded-3xl shadow-[var(--shadow-card)] border border-[var(--color-hairline)] relative overflow-hidden">
          {/* Subtle decorative mesh */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-[var(--color-lime)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
          
          <h1 className="text-[32px] font-medium tracking-tight mb-2">
            {isLogin ? "Welcome back" : "Join Healtho"}
          </h1>
          <p className="text-[15px] text-[var(--color-secondary)] mb-8">
            {isLogin ? "Sign in to view your health data." : "Create an account to start tracking."}
          </p>

          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              className="bg-red-50 text-red-600 p-3 rounded-xl text-[14px] mb-6 border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[14px] font-medium block">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[var(--color-lime)] focus:ring-1 focus:ring-[var(--color-lime)] transition-colors"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[14px] font-medium block">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[var(--color-lime)] focus:ring-1 focus:ring-[var(--color-lime)] transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-[var(--color-primary)] text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[14px] text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
