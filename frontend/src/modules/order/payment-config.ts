const CARD_PROVIDERS = ["craftgate", "nestpay_isbank", "halkode", "ziraatpay"] as const;

export type SupportedCardProvider = (typeof CARD_PROVIDERS)[number];

export function isBankCardPaymentEnabled() {
  return String(process.env.NEXT_PUBLIC_FEATURE_BANK_CARD_PAYMENT || "") === "1";
}

export function getConfiguredCardProvider(): string {
  return String(process.env.NEXT_PUBLIC_PAYMENT_CARD_PROVIDER || "")
    .trim()
    .toLowerCase();
}

export function isBankCardProvider(value: string | null | undefined): value is SupportedCardProvider {
  const normalized = String(value || "").trim().toLowerCase();
  return CARD_PROVIDERS.includes(normalized as SupportedCardProvider);
}

export function resolveCardButtonKey(provider: string | null | undefined): string {
  switch (String(provider || "").trim().toLowerCase()) {
    case "craftgate":
      return "payWithCardCraftgate";
    case "nestpay_isbank":
      return "payWithCardNestpay";
    case "halkode":
      return "payWithCardHalkode";
    case "ziraatpay":
      return "payWithCardZiraatpay";
    default:
      return "payWithCard";
  }
}
