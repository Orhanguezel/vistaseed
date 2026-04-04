"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { MapPin, Phone, MessageSquare, ExternalLink } from "lucide-react";
import type { PublicDealer } from "./types";

/** 
 * Bayi Kartı İskeleti (Skeleton)
 */
export function DealerCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border-soft bg-surface p-5 shadow-sm space-y-4">
      <Skeleton className="h-6 w-3/4 rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/2 rounded-md" />
        <Skeleton className="h-4 w-1/3 rounded-md" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}

/** 
 * Harita İskeleti (Skeleton)
 */
export function MapSkeleton() {
  return (
    <div className="relative w-full aspect-[16/10] max-h-[420px] rounded-2xl border border-border-soft bg-surface-alt overflow-hidden">
      <Skeleton className="absolute inset-0 w-full h-full" />
      {/* Sahte marker iskeletleri */}
      <div className="absolute top-1/4 left-1/3 h-3 w-3 rounded-full bg-border-soft animate-pulse" />
      <div className="absolute top-1/2 left-2/3 h-3 w-3 rounded-full bg-border-soft animate-pulse delay-75" />
      <div className="absolute top-2/3 left-1/2 h-3 w-3 rounded-full bg-border-soft animate-pulse delay-150" />
    </div>
  );
}

/** 
 * Gelişmiş Bayi Kartı
 */
export function DealerCard({
  dealer,
  t,
}: {
  dealer: PublicDealer;
  t: (key: string, values?: Record<string, string | number | Date>) => string;
}) {
  const whatsappUrl = dealer.phone 
    ? `https://wa.me/${dealer.phone.replace(/[\s\(\)-]/g, "")}` 
    : null;
    
  const googleMapsUrl = dealer.latitude && dealer.longitude 
    ? `https://www.google.com/maps/dir/?api=1&destination=${dealer.latitude},${dealer.longitude}` 
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.company_name || dealer.city || "")}`;

  return (
    <li
      id={`dealer-${dealer.id}`}
      className="group rounded-2xl border border-border-soft bg-surface p-5 shadow-sm hover:border-brand/30 hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-foreground line-clamp-2 leading-tight group-hover:text-brand transition-colors">
          {dealer.company_name || dealer.city || "—"}
        </h3>
        <div className="p-2 rounded-full bg-brand/5 text-brand hidden group-hover:block transition-all">
          <MapPin className="h-4 w-4" />
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{[dealer.city, dealer.region].filter(Boolean).join(" · ") || "—"}</span>
        </div>

        {dealer.tax_office && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
              {dealer.tax_office}
            </span>
          </div>
        )}
        
        {dealer.phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <a href={`tel:${dealer.phone.replace(/\s/g, "")}`} className="hover:text-brand font-medium text-foreground/80">
              {dealer.phone}
            </a>
          </div>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <a 
          href={googleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border-soft bg-surface-alt px-3 py-2 text-xs font-semibold hover:bg-surface hover:text-brand transition-all"
        >
          <ExternalLink className="h-3 w-3" />
          {t("directions")}
        </a>
        
        {whatsappUrl && (
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-brand/10 text-brand px-3 py-2 text-xs font-semibold hover:bg-brand hover:text-white transition-all"
          >
            <MessageSquare className="h-3 w-3" />
            {t("whatsapp")}
          </a>
        )}
      </div>
    </li>
  );
}
