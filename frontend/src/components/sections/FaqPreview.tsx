"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircleQuestion, ArrowUpRight } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { getLocaleFromPathname, toLocalizedPath } from "@/i18n/routing";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqPreviewProps {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  faqs: FaqItem[];
  maxItems?: number;
}

export default function FaqPreview({
  title,
  subtitle,
  ctaLabel,
  faqs,
  maxItems = 5,
}: FaqPreviewProps) {
  const t = useTranslations("Sections.faqPreview");
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const items = faqs.slice(0, maxItems);
  const resolvedTitle = title ?? t("title");
  const resolvedSubtitle = subtitle ?? t("subtitle");
  const resolvedCtaLabel = ctaLabel ?? t("ctaLabel");

  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  if (items.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-surface-alt/30 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 lg:gap-24 items-start">
          
          {/* Left: Context */}
          <div className="sticky top-32">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 backdrop-blur-sm mb-6">
              <MessageCircleQuestion className="w-4 h-4 text-brand" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand">{t("eyebrow")}</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[1.1] mb-6">
              {resolvedTitle}
            </h2>
            
            <p className="text-lg text-muted-foreground font-medium leading-relaxed mb-10 text-balance">
              {resolvedSubtitle}
            </p>

            <Link
              href={toLocalizedPath(ROUTES.static.faq, locale)}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-surface text-foreground font-black rounded-2xl hover:bg-white dark:hover:bg-navy-mid transition-all shadow-xl shadow-brand/5 border border-border/50 text-sm tracking-widest uppercase"
            >
              <span>{resolvedCtaLabel}</span>
              <ArrowUpRight className="w-4 h-4 text-brand transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>

          {/* Right: Accordion */}
          <div className="flex flex-col gap-4">
            {items.map((faq) => {
              const isOpen = openId === faq.id;

              return (
                <div
                  key={faq.id}
                  className={`group relative overflow-hidden rounded-[1.5rem] transition-all duration-300 ${
                    isOpen 
                      ? "bg-surface shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-brand/20" 
                      : "bg-surface/50 border border-border/50 hover:bg-surface hover:border-brand/30"
                  }`}
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-6 md:p-8 text-left outline-none cursor-pointer"
                  >
                    <span className={`text-lg md:text-xl font-bold transition-colors pr-6 ${isOpen ? "text-brand" : "text-foreground group-hover:text-brand"}`}>
                      {faq.question}
                    </span>
                    <div className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-colors ${isOpen ? "bg-brand/10" : "bg-surface-alt group-hover:bg-brand/5"}`}>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isOpen ? "rotate-180 text-brand" : "text-muted-foreground group-hover:text-brand"
                        }`}
                      />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-6 md:px-8 pb-8 pt-0 text-muted-foreground leading-relaxed md:text-lg">
                          <div className="h-px w-12 bg-brand/20 mb-6" />
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
