"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { AIActionDropdown } from "@/app/(main)/admin/_components/common/ai-action-dropdown";
import { AIResultsPanel } from "@/app/(main)/admin/_components/common/ai-results-panel";
import { ImagesGalleryTab } from "@/app/(main)/admin/_components/common/images-gallery-tab";
import RichContentEditor from "@/app/(main)/admin/_components/common/rich-content-editor";
import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
import {
  type AIAction,
  type LocaleContent,
  useAIContentAssist,
} from "@/app/(main)/admin/_components/common/use-ai-content-assist";
import { AdminCategorySelect } from "@/app/(main)/admin/_components/common/admin-category-select";
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
  useAddReferenceImageAdminMutation,
  useCreateReferenceAdminMutation,
  useDeleteReferenceImageAdminMutation,
  useGetReferenceAdminQuery,
  useListReferenceImagesAdminQuery,
  useUpdateReferenceAdminMutation,
} from "@/integrations/hooks";
import {
  createEmptyReferenceDetailForm,
  mapReferenceToDetailForm,
  REFERENCE_DEFAULT_LOCALE,
  type ReferenceDetailTabKey,
} from "@/integrations/shared";

interface Props {
  id: string;
}

export default function ReferenceDetailClient({ id }: Props) {
  const t = useAdminT("admin.references");
  const router = useRouter();
  const isNew = id === "new";

  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState(() =>
    coerceLocale(defaultLocaleFromDb, REFERENCE_DEFAULT_LOCALE),
  );
  const [activeTab, setActiveTab] = React.useState<ReferenceDetailTabKey>("content");

  React.useEffect(() => {
    const next = coerceLocale(activeLocale, defaultLocaleFromDb || REFERENCE_DEFAULT_LOCALE);
    if (next !== activeLocale) {
      setActiveLocale(next);
    }
  }, [coerceLocale, defaultLocaleFromDb, activeLocale]);

  const {
    data: reference,
    isFetching,
    refetch,
  } = useGetReferenceAdminQuery({ id, locale: activeLocale }, { skip: isNew });
  const { data: referenceImages = [], refetch: refetchImages } = useListReferenceImagesAdminQuery(
    { referenceId: id, locale: activeLocale },
    { skip: isNew },
  );

  const [createReference, { isLoading: isCreating }] = useCreateReferenceAdminMutation();
  const [updateReference, { isLoading: isUpdating }] = useUpdateReferenceAdminMutation();
  const [addReferenceImage] = useAddReferenceImageAdminMutation();
  const [deleteReferenceImage] = useDeleteReferenceImageAdminMutation();

  const [formData, setFormData] = React.useState(() => createEmptyReferenceDetailForm(activeLocale));
  const formInitRef = React.useRef<string | null>(null);
  const imagesInitRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!reference || isNew) return;
    const key = `${reference.id}-${activeLocale}`;
    if (formInitRef.current === key) return;
    formInitRef.current = key;
    setFormData(mapReferenceToDetailForm(reference, activeLocale));
  }, [reference, isNew, activeLocale]);

  React.useEffect(() => {
    if (!isNew && id) {
      formInitRef.current = null;
      imagesInitRef.current = null;
      refetch();
      refetchImages();
    }
  }, [id, isNew, refetch, refetchImages]);

  React.useEffect(() => {
    if (isNew) return;
    const nextKey = `${id}-${activeLocale}-${referenceImages.map((image) => image.id).join(",")}`;
    if (imagesInitRef.current === nextKey) return;
    imagesInitRef.current = nextKey;

    const urls = referenceImages.map((image) => String(image.image_url || "").trim()).filter(Boolean);
    const featuredImage = String(
      referenceImages.find((image) => image.is_featured)?.image_url ||
        formData.featured_image ||
        reference?.featured_image ||
        urls[0] ||
        "",
    ).trim();

    setFormData((prev) => ({
      ...prev,
      featured_image: featuredImage,
      images: featuredImage && !urls.includes(featuredImage) ? [featuredImage, ...urls] : urls,
    }));
  }, [activeLocale, formData.featured_image, id, isNew, reference?.featured_image, referenceImages]);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // AI
  const { assist: aiAssist, loading: aiLoading } = useAIContentAssist();
  const [aiResults, setAiResults] = React.useState<LocaleContent[] | null>(null);

  const handleAIAction = async (action: AIAction) => {
    const targetLocales = (localeOptions || []).map((localeOption: { value?: string }) => String(localeOption.value || "")).filter(Boolean);
    if (!targetLocales.length) {
      const fallbackLocale = String(activeLocale || defaultLocaleFromDb || REFERENCE_DEFAULT_LOCALE).trim();
      if (fallbackLocale) targetLocales.push(fallbackLocale);
    }
    const result = await aiAssist({
      title: formData.title,
      summary: formData.summary,
      content: formData.content,
      locale: activeLocale,
      target_locales: targetLocales,
      module_key: "references",
      action,
    });
    if (!result) return;
    setAiResults(result);
    const current = result.find((r) => r.locale === activeLocale) || result[0];
    if (current) {
      setFormData((prev) => ({
        ...prev,
        title: current.title ?? prev.title,
        slug: current.slug ?? prev.slug,
        content: current.content ?? prev.content,
        summary: current.summary ?? prev.summary,
        meta_title: current.meta_title ?? prev.meta_title,
        meta_description: current.meta_description ?? prev.meta_description,
      }));
    }
  };

  const handleApplyAILocale = (lc: LocaleContent) => {
    formInitRef.current = `${id}-${lc.locale}`;
    setActiveLocale(lc.locale);
    setFormData((prev) => ({
      ...prev,
      locale: lc.locale,
      title: lc.title || "",
      slug: lc.slug || prev.slug,
      content: lc.content || lc.summary || "",
      summary: lc.summary || prev.summary,
      meta_title: lc.meta_title || "",
      meta_description: lc.meta_description || "",
    }));
  };

  const syncReferenceImages = async (referenceId: string) => {
    const desiredUrls = Array.from(
      new Set([...formData.images.filter(Boolean), ...(formData.featured_image ? [formData.featured_image] : [])]),
    );

    for (const image of referenceImages) {
      await deleteReferenceImage({ referenceId, imageId: String(image.id) }).unwrap();
    }

    for (const [index, imageUrl] of desiredUrls.entries()) {
      await addReferenceImage({
        referenceId,
        body: {
          image_url: imageUrl,
          display_order: index,
          is_featured: imageUrl === formData.featured_image,
          locale: activeLocale,
          alt: formData.featured_image_alt || undefined,
          title: formData.title || undefined,
        },
      }).unwrap();
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.slug) {
      toast.error(t("messages.requiredError"));
      return;
    }
    try {
      const payload = {
        locale: activeLocale,
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary || undefined,
        content: formData.content || "",
        website_url: formData.website_url || null,
        category_id: formData.category_id || null,
        featured_image: formData.featured_image || null,
        featured_image_alt: formData.featured_image_alt || null,
        display_order: formData.display_order,
        is_published: formData.is_published,
        is_featured: formData.is_featured,
        meta_title: formData.meta_title || undefined,
        meta_description: formData.meta_description || undefined,
      };
      if (isNew) {
        const result = await createReference(payload).unwrap();
        const referenceId = String(result?.id || "").trim();
        if (referenceId && formData.images.length > 0) {
          await syncReferenceImages(referenceId);
          toast.success(t("messages.imagesSynced"));
        }
        toast.success(t("messages.created"));
        if (referenceId) router.push(`/admin/references/${referenceId}`);
      } else {
        await updateReference({ id, patch: payload }).unwrap();
        await syncReferenceImages(id);
        formInitRef.current = null;
        imagesInitRef.current = null;
        refetchImages();
        toast.success(t("messages.imagesSynced"));
        toast.success(t("messages.updated"));
      }
    } catch (error) {
      const errMsg =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "error" in error.data &&
        typeof error.data.error === "object" &&
        error.data.error !== null &&
        "message" in error.data.error &&
        typeof error.data.error.message === "string"
          ? error.data.error.message
          : error instanceof Error
            ? error.message
            : t("messages.unknownError");
      toast.error(`${t("messages.errorPrefix")}: ${errMsg}`);
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
            onClick={() => router.push("/admin/references")}
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

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ReferenceDetailTabKey)}>
        <TabsList>
          <TabsTrigger value="content">{t("tabs.content")}</TabsTrigger>
          <TabsTrigger value="images">{t("tabs.images")}</TabsTrigger>
          <TabsTrigger value="seo">{t("tabs.seo")}</TabsTrigger>
        </TabsList>

        {/* CONTENT */}
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
                    placeholder={t("form.titlePlaceholder")}
                    value={formData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.slug")}</Label>
                  <Input
                    placeholder={t("form.slugPlaceholder")}
                    value={formData.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("form.summary")}</Label>
                <Textarea
                  placeholder={t("form.summaryPlaceholder")}
                  value={formData.summary}
                  onChange={(e) => handleChange("summary", e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("form.content")}</Label>
                <RichContentEditor value={formData.content} onChange={(v) => handleChange("content", v)} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.websiteUrl")}</Label>
                  <Input
                    placeholder={t("form.websiteUrlPlaceholder")}
                    value={formData.website_url}
                    onChange={(e) => handleChange("website_url", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.category")}</Label>
                  <AdminCategorySelect
                    moduleKey="references"
                    locale={activeLocale}
                    value={formData.category_id}
                    onChange={(v: string) => handleChange("category_id", v)}
                    placeholder={t("form.categoryPlaceholder")}
                    disabled={isSaving || isFetching}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.displayOrder")}</Label>
                  <Input
                    type="number"
                    value={formData.display_order || ""}
                    onChange={(e) => handleChange("display_order", parseInt(e.target.value, 10) || 0)}
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={formData.is_published} onCheckedChange={(v) => handleChange("is_published", v)} />
                  <Label>{t("form.isPublished")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.is_featured} onCheckedChange={(v) => handleChange("is_featured", v)} />
                  <Label>{t("form.isFeatured")}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IMAGES */}
        <TabsContent value="images">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.imagesTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">{t("detail.imagesDescription")}</p>
                <ImagesGalleryTab
                  coverUrl={formData.featured_image}
                  images={formData.images}
                  onCoverChange={(url) => setFormData((p) => ({ ...p, featured_image: url }))}
                  onImagesChange={(urls) => {
                    setFormData((p) => {
                      const cover = p.featured_image;
                      const merged = cover && !urls.includes(cover) ? [cover, ...urls] : urls;
                      return { ...p, images: merged, featured_image: cover || (urls.length > 0 ? urls[0] : "") };
                    });
                  }}
                  disabled={isSaving || isFetching}
                  folder="uploads/references"
                />
                <p className="text-muted-foreground text-sm">{t("images.saveHint")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.seoTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("form.metaTitle")}</Label>
                <Input
                  placeholder={t("form.metaTitlePlaceholder")}
                  value={formData.meta_title}
                  onChange={(e) => handleChange("meta_title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("form.metaDescription")}</Label>
                <Textarea
                  placeholder={t("form.metaDescriptionPlaceholder")}
                  value={formData.meta_description}
                  onChange={(e) => handleChange("meta_description", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("form.featuredImageAlt")}</Label>
                <Input
                  placeholder={t("form.featuredImageAltPlaceholder")}
                  value={formData.featured_image_alt}
                  onChange={(e) => handleChange("featured_image_alt", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
