/** Backend `support` modulu ile ayni kategori anahtarlari */
export type SupportCategory = "genel" | "urunler" | "hesap" | "teknik";

export interface SupportFaq {
  id: string;
  category: SupportCategory;
  display_order: number;
  is_published: number;
  locale: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id?: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: SupportCategory;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  admin_note?: string | null;
  ip?: string | null;
  user_agent?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  sender_type: "user" | "staff";
  author_id: string | null;
  body: string;
  created_at: string;
}

export interface SupportTicketCreateInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: SupportCategory;
}

export interface SupportFaqListParams {
  locale?: string;
  category?: SupportFaq["category"];
  is_published?: boolean;
  limit?: number;
  offset?: number;
}

export interface SupportTicketListParams {
  status?: SupportTicket["status"];
  category?: SupportTicket["category"];
  priority?: SupportTicket["priority"];
  search?: string;
  limit?: number;
  offset?: number;
}
