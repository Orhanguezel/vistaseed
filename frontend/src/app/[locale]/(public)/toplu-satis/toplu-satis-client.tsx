"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { submitBulkOffer, type BulkOfferOrgType } from "@/modules/bulk-sales/submit-bulk-offer";
import { toLocalizedPath } from "@/i18n/routing";

const ORG_TYPES: BulkOfferOrgType[] = [
  "cooperative",
  "producer_union",
  "retailer_chain",
  "exporter",
  "other",
];

export default function TopluSatisClient() {
  const t = useTranslations("BulkSales");
  const locale = useLocale();
  const termsHref = toLocalizedPath(ROUTES.static.terms, locale);
  const [website, setWebsite] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [orgType, setOrgType] = useState<BulkOfferOrgType | "">("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [estimatedVolume, setEstimatedVolume] = useState("");
  const [message, setMessage] = useState("");
  const [consentTerms, setConsentTerms] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consentTerms) return;
    setSaving(true);
    setDone(null);
    setError(null);
    try {
      await submitBulkOffer({
        source: "toplu-satis",
        website,
        customer_name: customerName.trim(),
        company_name: companyName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        locale,
        country_code: "TR",
        message: message.trim(),
        consent_terms: true,
        consent_marketing: consentMarketing,
        org_type: orgType || undefined,
        city: city.trim() || undefined,
        region: region.trim() || undefined,
        estimated_volume: estimatedVolume.trim() || undefined,
      });
      setCustomerName("");
      setCompanyName("");
      setEmail("");
      setPhone("");
      setOrgType("");
      setCity("");
      setRegion("");
      setEstimatedVolume("");
      setMessage("");
      setConsentTerms(false);
      setConsentMarketing(false);
      setWebsite("");
      setDone(t("success"));
    } catch {
      setError(t("error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="surface-page min-h-screen">
      <div className="pt-24 pb-10 text-center px-6">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-3">{t("title")}</h1>
        <div className="w-20 h-1.5 bg-brand mx-auto rounded-full mb-5" />
        <p className="text-muted max-w-2xl mx-auto leading-relaxed">{t("intro")}</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="surface-elevated p-6 md:p-8 rounded-2xl border border-border/40">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
              aria-hidden
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">{t("fields.name")}</span>
                <input
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">{t("fields.company")}</span>
                <input
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">{t("fields.email")}</span>
                <input
                  required
                  type="email"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">{t("fields.phone")}</span>
                <input
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-foreground">{t("fields.orgType")}</span>
              <select
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                value={orgType}
                onChange={(e) => setOrgType(e.target.value as BulkOfferOrgType | "")}
              >
                <option value="">{t("fields.orgTypePlaceholder")}</option>
                {ORG_TYPES.map((key) => (
                  <option key={key} value={key}>
                    {t(`orgTypes.${key}`)}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">{t("fields.city")}</span>
                <input
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">{t("fields.region")}</span>
                <input
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-foreground">{t("fields.volume")}</span>
              <input
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm"
                value={estimatedVolume}
                onChange={(e) => setEstimatedVolume(e.target.value)}
                placeholder={t("fields.volumePlaceholder")}
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-foreground">{t("fields.message")}</span>
              <textarea
                required
                minLength={10}
                rows={5}
                className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm resize-y min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentTerms}
                onChange={(e) => setConsentTerms(e.target.checked)}
                className="mt-1 rounded border-border"
              />
              <span className="text-sm text-muted leading-snug">
                {t("consentTermsLead")}{" "}
                <Link href={termsHref} className="text-brand underline underline-offset-2">
                  {t("consentTermsLink")}
                </Link>
                {t("consentTermsTrail")}
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentMarketing}
                onChange={(e) => setConsentMarketing(e.target.checked)}
                className="mt-1 rounded border-border"
              />
              <span className="text-sm text-muted leading-snug">{t("consentMarketing")}</span>
            </label>

            {done && <p className="text-sm text-emerald-600 dark:text-emerald-400">{done}</p>}
            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={saving || !consentTerms}
              className="w-full sm:w-auto rounded-xl bg-brand text-white font-semibold px-8 py-3 text-sm disabled:opacity-50"
            >
              {saving ? t("sending") : t("submit")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
