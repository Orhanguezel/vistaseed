import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { Headset, Sparkles, MapPin, Mail, Phone } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { toLocalizedPath, type AppLocale } from "@/i18n/routing";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  siteName?: string;
  logoUrl?: string;
  logoUrlDark?: string;
  locale?: AppLocale;
  columns?: FooterColumn[];
  helpTitle?: string;
  helpDescription?: ReactNode;
  followTitle?: string;
  copyrightText?: string;
  builtByText?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  socialLinkedin?: string;
  socialYoutube?: string;
  siteSubtitle?: string;
  contactEmail?: string;
  contactPhone?: string;
}

function SocialIcon({ d, href, label }: { d: string; href: string; label: string }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand hover:border-brand hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-lg"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
        <path d={d} />
      </svg>
    </a>
  );
}

export default async function Footer({
  siteName = "",
  logoUrl = "",
  logoUrlDark = "",
  locale = "tr",
  columns,
  helpTitle = "",
  helpDescription,
  followTitle = "",
  copyrightText,
  builtByText = "",
  socialFacebook,
  socialInstagram,
  socialTwitter,
  socialLinkedin,
  socialYoutube,
  siteSubtitle = "",
  contactEmail = "",
  contactPhone = "",
}: FooterProps) {
  const t = await getTranslations({ locale, namespace: "Footer" });
  const cols = columns && columns.length > 0 ? columns : [];
  const currentYear = new Date().getFullYear();
  const hasSocial = socialFacebook || socialInstagram || socialTwitter || socialLinkedin || socialYoutube;
  const localize = (href: string) => toLocalizedPath(href, locale);
  const resolvedSiteName = siteName || "VISTA SEED";
  const resolvedCopyrightText = copyrightText || t("copyright");

  return (
    <footer className="relative bg-[#050B14] overflow-hidden pt-12 md:pt-20">
      {/* Abstract Ambiance Background */}
      <div className="absolute top-0 left-1/4 w-[60rem] h-[60rem] bg-brand/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-brand/5 blur-[120px] rounded-full pointer-events-none translate-y-1/4 translate-x-1/4" />
      
      {/* Help + Social bar (Premium Banner Style) */}
      <div className="max-w-7xl mx-auto px-6 mb-16 relative z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center shrink-0 shadow-lg shadow-brand/20 ring-4 ring-brand/10 relative overflow-hidden">
              <Headset className="w-8 h-8 text-white relative z-10" />
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
            </div>
            <div>
              <div className="inline-flex items-center justify-center md:justify-start gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span className="text-xs font-black uppercase tracking-[0.25em] text-green-400">{t("eyebrow")}</span>
              </div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tighter mb-4 leading-tight">
                {t("helpTitle") || helpTitle}
              </h3>
              <p className="text-white/80 text-base md:text-lg max-w-xl leading-relaxed text-balance">
                {helpDescription || (
                  <>
                    <Link href={localize(ROUTES.static.faq)} className="text-white font-semibold underline decoration-brand/50 hover:decoration-brand underline-offset-4 transition-colors">{t("faqLink")}</Link>{" "}
                    {t("helpDescriptionMiddle")}{" "}
                    <Link href={localize(ROUTES.static.contact)} className="text-white font-semibold underline decoration-brand/50 hover:decoration-brand underline-offset-4 transition-colors">{t("contactLink")}</Link>.
                  </>
                )}
              </p>
            </div>
          </div>

          {hasSocial && (
            <div className="flex flex-col items-center lg:items-end gap-5 shrink-0">
              <span className="text-white/50 text-xs font-bold uppercase tracking-[0.2em]">{followTitle}</span>
              <div className="flex gap-3">
                <SocialIcon href={socialFacebook || ""} label="Facebook" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                <SocialIcon href={socialInstagram || ""} label="Instagram" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z" />
                <SocialIcon href={socialTwitter || ""} label="Twitter" d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                <SocialIcon href={socialLinkedin || ""} label="LinkedIn" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 2a2 2 0 110 4 2 2 0 010-4z" />
                <SocialIcon href={socialYoutube || ""} label="YouTube" d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.4 19.6C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 001.94-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 border-t border-white/10 bg-[#050B14]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            
            {/* Brand Intro Column */}
            <div className="lg:col-span-2 pr-0 lg:pr-12">
              {(logoUrlDark || logoUrl) && (
                <div className="mb-10 inline-block bg-white rounded-2xl p-4 shadow-xl">
                  <Image
                    src={logoUrlDark || logoUrl}
                    alt={resolvedSiteName}
                    width={180}
                    height={180}
                    className="w-32 h-auto object-contain"
                  />
                </div>
              )}
              {!(logoUrlDark || logoUrl) && (
                <div className="mb-6 flex flex-col">
                  <span className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
                    {resolvedSiteName}
                  </span>
                </div>
              )}
              <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
                {siteSubtitle || "Üretimden tedariğe kadar uzanan modern tarım ekosistemiyle dijital dönüşümünüze ortak oluyoruz."}
              </p>
              
              <div className="space-y-4">
                {contactEmail && (
                  <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 group w-fit">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                      <Mail className="w-3.5 h-3.5 text-white/70 group-hover:text-brand transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{contactEmail}</span>
                  </a>
                )}
                {contactPhone && (
                  <a href={`tel:${contactPhone.replace(/\s/g, "")}`} className="flex items-center gap-3 group w-fit">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand/20 transition-colors">
                      <Phone className="w-3.5 h-3.5 text-white/70 group-hover:text-brand transition-colors" />
                    </div>
                    <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{contactPhone}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Link Columns */}
            {cols.map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-black tracking-widest uppercase text-sm mb-6 opacity-90 relative inline-block">
                  {col.title}
                  <span className="absolute -bottom-3 left-0 w-1/2 h-[3px] bg-brand rounded-full" />
                </h4>
                <ul className="space-y-4">
                  {col.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={localize(link.href)}
                        className="group flex items-center gap-3 text-white/60 hover:text-white text-base font-medium transition-colors py-1"
                      >
                        <span className="w-2 h-2 rounded-full bg-white/20 group-hover:bg-brand transition-colors" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="relative z-10 border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-white/50 text-sm font-medium text-center sm:text-left">
            &copy; {currentYear} {resolvedSiteName}. {resolvedCopyrightText}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-xs uppercase font-bold tracking-widest">{t("builtBy")}</span>
            <a 
              href="https://guezelwebdesign.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/70 text-xs font-black uppercase tracking-wider hover:text-brand transition-colors flex items-center gap-1.5 group"
            >
              Guezel Web Design
              <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
