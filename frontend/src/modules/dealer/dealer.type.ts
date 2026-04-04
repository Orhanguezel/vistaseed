// src/modules/dealer/dealer.type.ts

export interface DealerProfile {
  id: string;
  user_id: string;
  company_name?: string;
  tax_number?: string;
  tax_office?: string;
  address?: string;
  phone?: string;
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
