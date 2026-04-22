'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { showDealerBankCardPayment } from '@/config/public-features';
import DashboardShell from '@/components/DashboardShell';
import { IyzicoCheckoutHost } from '@/modules/dealer/IyzicoCheckoutHost';
import type { FinanceSummary, DealerTransactionRow } from '@/modules/dealer/dealer.type';
import {
  downloadFinanceStatementPdf,
  fetchFinanceSummary,
  fetchTransactions,
  postDealerDirectCardInitiate,
} from '@/modules/dealer/dealer.service';

function formatTry(n: number, locale: string) {
  return n.toLocaleString(locale === 'en' ? 'en-US' : 'tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  });
}

function parseMoney(s: string) {
  return Number.parseFloat(s) || 0;
}

export default function FinancePage() {
  const t = useTranslations('Dashboard.finance');
  const locale = useLocale();
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [tx, setTx] = useState<DealerTransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [payBusy, setPayBusy] = useState(false);
  const [cardFormHtml, setCardFormHtml] = useState<string | null>(null);
  const [amount, setAmount] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [s, tr] = await Promise.all([
        fetchFinanceSummary(),
        fetchTransactions({ page: 1, limit: 40 }),
      ]);
      setSummary(s);
      setTx(tr.data);
    } catch {
      setErr('load_error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!summary) return;
    if (amount.trim()) return;
    if (summary.current_balance > 0) {
      setAmount(summary.current_balance.toFixed(2));
    }
  }, [summary, amount]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const u = new URLSearchParams(window.location.search);
    const payment = u.get('payment');
    if (payment === 'success') {
      setMsg({ kind: 'ok', text: t('directPayment.success') });
      setCardFormHtml(null);
      void load();
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }
    if (payment === 'fail') {
      const reason = u.get('reason');
      setMsg({ kind: 'err', text: translateErr(reason || 'payment_failed') });
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }
    if (u.get('focus') === 'direct-payment') {
      const el = document.getElementById('dealer-direct-payment');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load]);

  async function onPdf() {
    setPdfBusy(true);
    setErr(null);
    try {
      await downloadFinanceStatementPdf();
    } catch {
      setErr(t('errors.pdf'));
    } finally {
      setPdfBusy(false);
    }
  }

  function translateErr(code: string) {
    const known = [
      'bank_card_feature_disabled', 'nestpay_not_configured', 'ziraatpay_not_configured',
      'craftgate_init_failed', 'ziraatpay_init_failed', 'payment_failed', 'hash_mismatch',
      'payment_not_found', 'amount_exceeds_balance', 'no_outstanding_balance', 'invalid_payment_state',
    ] as const;
    if ((known as readonly string[]).includes(code)) {
      return t(`errors.${code}` as 'errors.load');
    }
    return t('errors.generic', { code });
  }

  async function onDirectPayment() {
    const numericAmount = Number.parseFloat(amount.replace(',', '.'));
    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMsg({ kind: 'err', text: t('errors.invalidAmount') });
      return;
    }
    setPayBusy(true);
    setErr(null);
    setMsg(null);
    setCardFormHtml(null);
    try {
      const res = await postDealerDirectCardInitiate({ amount: numericAmount, locale });
      if ('pageUrl' in res) {
        window.location.href = res.pageUrl;
      } else if ('redirectUrl' in res) {
        window.location.href = res.redirectUrl;
      } else if ('formHtml' in res) {
        setCardFormHtml(res.formHtml);
      }
    } catch (e) {
      setMsg({ kind: 'err', text: translateErr(e instanceof Error ? e.message : 'payment_failed') });
    } finally {
      setPayBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="p-20 text-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <DashboardShell>
      <div className="space-y-10">
      <header className="flex flex-wrap items-start justify-between gap-4 pb-8 border-b border-border/10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-foreground">{t('title')}</h1>
          <p className="text-muted text-sm font-medium mt-1 italic">{t('description')}</p>
        </div>
        <button
          type="button"
          disabled={pdfBusy}
          className="rounded-4xl bg-brand px-5 py-3 text-sm font-bold text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
          onClick={() => void onPdf()}
        >
          {pdfBusy ? t('pdfWorking') : t('downloadPdf')}
        </button>
      </header>

      {msg ? (
        <div className={`rounded-4xl px-5 py-4 text-sm font-medium ${msg.kind === 'ok' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-500'}`}>
          {msg.text}
        </div>
      ) : null}

      {err ? (
        <div className="rounded-4xl bg-red-500/10 text-red-500 px-5 py-4 text-sm font-medium">
          {err === 'load_error' ? t('errors.load') : err}
        </div>
      ) : null}

      {summary ? (
        <>
          <section
            id="dealer-direct-payment"
            className="surface-elevated rounded-[2.5rem] border border-border/10 p-8 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-brand mb-2 italic">
                  {t('directPayment.eyebrow')}
                </div>
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                  {t('directPayment.title')}
                </h2>
                <p className="mt-2 text-sm leading-7 text-muted max-w-xl">
                  {t('directPayment.lead')}
                </p>
              </div>
              {summary.current_balance > 0 && (
                <button
                  type="button"
                  className="rounded-4xl border border-border/20 px-4 py-2 text-sm font-bold text-foreground hover:bg-bg-alt/50 transition-colors"
                  onClick={() => setAmount(String(summary.current_balance.toFixed(2)))}
                >
                  {t('directPayment.useFullBalance')}
                </button>
              )}
            </div>

            <div className="mt-6">
              <label className="space-y-2">
                <span className="text-sm font-bold text-foreground">{t('directPayment.amount')}</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={String((summary.current_balance || 0).toFixed(2))}
                  className="w-full rounded-[1.5rem] border border-border/20 bg-bg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-4xl border border-border/10 px-5 py-4 text-sm bg-bg-alt/30">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted">{t('directPayment.outstanding')}</div>
                <div className="mt-1 font-black text-brand text-xl">{formatTry(summary.current_balance, locale)}</div>
              </div>
              <div className="max-w-md text-sm text-muted">
                {t('directPayment.hint')}
              </div>
            </div>

            {showDealerBankCardPayment && (
              <div className="mt-6">
                <button
                  type="button"
                  disabled={payBusy || !(Number.parseFloat(amount.replace(',', '.')) > 0)}
                  className="rounded-4xl bg-brand px-6 py-3 text-sm font-black text-white disabled:opacity-50 hover:opacity-90 transition-opacity"
                  onClick={() => void onDirectPayment()}
                >
                  {payBusy ? t('directPayment.processing') : t('directPayment.cta')}
                </button>
              </div>
            )}
          </section>

          {summary.warnings.length > 0 ? (
            <ul className="space-y-2 rounded-4xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900 font-medium">
              {summary.warnings.map((w) => (
                <li key={w}>{t(`warnings.${w}` as 'warnings.low_credit')}</li>
              ))}
            </ul>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: t('cards.limit'), value: summary.credit_limit },
              { label: t('cards.balance'), value: summary.current_balance },
              { label: t('cards.available'), value: summary.available },
              { label: t('cards.discount'), value: summary.discount_rate, suffix: '%' },
            ].map((c) => (
              <div
                key={c.label}
                className="surface-elevated p-6 rounded-[2.5rem] border border-border/10 shadow-sm"
              >
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted mb-3 italic">{c.label}</div>
                <div className="text-2xl font-black tracking-tight text-brand">
                  {'suffix' in c && c.suffix === '%'
                    ? `${c.value.toLocaleString(locale === 'en' ? 'en-US' : 'tr-TR')}%`
                    : formatTry(c.value, locale)}
                </div>
              </div>
            ))}
          </div>

          {Object.keys(summary.totals_by_type).length > 0 && (
            <div className="surface-elevated rounded-[2.5rem] border border-border/10 p-6 shadow-sm">
              <h2 className="text-sm font-black uppercase tracking-widest text-muted mb-4 italic">{t('totalsByType')}</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {Object.entries(summary.totals_by_type).map(([k, v]) => (
                  <li key={k} className="flex justify-between gap-4 text-sm">
                    <span className="text-muted">{t(`txType.${k}` as 'txType.order')}</span>
                    <span className="font-black text-foreground">{formatTry(v, locale)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted italic">
                {t('meta', { count: summary.transaction_count, overdue: summary.overdue_count })}
              </p>
            </div>
          )}
        </>
      ) : null}

      {cardFormHtml ? (
        <div className="space-y-2">
          <p className="text-xs text-muted italic">{t('directPayment.redirectHint')}</p>
          <IyzicoCheckoutHost html={cardFormHtml} />
        </div>
      ) : null}

      <section className="space-y-6">
        <h2 className="text-2xl font-black text-foreground tracking-tight">{t('movements')}</h2>
        {tx.length === 0 ? (
          <div className="py-16 text-center text-muted italic font-medium">{t('noMovements')}</div>
        ) : (
          <div className="surface-elevated rounded-[2.5rem] border border-border/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-130 text-left text-sm">
                <thead>
                  <tr className="bg-bg-alt/50 border-b border-border/5">
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">{t('col.date')}</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">{t('col.type')}</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted">{t('col.amount')}</th>
                    <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted text-right">{t('col.balance')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/5">
                  {tx.map((row) => (
                    <tr key={row.id} className="hover:bg-bg-alt/30 transition-colors">
                      <td className="px-6 py-5 text-sm font-medium text-muted">
                        {new Date(row.created_at).toLocaleString(locale === 'en' ? 'en-GB' : 'tr-TR')}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${row.type === 'order' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                          {t(`txType.${row.type}` as 'txType.order')}
                        </span>
                      </td>
                      <td className={`px-6 py-5 font-black text-sm ${parseMoney(row.amount) < 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {formatTry(parseMoney(row.amount), locale)}
                      </td>
                      <td className="px-6 py-5 font-black text-foreground text-right text-sm">
                        {formatTry(parseMoney(row.balance_after), locale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
      </div>
    </DashboardShell>
  );
}
