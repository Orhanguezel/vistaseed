"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { createContact } from "./contact.service";
import type { ContactFormData } from "./contact.type";
import type { SiteSettings } from "@/lib/site-settings";

interface ContactPageClientProps {
  settings: SiteSettings;
}

const FALLBACK_CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@example.com";

const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

function buildMapEmbedUrl(settings: SiteSettings): string {
  if (settings.contact_map_iframe) return settings.contact_map_iframe;
  
  const q = settings.contact_map_lat && settings.contact_map_lng 
    ? `${settings.contact_map_lat},${settings.contact_map_lng}`
    : settings.contact_address;

  if (!q) return "";
  
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
}

export function ContactPageClient({ settings }: ContactPageClientProps) {
  const t = useTranslations("Contact.page");
  const [form, setForm] = useState(INITIAL_FORM);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  const mapUrl = buildMapEmbedUrl(settings);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setDone(null);
    try {
      await createContact(form);
      setForm(INITIAL_FORM);
      setDone(t("success"));
    } finally {
      setSaving(false);
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-background min-h-screen overflow-x-hidden">
      {/* Hero Header */}
      <section className="relative pt-32 pb-20 border-b border-border/50 bg-surface">
        <div className="absolute inset-0 bg-linear-to-br from-brand/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-foreground mb-6"
          >
            {t("heroTitle")}
          </motion.h1>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            className="h-3 bg-brand mx-auto rounded-full mb-8 shadow-[0_0_15px_rgba(var(--color-brand),0.5)]" 
          />
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium"
          >
            {t("heroDescription")}
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Column: Info & Map */}
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div variants={item} className="p-8 rounded-3xl bg-surface border border-border-soft hover:border-brand/40 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-bl-[4rem] group-hover:bg-brand/10 transition-colors" />
                <div className="w-14 h-14 rounded-2xl bg-brand/5 text-brand flex items-center justify-center mb-6 group-hover:bg-brand group-hover:text-white transition-all duration-500 shadow-inner">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-foreground mb-2">{t("contactCards.phoneTitle")}</h3>
                <a href={`tel:${settings.contact_phone.replace(/\s/g, "")}`} className="text-sm font-bold text-muted-foreground hover:text-brand transition-colors block">
                  {settings.contact_phone || t("contactCards.undefined")}
                </a>
              </motion.div>

              <motion.div variants={item} className="p-8 rounded-3xl bg-surface border border-border-soft hover:border-brand/40 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 rounded-bl-[4rem] group-hover:bg-brand/10 transition-colors" />
                <div className="w-14 h-14 rounded-2xl bg-brand/5 text-brand flex items-center justify-center mb-6 group-hover:bg-brand group-hover:text-white transition-all duration-500 shadow-inner">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-foreground mb-2">{t("contactCards.emailTitle")}</h3>
                <a href={`mailto:${settings.contact_email}`} className="text-sm font-bold text-muted-foreground hover:text-brand transition-colors break-all block">
                  {settings.contact_email || FALLBACK_CONTACT_EMAIL}
                </a>
              </motion.div>
            </div>

            <motion.div variants={item} className="p-8 rounded-[2.5rem] bg-surface-elevated/50 border border-border-soft backdrop-blur-xl relative group">
              <div className="flex items-center gap-5 mb-8">
                 <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center shadow-lg">
                    <MapPin className="w-7 h-7" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black text-foreground leading-tight">{t("address.title")}</h3>
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60 mt-1">{t("address.subtitle")}</p>
                 </div>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 font-medium">
                {settings.contact_address || t("address.fallbackCountry")}
              </p>
              
              {mapUrl && (
                <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-border-soft shadow-2xl group-hover:border-brand/20 transition-all">
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    className="grayscale-[0.5] hover:grayscale-0 transition-all duration-700"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              )}
            </motion.div>
          </motion.div>

          {/* Right Column: Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-[3rem] bg-surface p-10 md:p-16 border border-border-soft shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-bl-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
            
            <h2 className="text-4xl font-black text-foreground tracking-tighter mb-10 relative">{t("form.title")}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">{t("form.fields.name.label")}</label>
                  <input 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    required 
                    placeholder={t("form.fields.name.placeholder")}
                    className="w-full bg-bg-alt/50 border border-border-soft px-5 py-4 rounded-2xl focus:border-brand focus:bg-white transition-all outline-hidden font-medium text-foreground placeholder:text-muted-foreground/40" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">{t("form.fields.email.label")}</label>
                  <input 
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    required 
                    type="email" 
                    placeholder={t("form.fields.email.placeholder")}
                    className="w-full bg-bg-alt/50 border border-border-soft px-5 py-4 rounded-2xl focus:border-brand focus:bg-white transition-all outline-hidden font-medium text-foreground placeholder:text-muted-foreground/40" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">{t("form.fields.phone.label")}</label>
                  <input 
                    value={form.phone} 
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                    required 
                    placeholder={t("form.fields.phone.placeholder")}
                    className="w-full bg-bg-alt/50 border border-border-soft px-5 py-4 rounded-2xl focus:border-brand focus:bg-white transition-all outline-hidden font-medium text-foreground placeholder:text-muted-foreground/40" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">{t("form.fields.subject.label")}</label>
                  <input 
                    value={form.subject} 
                    onChange={(e) => setForm({ ...form, subject: e.target.value })} 
                    required 
                    placeholder={t("form.fields.subject.placeholder")}
                    className="w-full bg-bg-alt/50 border border-border-soft px-5 py-4 rounded-2xl focus:border-brand focus:bg-white transition-all outline-hidden font-medium text-foreground placeholder:text-muted-foreground/40" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">{t("form.fields.message.label")}</label>
                <textarea 
                  value={form.message} 
                  onChange={(e) => setForm({ ...form, message: e.target.value })} 
                  required 
                  rows={4} 
                  placeholder={t("form.fields.message.placeholder")}
                  className="w-full bg-bg-alt/50 border border-border-soft px-5 py-4 rounded-2xl focus:border-brand focus:bg-white transition-all outline-hidden font-medium text-foreground placeholder:text-muted-foreground/40 resize-none" 
                />
              </div>

              {done && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-600 font-bold text-sm text-center"
                >
                  {done}
                </motion.div>
              )}

              <button 
                disabled={saving} 
                className="group relative w-full h-16 bg-brand text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-brand-dark transition-all disabled:opacity-50 overflow-hidden shadow-xl shadow-brand/20 active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      {t("form.submit")}
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
