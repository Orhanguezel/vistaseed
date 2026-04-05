"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
import { AdminLocaleSelect } from "@/components/common/admin-locale-select";
import { useAdminLocales } from "@/components/common/use-admin-locales";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useDeleteJobListingAdminMutation,
  useListJobListingsAdminQuery,
  useToggleJobListingActiveAdminMutation,
} from "@/integrations/hooks";
import {
  buildJobListingsListQueryParams,
  JOB_LISTINGS_DEFAULT_LOCALE,
  type JobListingDto,
} from "@/integrations/shared";

export default function JobListingsListPanel() {
  const t = useAdminT("admin.job-listings");
  const router = useRouter();
  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();

  const [locale, setLocale] = React.useState("");

  React.useEffect(() => {
    setLocale((prev: string) => coerceLocale(prev, defaultLocaleFromDb || JOB_LISTINGS_DEFAULT_LOCALE));
  }, [coerceLocale, defaultLocaleFromDb]);

  const queryParams = React.useMemo(() => buildJobListingsListQueryParams({ locale }), [locale]);

  const {
    data: rows = [],
    isFetching,
    refetch,
  } = useListJobListingsAdminQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteJob] = useDeleteJobListingAdminMutation();
  const [toggleActive] = useToggleJobListingActiveAdminMutation();

  const handleDelete = async (item: JobListingDto) => {
    if (!confirm(t("messages.confirmDelete", { title: item.title || "" }))) return;
    try {
      await deleteJob({ id: item.id, locale }).unwrap();
      toast.success(t("messages.deleted"));
      refetch();
    } catch (error) {
      toast.error(`${t("messages.deleteError")}: ${error}`);
    }
  };

  const handleToggleActive = async (item: JobListingDto, next: boolean) => {
    try {
      await toggleActive({ id: item.id, is_active: next }).unwrap();
      toast.success(next ? t("messages.activated") : t("messages.deactivated"));
    } catch (error) {
      toast.error(`${t("messages.updateError")}: ${error}`);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          {localeOptions && localeOptions.length > 0 && (
            <AdminLocaleSelect value={locale} onChange={setLocale} options={localeOptions} />
          )}
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
            <Button size="sm" onClick={() => router.push("/admin/job-listings/new")}>
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
                <TableHead className="w-16">{t("table.order")}</TableHead>
                <TableHead>{t("table.title")}</TableHead>
                <TableHead>{t("table.department")}</TableHead>
                <TableHead>{t("table.location")}</TableHead>
                <TableHead>{t("table.employmentType")}</TableHead>
                <TableHead className="w-24">{t("table.active")}</TableHead>
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
                    <TableCell className="text-muted-foreground">{item.display_order}</TableCell>
                    <TableCell className="font-medium">{item.title || "-"}</TableCell>
                    <TableCell>{item.department || "-"}</TableCell>
                    <TableCell>{item.location || "-"}</TableCell>
                    <TableCell>{t(`employmentTypes.${item.employment_type}`)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={item.is_active === true || item.is_active === 1}
                        onCheckedChange={(checked) => handleToggleActive(item, checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/job-listings/${item.id}`)}>
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
