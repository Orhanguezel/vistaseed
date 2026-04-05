"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { History, Sparkles, Milestone } from "lucide-react";

interface TimelineItem {
  year: string;
  title: string;
  description?: string;
}

interface TimelineProps {
  title?: string;
  subtitle?: string;
  items?: TimelineItem[];
}

export default function TimelineSection({
  title,
  subtitle,
  items,
}: TimelineProps) {
  const t = useTranslations("Sections.timeline");
  
  // Use translations if no items passed
  const resolvedItems: TimelineItem[] = items && items.length > 0 
    ? items 
    : t.raw("items") as TimelineItem[];

  const resolvedTitle = title || t("title");
  const resolvedSubtitle = subtitle || t("subtitle");

  return (
    <section className="relative w-full bg-[#050B14] py-24 md:py-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[50rem] h-[50rem] bg-brand/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-[40rem] h-[40rem] bg-brand/10 blur-[150px] rounded-full opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-20 md:mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6"
          >
            <History className="w-4 h-4 text-brand" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand">{t("eyebrow")}</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-8"
          >
            {resolvedTitle}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/60 font-medium max-w-2xl leading-relaxed text-balance"
          >
            {resolvedSubtitle}
          </motion.p>
        </div>

        {/* Timeline Desktop/Mobile Mix */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-brand/50 via-brand/20 to-transparent -translate-x-1/2" />

          <div className="space-y-16 md:space-y-24">
            {resolvedItems.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={`group relative flex items-center md:justify-between gap-10 md:gap-0 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Year Indicator (The Dot) */}
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 flex items-center justify-center z-20">
                   <div className="w-4 h-4 rounded-full bg-brand ring-4 ring-[#050B14] group-hover:scale-150 transition-transform duration-500 shadow-[0_0_20px_rgba(var(--brand-rgb),0.5)]" />
                   {/* Ghost pulse */}
                   <div className="absolute inset-0 rounded-full bg-brand/20 animate-ping" />
                </div>

                {/* Content Card */}
                <div className="w-full md:w-[45%] pl-16 md:pl-0">
                  <div className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 transition-all duration-500 hover:bg-white/10 hover:border-brand/30 hover:-translate-y-2 shadow-2xl ${
                     i % 2 === 0 ? "md:text-right" : "md:text-left"
                  }`}>
                    
                    {/* Floating Year Tag */}
                    <div className={`absolute -top-6 bg-gradient-to-br from-brand to-brand-dark px-6 py-2 rounded-2xl shadow-xl shadow-brand/20 ${
                      i % 2 === 0 ? "md:right-10" : "md:left-10"
                    } left-10 md:left-auto`}>
                      <span className="text-sm font-black text-white uppercase tracking-widest">{item.year}</span>
                    </div>

                    <div className={`mt-2 ${i % 2 === 0 ? "md:flex md:flex-col md:items-end" : ""}`}>
                      <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center mb-6 group-hover:bg-brand/20 transition-colors">
                        <Milestone className="w-6 h-6 text-brand" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-base md:text-lg text-white/50 font-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Decor Sparkle */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sparkles className="w-4 h-4 text-brand" />
                    </div>
                  </div>
                </div>

                {/* Empty Spacer for Desktop */}
                <div className="hidden md:block md:w-[45%]" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
