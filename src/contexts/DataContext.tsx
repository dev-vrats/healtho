"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./AuthContext";
import { mockData } from "@/lib/mockData";
import { useRouter, usePathname } from "next/navigation";

interface DataContextType {
  data: typeof mockData | null;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType>({
  data: null,
  loading: true,
  error: null,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<typeof mockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setData(null);
      setLoading(false);
      // Protect routes
      if (pathname !== "/login") {
        router.push("/login");
      }
      return;
    }

    let unsubscribe: () => void;
    const userDocRef = doc(db, "users", user.uid);

    const initializeData = async () => {
      try {
        const docSnap = await getDoc(userDocRef);
        if (!docSnap.exists()) {
          // Customize the baseline data with the user's actual name/email
          const userName = user.displayName || user.email?.split('@')[0] || "User";
          const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1);
          
          const seededData = {
            ...mockData,
            user: { name: capitalizedName }
          };

          // Seed with baseline data
          await setDoc(userDocRef, seededData);
        }
      } catch (err: any) {
        console.error("Error initializing data:", err);
        if (err.message?.includes("Missing or insufficient permissions")) {
          setError("Firestore Permission Denied. Please update your Firestore Rules in the Firebase Console to allow read/write for authenticated users.");
        } else {
          setError(err.message || "Failed to load data.");
        }
        setLoading(false);
      }
    };

    initializeData().then(() => {
      if (error) return; // Don't subscribe if initialize failed
      unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data() as typeof mockData);
        }
        setLoading(false);
      }, (err: any) => {
        console.error("Snapshot error:", err);
        if (err.message?.includes("Missing or insufficient permissions")) {
          setError("Firestore Permission Denied. Please update your Firestore Rules in the Firebase Console to allow read/write for authenticated users.");
        } else {
          setError(err.message || "Failed to load data stream.");
        }
        setLoading(false);
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, authLoading, pathname, router, error]);

  return (
    <DataContext.Provider value={{ data, loading: loading || authLoading, error }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
