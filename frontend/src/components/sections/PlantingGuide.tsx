"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, CheckCircle2, CloudSun, Leaf, Sparkles, Wind } from "lucide-react";

interface Season {
  key: string;
  label: string;
  months: string;
  tips: string[];
}

interface PlantingGuideProps {
  title?: string;
  description?: string;
  seasons?: Season[];
}

export default function PlantingGuide({
  title,
  description,
  seasons: propsSeasons,
}: PlantingGuideProps) {
  const t = useTranslations("Sections.plantingGuide");
  
  // Define season keys to iterate through translations
  const seasonKeys = ["spring", "summer", "autumn", "winter"];
  
  // Use propsSeasons if available, otherwise fall back to translations
  const resolvedSeasons: Season[] = propsSeasons && propsSeasons.length > 0 
    ? propsSeasons 
    : seasonKeys.map(key => ({
        key,
        label: t(`seasons.${key}.label`),
        months: t(`seasons.${key}.months`),
        tips: t.raw(`seasons.${key}.tips`) as string[]
      }));

  const [activeTab, setActiveTab] = useState(resolvedSeasons[0]?.key || "spring");
  const currentSeason = resolvedSeasons.find(s => s.key === activeTab) || resolvedSeasons[0];

  const resolvedTitle = title || t("title");
  const resolvedSubtitle = description || t("subtitle");

  // Icons mapping for visual representation
  const seasonIcons: Record<string, any> = {
    spring: Leaf,
    summer: CloudSun,
    autumn: Wind,
    winter: Sparkles,
    bahar: Leaf, // Handling potential variants
    yaz: CloudSun,
    guz: Wind,
    kis: Sparkles,
  };

  return (
    <section className="relative w-full bg-background py-24 md:py-32 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[35rem] h-[35rem] bg-brand/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand/10 blur-[150px] rounded-full pointer-events-none -z-10 translate-x-1/3 -translate-y-1/3 opacity-30" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 backdrop-blur-sm mb-6">
            <Calendar className="w-4 h-4 text-brand" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-brand">{t("eyebrow")}</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tighter leading-[1.1] mb-6">
            {resolvedTitle}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-3xl text-balance">
            {resolvedSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 md:gap-16 items-start">
          
          {/* Navigation Sidebar */}
          <div className="flex flex-row lg:flex-col gap-3 md:gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide no-scrollbar">
            {resolvedSeasons.map((season) => {
              const Icon = seasonIcons[season.key] || Calendar;
              const isActive = activeTab === season.key;
              
              return (
                <button
                  key={season.key}
                  onClick={() => setActiveTab(season.key)}
                  className={`group relative flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all duration-300 min-w-[200px] lg:min-w-0 flex-shrink-0 text-left border ${
                    isActive 
                      ? "bg-surface shadow-[0_10px_40px_rgba(0,0,0,0.04)] border-brand/30 ring-1 ring-brand/10" 
                      : "bg-surface/40 border-border/50 hover:bg-surface hover:border-brand/20"
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-colors ${isActive ? "bg-brand text-white shadow-lg shadow-brand/20" : "bg-bg-alt text-muted-foreground group-hover:bg-brand/10 group-hover:text-brand"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-black uppercase tracking-widest ${isActive ? "text-brand" : "text-muted-foreground group-hover:text-foreground"}`}>
                      {season.label}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter">
                      {season.months}
                    </span>
                  </div>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-1 h-8 bg-brand rounded-full -translate-x-1/2 lg:block hidden"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "circOut" }}
                className="bg-surface rounded-[2.5rem] p-8 md:p-12 lg:p-16 border border-border/60 shadow-2xl shadow-brand/5 relative overflow-hidden"
              >
                {/* Decorative Element */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand/5 blur-[60px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-1 bg-brand rounded-full" />
                        <span className="text-sm font-bold text-brand uppercase tracking-[0.2em]">{currentSeason?.label}</span>
                      </div>
                      <h3 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter">
                        {currentSeason?.months}
                      </h3>
                    </div>
                    
                    <div className="hidden md:flex flex-col items-end opacity-20">
                      <Calendar className="w-20 h-20 text-foreground" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {currentSeason?.tips.map((tip, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group flex gap-5 p-6 rounded-3xl bg-bg-alt/50 border border-border/40 hover:bg-white dark:hover:bg-navy-mid hover:border-brand/20 hover:shadow-lg hover:shadow-brand/5 transition-all duration-300"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-brand/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <CheckCircle2 className="w-5 h-5 text-brand" />
                        </div>
                        <p className="text-base md:text-lg text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed font-medium">
                          {tip}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}
