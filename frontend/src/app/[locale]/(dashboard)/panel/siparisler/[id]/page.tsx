"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ApiError } from "@/lib/api-client";
import { localePath } from "@/lib/locale-path";
import { ROUTES } from "@/config/routes";
import { getOrder } from "@/modules/order/order.service";
import type { Order } from "@/modules/order/order.type";
import { isBankCardProvider } from "@/modules/order/payment-config";
import { OrderPaymentSection } from "@/modules/order/order-payment-section";
import DashboardShell from "@/components/DashboardShell";

function formatTry(n: number) {
  return n.toLocaleString("tr-TR", { style: "currency", currency: "TRY" });
}

function paymentStatusText(t: (key: string) => string, raw: string | null | undefined) {
  const s = (raw ?? "").trim();
  if (!s) return "—";
  if (s === "unpaid" || s === "pending" || s === "paid" || s === "failed") {
    return t(`payStatus.${s}`);
  }
  return s;
}

function paymentMethodText(t: (key: string) => string, raw: string | null | undefined) {
  const s = (raw ?? "").trim();
  if (!s) return "—";
  if (s === "iyzico" || s === "bank_transfer" || s === "dealer_credit" || isBankCardProvider(s)) {
    return t(`payMethod.${s}`);
  }
  return s;
}

function StatusBadge({ status }: { status: string }) {
  const t = useTranslations("Dashboard.orderStatus");
  const configs: Record<string, { label: string; color: string }> = {
    pending: { label: t("pending"), color: "bg-yellow-500/10 text-yellow-500" },
    confirmed: { label: t("confirmed"), color: "bg-blue-500/10 text-blue-500" },
    processing: { label: t("processing"), color: "bg-indigo-500/10 text-indigo-500" },
    shipped: { label: t("shipped"), color: "bg-purple-500/10 text-purple-500" },
    delivered: { label: t("delivered"), color: "bg-green-500/10 text-green-500" },
    completed: { label: t("delivered"), color: "bg-green-500/10 text-green-500" },
    cancelled: { label: t("cancelled"), color: "bg-red-500/10 text-red-500" },
  };
  const config = configs[status] || { label: status, color: "bg-muted/10 text-muted" };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${config.color}`}>
      {config.label}
    </span>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : "";
  const locale = useLocale();
  const t = useTranslations("Dashboard.memberOrders.detail");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"notFound" | "load" | null>(null);

  const reloadOrder = async () => {
    if (!id) return;
    try {
      const o = await getOrder(id);
      setOrder(o);
    } catch {
      /* keep previous */
    }
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("notFound");
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const o = await getOrder(id);
        if (!cancelled) setOrder(o);
      } catch (e) {
        if (cancelled) return;
        if (e instanceof ApiError && e.status === 404) setError("notFound");
        else setError("load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const backHref = localePath(locale, ROUTES.orders.list);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <Link href={backHref} className="text-[10px] font-black uppercase tracking-widest text-brand hover:underline">
          ← {t("back")}
        </Link>
        <p className="text-muted">{error === "notFound" ? t("notFound") : t("loadError")}</p>
      </div>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-10">
      <div className="flex flex-col gap-4 border-b border-border/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href={backHref} className="mb-3 inline-block text-[10px] font-black uppercase tracking-widest text-brand hover:underline">
            ← {t("back")}
          </Link>
          <h1 className="text-3xl font-black tracking-tighter text-foreground">{t("title")}</h1>
          <p className="mt-1 font-mono text-sm text-muted">
            #{order.id.slice(-8).toUpperCase()}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <StatusBadge status={order.status} />
          <span className="text-sm text-muted">
            {new Date(order.created_at).toLocaleString("tr-TR")}
          </span>
          <span className="text-xl font-black text-foreground">{formatTry(order.total_amount)}</span>
        </div>
      </div>

      {order.notes?.trim() ? (
        <div className="rounded-2xl border border-border/10 bg-bg-alt/30 p-5">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted">{t("notes")}</p>
          <p className="mt-2 text-sm text-foreground">{order.notes}</p>
        </div>
      ) : null}

      <div className="surface-elevated overflow-hidden rounded-[2rem] border border-border/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/5 bg-bg-alt/50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">{t("colProduct")}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">{t("quantityGram")}</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted">{t("unitPriceKg")}</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted">{t("lineTotal")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/5">
              {(order.items ?? []).map((line) => (
                <tr key={line.id}>
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">
                    {line.product_title?.trim() || `#${line.product_id.slice(-8).toUpperCase()}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">{line.quantity.toLocaleString("tr-TR")} g</td>
                  <td className="px-6 py-4 text-sm text-muted">{formatTry(line.price_at_order)}</td>
                  <td className="px-6 py-4 text-right text-sm font-black text-foreground">{formatTry(line.total_price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap gap-8 text-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">{t("paymentMethod")}</span>
          <p className="mt-1 font-medium">{paymentMethodText(t, order.payment_method)}</p>
        </div>
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted">{t("paymentStatus")}</span>
          <p className="mt-1 font-medium">{paymentStatusText(t, order.payment_status)}</p>
        </div>
      </div>

        <OrderPaymentSection
          orderId={order.id}
          locale={locale}
          orderStatus={order.status}
          paymentStatus={order.payment_status}
          paymentMethod={order.payment_method}
          totalAmount={order.total_amount}
          onRefresh={reloadOrder}
        />
      </div>
    </DashboardShell>
  );
}
