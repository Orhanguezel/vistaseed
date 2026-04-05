"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
import { AdminLocaleSelect } from "@/components/common/admin-locale-select";
import { useAdminLocales } from "@/components/common/use-admin-locales";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useListJobApplicationsAdminQuery } from "@/integrations/hooks";
import { buildJobApplicationsListQueryParams, JOB_APPLICATIONS_DEFAULT_LOCALE } from "@/integrations/shared";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "outline",
  reviewed: "secondary",
  shortlisted: "default",
  rejected: "destructive",
  hired: "default",
};

export default function JobApplicationsListPanel() {
  const t = useAdminT("admin.job-applications");
  const router = useRouter();
  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();

  const [locale, setLocale] = React.useState("");

  React.useEffect(() => {
    setLocale((prev: string) => coerceLocale(prev, defaultLocaleFromDb || JOB_APPLICATIONS_DEFAULT_LOCALE));
  }, [coerceLocale, defaultLocaleFromDb]);

  const queryParams = React.useMemo(() => buildJobApplicationsListQueryParams({ locale }), [locale]);
  const {
    data: rows = [],
    isFetching,
    refetch,
  } = useListJobApplicationsAdminQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          {localeOptions && localeOptions.length > 0 && (
            <AdminLocaleSelect value={locale} onChange={setLocale} options={localeOptions} />
          )}
          <div className="ml-auto">
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
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("table.fullName")}</TableHead>
                <TableHead>{t("table.jobTitle")}</TableHead>
                <TableHead>{t("table.email")}</TableHead>
                <TableHead>{t("table.phone")}</TableHead>
                <TableHead className="w-32">{t("table.status")}</TableHead>
                <TableHead className="w-28">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    {isFetching ? t("list.loading") : t("list.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.full_name}</TableCell>
                    <TableCell>{item.job_title || "-"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{item.email}</TableCell>
                    <TableCell>{item.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANTS[item.status] || "outline"}>{t(`statuses.${item.status}`)}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/admin/job-applications/${item.id}`)}
                      >
                        {t("actions.view")}
                      </Button>
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
