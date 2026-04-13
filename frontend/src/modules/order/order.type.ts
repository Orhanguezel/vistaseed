// src/modules/order/order.type.ts

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type OrderPaymentStatus = 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded' | (string & {});
export type OrderPaymentProvider =
  | 'iyzico'
  | 'craftgate'
  | 'nestpay_isbank'
  | 'halkode'
  | 'ziraatpay'
  | 'bank_transfer'
  | 'dealer_credit'
  | (string & {});

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_title?: string;
  quantity: number;
  price_at_order: number;
  total_price: number;
}

export interface Order {
  id: string;
  user_id?: string;
  dealer_id?: string;
  /** API `total` alanindan turetilir */
  total_amount: number;
  total?: string;
  status: OrderStatus;
  notes?: string;
  payment_method?: OrderPaymentProvider | null;
  payment_status?: OrderPaymentStatus | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

/** POST .../orders/:id/payment/iyzico/initiate */
export interface OrderIyzicoInitResponse {
  provider: "iyzico";
  checkoutFormContent: string;
  token: string;
  conversationId: string;
  amount: number;
}

export interface OrderCardInitResponse {
  provider: string;
  mode?: "html" | "redirect";
  checkoutFormContent?: string | null;
  checkoutUrl?: string | null;
  redirectUrl?: string | null;
  paymentPageUrl?: string | null;
  token?: string;
  conversationId?: string;
  amount?: number;
}

export interface CreateOrderData {
  items: {
    product_id: string;
    quantity: number;
  }[];
  notes?: string;
}

export interface OrderListQuery {
  status?: OrderStatus;
  limit?: number;
  offset?: number;
}
