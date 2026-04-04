"use client";

import * as React from "react";
import { fetchDealerCatalog } from "@/modules/dealer/dealer.service";
import type { DealerCatalogProduct } from "@/modules/dealer/dealer.type";

export type DealerSharedCatalogState = {
  products: DealerCatalogProduct[];
  discountRate: number;
  loading: boolean;
  error: boolean;
};

/** Bayi panelinde tek `fetchDealerCatalog` — katalog + siparis formu paylasir. */
export function useDealerSharedCatalog(locale: string) {
  const [products, setProducts] = React.useState<DealerCatalogProduct[]>([]);
  const [discountRate, setDiscountRate] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    fetchDealerCatalog({ locale, limit: 200, offset: 0 })
      .then((res) => {
        if (!cancelled) {
          setProducts(res.data);
          setDiscountRate(res.discount_rate);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  return { products, discountRate, loading, error };
}
