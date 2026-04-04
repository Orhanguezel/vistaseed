"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Shield, Sprout, Users, Beaker, Sparkles, TrendingUp } from "lucide-react";

interface ValueItem {
  title: string;
  description: string;
  icon?: string;
}

interface ValuesProps {
  title?: string;
  subtitle?: string;
  items?: ValueItem[];
}

const FALLBACK_VALUE_ICONS = ["trending", "shield", "users", "beaker"] as const;

const ICON_MAP: Record<string, any> = {
  trending: TrendingUp,
  sprout: Sprout,
  shield: Shield,
  users: Users,
  beaker: Beaker,
};

export default function ValuesSection({
  title,
  subtitle,
  items,
}: ValuesProps) {
  const t = useTranslations("Sections.values");
  
  const fallbackValues: ValueItem[] = FALLBACK_VALUE_ICONS.map((icon, index) => ({
    icon,
    title: t(`items.${index}.title`),
    description: t(`items.${index}.description`),
  }));

  const resolvedTitle = title ?? t("title");
  const resolvedSubtitle = subtitle ?? t("subtitle");
  const values = items && items.length > 0 ? items : fallbackValues;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <section className="relative w-full bg-background py-24 md:py-32 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 right-0 w-[40rem] h-[40rem] bg-brand/5 blur-[120px] rounded-full pointer-events-none -z-10 translate-x-1/2 opacity-60" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-brand/10 blur-[150px] rounded-full pointer-events-none -z-10 -translate-x-1/4 opacity-30" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 md:mb-28">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand/20 bg-brand/5 backdrop-blur-sm mb-6"
            >
              <Sparkles className="w-4 h-4 text-brand" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-brand">{t("eyebrow")}</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-[1.05] mb-8"
            >
              {resolvedTitle}
            </motion.h2>
            
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="h-2 bg-brand rounded-full mb-8" 
            />
          </div>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl leading-relaxed text-balance"
          >
            {resolvedSubtitle}
          </motion.p>
        </div>

        {/* Values Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {values.map((v, i) => {
            const Icon = (v.icon && ICON_MAP[v.icon]) ? ICON_MAP[v.icon] : Sprout;
            
            return (
              <motion.div
                key={v.title}
                variants={itemVariants}
                className="group relative"
              >
                <div className="h-full bg-surface/40 backdrop-blur-sm border border-border/50 rounded-[2.5rem] p-10 transition-all duration-500 hover:bg-surface hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/10 group-hover:-translate-y-2">
                  
                  {/* Icon Container */}
                  <div className="w-16 h-16 rounded-3xl bg-brand/10 flex items-center justify-center mb-10 text-brand ring-1 ring-brand/5 group-hover:bg-brand group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-lg shadow-brand/5">
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Text Content */}
                  <div className="relative">
                    <h3 className="text-2xl font-black text-foreground tracking-tight mb-5 group-hover:text-brand transition-colors duration-300">
                      {v.title}
                    </h3>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium group-hover:text-foreground/80 transition-colors duration-300">
                      {v.description}
                    </p>
                  </div>

                  {/* Decorative Number */}
                  <div className="absolute bottom-6 right-8 text-6xl font-black text-foreground/[0.03] pointer-events-none group-hover:text-brand/[0.05] transition-colors">
                    0{i + 1}
                  </div>

                  {/* Corner Accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-brand/10 to-transparent rounded-tr-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
