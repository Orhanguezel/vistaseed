import { apiGet } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type { Product, ProductCategory } from "./product.type";

export async function getProducts(params?: Record<string, string>): Promise<Product[]> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  return apiGet<Product[]>(`${API.products.list}${query}`);
}

export async function getProductBySlug(slug: string, locale = "tr"): Promise<Product> {
  return apiGet<Product>(`${API.products.detail(slug)}?locale=${locale}`);
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  return apiGet<ProductCategory[]>(API.products.categories);
}
