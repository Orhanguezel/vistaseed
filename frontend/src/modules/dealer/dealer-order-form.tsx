"use client";

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { fetchDealerCatalog } from "@/modules/dealer/dealer.service";
import type { DealerCatalogProduct } from "@/modules/dealer/dealer.type";
import type { DealerSharedCatalogState } from "@/modules/dealer/use-dealer-shared-catalog";
import {
  createOrder,
  initiateOrderCardPayment,
  initiateOrderBankTransfer,
  initiateOrderCreditPayment,
  initiateOrderIyzicoPayment,
} from "@/modules/order/order.service";
import { useOrderStore } from "@/modules/order/order.store";
import { useDealerStore } from "@/modules/dealer/dealer.store";
import { resolveImageUrl } from "@/lib/utils";
import { ApiError } from "@/lib/api-client";
import { IyzicoCheckoutHost } from "./iyzico-checkout-host";
import {
  getConfiguredCardProvider,
  isBankCardPaymentEnabled,
  resolveCardButtonKey,
} from "@/modules/order/payment-config";
import {
  clearDealerOrderDraft,
  loadDealerOrderDraft,
  saveDealerOrderDraft,
} from "@/modules/dealer/dealer-order-draft-storage";

function thumb(p: DealerCatalogProduct) {
  const first = p.images?.[0];
  return resolveImageUrl(first || p.image_url || null);
}

export function DealerOrderForm({
  locale,
  shared,
}: {
  locale: string;
  /** Ust hook ile tek katalog istegi (panel/siparisler). */
  shared?: DealerSharedCatalogState;
}) {
  const t = useTranslations("Dashboard.dealerOrders");
  const fetchOrders = useOrderStore((s) => s.fetchOrders);
  const fetchBalance = useDealerStore((s) => s.fetchBalance);
  const [internalProducts, setInternalProducts] = React.useState<DealerCatalogProduct[]>([]);
  const [internalLoading, setInternalLoading] = React.useState(true);
  const [internalErr, setInternalErr] = React.useState(false);
  const [quantities, setQuantities] = React.useState<Record<string, number>>({});
  /** Siparise dahil edilecek satirlar (sepet yerine tablo secimi) */
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [feedback, setFeedback] = React.useState<"ok" | "err" | "bankOk" | "creditOk" | null>(null);
  const [createdOrderId, setCreatedOrderId] = React.useState<string | null>(null);
  const [checkoutHtml, setCheckoutHtml] = React.useState<string | null>(null);
  const [paymentErr, setPaymentErr] = React.useState<string | null>(null);
  const [paymentBusy, setPaymentBusy] = React.useState(false);
  const [draftHydrated, setDraftHydrated] = React.useState(false);
  const draftLoadedRef = React.useRef(false);
  const bankCardEnabled = isBankCardPaymentEnabled();
  const configuredCardProvider = getConfiguredCardProvider();

  React.useEffect(() => {
    if (shared) return;
    let cancelled = false;
    setInternalErr(false);
    fetchDealerCatalog({ locale, limit: 200, offset: 0 })
      .then((res) => {
        if (!cancelled) setInternalProducts(res.data);
      })
      .catch(() => {
        if (!cancelled) setInternalErr(true);
      })
      .finally(() => {
        if (!cancelled) setInternalLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [locale, shared]);

  const products = shared?.products ?? internalProducts;
  const loading = shared ? shared.loading : internalLoading;
  const catalogErr = shared ? shared.error : internalErr;

  React.useEffect(() => {
    if (loading) return;
    const timer = window.setTimeout(() => {
      if (draftLoadedRef.current) return;
      draftLoadedRef.current = true;
      const d = loadDealerOrderDraft();
      if (!d) {
        setDraftHydrated(true);
        return;
      }
      const ids = new Set(products.map((p) => p.id));
      const q: Record<string, number> = {};
      const sel: Record<string, boolean> = {};
      for (const [id, n] of Object.entries(d.quantities)) {
        if (!ids.has(id)) continue;
        if (typeof n === "number" && n > 0) q[id] = n;
      }
      for (const [id, on] of Object.entries(d.selected ?? {})) {
        if (ids.has(id) && on) sel[id] = true;
      }
      for (const id of Object.keys(q)) {
        if (sel[id] === undefined) sel[id] = true;
      }
      if (Object.keys(q).length > 0) setQuantities(q);
      if (Object.keys(sel).length > 0) setSelected((prev) => ({ ...prev, ...sel }));
      if (d.notes.trim()) setNotes(d.notes);
      setDraftHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loading, products]);

  React.useEffect(() => {
    if (loading || !draftHydrated) return;
    const timer = window.setTimeout(() => saveDealerOrderDraft(quantities, selected, notes), 450);
    return () => window.clearTimeout(timer);
  }, [quantities, selected, notes, loading, draftHydrated]);

  const handleQtyChange = (id: string, val: string) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    setQuantities((prev) => ({ ...prev, [id]: num }));
  };

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const on = !(prev[id] ?? false);
      if (!on) {
        setQuantities((q) => ({ ...q, [id]: 0 }));
      }
      return { ...prev, [id]: on };
    });
  };

  const filtered = React.useMemo(
    () => products.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase())),
    [products, searchTerm],
  );

  /** TRY / kg (bayi indirimli) */
  const pricePerKg = (p: DealerCatalogProduct) => parseFloat(p.unit_price);

  const lineTotal = (p: DealerCatalogProduct, grams: number) =>
    (grams / 1000) * pricePerKg(p);

  const calculateTotal = () =>
    Object.entries(quantities).reduce((acc, [id, grams]) => {
      if (!selected[id] || grams <= 0) return acc;
      const p = products.find((prod) => prod.id === id);
      if (!p) return acc;
      return acc + lineTotal(p, grams);
    }, 0);

  const submitOrder = async () => {
    setFeedback(null);
    const orderItems = Object.entries(quantities)
      .filter(([id, qty]) => selected[id] && qty > 0)
      .map(([product_id, quantity]) => ({ product_id, quantity }));

    if (orderItems.length === 0) {
      window.alert(t("alerts.minOneItem"));
      return;
    }

    setSubmitting(true);
    try {
      const created = await createOrder({
        items: orderItems,
        notes: notes.trim() || undefined,
      });
      setCreatedOrderId(created.id);
      setCheckoutHtml(null);
      setPaymentErr(null);
      setQuantities({});
      setSelected({});
      setNotes("");
      clearDealerOrderDraft();
      setFeedback("ok");
      await fetchOrders();
    } catch (e) {
      setFeedback("err");
      if (e instanceof ApiError && e.status === 401) {
        return;
      }
    } finally {
      setSubmitting(false);
    }
  };

  const startCardPayment = async () => {
    if (!createdOrderId) return;
    setPaymentErr(null);
    setPaymentBusy(true);
    try {
      if (bankCardEnabled) {
        const res = await initiateOrderCardPayment(createdOrderId, locale);
        const redirectUrl = res.redirectUrl || res.paymentPageUrl || res.checkoutUrl;
        if (res.checkoutFormContent) {
          setCheckoutHtml(res.checkoutFormContent);
        } else if (redirectUrl) {
          window.location.assign(redirectUrl);
        } else {
          throw new Error("missing_card_checkout_payload");
        }
        return;
      }

      const res = await initiateOrderIyzicoPayment(createdOrderId, locale);
      setCheckoutHtml(res.checkoutFormContent);
    } catch (e) {
      if (bankCardEnabled && e instanceof ApiError && e.status === 404) {
        try {
          const iyzico = await initiateOrderIyzicoPayment(createdOrderId, locale);
          setCheckoutHtml(iyzico.checkoutFormContent);
          return;
        } catch (fallbackError) {
          if (fallbackError instanceof ApiError && fallbackError.status === 503) {
            setPaymentErr(t("paymentIyzicoUnavailable"));
          } else {
            setPaymentErr(t("paymentCardError"));
          }
          return;
        }
      }
      if (e instanceof ApiError && e.status === 503 && !bankCardEnabled) {
        setPaymentErr(t("paymentIyzicoUnavailable"));
      } else {
        setPaymentErr(bankCardEnabled ? t("paymentCardError") : t("paymentIyzicoError"));
      }
    } finally {
      setPaymentBusy(false);
    }
  };

  const startBankTransfer = async () => {
    if (!createdOrderId) return;
    setPaymentErr(null);
    setPaymentBusy(true);
    try {
      await initiateOrderBankTransfer(createdOrderId);
      setCreatedOrderId(null);
      setCheckoutHtml(null);
      setFeedback("bankOk");
      await fetchOrders();
    } catch {
      setPaymentErr(t("paymentIyzicoError"));
    } finally {
      setPaymentBusy(false);
    }
  };

  const creditPaymentMessage = (e: unknown) => {
    if (!(e instanceof ApiError)) return t("paymentCreditError");
    switch (e.code) {
      case "insufficient_credit":
        return t("paymentCreditInsufficient");
      case "dealer_not_found":
        return t("paymentCreditDealerMissing");
      case "invalid_order_total":
        return t("paymentCreditInvalidTotal");
      case "order_has_no_items":
        return t("paymentCreditNoItems");
      case "order_cancelled":
        return t("paymentCreditCancelled");
      case "already_paid":
        return t("paymentCreditError");
      default:
        return t("paymentCreditError");
    }
  };

  const startCreditPayment = async () => {
    if (!createdOrderId) return;
    setPaymentErr(null);
    setPaymentBusy(true);
    try {
      await initiateOrderCreditPayment(createdOrderId);
      setCreatedOrderId(null);
      setCheckoutHtml(null);
      setFeedback("creditOk");
      await fetchOrders();
      void fetchBalance();
    } catch (e) {
      setPaymentErr(creditPaymentMessage(e));
    } finally {
      setPaymentBusy(false);
    }
  };

  if (loading) {
    return (
      <section id="dealer-order" className="scroll-mt-28">
        <div className="p-16 text-center text-muted italic">{t("loading")}</div>
      </section>
    );
  }

  if (catalogErr) {
    return (
      <section id="dealer-order" className="scroll-mt-28">
        <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 text-sm font-medium text-red-600">
          {t("catalogLoadError")}
        </div>
      </section>
    );
  }

  return (
    <section id="dealer-order" className="scroll-mt-28 space-y-8 mb-14">
      <header className="space-y-1">
        <h2 className="text-2xl font-black tracking-tight text-foreground">{t("orderBlockTitle")}</h2>
        <p className="text-sm text-muted">{t("orderBlockDescription")}</p>
      </header>

      {feedback === "ok" && (
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-sm font-medium text-emerald-800 dark:text-emerald-200">
          {t("createSuccess")}
        </div>
      )}
      {feedback === "bankOk" && (
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-sm font-medium text-emerald-800 dark:text-emerald-200">
          {t("paymentBankDone")}
        </div>
      )}
      {feedback === "creditOk" && (
        <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 text-sm font-medium text-emerald-800 dark:text-emerald-200">
          {t("paymentCreditDone")}
        </div>
      )}
      {feedback === "err" && (
        <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-sm font-medium text-red-600">
          {t("createError")}
        </div>
      )}

      {createdOrderId && feedback === "ok" && (
        <div className="space-y-4 p-6 rounded-4xl border border-border/15 bg-bg-alt/30">
          <h3 className="text-lg font-black text-foreground">{t("paymentTitle")}</h3>
          {!checkoutHtml ? (
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <button
                type="button"
                disabled={paymentBusy}
                onClick={() => void startCardPayment()}
                className="px-6 py-3 rounded-2xl bg-brand text-white text-xs font-black uppercase tracking-widest disabled:opacity-50"
              >
                {paymentBusy ? "…" : t(resolveCardButtonKey(bankCardEnabled ? configuredCardProvider : "iyzico"))}
              </button>
              <button
                type="button"
                disabled={paymentBusy}
                onClick={() => void startBankTransfer()}
                className="px-6 py-3 rounded-2xl border border-border/20 bg-surface text-xs font-black uppercase tracking-widest disabled:opacity-50"
              >
                {t("payWithBank")}
              </button>
              <button
                type="button"
                disabled={paymentBusy}
                onClick={() => void startCreditPayment()}
                className="px-6 py-3 rounded-2xl border border-brand/30 bg-brand/5 text-brand text-xs font-black uppercase tracking-widest disabled:opacity-50"
              >
                {paymentBusy ? "…" : t("payWithCredit")}
              </button>
            </div>
          ) : (
            <IyzicoCheckoutHost html={checkoutHtml} />
          )}
          {paymentErr && <p className="text-sm text-red-600">{paymentErr}</p>}
        </div>
      )}

      <div className="relative w-full max-w-md">
        <input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-5 py-3 rounded-full bg-surface border border-border/20 text-sm outline-none focus:border-brand/40"
        />
      </div>

      <div className="surface-elevated rounded-4xl border border-border/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[720px]">
            <thead className="bg-bg-alt/30 border-b border-border/10">
              <tr>
                <th className="w-12 px-3 py-5 text-[10px] font-black uppercase tracking-widest text-muted text-center">
                  {t("table.select")}
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">
                  {t("table.product")}
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">
                  {t("table.unitPriceKg")}
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted text-right">
                  {t("table.quantityGrams")}
                </th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted text-right">
                  {t("table.amount")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/5">
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-bg-alt/20 transition-colors ${selected[product.id] ? "bg-brand/5" : ""}`}
                >
                  <td className="px-3 py-4 text-center align-middle">
                    <input
                      type="checkbox"
                      checked={selected[product.id] ?? false}
                      onChange={() => toggleRow(product.id)}
                      className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
                      aria-label={t("table.selectAria", { title: product.title })}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-bg-alt/40">
                        <Image src={thumb(product)} alt={product.title} fill className="object-contain p-1" sizes="48px" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-foreground">{product.title}</div>
                        <div className="text-[10px] text-muted font-bold tracking-tight">
                          {product.product_code || t("unknownProductCode")}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-brand">
                      ₺{pricePerKg(product).toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="block text-[10px] text-muted">{t("table.perKg")}</span>
                    <span className="block text-[10px] text-muted line-through mt-0.5">
                      ₺{parseFloat(product.list_price).toLocaleString("tr-TR", { minimumFractionDigits: 2 })} {t("table.listPerKg")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <input
                      type="number"
                      min={0}
                      step={100}
                      disabled={!selected[product.id]}
                      value={quantities[product.id] ?? ""}
                      onChange={(e) => handleQtyChange(product.id, e.target.value)}
                      placeholder="0"
                      className="w-24 px-3 py-2 rounded-xl bg-surface border border-border/20 text-center font-bold text-sm outline-none focus:border-brand disabled:opacity-40 disabled:cursor-not-allowed"
                    />
                    <span className="block text-[10px] text-muted mt-1">{t("table.gramsHint")}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-black text-foreground">
                    ₺
                    {lineTotal(product, quantities[product.id] || 0).toLocaleString("tr-TR", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-20 text-center text-muted font-bold italic">{t("empty")}</div>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-muted">{t("notesLabel")}</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder={t("notesPlaceholder")}
          className="w-full px-4 py-3 rounded-2xl border border-border/20 bg-surface text-sm resize-y min-h-[88px]"
        />
      </div>

      <footer className="sticky bottom-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-navy-mid border border-white/10 rounded-4xl shadow-2xl text-white">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/50">{t("summary.selectedItems")}</span>
            <span className="text-xl font-black">
              {Object.entries(quantities).filter(([id, q]) => selected[id] && q > 0).length}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/50">{t("summary.totalAmount")}</span>
            <span className="text-xl font-black font-tighter">
              ₺{calculateTotal().toLocaleString("tr-TR", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void submitOrder()}
          disabled={submitting}
          className="px-10 py-4 bg-brand hover:bg-brand-dark disabled:opacity-60 text-white text-xs font-black uppercase tracking-widest rounded-full transition-all shadow-xl shadow-brand/20 active:scale-95"
        >
          {submitting ? "…" : `${t("submit")} →`}
        </button>
      </footer>
    </section>
  );
}
