function envTruthy(v: string | undefined): boolean {
  return ['1', 'true', 'yes', 'on'].includes(String(v ?? '').trim().toLowerCase());
}

function envExplicitlyDisabled(v: string | undefined): boolean {
  const s = String(v ?? '').trim().toLowerCase();
  if (!s) return false;
  return ['0', 'false', 'no', 'off'].includes(s);
}

export const showHomeReferencesBand = envTruthy(process.env.NEXT_PUBLIC_FEATURE_HOME_REFERENCES);
export const showHomeCatalogsBand = envTruthy(process.env.NEXT_PUBLIC_FEATURE_HOME_CATALOGS);
export const showHomeBlogBand = !envExplicitlyDisabled(process.env.NEXT_PUBLIC_FEATURE_HOME_BLOG);
export const showHomeNewsBand = !envExplicitlyDisabled(process.env.NEXT_PUBLIC_FEATURE_HOME_NEWS);
export const showFooterNewsletter = envTruthy(process.env.NEXT_PUBLIC_FEATURE_FOOTER_NEWSLETTER);

export const showDealerBankCardPayment = envTruthy(
  process.env.NEXT_PUBLIC_FEATURE_BANK_CARD_PAYMENT,
);
