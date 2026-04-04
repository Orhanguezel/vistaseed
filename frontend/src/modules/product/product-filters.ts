import type { Product, ProductCategory } from "./product.type";

export type SmartFilterOption = {
  id: string;
  keywords: string[];
};

export type SmartFilterGroup = {
  id: "type" | "cultivation" | "taste" | "tolerance";
  options: SmartFilterOption[];
};

export type ProductFilterValues = {
  search: string;
  categoryId: string;
  activeTag: string;
  selectedType: string;
  selectedCultivation: string;
  selectedTaste: string;
  selectedTolerance: string;
};

export const SMART_FILTERS: SmartFilterGroup[] = [
  {
    id: "type",
    options: [
      { id: "rootstock", keywords: ["anac", "anaç", "rootstock", "unterlage"] },
      { id: "charleston", keywords: ["charliston", "çarliston", "charleston"] },
      { id: "hotThin", keywords: ["aci kil", "acı kıl", "hot thin", "scharfe dunne", "scharfe dünne", "kıl biber"] },
      { id: "sweetThin", keywords: ["tatli kil", "tatlı kıl", "sweet thin", "susse dunne", "süße dünne"] },
      { id: "breakfast", keywords: ["kahvaltilik", "kahvaltılık", "breakfast", "fruhstuck", "frühstück"] },
      { id: "kapia", keywords: ["kapya", "kapia"] },
      { id: "stuffing", keywords: ["dolma", "stuffing", "blockpaprika"] },
    ],
  },
  {
    id: "cultivation",
    options: [
      { id: "greenhouse", keywords: ["sera", "greenhouse", "gewachshaus", "gewächshaus"] },
      { id: "openField", keywords: ["acik tarla", "açık tarla", "open field", "freiland"] },
      { id: "highland", keywords: ["yayla", "highland"] },
      { id: "grafted", keywords: ["asili", "aşılı", "graft", "veredelt"] },
    ],
  },
  {
    id: "taste",
    options: [
      { id: "sweet", keywords: ["tatli", "tatlı", "sweet", "suss", "süß"] },
      { id: "hot", keywords: ["aci", "acı", "hot", "scharf"] },
    ],
  },
  {
    id: "tolerance",
    options: [
      { id: "tswv", keywords: ["tswv"] },
      { id: "tm02", keywords: ["tm 0-2", "tm: 0-2", "tm 0 2"] },
      { id: "fon01", keywords: ["fon 0,1", "fon 0.1", "fon-0,1", "fon-0.1"] },
      { id: "cold", keywords: ["soguk", "soğuk", "cold", "kalt"] },
    ],
  },
];

export function normalizeForFilter(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function buildProductSearchIndex(product: Product): string {
  const specs = Object.entries(product.specifications ?? {})
    .flatMap(([name, value]) => [name, value])
    .join(" ");

  return normalizeForFilter(
    [
      product.title,
      product.slug,
      product.category?.name,
      product.category?.slug,
      product.product_code,
      ...(product.tags ?? []),
      specs,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

export function matchesSmartFilter(product: Product, option: SmartFilterOption): boolean {
  const index = buildProductSearchIndex(product);
  return option.keywords.some((keyword) => index.includes(normalizeForFilter(keyword)));
}

export function getAvailableSmartFilters(products: Product[]) {
  return SMART_FILTERS.map((group) => ({
    ...group,
    options: group.options.filter((option) => products.some((product) => matchesSmartFilter(product, option))),
  })).filter((group) => group.options.length > 0);
}

export function applyProductFilters(products: Product[], values: ProductFilterValues) {
  return products.filter((product) => {
    if (
      values.search &&
      !product.title.toLowerCase().includes(values.search.toLowerCase()) &&
      !(product.product_code || "").toLowerCase().includes(values.search.toLowerCase())
    ) {
      return false;
    }
    if (values.categoryId && product.category?.id !== values.categoryId) return false;
    if (values.activeTag && !product.tags.includes(values.activeTag)) return false;

    if (values.selectedType) {
      const option = SMART_FILTERS.find((group) => group.id === "type")?.options.find((item) => item.id === values.selectedType);
      if (option && !matchesSmartFilter(product, option)) return false;
    }
    if (values.selectedCultivation) {
      const option = SMART_FILTERS.find((group) => group.id === "cultivation")?.options.find((item) => item.id === values.selectedCultivation);
      if (option && !matchesSmartFilter(product, option)) return false;
    }
    if (values.selectedTaste) {
      const option = SMART_FILTERS.find((group) => group.id === "taste")?.options.find((item) => item.id === values.selectedTaste);
      if (option && !matchesSmartFilter(product, option)) return false;
    }
    if (values.selectedTolerance) {
      const option = SMART_FILTERS.find((group) => group.id === "tolerance")?.options.find((item) => item.id === values.selectedTolerance);
      if (option && !matchesSmartFilter(product, option)) return false;
    }

    return true;
  });
}

export function findCategoryName(categories: ProductCategory[], categoryId: string) {
  return categories.find((category) => category.id === categoryId)?.name;
}
