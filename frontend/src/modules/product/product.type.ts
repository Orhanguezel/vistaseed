import type { ProductAgriculturalMetadata } from "@agro/shared-types";

export interface Product extends ProductAgriculturalMetadata {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  /** Kamuya acik API artik fiyat donmez; bayi katalogunda ayri alanlar kullanilir. */
  price?: number;
  image_url: string | null;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  order_num: number;
  product_code: string | null;
  stock_quantity: number;
  rating: number;
  review_count: number;
  tags: string[];
  specifications: Record<string, string>;
  meta_title: string | null;
  meta_description: string | null;
  category?: { id: string; name: string; slug: string } | null;
  sub_category?: { id: string; name: string; slug: string } | null;
  created_at: string;
  updated_at: string;
}

export interface ProductListParams {
  q?: string;
  category_id?: string;
  is_active?: boolean;
  locale?: string;
  limit?: number;
  offset?: number;
  sort?: string;
  order?: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  image_url?: string | null;
  description?: string | null;
}

export interface ProductSpec {
  id: string;
  product_id: string;
  locale: string;
  name: string;
  value: string;
  category: "physical" | "material" | "service" | "custom";
  order_num: number;
}

export interface ProductReview {
  id: string;
  product_id: string;
  rating: number;
  comment: string | null;
  customer_name: string | null;
  review_date: string;
}

export interface ProductFaq {
  id: string;
  product_id: string;
  question: string;
  answer: string;
  display_order: number;
}
