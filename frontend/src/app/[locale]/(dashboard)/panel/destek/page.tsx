"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/modules/auth/auth.store";
import {
  createSupportTicket,
  listMyTickets,
  listTicketMessages,
  postTicketMessage,
} from "@/modules/support/support.service";
import type {
  SupportTicket,
  SupportTicketCreateInput,
  SupportTicketMessage,
} from "@/modules/support/support.type";
import DashboardShell from "@/components/DashboardShell";

const INITIAL: SupportTicketCreateInput = {
  name: "",
  email: "",
  subject: "",
  message: "",
  category: "genel",
};

export default function PanelDestekPage() {
  const t = useTranslations("Dashboard.support");
  const user = useAuthStore((s) => s.user);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<SupportTicketMessage[]>([]);
  const [reply, setReply] = useState("");
  const [form, setForm] = useState(INITIAL);
  const [listLoading, setListLoading] = useState(true);
  const [threadLoading, setThreadLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    setListLoading(true);
    setError(null);
    try {
      const rows = await listMyTickets({ limit: 50 });
      const sorted = [...rows].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setTickets(sorted);
      setSelectedId((prev) => {
        if (prev && sorted.some((x) => x.id === prev)) return prev;
        return sorted[0]?.id ?? null;
      });
    } catch {
      setError(t("loadError"));
      setTickets([]);
    } finally {
      setListLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({
      ...f,
      name: f.name.trim() ? f.name : user.full_name?.trim() || "",
      email: f.email.trim() ? f.email : user.email || "",
    }));
  }, [user]);

  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }
    let cancelled = false;
    setThreadLoading(true);
    listTicketMessages(selectedId)
      .then((rows) => {
        if (!cancelled) setMessages(rows);
      })
      .catch(() => {
        if (!cancelled) setMessages([]);
      })
      .finally(() => {
        if (!cancelled) setThreadLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const selected = tickets.find((x) => x.id === selectedId) ?? null;
  const canReply = selected && selected.status !== "closed";

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const created = await createSupportTicket(form);
      setForm({
        ...INITIAL,
        name: user?.full_name?.trim() || "",
        email: user?.email || "",
      });
      await loadTickets();
      setSelectedId(created.id);
    } catch {
      setError(t("loadError"));
    } finally {
      setCreating(false);
    }
  }

  async function handleReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !reply.trim()) return;
    setSending(true);
    setError(null);
    try {
      const msg = await postTicketMessage(selectedId, reply.trim());
      setReply("");
      setMessages((m) => [...m, msg]);
      await loadTickets();
    } catch {
      setError(t("threadError"));
    } finally {
      setSending(false);
    }
  }

  function statusLabel(s: SupportTicket["status"]) {
    switch (s) {
      case "open":
        return t("status.open");
      case "in_progress":
        return t("status.in_progress");
      case "resolved":
        return t("status.resolved");
      case "closed":
        return t("status.closed");
      default:
        return s;
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-6xl space-y-10">
      <header className="pb-6 border-b border-border/10">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground">{t("title")}</h1>
        <p className="text-muted text-sm font-medium mt-2">{t("description")}</p>
        {error ? <p className="text-sm text-red-600 mt-3">{error}</p> : null}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <section className="lg:col-span-2 space-y-3">
          <h2 className="text-xs font-black uppercase tracking-widest text-brand">{t("ticketsTitle")}</h2>
          <div className="rounded-2xl border border-border/10 bg-surface max-h-[min(420px,50vh)] overflow-y-auto">
            {listLoading ? (
              <div className="p-8 text-center text-sm text-muted">{t("loading")}</div>
            ) : tickets.length === 0 ? (
              <div className="p-6 text-sm text-muted leading-relaxed">{t("emptyTickets")}</div>
            ) : (
              <ul className="divide-y divide-border/10">
                {tickets.map((tk) => (
                  <li key={tk.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(tk.id)}
                      className={`w-full text-left px-4 py-3 transition hover:bg-bg-alt/80 ${
                        selectedId === tk.id ? "bg-brand/10 border-l-4 border-l-brand" : ""
                      }`}
                    >
                      <div className="text-sm font-bold text-foreground line-clamp-2">{tk.subject}</div>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <span className="text-[10px] uppercase tracking-wider text-muted">
                          {new Date(tk.created_at).toLocaleString()}
                        </span>
                        <span className="text-[10px] font-black uppercase text-brand">{statusLabel(tk.status)}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="lg:col-span-3 flex flex-col min-h-[320px] rounded-2xl border border-border/10 bg-surface p-5">
          {!selectedId ? (
            <p className="text-sm text-muted m-auto text-center px-4">{t("selectTicket")}</p>
          ) : threadLoading ? (
            <div className="m-auto text-sm text-muted">{t("loading")}</div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-3 max-h-[min(360px,45vh)] pr-1 mb-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender_type === "staff" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[92%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.sender_type === "staff"
                          ? "bg-bg-alt text-foreground border border-border/10"
                          : "bg-brand text-white"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{m.body}</p>
                      <p
                        className={`text-[10px] mt-2 opacity-80 ${
                          m.sender_type === "staff" ? "text-muted" : "text-white/80"
                        }`}
                      >
                        {new Date(m.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {canReply ? (
                <form onSubmit={handleReply} className="flex flex-col gap-2 border-t border-border/10 pt-4">
                  <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    rows={3}
                    placeholder={t("replyPlaceholder")}
                    className="rounded-xl border border-border px-3 py-2 bg-background text-sm resize-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !reply.trim()}
                    className="self-end rounded-xl bg-brand px-5 py-2 text-xs font-black uppercase tracking-widest text-white disabled:opacity-50"
                  >
                    {sending ? t("sending") : t("sendReply")}
                  </button>
                </form>
              ) : selected ? (
                <p className="text-xs text-muted text-center pt-2">{statusLabel(selected.status)}</p>
              ) : null}
            </>
          )}
        </section>
      </div>

      <section className="rounded-3xl border border-border/10 bg-surface p-6 md:p-8">
        <h2 className="text-lg font-black text-foreground mb-4">{t("newTicketTitle")}</h2>
        <form onSubmit={handleCreate} className="grid gap-3 max-w-xl">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="rounded-xl border border-border px-4 py-2.5 bg-background text-sm"
            placeholder={t("namePlaceholder")}
            autoComplete="name"
          />
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            type="email"
            className="rounded-xl border border-border px-4 py-2.5 bg-background text-sm"
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
          />
          <input
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
            className="rounded-xl border border-border px-4 py-2.5 bg-background text-sm"
            placeholder={t("subject")}
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value as SupportTicketCreateInput["category"] })}
            className="rounded-xl border border-border px-4 py-2.5 bg-background text-sm"
          >
            {(["genel", "urunler", "hesap", "teknik"] as const).map((c) => (
              <option key={c} value={c}>
                {t(`categories.${c}`)}
              </option>
            ))}
          </select>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={5}
            minLength={10}
            className="rounded-xl border border-border px-4 py-2.5 bg-background text-sm"
            placeholder={t("message")}
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-xl bg-brand px-5 py-3 text-xs font-black uppercase tracking-widest text-white disabled:opacity-50 w-fit"
          >
            {creating ? t("sending") : t("sendTicket")}
          </button>
        </form>
      </section>
      </div>
    </DashboardShell>
  );
}
