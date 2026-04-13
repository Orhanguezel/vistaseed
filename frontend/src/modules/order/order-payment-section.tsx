"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/lib/api-client";
import { useAuthStore } from "@/modules/auth/auth.store";
import { useDealerStore } from "@/modules/dealer/dealer.store";
import { IyzicoCheckoutHost } from "@/modules/dealer/iyzico-checkout-host";
import {
  initiateOrderCardPayment,
  initiateOrderBankTransfer,
  initiateOrderCreditPayment,
  initiateOrderIyzicoPayment,
} from "@/modules/order/order.service";
import {
  getConfiguredCardProvider,
  isBankCardPaymentEnabled,
  isBankCardProvider,
  resolveCardButtonKey,
} from "@/modules/order/payment-config";

type PaymentStatus = string | null | undefined;

function creditPaymentMessage(t: (k: string) => string, e: unknown) {
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
}

export function OrderPaymentSection({
  orderId,
  locale,
  orderStatus,
  paymentStatus,
  paymentMethod,
  totalAmount,
  onRefresh,
}: {
  orderId: string;
  locale: string;
  orderStatus: string;
  paymentStatus: PaymentStatus;
  paymentMethod: string | null | undefined;
  totalAmount: number;
  onRefresh: () => void | Promise<void>;
}) {
  const t = useTranslations("Dashboard.dealerOrders");
  const td = useTranslations("Dashboard.memberOrders.detail");
  const { user } = useAuthStore();
  const { balance, fetchBalance } = useDealerStore();
  const [checkoutHtml, setCheckoutHtml] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [localMsg, setLocalMsg] = React.useState<string | null>(null);
  const bankCardEnabled = isBankCardPaymentEnabled();
  const configuredCardProvider = getConfiguredCardProvider();

  const isDealer = user?.role === "dealer";
  const cancelled = orderStatus === "cancelled";
  const paid = paymentStatus === "paid";
  const bankAwaiting = paymentMethod === "bank_transfer" && paymentStatus === "pending";
  const cardAwaiting = isBankCardProvider(paymentMethod) && paymentStatus === "pending";
  const safeTotal = Number.isFinite(Number(totalAmount)) ? Number(totalAmount) : 0;
  const availableCreditAmount = balance
    ? Number(balance.available_limit ?? balance.balance ?? NaN)
    : NaN;
  const showCreditLine =
    isDealer && balance != null && Number.isFinite(availableCreditAmount);

  React.useEffect(() => {
    if (isDealer && !paid && !cancelled) void fetchBalance();
  }, [isDealer, paid, cancelled, fetchBalance]);

  const runRefresh = async () => {
    await onRefresh();
  };

  const startCard = async () => {
    setErr(null);
    setLocalMsg(null);
    setBusy(true);
    try {
      if (bankCardEnabled) {
        const res = await initiateOrderCardPayment(orderId, locale);
        const redirectUrl = res.redirectUrl || res.paymentPageUrl || res.checkoutUrl;
        if (res.checkoutFormContent) {
          setCheckoutHtml(res.checkoutFormContent);
        } else if (redirectUrl) {
          setLocalMsg("cardRedirect");
          window.location.assign(redirectUrl);
        } else {
          throw new Error("missing_card_checkout_payload");
        }
        return;
      }

      const res = await initiateOrderIyzicoPayment(orderId, locale);
      setCheckoutHtml(res.checkoutFormContent);
    } catch (e) {
      if (bankCardEnabled && e instanceof ApiError && e.status === 404) {
        try {
          const iyzico = await initiateOrderIyzicoPayment(orderId, locale);
          setCheckoutHtml(iyzico.checkoutFormContent);
          return;
        } catch (fallbackError) {
          if (fallbackError instanceof ApiError && fallbackError.status === 503) setErr(t("paymentIyzicoUnavailable"));
          else setErr(t("paymentCardError"));
          return;
        }
      }
      if (!bankCardEnabled && e instanceof ApiError && e.status === 503) setErr(t("paymentIyzicoUnavailable"));
      else setErr(bankCardEnabled ? t("paymentCardError") : t("paymentIyzicoError"));
    } finally {
      setBusy(false);
    }
  };

  const startBank = async () => {
    setErr(null);
    setLocalMsg(null);
    setBusy(true);
    try {
      await initiateOrderBankTransfer(orderId);
      setLocalMsg("bank");
      await runRefresh();
    } catch {
      setErr(t("paymentIyzicoError"));
    } finally {
      setBusy(false);
    }
  };

  const startCredit = async () => {
    setErr(null);
    setLocalMsg(null);
    setBusy(true);
    try {
      await initiateOrderCreditPayment(orderId);
      setLocalMsg("credit");
      void fetchBalance();
      await runRefresh();
    } catch (e) {
      setErr(creditPaymentMessage(t, e));
    } finally {
      setBusy(false);
    }
  };

  if (cancelled) return null;

  if (paid) {
    return (
      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-5 py-4 text-sm font-medium text-emerald-800 dark:text-emerald-200">
        {td("paymentPaidNote")}
      </div>
    );
  }

  if (bankAwaiting) {
    return (
      <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 px-5 py-4 text-sm font-medium text-amber-900 dark:text-amber-100">
        {t("paymentBankDone")}
      </div>
    );
  }

  if (cardAwaiting) {
    return (
      <div className="space-y-4 rounded-2xl border border-sky-500/25 bg-sky-500/5 px-5 py-4 text-sm font-medium text-sky-900 dark:text-sky-100">
        <p>{td("paymentCardPending")}</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void runRefresh()}
            className="rounded-2xl border border-sky-500/30 bg-white/70 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-sky-900"
          >
            {td("refreshPaymentStatus")}
          </button>
          <button
            type="button"
            onClick={() => void startCard()}
            className="rounded-2xl bg-sky-700 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-white"
          >
            {td("retryPayment")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-[2rem] border border-brand/15 bg-brand/[0.04] p-6">
      <div>
        <h2 className="text-lg font-black tracking-tight text-foreground">{t("paymentTitle")}</h2>
        <p className="mt-1 text-xs text-muted">
          {td("paymentHint", {
            total: safeTotal.toLocaleString("tr-TR", { style: "currency", currency: "TRY" }),
          })}
        </p>
        {showCreditLine && (
          <p className="mt-2 text-xs font-semibold text-foreground">
            {td("availableCredit", {
              amount: availableCreditAmount.toLocaleString("tr-TR", { style: "currency", currency: "TRY" }),
            })}
          </p>
        )}
      </div>

      {localMsg === "bank" && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          {t("paymentBankDone")}
        </div>
      )}
      {localMsg === "credit" && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-800 dark:text-emerald-200">
          {t("paymentCreditDone")}
        </div>
      )}
      {localMsg === "cardRedirect" && (
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 px-4 py-3 text-sm text-sky-800 dark:text-sky-200">
          {td("paymentCardRedirecting")}
        </div>
      )}

      {!checkoutHtml ? (
        <div className="flex flex-col flex-wrap gap-3 sm:flex-row">
          <button
            type="button"
            disabled={busy}
            onClick={() => void startCard()}
            className="rounded-2xl bg-brand px-6 py-3 text-xs font-black uppercase tracking-widest text-white disabled:opacity-50"
          >
            {busy ? "…" : t(resolveCardButtonKey(bankCardEnabled ? configuredCardProvider : "iyzico"))}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void startBank()}
            className="rounded-2xl border border-border/20 bg-surface px-6 py-3 text-xs font-black uppercase tracking-widest disabled:opacity-50"
          >
            {t("payWithBank")}
          </button>
          {isDealer && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void startCredit()}
              className="rounded-2xl border border-brand/30 bg-brand/5 px-6 py-3 text-xs font-black uppercase tracking-widest text-brand disabled:opacity-50"
            >
              {busy ? "…" : t("payWithCredit")}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted">{td("iyzicoIframeHint")}</p>
          <IyzicoCheckoutHost html={checkoutHtml} />
          <button
            type="button"
            onClick={() => {
              setCheckoutHtml(null);
              void runRefresh();
            }}
            className="text-[10px] font-black uppercase tracking-widest text-brand hover:underline"
          >
            {td("closeCheckout")}
          </button>
        </div>
      )}

      {err && <p className="text-sm text-red-600">{err}</p>}
    </div>
  );
}
