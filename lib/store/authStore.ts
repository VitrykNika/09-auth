"use client";

import { create } from "zustand";
import type { User } from "@/types/user";

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearIsAuthenticated: () => void;
  logout: () => void; 
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: true }),

  clearIsAuthenticated: () => set({
    user: null,
    isAuthenticated: false,
  }),
  
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));