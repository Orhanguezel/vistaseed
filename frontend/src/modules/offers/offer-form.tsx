"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Send, CheckCircle2, ChevronRight, Building2, User, Mail, Phone, MapPin, Package, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { API } from "@/config/api-endpoints";

const BASE_URL = typeof window !== "undefined" ? "" : (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8083").replace(/\/$/, "");
const CATEGORY_OPTIONS = ["Vegetable", "Field", "Hybrid", "Other"] as const;

export function OfferForm() {
  const t = useTranslations("Offers");
  const locale = useLocale();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    company_name: "",
    email: "",
    phone: "",
    category: "",
    quantity: "",
    location: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const messageBlock = [
        form.category && `${t("payload.categoryLabel")}: ${form.category}`,
        form.quantity && `${t("payload.quantityLabel")}: ${form.quantity}`,
        form.location && `${t("payload.locationLabel")}: ${form.location}`,
        form.message,
      ]
        .filter(Boolean)
        .join("\n");
      const body = {
        source: "teklif-al" as const,
        customer_name: form.company_name.trim() || t("payload.customerFallback"),
        company_name: form.company_name.trim() || null,
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        locale,
        country_code: "TR",
        message: messageBlock.length >= 10 ? messageBlock : `${messageBlock}\n(${t("payload.detailFallback")})\n`,
        consent_terms: true as const,
        consent_marketing: false,
        website: "",
      };

      const res = await fetch(`${BASE_URL}${API.offers.publicCreate}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(t("errors.submit"));
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || t("errors.unexpected"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-surface rounded-3xl border border-brand/20 shadow-2xl shadow-brand/10 animate-in fade-in zoom-in duration-500">
        <div className="mb-6 rounded-full bg-brand/10 p-5 text-brand animate-bounce">
          <CheckCircle2 className="h-16 w-16" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">{t("success")}</h2>
        <Button onClick={() => setSuccess(false)} variant="secondary" className="rounded-xl px-8">
          {t("createAnother")}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Sol Kolon: Bilgilendirme */}
      <div className="lg:col-span-5 space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand">{t("trust.title")}</h3>
          <ul className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-start gap-3 group">
                <div className="mt-1 rounded-full bg-brand/10 p-1 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <span className="text-foreground/80 font-medium group-hover:text-foreground transition-colors">
                  {t(`trust.item${i}`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-6 rounded-2xl bg-surface-alt border border-border-soft space-y-4 hidden lg:block">
          <h4 className="font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-brand" />
            {t("support.title")}
          </h4>
          <p className="text-sm text-muted-foreground">{t("support.description")}</p>
        </div>
      </div>

      {/* Sağ Kolon: Form */}
      <div className="lg:col-span-7">
        <form onSubmit={handleSubmit} className="bg-surface rounded-3xl border border-border-soft p-6 md:p-10 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 px-1">
                <Building2 className="h-4 w-4 text-brand/60" />
                {t("form.companyName")}
              </label>
              <Input
                required
                value={form.company_name}
                onChange={(e) => setForm(f => ({ ...f, company_name: e.target.value }))}
                placeholder={t("form.placeholder.companyName")}
                className="rounded-xl py-6 border-border-soft focus:ring-brand/20 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 px-1">
                <Mail className="h-4 w-4 text-brand/60" />
                {t("form.email")}
              </label>
              <Input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder={t("form.placeholder.email")}
                className="rounded-xl py-6 border-border-soft focus:ring-brand/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 px-1">
                <Phone className="h-4 w-4 text-brand/60" />
                {t("form.phone")}
              </label>
              <Input
                required
                value={form.phone}
                onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder={t("form.placeholder.phone")}
                className="rounded-xl py-6 border-border-soft focus:ring-brand/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 px-1">
                <MapPin className="h-4 w-4 text-brand/60" />
                {t("form.location")}
              </label>
              <Input
                value={form.location}
                onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder={t("form.placeholder.location")}
                className="rounded-xl py-6 border-border-soft focus:ring-brand/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 px-1">
                <Package className="h-4 w-4 text-brand/60" />
                {t("form.category")}
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 outline-none transition-all appearance-none"
              >
                <option value="">{t("form.placeholder.category")}</option>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {t(`form.categories.${option}`)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold flex items-center gap-2 px-1">
                <Package className="h-4 w-4 text-brand/60" />
                {t("form.quantity")}
              </label>
              <Input
                value={form.quantity}
                onChange={(e) => setForm(f => ({ ...f, quantity: e.target.value }))}
                placeholder={t("form.placeholder.quantity")}
                className="rounded-xl py-6 border-border-soft focus:ring-brand/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold flex items-center gap-2 px-1">
              <MessageSquare className="h-4 w-4 text-brand/60" />
              {t("form.message")}
            </label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder={t("form.placeholder.message")}
              className="w-full rounded-2xl border border-border-soft bg-surface p-4 text-sm focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive font-medium px-1 animate-pulse">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl py-8 text-lg font-black tracking-tight shadow-xl shadow-brand/20 transition-all active:scale-95"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {t("form.submitting")}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                {t("form.submit")}
              </span>
            )}
          </Button>

          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed mt-4">
            {t("responseNote")}
          </p>
        </form>
      </div>
    </div>
  );
}
