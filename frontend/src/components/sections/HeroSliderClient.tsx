"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export interface Slide {
  id: string;
  title: string;
  description: string | null;
  image: string;
  alt: string | null;
  buttonText: string | null;
  buttonLink: string | null;
}

interface HeroSliderClientProps {
  slides: Slide[];
  interval?: number;
}

export default function HeroSliderClient({ slides, interval = 7000 }: HeroSliderClientProps) {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasHydrated, setHasHydrated] = useState(false);
  const touchStart = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const count = slides.length;

  const goTo = useCallback(
    (idx: number) => {
      if (transitioning || count <= 1) return;
      setTransitioning(true);
      setCurrent(((idx % count) + count) % count);
      setProgress(0);
      setTimeout(() => setTransitioning(false), 1200);
    },
    [count, transitioning],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  useEffect(() => { setHasHydrated(true); }, []);

  useEffect(() => {
    if (count <= 1) return;
    setProgress(0);

    timerRef.current = setInterval(next, interval);
    progressRef.current = setInterval(() => {
      setProgress((p) => Math.min(p + 100 / (interval / 50), 100));
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [next, count, interval]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
    touchStart.current = null;
  };

  if (count === 0) return null;

  const slide = slides[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-black"
      style={{ height: "clamp(600px, 85vh, 950px)" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Images */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1.05 }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.alt || slide.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
          <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-4xl space-y-8">
            {/* Badge */}
            <motion.div
              key={`badge-${slide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand/20 border border-brand/30 backdrop-blur-xl text-[10px] font-black text-white uppercase tracking-[0.3em]"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse shadow-[0_0_8px_rgba(var(--color-brand),0.8)]" />
              VistaSeed Premium Selection
            </motion.div>

            {/* Title - Reveal Effect */}
            <div className="relative overflow-hidden">
              <motion.h1
                key={`title-${slide.id}`}
                initial={hasHydrated ? { y: "100%" } : false}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.95] drop-shadow-2xl"
              >
                {slide.title}
              </motion.h1>
            </div>

            {/* Description */}
            {slide.description && (
              <motion.p 
                key={`desc-${slide.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-white/70 text-lg sm:text-2xl leading-relaxed max-w-2xl font-medium"
              >
                {slide.description}
              </motion.p>
            )}

            {/* Actions */}
            <motion.div 
              key={`actions-${slide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              {slide.buttonLink && (
                <Link
                  href={slide.buttonLink}
                  className="group relative inline-flex items-center gap-3 px-10 py-5 bg-brand text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-brand-dark transition-all shadow-2xl shadow-brand/20 hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10">{slide.buttonText || "Kesfet"}</span>
                  <svg 
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" 
                    className="relative z-10 transition-transform duration-500 group-hover:translate-x-1"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigator — Ultra Premium Glassmorphism */}
      {count > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-40 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 pb-16">
            <div className="flex gap-4 p-3 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] pointer-events-auto shadow-2xl">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  className={`group relative flex-1 text-left py-4 px-6 rounded-[2rem] transition-all duration-700 overflow-hidden ${
                    i === current
                      ? "bg-white/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <span
                      className={`shrink-0 w-10 h-10 rounded-2xl border-2 flex items-center justify-center text-xs font-black transition-all duration-700 ${
                        i === current
                          ? "border-brand bg-brand text-white rotate-0 shadow-lg shadow-brand/40"
                          : "border-white/10 text-white/40 group-hover:border-white/30 group-hover:rotate-12"
                      }`}
                    >
                      0{i + 1}
                    </span>
                    <div className="hidden lg:block">
                      <div className={`text-xs font-black uppercase tracking-widest transition-colors ${i === current ? "text-white" : "text-white/30 group-hover:text-white/60"}`}>
                        {s.title.length > 30 ? s.title.slice(0, 30) + "..." : s.title}
                      </div>
                    </div>
                  </div>

                  {/* Progress Line */}
                  <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/5">
                    <motion.div
                      className="h-full bg-brand relative"
                      initial={false}
                      animate={{ width: i === current ? `${progress}%` : "0%" }}
                      transition={{ ease: "linear" }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/40 blur-sm" />
                    </motion.div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
