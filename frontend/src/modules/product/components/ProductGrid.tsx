"use client";

import { useTranslations } from "next-intl";
import type { Product } from "../product.type";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
  emptyMessage?: string;
  selectedSlugs?: string[];
  onToggleCompare?: (productSlug: string) => void;
}

export default function ProductGrid({ products, emptyMessage, selectedSlugs = [], onToggleCompare }: Props) {
  const t = useTranslations("Products.list");

  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-muted">
        {emptyMessage || t("noResults")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          selected={selectedSlugs.some((s) => s.toLowerCase() === product.slug.toLowerCase())}
          onToggleCompare={onToggleCompare}
        />
      ))}
    </div>
  );
}
