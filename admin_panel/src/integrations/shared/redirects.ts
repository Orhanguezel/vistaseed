// ===================================================================
// FILE: src/integrations/shared/redirects.ts
// Panelden yönetilen URL yönlendirmeleri (301 / 410) tipleri
// ===================================================================

export const REDIRECTS_ADMIN_BASE = "/admin/redirects";

export type RedirectType = "301" | "410";

export type RedirectDto = {
  id: string;
  source_path: string;
  type: RedirectType;
  destination: string | null;
  is_active: boolean;
  hits: number;
  note: string | null;
  created_at: string;
  updated_at: string;
};

export type RedirectCreatePayload = {
  source_path: string;
  type: RedirectType;
  destination?: string | null;
  is_active?: boolean;
  note?: string | null;
};

export type RedirectUpdatePayload = Partial<RedirectCreatePayload>;

export type RedirectListParams = { q?: string; page?: number; limit?: number };
