import { apiPost } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import { getStoredGclid } from "@/lib/gclid";
import { newMetaEventId, fireMetaLead, getFbCookies } from "@/lib/meta";

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
  gclid?: string;
  gclid_source?: "gclid" | "gbraid" | "wbraid";
  meta_event_id?: string;
  fbp?: string;
  fbc?: string;
}

export function submitBulkOffer(payload: BulkOfferFormPayload) {
  const g = getStoredGclid();
  const fb = getFbCookies();
  const metaEventId = newMetaEventId();
  const enriched: BulkOfferFormPayload = {
    ...payload,
    ...(g ? { gclid: g.id, gclid_source: g.source } : {}),
    meta_event_id: metaEventId,
    ...(fb.fbp ? { fbp: fb.fbp } : {}),
    ...(fb.fbc ? { fbc: fb.fbc } : {}),
  };
  return apiPost<{ success: boolean; id: string }>(API.offers.publicCreate, enriched).then((r) => {
    fireMetaLead(metaEventId);
    return r;
  });
}
