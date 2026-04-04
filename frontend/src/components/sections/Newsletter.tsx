"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, CheckCircle2, Mail, Sparkles } from "lucide-react";

interface NewsletterProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  placeholder?: string;
}

export default function Newsletter({
  title,
  description,
  buttonLabel,
  placeholder,
}: NewsletterProps) {
  const t = useTranslations("Home.sections.newsletter");
  const resolvedTitle = title ?? t("title");
  const resolvedDescription = description ?? t("description");
  const resolvedButtonLabel = buttonLabel ?? t("buttonLabel");
  const resolvedPlaceholder = placeholder ?? t("placeholder");

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus("loading");
    // Pseudo API call to simulate subscription
    setTimeout(() => {
      setStatus("success");
      setEmail("");
      setTimeout(() => setStatus("idle"), 5000);
    }, 1200);
  };

  return (
    <section className="relative w-full overflow-hidden bg-background py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-[2.5rem] bg-[#0A1A2F] p-8 md:p-16 lg:p-20 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/5">
          {/* Background Ambient Glows */}
          <div className="absolute -top-1/2 -left-1/4 w-[40rem] h-[40rem] bg-brand/30 blur-[120px] rounded-full pointer-events-none transition-opacity duration-1000" />
          <div className="absolute -bottom-1/2 -right-1/4 w-[40rem] h-[40rem] bg-brand/10 blur-[120px] rounded-full pointer-events-none transition-opacity duration-1000" />

          {/* Subtly Animated Graphic/Noise overlay if desired (handled by standard DOM logic here) */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at center, white 1.5px, transparent 1.5px)', backgroundSize: '36px 36px' }} 
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24">
            
            {/* Context Left */}
            <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/10 backdrop-blur-md shadow-inner shadow-white/5">
                <Sparkles className="w-4 h-4 text-brand" />
                <span className="text-xs font-black uppercase tracking-[0.2em] text-brand">{t("eyebrow")}</span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1] selection:bg-brand selection:text-white">
                {resolvedTitle}
              </h2>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed font-medium text-balance">
                {resolvedDescription}
              </p>
            </div>

            {/* Form Right */}
            <div className="w-full lg:w-[480px] shrink-0">
              <div className="bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-white/10 relative shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                
                {status === "success" ? (
                  <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in duration-500">
                    <div className="w-16 h-16 bg-brand/20 text-brand rounded-full flex items-center justify-center mb-4 ring-8 ring-brand/5 shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{t("successTitle")}</h3>
                    <p className="text-sm text-white/60">{t("successDesc")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1.5">
                      <label htmlFor="newsletter-email" className="text-sm font-semibold tracking-wide text-white/80 ml-1 block">
                        {t("emailLabel", { fallback: "E-posta Adresiniz" })}
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 transition-colors group-focus-within:text-brand" />
                        <input
                          id="newsletter-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={resolvedPlaceholder}
                          required
                          disabled={status === "loading"}
                          className="w-full h-[3.5rem] pl-14 pr-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 text-base outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 focus:bg-white/10 transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="w-full h-[3.5rem] rounded-2xl bg-brand font-black text-white text-base tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none group shadow-lg shadow-brand/20 relative overflow-hidden"
                    >
                      {/* Shine effect overlay */}
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                      
                      {status === "loading" ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{resolvedButtonLabel}</span>
                          <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                      )}
                    </button>
                    
                    <p className="text-[11px] text-center text-white/40 mt-4 font-medium tracking-wide leading-relaxed px-4">
                      {t("spamNote")}
                    </p>
                  </form>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
