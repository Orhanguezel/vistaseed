"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { GitCompareArrows } from "lucide-react";
import { ROUTES } from "@/config/routes";
import { addCompareSlug, getCompareSlugs } from "@/lib/compare-storage";
import { toLocalizedPath } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export default function AddToCompareButton({
  productSlug,
  className,
}: {
  productSlug: string;
  className?: string;
}) {
  const t = useTranslations("Compare");
  const locale = useLocale() as AppLocale;
  const [slugs, setSlugs] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState<"idle" | "added" | "duplicate" | "max">("idle");

  React.useEffect(() => {
    setSlugs(getCompareSlugs());
  }, []);

  const compareHref = `${toLocalizedPath(ROUTES.static.compare, locale)}?slugs=${encodeURIComponent(slugs.join(","))}`;

  const handleAdd = () => {
    const r = addCompareSlug(productSlug);
    const next = getCompareSlugs();
    setSlugs(next);
    if (r.ok) {
      setStatus("added");
      window.setTimeout(() => setStatus("idle"), 2000);
      return;
    }
    setStatus(r.reason);
    window.setTimeout(() => setStatus("idle"), 2000);
  };

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center gap-3 pt-2", className)}>
      <button
        type="button"
        onClick={handleAdd}
        className={cn(
          "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border-soft bg-surface text-foreground font-semibold text-sm hover:border-brand hover:text-brand transition-colors",
          className?.includes("!border-white/10") && "border-white/10",
        )}
      >
        <GitCompareArrows className="h-4 w-4" aria-hidden />
        {t("addToCompare")}
      </button>
      {slugs.length > 0 && (
        <Link
          href={compareHref}
          className={cn(
            "inline-flex items-center text-sm font-semibold text-brand hover:underline",
            className?.includes("!text-white") && "text-white/80 hover:text-white",
          )}
        >
          {t("goToCompare", { count: slugs.length })}
        </Link>
      )}
      {status === "added" && <span className="text-sm text-brand">{t("toastAdded")}</span>}
      {status === "duplicate" && <span className="text-sm text-muted-foreground">{t("toastDuplicate")}</span>}
      {status === "max" && <span className="text-sm text-amber-600">{t("max")}</span>}
    </div>
  );
}
