"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { AIActionDropdown } from "@/app/(main)/admin/_components/common/ai-action-dropdown";
import { AIResultsPanel } from "@/app/(main)/admin/_components/common/ai-results-panel";
import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
import {
  type AIAction,
  type LocaleContent,
  useAIContentAssist,
} from "@/app/(main)/admin/_components/common/use-ai-content-assist";
import { AdminLocaleSelect } from "@/components/common/admin-locale-select";
import { useAdminLocales } from "@/components/common/use-admin-locales";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateJobListingAdminMutation,
  useGetJobListingAdminQuery,
  useUpdateJobListingAdminMutation,
} from "@/integrations/hooks";
import {
  buildJobListingPayload,
  createEmptyJobListingDetailForm,
  JOB_LISTINGS_DEFAULT_LOCALE,
  type JobEmploymentType,
  type JobListingDetailTabKey,
  mapJobListingToDetailForm,
} from "@/integrations/shared";

interface Props {
  id: string;
}

export default function JobListingDetailClient({ id }: Props) {
  const t = useAdminT("admin.job-listings");
  const router = useRouter();
  const isNew = id === "new";

  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState(() =>
    coerceLocale(defaultLocaleFromDb, JOB_LISTINGS_DEFAULT_LOCALE),
  );
  const [activeTab, setActiveTab] = React.useState<JobListingDetailTabKey>("content");

  React.useEffect(() => {
    setActiveLocale((prev: string) => coerceLocale(prev, defaultLocaleFromDb || JOB_LISTINGS_DEFAULT_LOCALE));
  }, [coerceLocale, defaultLocaleFromDb]);

  const { data: item, isFetching, refetch } = useGetJobListingAdminQuery({ id, locale: activeLocale }, { skip: isNew });

  const [createJob, { isLoading: isCreating }] = useCreateJobListingAdminMutation();
  const [updateJob, { isLoading: isUpdating }] = useUpdateJobListingAdminMutation();

  const [formData, setFormData] = React.useState(() => createEmptyJobListingDetailForm(activeLocale));
  const formInitRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!item || isNew) return;
    const key = `${item.id}-${activeLocale}`;
    if (formInitRef.current === key) return;
    formInitRef.current = key;
    setFormData(mapJobListingToDetailForm(item, activeLocale));
  }, [activeLocale, isNew, item]);

  React.useEffect(() => {
    if (!isNew && id) {
      formInitRef.current = null;
      refetch();
    }
  }, [id, isNew, refetch]);

  const handleChange = (field: keyof typeof formData, value: boolean | number | string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const { assist: aiAssist, loading: aiLoading } = useAIContentAssist();
  const [aiResults, setAiResults] = React.useState<LocaleContent[] | null>(null);

  const handleAIAction = async (action: AIAction) => {
    const targetLocales = (localeOptions || []).map((option: { value?: string }) => String(option.value || "")).filter(Boolean);
    if (!targetLocales.length) {
      const fallbackLocale = String(activeLocale || defaultLocaleFromDb || JOB_LISTINGS_DEFAULT_LOCALE).trim();
      if (fallbackLocale) targetLocales.push(fallbackLocale);
    }

    const result = await aiAssist({
      title: formData.title,
      summary: formData.description,
      content: formData.description,
      tags: formData.requirements,
      locale: activeLocale,
      target_locales: targetLocales,
      module_key: "job_listings",
      action,
    });

    if (!result) return;
    setAiResults(result);

    const current = result.find((row) => row.locale === activeLocale) || result[0];
    if (current) {
      setFormData((prev) => ({
        ...prev,
        title: current.title || prev.title,
        slug: current.slug || prev.slug,
        description: current.content || current.summary || prev.description,
        meta_title: current.meta_title || prev.meta_title,
        meta_description: current.meta_description || prev.meta_description,
      }));
    }
  };

  const handleApplyAILocale = (content: LocaleContent) => {
    formInitRef.current = `${id}-${content.locale}`;
    setActiveLocale(content.locale);
    setFormData((prev) => ({
      ...prev,
      locale: content.locale,
      title: content.title || prev.title,
      slug: content.slug || prev.slug,
      description: content.content || content.summary || prev.description,
      meta_title: content.meta_title || prev.meta_title,
      meta_description: content.meta_description || prev.meta_description,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.slug.trim()) {
      toast.error(t("messages.requiredError"));
      return;
    }

    try {
      const payload = buildJobListingPayload(formData, activeLocale);
      if (isNew) {
        const result = await createJob(payload).unwrap();
        toast.success(t("messages.created"));
        if (result?.id) router.push(`/admin/job-listings/${result.id}`);
      } else {
        await updateJob({ id, patch: payload }).unwrap();
        formInitRef.current = null;
        toast.success(t("messages.updated"));
      }
    } catch (error) {
      toast.error(`${t("messages.errorPrefix")}: ${error}`);
    }
  };

  const isSaving = isCreating || isUpdating;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/job-listings")}
            title={t("actions.back")}
            aria-label={t("actions.back")}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t("actions.back")}
          </Button>
          <h1 className="font-semibold text-lg">{isNew ? t("detail.newTitle") : t("detail.editTitle")}</h1>
        </div>
        <div className="flex items-center gap-3">
          {localeOptions && localeOptions.length > 0 && (
            <AdminLocaleSelect
              value={activeLocale}
              onChange={(value: string) => {
                setActiveLocale(value);
                setFormData((prev) => ({ ...prev, locale: value }));
              }}
              options={localeOptions}
            />
          )}
          <AIActionDropdown
            onAction={handleAIAction}
            loading={aiLoading}
            disabled={isSaving || isFetching || !formData.title.trim()}
          />
          <Button size="sm" onClick={handleSubmit} disabled={isSaving || isFetching}>
            <Save className="mr-1 h-4 w-4" />
            {t("actions.save")}
          </Button>
        </div>
      </div>

      {aiResults && aiResults.length > 1 && (
        <AIResultsPanel
          results={aiResults}
          currentLocale={activeLocale}
          onApply={handleApplyAILocale}
          onClose={() => setAiResults(null)}
        />
      )}

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as JobListingDetailTabKey)}>
        <TabsList>
          <TabsTrigger value="content">{t("tabs.content")}</TabsTrigger>
          <TabsTrigger value="seo">{t("tabs.seo")}</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.contentTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.title")}</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder={t("form.titlePlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.slug")}</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder={t("form.slugPlaceholder")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.department")}</Label>
                  <Input
                    value={formData.department}
                    onChange={(e) => handleChange("department", e.target.value)}
                    placeholder={t("form.departmentPlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.location")}</Label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder={t("form.locationPlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.employmentType")}</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    value={formData.employment_type}
                    onChange={(e) => handleChange("employment_type", e.target.value as JobEmploymentType)}
                  >
                    <option value="full_time">{t("employmentTypes.full_time")}</option>
                    <option value="part_time">{t("employmentTypes.part_time")}</option>
                    <option value="contract">{t("employmentTypes.contract")}</option>
                    <option value="intern">{t("employmentTypes.intern")}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("form.description")}</Label>
                <Textarea
                  rows={6}
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder={t("form.descriptionPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("form.requirements")}</Label>
                <Textarea
                  rows={5}
                  value={formData.requirements}
                  onChange={(e) => handleChange("requirements", e.target.value)}
                  placeholder={t("form.requirementsPlaceholder")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.displayOrder")}</Label>
                  <Input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => handleChange("display_order", Number.parseInt(e.target.value, 10) || 0)}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={formData.is_active} onCheckedChange={(value) => handleChange("is_active", value)} />
                  <Label>{t("form.isActive")}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.seoTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("form.metaTitle")}</Label>
                <Input
                  value={formData.meta_title}
                  onChange={(e) => handleChange("meta_title", e.target.value)}
                  placeholder={t("form.metaTitlePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("form.metaDescription")}</Label>
                <Textarea
                  rows={4}
                  value={formData.meta_description}
                  onChange={(e) => handleChange("meta_description", e.target.value)}
                  placeholder={t("form.metaDescriptionPlaceholder")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
