"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as authApi from "@/lib/api/auth";
import type { LoginPayload, RegisterPayload, User } from "@/types/api";

interface AuthState {
  user: User | null;
  token: string | null;
  isHydrated: boolean;
  isLoading: boolean;
  setHydrated: () => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isHydrated: false,
      isLoading: false,

      setHydrated: () => set({ isHydrated: true }),

      login: async (payload) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authApi.login(payload);
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (payload) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authApi.register(payload);
          set({ user, token, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { token } = get();
        if (token) {
          try {
            await authApi.logout(token);
          } catch {
            // ignore logout errors
          }
        }
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        const { token } = get();
        if (!token) return;
        try {
          const { data } = await authApi.getMe(token);
          set({ user: data });
        } catch {
          set({ user: null, token: null });
        }
      },
    }),
    {
      name: "eltiam-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
