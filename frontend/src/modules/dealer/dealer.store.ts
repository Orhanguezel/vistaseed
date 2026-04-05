// src/modules/dealer/dealer.store.ts
import { create } from "zustand";
import type { DealerProfile, DealerBalanceResponse } from "./dealer.type";
import * as dealerService from "./dealer.service";

interface DealerStore {
  profile: DealerProfile | null;
  balance: DealerBalanceResponse | null;
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  fetchBalance: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDealerStore = create<DealerStore>((set) => ({
  profile: null,
  balance: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await dealerService.fetchDealerProfile();
      set({ profile, isLoading: false });
    } catch (err) {
      set({ error: "profil_yuklenemedi", isLoading: false });
    }
  },

  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      const balance = await dealerService.fetchDealerBalance();
      set({ balance, isLoading: false });
    } catch (err) {
      set({ error: "bakiye_yuklenemedi", isLoading: false });
    }
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}));
