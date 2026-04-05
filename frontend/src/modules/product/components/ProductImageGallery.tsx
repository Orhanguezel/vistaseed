"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { resolveImageUrl } from "@/lib/utils";

interface Props {
  images: string[];
  alt: string;
  variant?: "rootstock" | "standard";
}

export default function ProductImageGallery({ images, alt, variant = "standard" }: Props) {
  const t = useTranslations("Products.detail.gallery");
  const [current, setCurrent] = useState(0);
  const list = images.length > 0 ? images.map((img) => resolveImageUrl(img)) : ["/assets/images/noImage.png"];
  const isRootstock = variant === "rootstock";

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className={`relative aspect-square rounded-2xl border border-border-soft overflow-hidden ${isRootstock ? "bg-gradient-to-br from-emerald-50 via-white to-lime-50" : "bg-white"}`}>
        <Image
          src={list[current]}
          alt={alt}
          fill
          className={isRootstock ? "object-contain p-3 sm:p-4" : "object-contain p-6"}
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />

        {/* Prev / Next arrows */}
        {list.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setCurrent((c) => (c - 1 + list.length) % list.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-foreground/5 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-foreground/10 transition-colors"
              aria-label={t("prev")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setCurrent((c) => (c + 1) % list.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-foreground/5 backdrop-blur-sm flex items-center justify-center text-foreground hover:bg-foreground/10 transition-colors"
              aria-label={t("next")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {list.length > 1 && (
        <div className="flex justify-center gap-2">
          {list.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === current ? "bg-foreground scale-110" : "bg-foreground/20 hover:bg-foreground/40"
              }`}
              aria-label={t("imageOf", { current: i + 1, total: list.length })}
            />
          ))}
        </div>
      )}

      {/* Thumbnail strip */}
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {list.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              className={`shrink-0 w-16 h-16 rounded-lg border-2 overflow-hidden transition-all ${
                i === current ? "border-foreground" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${alt} ${i + 1}`}
                width={64}
                height={64}
                className={`w-full h-full object-contain ${isRootstock ? "bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-0.5" : "bg-white p-1"}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
