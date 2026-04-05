"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDeleteOfferAdminMutation, useListOffersAdminQuery } from "@/integrations/hooks";
import { buildOffersListQueryParams, OFFER_STATUSES, type OfferDto, type OfferStatus } from "@/integrations/shared";

function toDateLabel(value: string | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("tr-TR");
}

function toMoneyLabel(value: number | string | null | undefined, currency: string | null | undefined) {
  if (value == null || value === "") return "-";
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return String(value);
  return `${amount.toFixed(2)} ${currency || "EUR"}`;
}

export default function OffersListPanel() {
  const t = useAdminT("admin.offers");
  const router = useRouter();

  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<OfferStatus | "">("");

  const queryParams = React.useMemo(() => buildOffersListQueryParams({ q: search, status }), [search, status]);
  const { data: rows = [], isFetching, refetch } = useListOffersAdminQuery(queryParams);
  const [deleteOffer] = useDeleteOfferAdminMutation();

  const handleDelete = async (item: OfferDto) => {
    if (!confirm(t("messages.confirmDelete", { title: item.offer_no || item.customer_name || item.id }))) return;
    try {
      await deleteOffer({ id: item.id }).unwrap();
      toast.success(t("messages.deleted"));
      refetch();
    } catch (error) {
      toast.error(`${t("messages.errorPrefix")}: ${error}`);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("filters.searchPlaceholder")}
            className="max-w-xs"
          />
          <select
            className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
            value={status}
            onChange={(e) => setStatus(e.target.value as OfferStatus | "")}
          >
            <option value="">{t("filters.statusAll")}</option>
            {OFFER_STATUSES.map((item) => (
              <option key={item} value={item}>
                {t(`statuses.${item}`)}
              </option>
            ))}
          </select>
          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast.info(t("messages.refreshing"));
                refetch();
              }}
              disabled={isFetching}
            >
              <RefreshCw className="mr-1 h-4 w-4" />
              {t("actions.refresh")}
            </Button>
            <Button size="sm" onClick={() => router.push("/admin/offers/new")}>
              <Plus className="mr-1 h-4 w-4" />
              {t("actions.create")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.offerNo")}</TableHead>
                <TableHead>{t("table.customer")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead>{t("table.locale")}</TableHead>
                <TableHead>{t("table.total")}</TableHead>
                <TableHead>{t("table.createdAt")}</TableHead>
                <TableHead className="w-28">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                    {isFetching ? t("list.loading") : t("list.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.offer_no || "-"}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div>{item.customer_name || "-"}</div>
                        <div className="text-muted-foreground text-sm">{item.email || "-"}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{t(`statuses.${item.status}`)}</Badge>
                    </TableCell>
                    <TableCell>{item.locale || "-"}</TableCell>
                    <TableCell>{toMoneyLabel(item.gross_total, item.currency)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{toDateLabel(item.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/offers/${item.id}`)}>
                          {t("actions.edit")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => handleDelete(item)}
                        >
                          {t("actions.delete")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
