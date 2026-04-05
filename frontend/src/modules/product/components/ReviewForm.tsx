"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { API } from "@/config/api-endpoints";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8083").replace(/\/$/, "");

interface Props {
  productId: string;
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  const t = useTranslations("Products.detail.reviewForm");

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const star = i + 1;
        const active = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(star)}
            className="p-0.5 transition-transform hover:scale-110"
            aria-label={t("starLabel", { star })}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className={active ? "text-amber-400" : "text-border"}
            >
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="currentColor"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

export default function ReviewForm({ productId }: Props) {
  const t = useTranslations("Products.detail.reviewForm");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || rating === 0 || comment.trim().length < 5) return;

    setStatus("sending");
    try {
      const res = await fetch(`${BASE_URL}${API.products.reviewSubmit}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          rating,
          comment: comment.trim(),
          customer_name: name.trim(),
        }),
      });

      if (res.ok) {
        setStatus("success");
        setName("");
        setRating(0);
        setComment("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-brand/20 bg-brand/5 px-5 py-4 text-sm text-brand font-medium">
        {t("success")}
      </div>
    );
  }

  const canSubmit = name.trim().length >= 2 && rating > 0 && comment.trim().length >= 5;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-border-soft rounded-xl p-5">
      <h3 className="text-sm font-bold text-foreground">{t("title")}</h3>

      {/* Name */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("namePlaceholder")}
        maxLength={255}
        className="w-full h-10 px-3 text-sm rounded-xl bg-surface border border-border text-foreground placeholder:text-faint outline-none focus:border-brand/40 transition-colors"
      />

      {/* Rating */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted">{t("ratingLabel")}</label>
        <StarInput value={rating} onChange={setRating} />
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t("commentPlaceholder")}
        minLength={5}
        maxLength={1000}
        rows={3}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-faint outline-none focus:border-brand/40 transition-colors resize-none"
      />

      {status === "error" && (
        <p className="text-xs text-danger">{t("error")}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || status === "sending"}
        className="inline-flex px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
