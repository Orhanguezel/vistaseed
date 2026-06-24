"use client";

import Link from "next/link";
import type { MouseEventHandler } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { getLocaleFromPathname, toLocalizedPath } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

interface OrderCtaButtonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  productSlug?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const variantClass: Record<Variant, string> = {
  primary: "bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-dark",
  ghost: "border border-border-soft bg-surface-elevated text-foreground hover:border-brand/40 hover:bg-brand/5 hover:text-brand",
  light: "bg-white text-slate-900 shadow-xl hover:bg-brand hover:text-white",
};

const sizeClass: Record<Size, string> = {
  sm: "px-3 py-3 text-[10px]",
  md: "px-5 py-3 text-xs",
  lg: "px-8 py-5 text-[11px]",
};

export function OrderCtaButton({
  variant = "primary",
  size = "md",
  className,
  productSlug,
  onClick,
}: OrderCtaButtonProps) {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const t = useTranslations("Common.cta");
  const href = toLocalizedPath(ROUTES.static.request_offer, locale);
  const targetHref = productSlug ? `${href}?product=${encodeURIComponent(productSlug)}` : href;

  return (
    <Link
      href={targetHref}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-black uppercase tracking-widest transition-all duration-300",
        variantClass[variant],
        sizeClass[size],
        className
      )}
    >
      <ShoppingCart className="h-4 w-4" />
      <span>{t("placeOrder")}</span>
    </Link>
  );
}
