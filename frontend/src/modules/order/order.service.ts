// src/modules/order/order.service.ts
import { apiGet, apiPost, apiPatch } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { Order, OrderListQuery, CreateOrderData, OrderIyzicoInitResponse } from "./order.type";

export async function listOrders(query?: OrderListQuery) {
  const res = await apiGet<{
    data: Array<Order & { total?: string }>;
    total: number;
    limit: number;
    offset: number;
  }>(API.orders.list, query);
  return {
    ...res,
    data: res.data.map((o) => ({
      ...o,
      total_amount: parseFloat(String(o.total_amount ?? o.total ?? 0)),
    })),
  };
}

type OrderDetailRaw = Omit<Order, "items"> & {
  total?: string;
  items?: Array<{
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    unit_price?: string;
    total_price?: string;
    product_title?: string;
    price_at_order?: number;
  }>;
};

export async function getOrder(id: string) {
  const raw = await apiGet<OrderDetailRaw>(API.orders.detail(id));
  const items: Order["items"] = (raw.items ?? []).map((it) => ({
    id: it.id,
    order_id: it.order_id,
    product_id: it.product_id,
    product_title: it.product_title,
    quantity: Number(it.quantity),
    price_at_order: parseFloat(String(it.unit_price ?? it.price_at_order ?? 0)),
    total_price: parseFloat(String(it.total_price ?? 0)),
  }));
  return {
    ...raw,
    total_amount: parseFloat(String(raw.total_amount ?? raw.total ?? 0)),
    items,
  };
}

export async function createOrder(data: CreateOrderData) {
  const raw = await apiPost<Order & { total?: string; dealer_id?: string }>(API.orders.create, data);
  return {
    ...raw,
    total_amount: parseFloat(String(raw.total_amount ?? raw.total ?? 0)),
  };
}

export async function cancelOrder(id: string) {
  return apiPatch<{ success: boolean; message: string }>(API.orders.cancel(id));
}

export async function initiateOrderIyzicoPayment(orderId: string, locale?: string) {
  const qs = locale ? `?locale=${encodeURIComponent(locale)}` : "";
  return apiPost<OrderIyzicoInitResponse>(`${API.orders.paymentIyzicoInit(orderId)}${qs}`, {});
}

export async function initiateOrderBankTransfer(orderId: string) {
  return apiPost<{ success: boolean; payment_method: string; payment_status: string }>(
    API.orders.paymentBankTransfer(orderId),
    {},
  );
}

export async function initiateOrderCreditPayment(orderId: string) {
  return apiPost<{ success: boolean; payment_method: string; payment_status: string }>(
    API.orders.paymentCredit(orderId),
    {},
  );
}
