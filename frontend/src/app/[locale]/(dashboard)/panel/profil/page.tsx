"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import DashboardShell from "@/components/DashboardShell";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useDealerStore } from "@/modules/dealer/dealer.store";
import { updateDealerProfile, uploadDealerLogo } from "@/modules/dealer/dealer.service";
import { resolveImageUrl } from "@/lib/utils";

type DealerFormState = {
  company_name: string;
  tax_number: string;
  tax_office: string;
  city: string;
  region: string;
  logo_url: string;
};

const EMPTY_FORM: DealerFormState = {
  company_name: "",
  tax_number: "",
  tax_office: "",
  city: "",
  region: "",
  logo_url: "",
};

function toOptional(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export default function ProfilePage() {
  const t = useTranslations("Dashboard.profile");
  const { user } = useAuthStore();
  const { profile, fetchProfile, isLoading } = useDealerStore();
  const [isMounted, setIsMounted] = useState(false);
  const [form, setForm] = useState<DealerFormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
    if (user?.role === "dealer") {
      void fetchProfile();
    }
  }, [user, fetchProfile]);

  useEffect(() => {
    if (!profile) return;
    setForm({
      company_name: profile.company_name ?? "",
      tax_number: profile.tax_number ?? "",
      tax_office: profile.tax_office ?? "",
      city: profile.city ?? "",
      region: profile.region ?? "",
      logo_url: profile.logo_url ?? "",
    });
  }, [profile]);

  const logoSrc = useMemo(
    () => resolveImageUrl(form.logo_url || profile?.logo_url, "/uploads/media/logo/vistaseed_logo.png"),
    [form.logo_url, profile?.logo_url],
  );

  if (!isMounted) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (user?.role !== "dealer") return;

    setSaving(true);
    setFeedback(null);
    try {
      await updateDealerProfile({
        company_name: toOptional(form.company_name),
        tax_number: toOptional(form.tax_number),
        tax_office: toOptional(form.tax_office),
        city: toOptional(form.city),
        region: toOptional(form.region),
        logo_url: form.logo_url.trim() || null,
      });
      await fetchProfile();
      setFeedback({ type: "success", message: t("messages.saveSuccess") });
    } catch {
      setFeedback({ type: "error", message: t("messages.saveError") });
    } finally {
      setSaving(false);
    }
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setFeedback({ type: "error", message: t("messages.logoTooLarge") });
      e.target.value = "";
      return;
    }

    setUploading(true);
    setFeedback(null);
    try {
      const url = await uploadDealerLogo(file);
      await updateDealerProfile({ logo_url: url });
      await fetchProfile();
      setForm((current) => ({ ...current, logo_url: url }));
      setFeedback({ type: "success", message: t("messages.logoSuccess") });
    } catch {
      setFeedback({ type: "error", message: t("messages.logoError") });
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-6xl space-y-10">
        <header className="border-b border-border/10 pb-8">
          <h1 className="text-4xl font-black tracking-tighter text-foreground">{t("title")}</h1>
          <p className="mt-1 text-sm font-medium italic text-muted">{t("description")}</p>
        </header>

        {feedback ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
              feedback.type === "success"
                ? "border-green-500/20 bg-green-500/10 text-green-700"
                : "border-red-500/20 bg-red-500/10 text-red-600"
            }`}
          >
            {feedback.message}
          </div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
          <section className="space-y-6">
            <div className="surface-elevated rounded-[2rem] border border-border/10 p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="relative h-36 w-36 overflow-hidden rounded-[2rem] border border-border/10 bg-bg-alt">
                  <Image
                    src={logoSrc}
                    alt={form.company_name || user?.full_name || "Dealer logo"}
                    fill
                    sizes="144px"
                    className="object-cover"
                  />
                  {uploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
                    </div>
                  ) : null}
                </div>

                <h2 className="mt-5 text-xl font-black tracking-tight text-foreground">
                  {form.company_name || t("logo.fallbackTitle")}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t("logo.description")}</p>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="mt-5 rounded-2xl bg-brand px-5 py-3 text-xs font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {uploading ? t("logo.uploading") : t("logo.cta")}
                </button>
                <p className="mt-3 text-[11px] font-bold uppercase tracking-widest text-muted">
                  {t("logo.hint")}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </div>
            </div>

            <section className="space-y-4">
              <h3 className="text-xl font-black tracking-tight text-brand">{t("personal.title")}</h3>
              <div className="surface-elevated space-y-4 rounded-[2rem] border border-border/10 p-6 shadow-sm">
                <InfoField label={t("personal.fields.fullName")} value={user?.full_name || "-"} />
                <InfoField label={t("personal.fields.email")} value={user?.email || "-"} />
                <InfoField label={t("personal.fields.phone")} value={user?.phone || "-"} />
              </div>
            </section>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-black tracking-tight text-brand">{t("corporate.title")}</h3>
            <form
              onSubmit={handleSubmit}
              className="surface-elevated rounded-[2rem] border border-border/10 p-6 shadow-sm md:p-8"
            >
              {isLoading ? (
                <div className="py-16 text-center text-sm font-bold text-muted">{t("loading")}</div>
              ) : user?.role !== "dealer" ? (
                <div className="py-10 text-sm font-bold text-muted">{t("messages.dealerOnly")}</div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <FormField
                      label={t("corporate.fields.companyName")}
                      value={form.company_name}
                      onChange={(value) => setForm((current) => ({ ...current, company_name: value }))}
                    />
                    <FormField
                      label={t("corporate.fields.taxNumber")}
                      value={form.tax_number}
                      onChange={(value) => setForm((current) => ({ ...current, tax_number: value }))}
                    />
                    <FormField
                      label={t("corporate.fields.taxOffice")}
                      value={form.tax_office}
                      onChange={(value) => setForm((current) => ({ ...current, tax_office: value }))}
                    />
                    <FormField
                      label={t("corporate.fields.city")}
                      value={form.city}
                      onChange={(value) => setForm((current) => ({ ...current, city: value }))}
                    />
                    <div className="md:col-span-2">
                      <FormField
                        label={t("corporate.fields.region")}
                        value={form.region}
                        onChange={(value) => setForm((current) => ({ ...current, region: value }))}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-border/10 pt-6">
                    <button
                      type="submit"
                      disabled={saving || uploading}
                      className="rounded-2xl bg-brand px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                    >
                      {saving ? t("actions.saving") : t("actions.save")}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-muted">{label}</label>
      <div className="text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2">
      <span className="block text-[10px] font-black uppercase tracking-widest text-muted">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-border/10 bg-background px-4 py-3 text-sm font-medium text-foreground outline-none transition focus:border-brand"
      />
    </label>
  );
}
