"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { AIActionDropdown } from "@/app/(main)/admin/_components/common/ai-action-dropdown";
import { AIResultsPanel } from "@/app/(main)/admin/_components/common/ai-results-panel";
import { ImagesGalleryTab } from "@/app/(main)/admin/_components/common/images-gallery-tab";
import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
import { type LocaleContent, useAIContentAssist } from "@/app/(main)/admin/_components/common/use-ai-content-assist";
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
  useAddGalleryImageAdminMutation,
  useCreateGalleryAdminMutation,
  useDeleteGalleryImageAdminMutation,
  useGetGalleryAdminQuery,
  useListGalleryImagesAdminQuery,
  useUpdateGalleryAdminMutation,
} from "@/integrations/hooks";
import {
  createEmptyGalleryDetailForm,
  GALLERY_DEFAULT_LOCALE,
  type GalleryDetailTabKey,
  mapGalleryToDetailForm,
} from "@/integrations/shared";

interface Props {
  id: string;
}

export default function GalleryDetailClient({ id }: Props) {
  const t = useAdminT("admin.gallery");
  const router = useRouter();
  const isNew = id === "new";

  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState(() =>
    coerceLocale(defaultLocaleFromDb, GALLERY_DEFAULT_LOCALE),
  );
  const [activeTab, setActiveTab] = React.useState<GalleryDetailTabKey>("content");

  React.useEffect(() => {
    setActiveLocale((prev: string) => coerceLocale(prev, defaultLocaleFromDb || GALLERY_DEFAULT_LOCALE));
  }, [coerceLocale, defaultLocaleFromDb]);

  const { data: gallery, isFetching, refetch } = useGetGalleryAdminQuery({ id, locale: activeLocale }, { skip: isNew });
  const { data: galleryImages = [], refetch: refetchImages } = useListGalleryImagesAdminQuery(
    { galleryId: id, locale: activeLocale },
    { skip: isNew },
  );

  const [createGallery, { isLoading: isCreating }] = useCreateGalleryAdminMutation();
  const [updateGallery, { isLoading: isUpdating }] = useUpdateGalleryAdminMutation();
  const [addGalleryImage] = useAddGalleryImageAdminMutation();
  const [deleteGalleryImage] = useDeleteGalleryImageAdminMutation();

  const [formData, setFormData] = React.useState(() => createEmptyGalleryDetailForm(activeLocale));
  const formInitRef = React.useRef<string | null>(null);
  const imagesInitRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!gallery || isNew) return;
    const key = `${gallery.id}-${activeLocale}`;
    if (formInitRef.current === key) return;
    formInitRef.current = key;
    setFormData(mapGalleryToDetailForm(gallery, activeLocale));
  }, [gallery, isNew, activeLocale]);

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
    const nextKey = `${id}-${activeLocale}-${galleryImages.map((image) => image.id).join(",")}`;
    if (imagesInitRef.current === nextKey) return;
    imagesInitRef.current = nextKey;

    const urls = galleryImages.map((image) => String(image.asset_url || image.image_url || "").trim()).filter(Boolean);
    const cover = galleryImages.find((image) => Boolean(image.is_cover));
    const coverUrl = String(cover?.asset_url || cover?.image_url || urls[0] || "").trim();

    setFormData((prev) => ({
      ...prev,
      cover_image: coverUrl,
      images: coverUrl && !urls.includes(coverUrl) ? [coverUrl, ...urls] : urls,
    }));
  }, [activeLocale, galleryImages, id, isNew]);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ---- AI Content Assist ---- */
  const { assist, loading: aiLoading } = useAIContentAssist();
  const [aiResults, setAiResults] = React.useState<LocaleContent[] | null>(null);

  const handleAIAction = async (action: "full" | "enhance" | "translate" | "generate_meta") => {
    const result = await assist({
      action,
      title: formData.title,
      content: formData.description,
      locale: activeLocale,
      module_key: "gallery",
    });
    if (result) setAiResults(result);
  };

  const handleApplyAI = (lc: LocaleContent) => {
    setFormData((prev) => ({
      ...prev,
      title: lc.title || prev.title,
      slug: lc.slug || prev.slug,
      description: lc.content || lc.summary || prev.description,
      meta_title: lc.meta_title || prev.meta_title,
      meta_description: lc.meta_description || prev.meta_description,
    }));
    setAiResults(null);
    toast.success(t("messages.aiApplied"));
  };

  const syncGalleryImages = async (galleryId: string) => {
    const desiredUrls = Array.from(
      new Set([...formData.images.filter(Boolean), ...(formData.cover_image ? [formData.cover_image] : [])]),
    );

    for (const image of galleryImages) {
      await deleteGalleryImage({ galleryId, imageId: String(image.id) }).unwrap();
    }

    for (const [index, imageUrl] of desiredUrls.entries()) {
      await addGalleryImage({
        galleryId,
        body: {
          image_url: imageUrl,
          display_order: index,
          is_cover: imageUrl === formData.cover_image,
          locale: activeLocale,
        },
      }).unwrap();
    }
  };

  /* ---- SAVE ---- */
  const handleSubmit = async () => {
    if (!formData.title || !formData.slug) {
      toast.error(t("messages.requiredError"));
      return;
    }
    const payload = {
      locale: activeLocale,
      title: formData.title,
      slug: formData.slug,
      description: formData.description || undefined,
      module_key: formData.module_key || undefined,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      display_order: formData.display_order,
      meta_title: formData.meta_title || undefined,
      meta_description: formData.meta_description || undefined,
    };
    try {
      if (isNew) {
        const result = await createGallery(payload).unwrap();
        const galleryId = String(result?.id || "").trim();
        if (galleryId && formData.images.length > 0) {
          await syncGalleryImages(galleryId);
          toast.success(t("messages.imagesSynced"));
        }
        toast.success(t("messages.created"));
        if (galleryId) router.push(`/admin/gallery/${galleryId}`);
      } else {
        await updateGallery({ id, patch: payload }).unwrap();
        await syncGalleryImages(id);
        formInitRef.current = null;
        imagesInitRef.current = null;
        refetchImages();
        toast.success(t("messages.imagesSynced"));
        toast.success(t("messages.updated"));
      }
    } catch (error: unknown) {
      const errMsg =
        typeof error === "object" && error !== null && "data" in error
          ? String(
              (
                error as {
                  data?: { error?: { message?: string } };
                  message?: string;
                }
              ).data?.error?.message ||
                (error as { message?: string }).message ||
                t("messages.unknownError"),
            )
          : t("messages.unknownError");
      toast.error(`${t("messages.errorPrefix")}: ${errMsg}`);
    }
  };

  const isLoading = isCreating || isUpdating || isFetching;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/gallery")}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t("actions.back")}
          </Button>
          <h1 className="font-semibold text-lg">{isNew ? t("detail.newTitle") : t("detail.editTitle")}</h1>
        </div>
        <div className="flex items-center gap-3">
          <AIActionDropdown onAction={handleAIAction} loading={aiLoading} disabled={isLoading} />
          {localeOptions && localeOptions.length > 0 && (
            <AdminLocaleSelect
              value={activeLocale}
              onChange={(v: string) => {
                setActiveLocale(v);
                setFormData((p) => ({ ...p, locale: v }));
              }}
              options={localeOptions}
            />
          )}
          <Button size="sm" onClick={handleSubmit} disabled={isLoading}>
            <Save className="mr-1 h-4 w-4" />
            {t("actions.save")}
          </Button>
        </div>
      </div>

      {aiResults && (
        <AIResultsPanel
          results={aiResults}
          currentLocale={activeLocale}
          onApply={handleApplyAI}
          onClose={() => setAiResults(null)}
        />
      )}

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as GalleryDetailTabKey)}>
        <TabsList>
          <TabsTrigger value="content">{t("tabs.content")}</TabsTrigger>
          <TabsTrigger value="seo">{t("tabs.seo")}</TabsTrigger>
          <TabsTrigger value="images">{t("tabs.images")}</TabsTrigger>
        </TabsList>

        {/* CONTENT */}
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("tabs.content")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.title")}</Label>
                  <Input value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.slug")}</Label>
                  <Input value={formData.slug} onChange={(e) => handleChange("slug", e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("form.description")}</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.moduleKey")}</Label>
                  <Input value={formData.module_key} onChange={(e) => handleChange("module_key", e.target.value)} />
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
                  <Switch checked={formData.is_active} onCheckedChange={(v) => handleChange("is_active", v)} />
                  <Label>{t("form.isActive")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.is_featured} onCheckedChange={(v) => handleChange("is_featured", v)} />
                  <Label>{t("form.isFeatured")}</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("tabs.seo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("form.metaTitle")}</Label>
                <Input value={formData.meta_title} onChange={(e) => handleChange("meta_title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("form.metaDescription")}</Label>
                <Textarea
                  value={formData.meta_description}
                  onChange={(e) => handleChange("meta_description", e.target.value)}
                  rows={3}
                />
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
                  coverUrl={formData.cover_image}
                  images={formData.images}
                  onCoverChange={(url) => setFormData((prev) => ({ ...prev, cover_image: url }))}
                  onImagesChange={(urls) => {
                    setFormData((prev) => {
                      const cover = prev.cover_image;
                      const merged = cover && !urls.includes(cover) ? [cover, ...urls] : urls;
                      return {
                        ...prev,
                        images: merged,
                        cover_image: cover || (urls.length > 0 ? urls[0] : ""),
                      };
                    });
                  }}
                  disabled={isLoading}
                  folder="uploads/support/gallery"
                />
                <p className="text-muted-foreground text-sm">{t("images.saveHint")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
