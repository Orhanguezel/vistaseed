"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateBlogPostAdminMutation,
  useGetBlogPostAdminQuery,
  useUpdateBlogPostAdminMutation,
} from "@/integrations/hooks";
import {
  BLOG_POST_DEFAULT_LOCALE,
  buildBlogPostPayload,
  createEmptyBlogPostForm,
  type BlogCategory,
  type BlogPostDetailTabKey,
  mapBlogPostToForm,
} from "@/integrations/shared";

const CATEGORIES: { value: BlogCategory; label: string }[] = [
  { value: "genel", label: "Genel" },
  { value: "haber", label: "Haber / RSS" },
  { value: "tohum-bilimi", label: "Tohum bilimi" },
  { value: "ekim-teknikleri", label: "Ekim teknikleri" },
  { value: "tarim-teknolojisi", label: "Tarım teknolojisi" },
  { value: "piyasa-analizi", label: "Piyasa analizi" },
  { value: "mevsimsel", label: "Mevsimsel" },
];

interface Props {
  id: string;
}

export default function BlogDetailClient({ id }: Props) {
  const t = useAdminT("admin.blog");
  const router = useRouter();
  const isNew = id === "new";

  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState(() =>
    coerceLocale(defaultLocaleFromDb, BLOG_POST_DEFAULT_LOCALE),
  );
  const [activeTab, setActiveTab] = React.useState<BlogPostDetailTabKey>("content");

  React.useEffect(() => {
    setActiveLocale((prev: string) => coerceLocale(prev, defaultLocaleFromDb || BLOG_POST_DEFAULT_LOCALE));
  }, [coerceLocale, defaultLocaleFromDb]);

  const { data: item, isFetching, refetch } = useGetBlogPostAdminQuery(
    { id, locale: activeLocale },
    { skip: isNew },
  );

  const [createPost, { isLoading: isCreating }] = useCreateBlogPostAdminMutation();
  const [updatePost, { isLoading: isUpdating }] = useUpdateBlogPostAdminMutation();

  const [formData, setFormData] = React.useState(() => createEmptyBlogPostForm());
  const formInitRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!item || isNew) return;
    const key = `${item.id}-${activeLocale}`;
    if (formInitRef.current === key) return;
    formInitRef.current = key;
    setFormData(mapBlogPostToForm(item));
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

  const handleSave = async () => {
    const payload = buildBlogPostPayload(formData, activeLocale);
    try {
      if (isNew) {
        const created = await createPost(payload).unwrap();
        toast.success(t("messages.saved"));
        router.replace(`/admin/blog/${created.id}`);
        return;
      }
      await updatePost({ id, patch: payload }).unwrap();
      toast.success(t("messages.saved"));
      refetch();
    } catch (error) {
      toast.error(`${t("messages.saveError")}: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/blog")}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          {t("actions.back")}
        </Button>
        {localeOptions && localeOptions.length > 0 && (
          <AdminLocaleSelect value={activeLocale} onChange={setActiveLocale} options={localeOptions} />
        )}
        <Button className="ml-auto" size="sm" onClick={handleSave} disabled={isCreating || isUpdating || isFetching}>
          <Save className="mr-1 h-4 w-4" />
          {t("actions.save")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{isNew ? t("detail.newTitle") : t("detail.editTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>{t("form.category")}</Label>
              <Select value={formData.category} onValueChange={(v) => handleChange("category", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("form.status")}</Label>
              <Select
                value={formData.status}
                onValueChange={(v) => handleChange("status", v as "draft" | "published")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">{t("status.draft")}</SelectItem>
                  <SelectItem value="published">{t("status.published")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("form.displayOrder")}</Label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => handleChange("display_order", parseInt(e.target.value, 10) || 0)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("form.publishedAt")}</Label>
              <Input
                type="datetime-local"
                value={formData.published_at}
                onChange={(e) => handleChange("published_at", e.target.value)}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center gap-2">
                <Switch checked={formData.is_active} onCheckedChange={(c) => handleChange("is_active", c)} />
                <Label>{t("form.active")}</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t("form.author")}</Label>
              <Input value={formData.author} onChange={(e) => handleChange("author", e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t("form.imageUrl")}</Label>
              <Input value={formData.image_url} onChange={(e) => handleChange("image_url", e.target.value)} />
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as BlogPostDetailTabKey)}>
            <TabsList>
              <TabsTrigger value="content">{t("form.tabs.content")}</TabsTrigger>
              <TabsTrigger value="seo">{t("form.tabs.seo")}</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>{t("form.title")}</Label>
                <Input value={formData.title} onChange={(e) => handleChange("title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("form.slug")}</Label>
                <Input value={formData.slug} onChange={(e) => handleChange("slug", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("form.excerpt")}</Label>
                <Textarea value={formData.excerpt} onChange={(e) => handleChange("excerpt", e.target.value)} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>{t("form.content")}</Label>
                <Textarea value={formData.content} onChange={(e) => handleChange("content", e.target.value)} rows={14} />
              </div>
            </TabsContent>
            <TabsContent value="seo" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>{t("form.metaTitle")}</Label>
                <Input value={formData.meta_title} onChange={(e) => handleChange("meta_title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>{t("form.metaDescription")}</Label>
                <Textarea
                  value={formData.meta_description}
                  onChange={(e) => handleChange("meta_description", e.target.value)}
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
