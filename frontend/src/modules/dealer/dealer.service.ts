// src/modules/dealer/dealer.service.ts
import { apiGet, apiPost, apiPut } from "@/lib/api-client";
import { getStoredAccessToken } from "@/lib/auth-token";
import { API } from "@/config/api-endpoints";
import type {
  DealerProfile,
  DealerBalanceResponse,
  DealerTransaction,
  DealerCatalogResponse,
  FinanceSummary,
  DealerTransactionRow,
  TransactionsListResponse,
  DealerDirectCardInitResponse,
} from "./dealer.type";

export async function fetchDealerProfile() {
  return apiGet<DealerProfile>(API.dealer.profile);
}

export async function updateDealerProfile(body: {
  company_name?: string;
  logo_url?: string | null;
  tax_number?: string;
  tax_office?: string;
  city?: string;
  region?: string;
}) {
  return apiPut<DealerProfile>(API.dealer.profile, body);
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

export async function fetchFinanceSummary(): Promise<FinanceSummary> {
  return apiGet<FinanceSummary>(API.dealer.finance.summary);
}

export async function fetchTransactions(params?: { page?: number; limit?: number }): Promise<TransactionsListResponse> {
  return apiGet<TransactionsListResponse>(API.dealer.transactions, { page: params?.page ?? 1, limit: params?.limit ?? 40 });
}

export async function postDealerDirectCardInitiate(body: {
  amount: number;
  locale: string;
}): Promise<DealerDirectCardInitResponse> {
  return apiPost<DealerDirectCardInitResponse>(API.dealer.finance.directPaymentCard, body);
}

export async function downloadFinanceStatementPdf(): Promise<void> {
  const BASE_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8083"
  ).replace(/\/$/, "");
  const bearer = getStoredAccessToken();
  const res = await fetch(`${BASE_URL}${API.dealer.finance.statementPdf}`, {
    credentials: "include",
    headers: bearer ? { Authorization: `Bearer ${bearer}` } : {},
  });
  if (!res.ok) throw new Error("pdf_download_failed");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "cari-ekstre.pdf";
  a.click();
  URL.revokeObjectURL(url);
}

export async function uploadDealerLogo(file: File): Promise<string> {
  const BASE_URL = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8083"
  ).replace(/\/$/, "");
  const bearer = getStoredAccessToken();
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/api/v1/storage/dealers/upload?path=logos/${encodeURIComponent(file.name)}&upsert=1`, {
    method: "POST",
    credentials: "include",
    headers: bearer ? { Authorization: `Bearer ${bearer}` } : {},
    body: formData,
  });

  if (!res.ok) {
    throw new Error("dealer_logo_upload_failed");
  }

  const data = await res.json() as { url?: string | null };
  if (!data.url) {
    throw new Error("dealer_logo_upload_missing_url");
  }
  return data.url;
}
