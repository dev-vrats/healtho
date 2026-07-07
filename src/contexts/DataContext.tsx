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
}

const DataContext = createContext<DataContextType>({
  data: null,
  loading: true,
});

export function DataProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<typeof mockData | null>(null);
  const [loading, setLoading] = useState(true);
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

    const userDocRef = doc(db, "users", user.uid);

    const initializeData = async () => {
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        // Seed with baseline data
        await setDoc(userDocRef, mockData);
      }
    };

    initializeData().then(() => {
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data() as typeof mockData);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    });
  }, [user, authLoading, pathname, router]);

  return (
    <DataContext.Provider value={{ data, loading: loading || authLoading }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
