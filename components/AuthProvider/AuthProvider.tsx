"use client";

import { useEffect, useState, type ReactNode } from "react";
import { checkSession } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isChecking, setIsChecking] = useState(true);
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated
  );

  useEffect(() => {
    let isMounted = true;

    async function syncAuth() {
      try {
        const user = await checkSession();

        if (!isMounted) return;

        if (user) {
          setUser(user); 
        } else {
          clearIsAuthenticated();
        }
      } finally {
        if (isMounted) setIsChecking(false);
      }
    }

    syncAuth();
    return () => {
      isMounted = false;
    };
  }, [setUser, clearIsAuthenticated]);

  if (isChecking) {
    return <div>Loading...</div>;
  }
  return <>{children}</>;
}