"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { localePath } from "@/lib/locale-path";
import { login } from "../auth.service";
import { useAuthStore } from "../auth.store";
import type { UserRole } from "../auth.type";

interface AuthFormProps {
  title: string;
  subtitle: string;
  role: UserRole;
  redirectPath: string;
  initialEmail?: string;
  initialPassword?: string;
  /** Gelistirme: form altinda sabit hesap hatirlatmasi (sadece bu prop verildiginde) */
  devCredentialsHint?: string;
}

export default function AuthForm({
  title,
  subtitle,
  role,
  redirectPath,
  initialEmail = "",
  initialPassword = "",
  devCredentialsHint,
}: AuthFormProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Auth.form");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(initialPassword);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login({ email, password });
      
      // Allow if exact match OR if user is admin
      if (res?.user.role !== role && res?.user.role !== "admin") {
         setError(t("errors.unauthorized"));
         useAuthStore.getState().clearAuth();
         setLoading(false);
         return;
      }

      router.push(localePath(locale, redirectPath));
      router.refresh();
    } catch (err: any) {
      setError(err?.code === "invalid_credentials" ? t("errors.invalidCredentials") : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="surface-elevated p-10 rounded-[2.5rem] border border-border/10 shadow-2xl backdrop-blur-sm">
        <div className="text-center mb-10">
          <div className="inline-block w-16 h-1 bg-brand rounded-full mb-6" />
          <h1 className="text-3xl font-black tracking-tighter text-foreground mb-3">{title}</h1>
          <p className="text-muted text-sm font-medium">{subtitle}</p>
          {devCredentialsHint ? (
            <p className="mt-4 text-[11px] text-muted/90 font-mono bg-bg-alt/60 border border-border/15 rounded-xl px-3 py-2 text-left">
              {devCredentialsHint}
            </p>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">{t("emailLabel")}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-bg-alt/50 border border-border/20 focus:border-brand/50 focus:ring-4 focus:ring-brand/5 outline-none transition-all text-sm font-medium"
              placeholder={t("emailPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1">{t("passwordLabel")}</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-bg-alt/50 border border-border/20 focus:border-brand/50 focus:ring-4 focus:ring-brand/5 outline-none transition-all text-sm font-medium"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full py-4 bg-brand hover:bg-brand-dark text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-lg hover:shadow-brand/20 disabled:opacity-50 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? t("submitting") : t("submit")}
              {!loading && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform">
                  <path d="M5 12h14m-7-7 7 7-7 7" />
                </svg>
              )}
            </span>
          </button>
        </form>

        <div className="mt-10 text-center">
            <p className="text-xs text-muted font-bold">
              {t("forgotPassword")} <span className="text-brand hover:underline cursor-pointer">{t("resetRequest")}</span>
            </p>
        </div>
      </div>
    </div>
  );
}
