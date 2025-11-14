"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

type AuthProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (user) {
      router.replace("/profile");
    }
  }, [user, router]);

  return children;
}