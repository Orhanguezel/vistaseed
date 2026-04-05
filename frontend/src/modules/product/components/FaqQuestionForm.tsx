"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { API } from "@/config/api-endpoints";

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8083").replace(/\/$/, "");

interface Props {
  productId: string;
}

export default function FaqQuestionForm({ productId }: Props) {
  const t = useTranslations("Products.detail.faqForm");
  const locale = useLocale();
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (question.trim().length < 3) return;

    setStatus("sending");
    try {
      const res = await fetch(`${BASE_URL}${API.products.faqSubmit}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          locale,
          question: question.trim(),
        }),
      });

      if (res.ok) {
        setStatus("success");
        setQuestion("");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-sm font-bold text-foreground">{t("title")}</h3>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder={t("placeholder")}
        minLength={3}
        maxLength={500}
        rows={3}
        className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-faint outline-none focus:border-brand/40 transition-colors resize-none"
      />
      {status === "error" && (
        <p className="text-xs text-danger">{t("error")}</p>
      )}
      <button
        type="submit"
        disabled={question.trim().length < 3 || status === "sending"}
        className="inline-flex px-5 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === "sending" ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
