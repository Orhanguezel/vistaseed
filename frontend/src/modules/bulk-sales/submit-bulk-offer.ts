import { apiPost } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";

export type BulkOfferOrgType =
  | "cooperative"
  | "producer_union"
  | "retailer_chain"
  | "exporter"
  | "other";

export interface BulkOfferFormPayload {
  source?: "toplu-satis" | "teklif-al";
  customer_name: string;
  company_name: string;
  email: string;
  phone: string;
  locale: string;
  country_code?: string;
  message: string;
  consent_terms: true;
  consent_marketing?: boolean;
  org_type?: BulkOfferOrgType;
  city?: string;
  region?: string;
  estimated_volume?: string;
  website?: string;
}

export function submitBulkOffer(payload: BulkOfferFormPayload) {
  return apiPost<{ success: boolean; id: string }>(API.offers.publicCreate, payload);
}
