"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, FileIcon, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AIActionDropdown } from "@/app/(main)/admin/_components/common/ai-action-dropdown";
import { AIResultsPanel } from "@/app/(main)/admin/_components/common/ai-results-panel";
import { ImagesGalleryTab } from "@/app/(main)/admin/_components/common/images-gallery-tab";
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
  useAddLibraryFileAdminMutation,
  useAddLibraryImageAdminMutation,
  useCreateLibraryAdminMutation,
  useDeleteLibraryFileAdminMutation,
  useDeleteLibraryImageAdminMutation,
  useGetLibraryAdminQuery,
  useListLibraryFilesAdminQuery,
  useListLibraryImagesAdminQuery,
  useUpdateLibraryAdminMutation,
} from "@/integrations/hooks";
import type { LibraryFileDto } from "@/integrations/shared";
import {
  createEmptyLibraryDetailForm,
  LIBRARY_DEFAULT_LOCALE,
  type LibraryDetailTabKey,
  mapLibraryToDetailForm,
} from "@/integrations/shared";

interface Props {
  id: string;
}

export default function LibraryDetailClient({ id }: Props) {
  const t = useAdminT("admin.library");
  const router = useRouter();
  const isNew = id === "new";

  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState(() =>
    coerceLocale(defaultLocaleFromDb, LIBRARY_DEFAULT_LOCALE),
  );
  const [activeTab, setActiveTab] = React.useState<LibraryDetailTabKey>("content");

  React.useEffect(() => {
    setActiveLocale((prev: string) => coerceLocale(prev, defaultLocaleFromDb || LIBRARY_DEFAULT_LOCALE));
  }, [coerceLocale, defaultLocaleFromDb]);

  const { data: item, isFetching, refetch } = useGetLibraryAdminQuery({ id, locale: activeLocale }, { skip: isNew });
  const { data: libraryImages = [], refetch: refetchImages } = useListLibraryImagesAdminQuery(
    { libraryId: id, locale: activeLocale },
    { skip: isNew },
  );

  const [createItem, { isLoading: isCreating }] = useCreateLibraryAdminMutation();
  const [updateItem, { isLoading: isUpdating }] = useUpdateLibraryAdminMutation();
  const [addLibraryImage] = useAddLibraryImageAdminMutation();
  const [deleteLibraryImage] = useDeleteLibraryImageAdminMutation();

  const [formData, setFormData] = React.useState(() => createEmptyLibraryDetailForm(activeLocale));
  const formInitRef = React.useRef<string | null>(null);
  const imagesInitRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!item || isNew) return;
    const key = `${item.id}-${activeLocale}`;
    if (formInitRef.current === key) return;
    formInitRef.current = key;
    setFormData(mapLibraryToDetailForm(item, activeLocale));
  }, [item, isNew, activeLocale]);

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
    const nextKey = `${id}-${activeLocale}-${libraryImages.map((image) => image.id).join(",")}`;
    if (imagesInitRef.current === nextKey) return;
    imagesInitRef.current = nextKey;

    const urls = libraryImages
      .map((image) => String(image.img_asset_url || image.image_url || "").trim())
      .filter(Boolean);
    const coverUrl = String(formData.cover_image || item?.featured_image || item?.image_url || urls[0] || "").trim();

    setFormData((prev) => ({
      ...prev,
      cover_image: coverUrl,
      image_url: coverUrl,
      images: coverUrl && !urls.includes(coverUrl) ? [coverUrl, ...urls] : urls,
    }));
  }, [activeLocale, formData.cover_image, id, isNew, item?.featured_image, item?.image_url, libraryImages]);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // AI
  const { assist: aiAssist, loading: aiLoading } = useAIContentAssist();
  const [aiResults, setAiResults] = React.useState<LocaleContent[] | null>(null);

  const handleAIAction = async (action: AIAction) => {
    const targetLocales = (localeOptions || []).map((localeOption: { value?: string }) => String(localeOption.value || "")).filter(Boolean);
    if (!targetLocales.length) {
      const fallbackLocale = String(activeLocale || defaultLocaleFromDb || LIBRARY_DEFAULT_LOCALE).trim();
      if (fallbackLocale) targetLocales.push(fallbackLocale);
    }
    const result = await aiAssist({
      title: formData.name,
      summary: formData.description,
      content: formData.description,
      locale: activeLocale,
      target_locales: targetLocales,
      module_key: "library",
      action,
    });
    if (!result) return;
    setAiResults(result);
    const current = result.find((r) => r.locale === activeLocale) || result[0];
    if (current) {
      setFormData((prev) => ({
        ...prev,
        name: current.title ?? prev.name,
        slug: current.slug ?? prev.slug,
        description: current.content ?? current.summary ?? prev.description,
        meta_title: current.meta_title ?? prev.meta_title,
        meta_description: current.meta_description ?? prev.meta_description,
        tags: current.tags ? current.tags : prev.tags,
      }));
    }
  };

  const handleApplyAILocale = (lc: LocaleContent) => {
    formInitRef.current = `${id}-${lc.locale}`;
    setActiveLocale(lc.locale);
    setFormData((prev) => ({
      ...prev,
      locale: lc.locale,
      name: lc.title || "",
      slug: lc.slug || prev.slug,
      description: lc.content || lc.summary || "",
      meta_title: lc.meta_title || "",
      meta_description: lc.meta_description || "",
    }));
  };

  const syncLibraryImages = async (libraryId: string) => {
    const desiredUrls = Array.from(
      new Set([...formData.images.filter(Boolean), ...(formData.cover_image ? [formData.cover_image] : [])]),
    );

    for (const image of libraryImages) {
      await deleteLibraryImage({ libraryId, imageId: String(image.id) }).unwrap();
    }

    for (const [index, imageUrl] of desiredUrls.entries()) {
      await addLibraryImage({
        libraryId,
        body: {
          image_url: imageUrl,
          display_order: index,
          is_active: true,
          locale: activeLocale,
          alt: formData.image_alt || undefined,
        },
      }).unwrap();
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.slug) {
      toast.error(t("messages.requiredError"));
      return;
    }
    try {
      const payload = {
        locale: activeLocale,
        name: formData.name,
        slug: formData.slug,
        description: formData.description || undefined,
        type: formData.type || undefined,
        category_id: formData.category_id || "",
        sub_category_id: formData.sub_category_id || null,
        image_url: formData.cover_image || formData.image_url || null,
        image_alt: formData.image_alt || null,
        tags: formData.tags || "",
        display_order: formData.display_order,
        is_published: formData.is_published,
        is_active: formData.is_active,
        featured: formData.featured,
        meta_title: formData.meta_title || undefined,
        meta_description: formData.meta_description || undefined,
        meta_keywords: formData.meta_keywords || undefined,
      };
      if (isNew) {
        const result = await createItem(payload).unwrap();
        const libraryId = String(result?.id || "").trim();
        if (libraryId && formData.images.length > 0) {
          await syncLibraryImages(libraryId);
          toast.success(t("messages.imagesSynced"));
        }
        toast.success(t("messages.created"));
        if (libraryId) router.push(`/admin/library/${libraryId}`);
      } else {
        await updateItem({ id, patch: payload }).unwrap();
        await syncLibraryImages(id);
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
            onClick={() => router.push("/admin/library")}
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
            disabled={isSaving || isFetching || !formData.name.trim()}
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

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LibraryDetailTabKey)}>
        <TabsList>
          <TabsTrigger value="content">{t("tabs.content")}</TabsTrigger>
          <TabsTrigger value="seo">{t("tabs.seo")}</TabsTrigger>
          <TabsTrigger value="images">{t("tabs.images")}</TabsTrigger>
          <TabsTrigger value="files">{t("tabs.files")}</TabsTrigger>
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
                  <Label>{t("form.name")}</Label>
                  <Input value={formData.name} onChange={(e) => handleChange("name", e.target.value)} />
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
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.type")}</Label>
                  <Input value={formData.type} onChange={(e) => handleChange("type", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.categoryId")}</Label>
                  <Input value={formData.category_id} onChange={(e) => handleChange("category_id", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.subCategoryId")}</Label>
                  <Input
                    value={formData.sub_category_id}
                    onChange={(e) => handleChange("sub_category_id", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.tags")}</Label>
                  <Input value={formData.tags} onChange={(e) => handleChange("tags", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.imageAlt")}</Label>
                  <Input value={formData.image_alt} onChange={(e) => handleChange("image_alt", e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.displayOrder")}</Label>
                  <Input
                    type="number"
                    value={formData.display_order || ""}
                    onChange={(e) => handleChange("display_order", Number.parseInt(e.target.value, 10) || 0)}
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Switch checked={formData.is_published} onCheckedChange={(v) => handleChange("is_published", v)} />
                  <Label>{t("form.isPublished")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.is_active} onCheckedChange={(v) => handleChange("is_active", v)} />
                  <Label>{t("form.isActive")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={formData.featured} onCheckedChange={(v) => handleChange("featured", v)} />
                  <Label>{t("form.featured")}</Label>
                </div>
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
              <div className="space-y-2">
                <Label>{t("form.metaKeywords")}</Label>
                <Input value={formData.meta_keywords} onChange={(e) => handleChange("meta_keywords", e.target.value)} />
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
                  onCoverChange={(url) => {
                    setFormData((prev) => ({
                      ...prev,
                      cover_image: url,
                      image_url: url,
                    }));
                  }}
                  onImagesChange={(urls) => {
                    setFormData((prev) => {
                      const cover = prev.cover_image;
                      const merged = cover && !urls.includes(cover) ? [cover, ...urls] : urls;
                      return {
                        ...prev,
                        images: merged,
                        cover_image: cover || (urls.length > 0 ? urls[0] : ""),
                        image_url: cover || (urls.length > 0 ? urls[0] : ""),
                      };
                    });
                  }}
                  disabled={isSaving || isFetching}
                  folder="uploads/support/library"
                />
                <p className="text-muted-foreground text-sm">{t("images.saveHint")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FILES */}
        <TabsContent value="files">
          {!isNew ? (
            <FilesTab libraryId={id} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground text-sm">
                {t("detail.filesAfterCreate")}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ============ FILES TAB ============ */
function FilesTab({ libraryId }: { libraryId: string }) {
  const t = useAdminT("admin.library");
  const { data: files = [], refetch } = useListLibraryFilesAdminQuery({ libraryId });
  const [addFile] = useAddLibraryFileAdminMutation();
  const [deleteFile] = useDeleteLibraryFileAdminMutation();

  const [newFileName, setNewFileName] = React.useState("");
  const [newFileUrl, setNewFileUrl] = React.useState("");
  const [newFileType, setNewFileType] = React.useState("");
  const [newFileSize, setNewFileSize] = React.useState("");

  const handleAdd = async () => {
    if (!newFileName.trim() || !newFileUrl.trim()) return;
    try {
      await addFile({
        libraryId,
        body: {
          name: newFileName,
          file_url: newFileUrl,
          mime_type: newFileType || undefined,
          size_bytes: newFileSize ? Number.parseInt(newFileSize, 10) : undefined,
        },
      }).unwrap();
      setNewFileName("");
      setNewFileUrl("");
      setNewFileType("");
      setNewFileSize("");
      refetch();
      toast.success(t("messages.fileAdded"));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`${t("messages.fileAddError")}: ${message}`);
    }
  };

  const handleDelete = async (fileId: string) => {
    if (!confirm(t("messages.confirmFileDelete"))) return;
    try {
      await deleteFile({ libraryId, fileId }).unwrap();
      refetch();
      toast.success(t("messages.fileDeleted"));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      toast.error(`${t("messages.fileDeleteError")}: ${message}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("detail.filesTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {files.map((file: LibraryFileDto) => (
          <div key={file.id} className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <div className="flex gap-2 text-muted-foreground text-xs">
                    {file.mime_type && <span>{file.mime_type}</span>}
                    {typeof file.size_bytes === "number" && <span>{file.size_bytes}</span>}
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="shrink-0 text-destructive"
                onClick={() => handleDelete(file.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        <div className="space-y-2 rounded-lg border-2 border-dashed p-4">
          <p className="font-medium text-sm">{t("detail.addFile")}</p>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder={t("form.fileName")}
            />
            <Input value={newFileUrl} onChange={(e) => setNewFileUrl(e.target.value)} placeholder={t("form.fileUrl")} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={newFileType}
              onChange={(e) => setNewFileType(e.target.value)}
              placeholder={t("form.fileType")}
            />
            <Input
              value={newFileSize}
              onChange={(e) => setNewFileSize(e.target.value)}
              placeholder={t("form.fileSize")}
            />
          </div>
          <Button size="sm" disabled={!newFileName.trim() || !newFileUrl.trim()} onClick={handleAdd}>
            <Plus className="mr-1 h-4 w-4" />
            {t("files.add")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
