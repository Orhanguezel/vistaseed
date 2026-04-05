"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { Plus, RefreshCw, Rss } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
import { AdminLocaleSelect } from "@/components/common/admin-locale-select";
import { useAdminLocales } from "@/components/common/use-admin-locales";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  useDeleteBlogPostAdminMutation,
  useImportBlogRssAdminMutation,
  useListBlogPostsAdminQuery,
} from "@/integrations/hooks";
import {
  BLOG_POST_DEFAULT_LOCALE,
  buildBlogPostsListQueryParams,
  type BlogPostDto,
} from "@/integrations/shared";

export default function BlogListPanel() {
  const t = useAdminT("admin.blog");
  const router = useRouter();
  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();

  const [locale, setLocale] = React.useState("");

  React.useEffect(() => {
    setLocale((prev: string) => coerceLocale(prev, defaultLocaleFromDb || BLOG_POST_DEFAULT_LOCALE));
  }, [coerceLocale, defaultLocaleFromDb]);

  const queryParams = React.useMemo(() => buildBlogPostsListQueryParams({ locale }), [locale]);

  const {
    data: rows = [],
    isFetching,
    refetch,
  } = useListBlogPostsAdminQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });
  const [deletePost] = useDeleteBlogPostAdminMutation();
  const [importRss, { isLoading: rssImporting }] = useImportBlogRssAdminMutation();

  const handleRssImport = async () => {
    toast.info(t("messages.rssImportRunning"));
    try {
      const r = await importRss({}).unwrap();
      if (r.errors?.includes("rss_import_no_feeds")) {
        toast.warning(t("messages.rssImportEmpty"));
        return;
      }
      toast.success(
        t("messages.rssImportDone", {
          imported: String(r.imported),
          skipped: String(r.skipped),
          feeds: String(r.feeds),
        }),
      );
      if (r.errors.length > 0) {
        toast.info(r.errors.slice(0, 3).join(" · "));
      }
      refetch();
    } catch {
      toast.error(t("messages.rssImportError"));
    }
  };

  const handleDelete = async (item: BlogPostDto) => {
    if (!confirm(t("messages.confirmDelete", { title: item.title || "" }))) return;
    try {
      await deletePost({ id: item.id, locale }).unwrap();
      toast.success(t("messages.deleted"));
      refetch();
    } catch (error) {
      toast.error(`${t("messages.deleteError")}: ${error}`);
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
              onClick={() => void handleRssImport()}
              disabled={isFetching || rssImporting}
            >
              <Rss className="mr-1 h-4 w-4" />
              {t("actions.rssImport")}
            </Button>
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
            <Button size="sm" onClick={() => router.push("/admin/blog/new")}>
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
                <TableHead>{t("table.category")}</TableHead>
                <TableHead>{t("table.status")}</TableHead>
                <TableHead className="w-28">{t("table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    {isFetching ? t("list.loading") : t("list.empty")}
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-muted-foreground">{item.display_order}</TableCell>
                    <TableCell className="font-medium">{item.title || "-"}</TableCell>
                    <TableCell>{item.category || "-"}</TableCell>
                    <TableCell>{t(`status.${item.status === "published" ? "published" : "draft"}`)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/blog/${item.id}`)}>
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
