"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { listFaqs, createSupportTicket } from "@/modules/support/support.service";
import type { SupportFaq, SupportTicketCreateInput } from "@/modules/support/support.type";
import { useAuthStore } from "@/modules/auth/auth.store";

const INITIAL_FORM: SupportTicketCreateInput = {
  name: "",
  email: "",
  subject: "",
  message: "",
  category: "genel",
};

export default function DestekPage() {
  const locale = useLocale();
  const t = useTranslations("Support");
  const user = useAuthStore((s) => s.user);
  const [faqs, setFaqs] = useState<SupportFaq[]>([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  useEffect(() => {
    listFaqs({ locale, limit: 20 })
      .then(setFaqs)
      .catch(() => setFaqs([]));
  }, [locale]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#admin-mesaj") {
      requestAnimationFrame(() => {
        document.getElementById("admin-mesaj")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name.trim() ? prev.name : user.full_name?.trim() || "",
      email: prev.email.trim() ? prev.email : user.email || "",
    }));
  }, [user]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setDone(null);
    try {
      await createSupportTicket(form);
      setForm(INITIAL_FORM);
      setDone(t("success"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-background text-foreground">
      <section className="bg-bg-alt border-b border-border-soft">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">{t("badge")}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">{t("title")}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            {t("description")}
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details key={faq.id} className="rounded-2xl border border-border-soft bg-surface p-5">
              <summary className="cursor-pointer list-none text-base font-bold text-foreground">{faq.question}</summary>
              <p className="mt-3 text-sm leading-7 text-muted">{faq.answer}</p>
            </details>
          ))}
        </div>

        <form
          id="admin-mesaj"
          onSubmit={handleSubmit}
          className="scroll-mt-24 rounded-3xl border border-border-soft bg-surface p-6 shadow-sm"
        >
          <h2 className="text-xl font-extrabold">{t("form.title")}</h2>
          <p className="mt-2 text-sm text-muted">{t("form.chatHint")}</p>
          <div className="mt-5 grid gap-4">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder={t("form.namePlaceholder")} className="rounded-xl border border-border px-4 py-3 bg-background" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required type="email" placeholder={t("form.emailPlaceholder")} className="rounded-xl border border-border px-4 py-3 bg-background" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as SupportTicketCreateInput["category"] })} className="rounded-xl border border-border px-4 py-3 bg-background">
              <option value="genel">{t("form.categories.general")}</option>
              <option value="urunler">{t("form.categories.products")}</option>
              <option value="hesap">{t("form.categories.account")}</option>
              <option value="teknik">{t("form.categories.technical")}</option>
            </select>
            <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required placeholder={t("form.subjectPlaceholder")} className="rounded-xl border border-border px-4 py-3 bg-background" />
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required rows={6} placeholder={t("form.messagePlaceholder")} className="rounded-xl border border-border px-4 py-3 bg-background" />
          </div>
          {done ? <p className="mt-4 text-sm text-brand">{done}</p> : null}
          <button disabled={saving} className="mt-6 w-full rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-dark disabled:opacity-60">
            {saving ? t("form.sending") : t("form.submit")}
          </button>
        </form>
      </section>
    </div>
  );
}
