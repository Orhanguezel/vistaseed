"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
import { AdminLocaleSelect } from "@/components/common/admin-locale-select";
import { useAdminLocales } from "@/components/common/use-admin-locales";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useDeleteJobApplicationAdminMutation,
  useGetJobApplicationAdminQuery,
  useUpdateJobApplicationStatusAdminMutation,
} from "@/integrations/hooks";
import {
  buildJobApplicationStatusPayload,
  JOB_APPLICATION_STATUS_OPTIONS,
  JOB_APPLICATIONS_DEFAULT_LOCALE,
  type JobApplicationStatus,
  mapJobApplicationToDetailForm,
} from "@/integrations/shared";

interface Props {
  id: string;
}

export default function JobApplicationDetailClient({ id }: Props) {
  const t = useAdminT("admin.job-applications");
  const router = useRouter();
  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();

  const [activeLocale, setActiveLocale] = React.useState(() =>
    coerceLocale(defaultLocaleFromDb, JOB_APPLICATIONS_DEFAULT_LOCALE),
  );
  const [activeTab, setActiveTab] = React.useState<"overview" | "review">("overview");

  React.useEffect(() => {
    setActiveLocale((prev: string) => coerceLocale(prev, defaultLocaleFromDb || JOB_APPLICATIONS_DEFAULT_LOCALE));
  }, [coerceLocale, defaultLocaleFromDb]);

  const { data: item, isFetching } = useGetJobApplicationAdminQuery({ id, locale: activeLocale });
  const [updateStatus, { isLoading: isUpdating }] = useUpdateJobApplicationStatusAdminMutation();
  const [deleteApplication, { isLoading: isDeleting }] = useDeleteJobApplicationAdminMutation();

  const [formData, setFormData] = React.useState(() => mapJobApplicationToDetailForm(null));

  React.useEffect(() => {
    setFormData(mapJobApplicationToDetailForm(item));
  }, [item]);

  const handleSubmit = async () => {
    try {
      await updateStatus({
        id,
        locale: activeLocale,
        patch: buildJobApplicationStatusPayload(formData),
      }).unwrap();
      toast.success(t("messages.updated"));
    } catch (error) {
      toast.error(`${t("messages.errorPrefix")}: ${error}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("messages.confirmDelete"))) return;
    try {
      await deleteApplication({ id, locale: activeLocale }).unwrap();
      toast.success(t("messages.deleted"));
      router.push("/admin/job-applications");
    } catch (error) {
      toast.error(`${t("messages.deleteError")}: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/job-applications")}
            title={t("actions.back")}
            aria-label={t("actions.back")}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t("actions.back")}
          </Button>
          <h1 className="font-semibold text-lg">{t("detail.title")}</h1>
        </div>
        <div className="flex items-center gap-3">
          {localeOptions && localeOptions.length > 0 && (
            <AdminLocaleSelect value={activeLocale} onChange={setActiveLocale} options={localeOptions} />
          )}
          <Button variant="outline" size="sm" onClick={handleDelete} disabled={isDeleting || isFetching}>
            <Trash2 className="mr-1 h-4 w-4" />
            {t("actions.delete")}
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={isUpdating || isFetching}>
            <Save className="mr-1 h-4 w-4" />
            {t("actions.save")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "overview" | "review")}>
        <TabsList>
          <TabsTrigger value="overview">{t("tabs.overview")}</TabsTrigger>
          <TabsTrigger value="review">{t("tabs.review")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.overviewTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>{t("table.fullName")}</Label>
                <Input value={item?.full_name || ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label>{t("table.jobTitle")}</Label>
                <Input value={item?.job_title || ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label>{t("table.email")}</Label>
                <Input value={item?.email || ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label>{t("table.phone")}</Label>
                <Input value={item?.phone || ""} readOnly />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{t("detail.coverLetter")}</Label>
                <Textarea value={item?.cover_letter || ""} readOnly rows={8} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>{t("detail.cvUrl")}</Label>
                <Input value={item?.cv_url || ""} readOnly />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.reviewTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("form.status")}</Label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as JobApplicationStatus }))}
                >
                  {JOB_APPLICATION_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {t(`statuses.${status}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>{t("form.adminNote")}</Label>
                <Textarea
                  rows={6}
                  value={formData.admin_note}
                  onChange={(e) => setFormData((prev) => ({ ...prev, admin_note: e.target.value }))}
                  placeholder={t("form.adminNotePlaceholder")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
