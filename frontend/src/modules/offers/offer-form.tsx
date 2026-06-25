"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { fireAdsConversion } from "@/lib/ads-conversion";
import { getStoredGclid } from "@/lib/gclid";
import { newMetaEventId, fireMetaLead, getFbCookies } from "@/lib/meta";
import { Send, CheckCircle2, ChevronRight, ChevronLeft, Building2, Mail, Phone, MapPin, Package, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { WhatsAppOrderButton } from "./whatsapp-order-button";
import { API } from "@/config/api-endpoints";
import { resolveClientApiBase } from "@/lib/utils";

const BASE_URL = resolveClientApiBase();
const CATEGORY_OPTIONS = ["Vegetable", "Field", "Hybrid", "Other"] as const;

const FIELD_CLASS = "rounded-xl py-6 border-border-soft focus:ring-brand/20 transition-all";

export function OfferForm({ whatsappPhone }: { whatsappPhone?: string | null }) {
  const t = useTranslations("Offers");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const productCtx = searchParams.get("product")?.trim() || "";

  const [step, setStep] = React.useState<1 | 2>(1);
  const intent = React.useRef<"submit" | "continue">("submit");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState({
    company_name: "", email: "", phone: "", category: "",
    quantity: "", location: "", message: "",
    vergiDairesi: "", vergiNo: "", mersisNo: "", adres: "", sevkAdresi: "",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const waPrefill = productCtx
    ? `${t("whatsapp.prefill")} (${productCtx})`
    : t("whatsapp.prefill");

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const metaEventId = newMetaEventId();
      const messageBlock = [
        form.category && `${t("payload.categoryLabel")}: ${form.category}`,
        form.quantity && `${t("payload.quantityLabel")}: ${form.quantity}`,
        form.location && `${t("payload.locationLabel")}: ${form.location}`,
        productCtx && `${t("payload.categoryLabel")}: ${productCtx}`,
        form.message,
      ].filter(Boolean).join("\n");
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
        ...(() => {
          const billing = {
            vergiDairesi: form.vergiDairesi.trim(), vergiNo: form.vergiNo.trim(),
            mersisNo: form.mersisNo.trim(), adres: form.adres.trim(), sevkAdresi: form.sevkAdresi.trim(),
          };
          return Object.values(billing).some(Boolean) ? { billing } : {};
        })(),
        ...(() => {
          const g = getStoredGclid();
          return g ? { gclid: g.id, gclid_source: g.source } : {};
        })(),
        ...(() => {
          const fb = getFbCookies();
          return { meta_event_id: metaEventId, ...(fb.fbp ? { fbp: fb.fbp } : {}), ...(fb.fbc ? { fbc: fb.fbc } : {}) };
        })(),
      };

      const res = await fetch(`${BASE_URL}${API.offers.publicCreate}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(t("errors.submit"));
      fireAdsConversion("quote");
      fireMetaLead(metaEventId);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || t("errors.unexpected"));
    } finally {
      setLoading(false);
    }
  };

  // Adim 1 native validation gecince ya gonder ya da Adim 2'ye gec.
  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (intent.current === "continue") {
      setStep(2);
      intent.current = "submit";
      return;
    }
    void submit();
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-surface rounded-3xl border border-brand/20 shadow-2xl shadow-brand/10 animate-in fade-in zoom-in duration-500">
        <div className="mb-6 rounded-full bg-brand/10 p-5 text-brand animate-bounce">
          <CheckCircle2 className="h-16 w-16" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-foreground mb-4">{t("success")}</h2>
        <Button onClick={() => { setSuccess(false); setStep(1); }} variant="secondary" className="rounded-xl px-8">
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
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-tight">{t("title")}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("description")}</p>
        </div>

        {whatsappPhone ? (
          <div className="space-y-3 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/5 p-5">
            <p className="text-sm font-bold text-foreground">{t("steps.or")}</p>
            <WhatsAppOrderButton phone={whatsappPhone} message={waPrefill} label={t("whatsapp.button")} variant="primary" size="md" className="w-full" />
          </div>
        ) : null}

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-brand">{t("trust.title")}</h3>
          <ul className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-start gap-3 group">
                <div className="mt-1 rounded-full bg-brand/10 p-1 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </div>
                <span className="text-foreground/80 font-medium group-hover:text-foreground transition-colors">{t(`trust.item${i}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sag Kolon: Form */}
      <div className="lg:col-span-7">
        <form onSubmit={handleStep1} className="bg-surface rounded-3xl border border-border-soft p-6 md:p-10 shadow-xl space-y-6">
          {/* Adim gostergesi */}
          <div className="flex items-center gap-3 text-xs font-bold">
            <span className={step === 1 ? "text-brand" : "text-muted-foreground"}>① {t("steps.contactTitle")}</span>
            <span className="h-px flex-1 bg-border-soft" />
            <span className={step === 2 ? "text-brand" : "text-muted-foreground"}>② {t("steps.detailsTitle")}</span>
          </div>

          {step === 1 ? (
            <>
              <p className="text-sm text-muted-foreground">{t("steps.contactHint")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2 px-1"><Building2 className="h-4 w-4 text-brand/60" />{t("form.companyName")}</label>
                  <Input required value={form.company_name} onChange={set("company_name")} placeholder={t("form.placeholder.companyName")} className={FIELD_CLASS} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2 px-1"><Phone className="h-4 w-4 text-brand/60" />{t("form.phone")}</label>
                  <Input required type="tel" value={form.phone} onChange={set("phone")} placeholder={t("form.placeholder.phone")} className={FIELD_CLASS} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2 px-1"><Mail className="h-4 w-4 text-brand/60" />{t("form.email")}</label>
                  <Input required type="email" value={form.email} onChange={set("email")} placeholder={t("form.placeholder.email")} className={FIELD_CLASS} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2 px-1"><Package className="h-4 w-4 text-brand/60" />{t("form.category")}</label>
                  <select required value={form.category} onChange={set("category")} className="w-full rounded-xl border border-border-soft bg-surface px-4 py-3 text-sm focus:ring-2 focus:ring-brand/20 outline-none transition-all appearance-none">
                    <option value="">{t("form.placeholder.category")}</option>
                    {CATEGORY_OPTIONS.map((o) => <option key={o} value={o}>{t(`form.categories.${o}`)}</option>)}
                  </select>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">{t("steps.detailsHint")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2 px-1"><MapPin className="h-4 w-4 text-brand/60" />{t("form.location")}</label>
                  <Input value={form.location} onChange={set("location")} placeholder={t("form.placeholder.location")} className={FIELD_CLASS} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2 px-1"><Package className="h-4 w-4 text-brand/60" />{t("form.quantity")}</label>
                  <Input value={form.quantity} onChange={set("quantity")} placeholder={t("form.placeholder.quantity")} className={FIELD_CLASS} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold flex items-center gap-2 px-1"><MessageSquare className="h-4 w-4 text-brand/60" />{t("form.message")}</label>
                <textarea rows={4} value={form.message} onChange={set("message")} placeholder={t("form.placeholder.message")} className="w-full rounded-2xl border border-border-soft bg-surface p-4 text-sm focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none" />
              </div>
              <div className="rounded-2xl border border-border-soft bg-surface-alt/40 p-5 space-y-5">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold flex items-center gap-2"><FileText className="h-4 w-4 text-brand/60" />{t("form.billing.title")}</h4>
                  <p className="text-xs text-muted-foreground">{t("form.billing.optional")}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input value={form.vergiDairesi} onChange={set("vergiDairesi")} placeholder={t("form.billing.placeholder.vergiDairesi")} aria-label={t("form.billing.vergiDairesi")} className="rounded-xl py-5 border-border-soft focus:ring-brand/20 transition-all" />
                  <Input value={form.vergiNo} onChange={set("vergiNo")} placeholder={t("form.billing.placeholder.vergiNo")} aria-label={t("form.billing.vergiNo")} className="rounded-xl py-5 border-border-soft focus:ring-brand/20 transition-all" />
                  <Input value={form.mersisNo} onChange={set("mersisNo")} placeholder={t("form.billing.placeholder.mersisNo")} aria-label={t("form.billing.mersisNo")} className="rounded-xl py-5 border-border-soft focus:ring-brand/20 transition-all" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea rows={2} value={form.adres} onChange={set("adres")} placeholder={t("form.billing.placeholder.adres")} aria-label={t("form.billing.adres")} className="w-full rounded-xl border border-border-soft bg-surface p-3 text-sm focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none" />
                  <textarea rows={2} value={form.sevkAdresi} onChange={set("sevkAdresi")} placeholder={t("form.billing.placeholder.sevkAdresi")} aria-label={t("form.billing.sevkAdresi")} className="w-full rounded-xl border border-border-soft bg-surface p-3 text-sm focus:ring-2 focus:ring-brand/20 outline-none transition-all resize-none" />
                </div>
              </div>
            </>
          )}

          {error && <p className="text-sm text-destructive font-medium px-1 animate-pulse">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row">
            {step === 2 && (
              <Button type="button" variant="secondary" onClick={() => setStep(1)} disabled={loading} className="rounded-2xl py-8 sm:w-auto px-8">
                <span className="flex items-center gap-2"><ChevronLeft className="h-5 w-5" />{t("steps.back")}</span>
              </Button>
            )}
            <Button type="submit" onClick={() => { intent.current = "submit"; }} disabled={loading} className="flex-1 rounded-2xl py-8 text-lg font-black tracking-tight shadow-xl shadow-brand/20 transition-all active:scale-95">
              {loading ? (
                <span className="flex items-center gap-2"><span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />{t("form.submitting")}</span>
              ) : (
                <span className="flex items-center gap-2"><Send className="h-5 w-5" />{t("form.submit")}</span>
              )}
            </Button>
            {step === 1 && (
              <Button type="submit" variant="secondary" onClick={() => { intent.current = "continue"; }} disabled={loading} className="rounded-2xl py-8 sm:w-auto px-8">
                <span className="flex items-center gap-2">{t("steps.continue")}<ChevronRight className="h-5 w-5" /></span>
              </Button>
            )}
          </div>

          <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest leading-relaxed">{t("responseNote")}</p>
        </form>
      </div>
    </div>
  );
}
