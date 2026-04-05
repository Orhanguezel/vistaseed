"use client";

import { motion } from "framer-motion";

interface StatItem {
  label: string;
  value: string;
}

interface StatsProps {
  items?: StatItem[];
}

export default function StatsSection({ items }: StatsProps) {
  if (!items || items.length === 0) return null;
  const stats = items;

  return (
    <section className="py-16 border-y border-border/5 bg-surface/50 backdrop-blur-3xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-brand/5 via-transparent to-brand/5 pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((s, idx) => (
            <motion.div 
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="text-center group cursor-default"
            >
              <div className="text-4xl md:text-5xl font-black text-foreground group-hover:text-brand transition-colors duration-500 tracking-tighter mb-2">
                {s.value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-60 group-hover:opacity-100 group-hover:text-brand transition-all">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
