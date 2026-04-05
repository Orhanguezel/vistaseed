import { apiGet, apiPost } from "@/lib/api-client";
import { API } from "@/config/api-endpoints";
import type {
  SupportFaq,
  SupportFaqListParams,
  SupportTicket,
  SupportTicketCreateInput,
  SupportTicketListParams,
  SupportTicketMessage,
} from "./support.type";

function toQS(params: object) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") qs.set(key, String(value));
  }
  return qs.toString();
}

export function listFaqs(params: SupportFaqListParams = {}) {
  return apiGet<SupportFaq[]>(`${API.support.faqs}?${toQS(params)}`);
}

export function createSupportTicket(data: SupportTicketCreateInput) {
  return apiPost<SupportTicket>(API.support.tickets, data);
}

export function listMyTickets(params: SupportTicketListParams = {}) {
  return apiGet<SupportTicket[]>(API.support.myTickets, params);
}

export function listTicketMessages(ticketId: string) {
  return apiGet<SupportTicketMessage[]>(API.support.ticketMessages(ticketId));
}

export function postTicketMessage(ticketId: string, body: string) {
  return apiPost<SupportTicketMessage>(API.support.ticketMessages(ticketId), { body });
}
