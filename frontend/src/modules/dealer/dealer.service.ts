// src/modules/dealer/dealer.service.ts
import { apiGet } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type {
  DealerProfile,
  DealerBalanceResponse,
  DealerTransaction,
  DealerCatalogResponse,
} from "./dealer.type";

export async function fetchDealerProfile() {
  return apiGet<DealerProfile>(API.dealer.profile);
}

export async function fetchDealerBalance() {
  return apiGet<DealerBalanceResponse>(API.dealer.balance);
}

export async function fetchDealerCatalog(params?: {
  locale?: string;
  q?: string;
  limit?: number;
  offset?: number;
}) {
  return apiGet<DealerCatalogResponse>(API.dealer.catalog, params);
}

export async function listDealerTransactions(query?: { limit?: number; offset?: number }) {
  return apiGet<{ data: DealerTransaction[]; total: number; limit: number; offset: number }>(API.dealer.transactions, query);
}
