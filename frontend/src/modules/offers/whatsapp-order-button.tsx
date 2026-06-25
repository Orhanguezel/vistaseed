"use client";

import { MessageCircle } from "lucide-react";
import { fireAdsConversion } from "@/lib/ads-conversion";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

interface WhatsAppOrderButtonProps {
  /** site_settings.whatsapp_number — ham numara, hard-code degil */
  phone?: string | null;
  /** Önceden doldurulmuş mesaj (örn. ürün adı/kategori bağlamı) */
  message?: string;
  label: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}

const variantClass: Record<Variant, string> = {
  primary: "bg-[#25D366] text-white shadow-lg shadow-[#25D366]/25 hover:bg-[#1ebe5d]",
  ghost: "border border-[#25D366]/40 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366] hover:text-white",
  light: "bg-white text-[#128C7E] shadow-xl hover:bg-[#25D366] hover:text-white",
};

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-3 text-[10px]",
  md: "px-5 py-3 text-xs",
  lg: "px-8 py-5 text-[11px]",
};

function sanitize(phone: string): string {
  // wa.me ülke kodlu, isaretsiz numara ister
  return phone.replace(/[^\d]/g, "").replace(/^0+/, "");
}

export function WhatsAppOrderButton({
  phone,
  message,
  label,
  variant = "primary",
  size = "md",
  className,
}: WhatsAppOrderButtonProps) {
  const digits = phone ? sanitize(phone) : "";
  if (!digits) return null;

  const href = `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => fireAdsConversion("whatsapp")}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-black uppercase tracking-widest transition-all duration-300",
        variantClass[variant],
        sizeClass[size],
        className,
      )}
    >
      <MessageCircle className="h-4 w-4" />
      <span>{label}</span>
    </a>
  );
}
