// src/modules/order/order.store.ts
import { create } from "zustand";
import type { Order } from "./order.type";
import * as orderService from "./order.service";

interface OrderStore {
  orders: Order[];
  totalOrders: number;
  isLoading: boolean;
  error: string | null;

  fetchOrders: (query?: any) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  orders: [],
  totalOrders: 0,
  isLoading: false,
  error: null,

  fetchOrders: async (query?: any) => {
    set({ isLoading: true, error: null });
    try {
      const res = await orderService.listOrders(query);
      set({ orders: res.data, totalOrders: res.total, isLoading: false });
    } catch (err) {
      set({ error: "siparisler_yuklenemedi", isLoading: false });
    }
  },

  setLoading: (isLoading: boolean) => set({ isLoading }),
}));
