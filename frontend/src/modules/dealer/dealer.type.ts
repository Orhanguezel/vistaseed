// src/modules/dealer/dealer.type.ts

export interface DealerProfile {
  id: string;
  user_id: string;
  company_name?: string;
  logo_url?: string | null;
  tax_number?: string;
  tax_office?: string;
  city?: string | null;
  region?: string | null;
  credit_limit: number;
  current_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type DealerTransactionType = 'order' | 'payment' | 'refund' | 'adjustment';

export interface DealerTransaction {
  id: string;
  dealer_id: string;
  order_id?: string;
  type: DealerTransactionType;
  amount: number;
  balance_after: number;
  description?: string;
  created_at: string;
}

export interface DealerBalanceResponse {
  balance: number;
  credit_limit: number;
  available_limit: number;
}

export interface FinanceSummary {
  credit_limit: number;
  current_balance: number;
  available: number;
  discount_rate: number;
  transaction_count: number;
  totals_by_type: Record<string, number>;
  overdue_count: number;
  warnings: string[];
}

export interface DealerTransactionRow {
  id: string;
  type: string;
  amount: string;
  balance_after: string;
  description: string | null;
  order_id: string | null;
  due_date: string | null;
  created_at: string;
}

export interface TransactionsListResponse {
  data: DealerTransactionRow[];
  total: number;
  page: number;
  limit: number;
}

export type DealerDirectCardInitResponse =
  | { provider: 'craftgate'; pageUrl: string; checkoutId?: string }
  | { provider: 'ziraatpay'; pageUrl: string }
  | { provider: 'nestpay_isbank' | 'halkode' | 'ziraatpay'; formHtml: string }
  | { provider: 'halkode'; redirectUrl: string };

/** GET /dealer/products */
export interface DealerCatalogProduct {
  id: string;
  title: string;
  slug: string;
  image_url: string | null;
  images: string[];
  product_code: string | null;
  list_price: string;
  unit_price: string;
  discount_percent: number;
  category?: { name: string | null; slug: string | null } | null;
}

export interface DealerCatalogResponse {
  data: DealerCatalogProduct[];
  total: number;
  discount_rate: number;
}
