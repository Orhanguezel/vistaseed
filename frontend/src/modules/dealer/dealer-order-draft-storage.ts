// Bayi siparis taslagi — secim + gram miktarlari + not
const STORAGE_KEY = "vistaseeds-dealer-order-draft";

type DraftV2 = {
  v: 2;
  quantities: Record<string, number>;
  selected: Record<string, boolean>;
  notes: string;
  savedAt?: number;
};

export type DealerOrderDraft = {
  quantities: Record<string, number>;
  selected: Record<string, boolean>;
  notes: string;
};

export function loadDealerOrderDraft(): DealerOrderDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Record<string, unknown>;
    const notes = typeof p.notes === "string" ? p.notes : "";
    const v = typeof p.v === "number" ? p.v : 0;
    const quantitiesRaw = p.quantities;

    if (v === 2 && quantitiesRaw && typeof quantitiesRaw === "object" && !Array.isArray(quantitiesRaw)) {
      const selected =
        p.selected && typeof p.selected === "object" && p.selected !== null && !Array.isArray(p.selected)
          ? (p.selected as Record<string, boolean>)
          : {};
      return { quantities: quantitiesRaw as Record<string, number>, selected, notes };
    }

    if (v === 1 && quantitiesRaw && typeof quantitiesRaw === "object" && !Array.isArray(quantitiesRaw)) {
      const q = quantitiesRaw as Record<string, number>;
      const selected: Record<string, boolean> = {};
      for (const [id, n] of Object.entries(q)) {
        if (typeof n === "number" && n > 0) selected[id] = true;
      }
      return { quantities: q, selected, notes };
    }

    return null;
  } catch {
    return null;
  }
}

export function saveDealerOrderDraft(
  quantities: Record<string, number>,
  selected: Record<string, boolean>,
  notes: string,
): void {
  if (typeof window === "undefined") return;
  try {
    const payload: DraftV2 = { v: 2, quantities, selected, notes, savedAt: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

export function clearDealerOrderDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* */
  }
}
