'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useAdminT } from '@/app/(main)/admin/_components/common/use-admin-t';
import { ImagesGalleryTab } from '@/app/(main)/admin/_components/common/images-gallery-tab';
import { useAdminLocales } from '@/components/common/use-admin-locales';
import { AdminLocaleSelect } from '@/components/common/admin-locale-select';
import {
  useGetProductAdminQuery,
  useCreateProductAdminMutation,
  useUpdateProductAdminMutation,
  useListProductFaqsAdminQuery,
  useCreateProductFaqAdminMutation,
  useUpdateProductFaqAdminMutation,
  useDeleteProductFaqAdminMutation,
  useListProductSpecsAdminQuery,
  useCreateProductSpecAdminMutation,
  useUpdateProductSpecAdminMutation,
  useDeleteProductSpecAdminMutation,
  useListProductReviewsAdminQuery,
  useCreateProductReviewAdminMutation,
  useDeleteProductReviewAdminMutation,
} from '@/integrations/hooks';
import {
  createEmptyProductDetailForm,
  mapProductToDetailForm,
  PRODUCT_DEFAULT_LOCALE,
  PLANTING_SEASON_OPTIONS,
  CLIMATE_ZONE_OPTIONS,
  SOIL_TYPE_OPTIONS,
  WATER_NEED_OPTIONS,
  SUN_EXPOSURE_OPTIONS,
  type ProductDetailTabKey,
  type ProductDetailFormState,
} from '@/integrations/shared';

function toggleEnum<T extends string>(list: T[], v: T): T[] {
  return list.includes(v) ? list.filter((x) => x !== v) : [...list, v];
}

function buildAgPayload(f: ProductDetailFormState): Record<string, unknown> {
  const nn = (v: number | '') => (v === '' ? null : v);
  return {
    botanical_name: f.botanical_name.trim() || null,
    planting_seasons: f.planting_seasons,
    harvest_days: nn(f.harvest_days),
    climate_zones: f.climate_zones,
    soil_types: f.soil_types,
    water_need: f.water_need === '' ? null : f.water_need,
    sun_exposure: f.sun_exposure === '' ? null : f.sun_exposure,
    min_temp: nn(f.min_temp),
    max_temp: nn(f.max_temp),
    germination_days: nn(f.germination_days),
    seed_depth_cm: nn(f.seed_depth_cm),
    row_spacing_cm: nn(f.row_spacing_cm),
    plant_spacing_cm: nn(f.plant_spacing_cm),
    yield_per_sqm: f.yield_per_sqm.trim() || null,
  };
}

interface Props {
  id: string;
}

export default function ProductDetailClient({ id }: Props) {
  const t = useAdminT('admin.products');
  const router = useRouter();
  const isNew = id === 'new';

  const { localeOptions, defaultLocaleFromDb, coerceLocale } = useAdminLocales();
  const [activeLocale, setActiveLocale] = React.useState(() =>
    coerceLocale(defaultLocaleFromDb, PRODUCT_DEFAULT_LOCALE),
  );
  const [activeTab, setActiveTab] = React.useState<ProductDetailTabKey>('content');

  React.useEffect(() => {
    setActiveLocale((prev: string) => coerceLocale(prev, defaultLocaleFromDb || PRODUCT_DEFAULT_LOCALE));
  }, [coerceLocale, defaultLocaleFromDb]);

  const { data: product, isFetching, refetch } = useGetProductAdminQuery(
    { id, locale: activeLocale },
    { skip: isNew },
  );

  const [createProduct, { isLoading: isCreating }] = useCreateProductAdminMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductAdminMutation();

  const [formData, setFormData] = React.useState(() => createEmptyProductDetailForm(activeLocale));
  const formInitRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (!product || isNew) return;
    // Sadece ilk yukleme veya locale degisiminde formData'yi set et
    const key = `${product.id}-${activeLocale}`;
    if (formInitRef.current === key) return;
    formInitRef.current = key;
    setFormData(mapProductToDetailForm(product, activeLocale));
  }, [product, isNew, activeLocale]);

  React.useEffect(() => {
    if (!isNew && id) {
      formInitRef.current = null; // locale degisince yeniden yukle
      refetch();
    }
  }, [activeLocale, id, isNew, refetch]);

  const handleChange = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /* ---- SAVE: Ensotek ile birebir ayni ---- */
  const handleSubmit = async () => {
    if (!formData.title || !formData.slug) { toast.error(t('messages.requiredError')); return; }
    const payload = {
      locale: activeLocale,
      title: formData.title,
      slug: formData.slug,
      description: formData.description || undefined,
      alt: formData.alt || undefined,
      price: formData.price,
      category_id: formData.category_id || '',
      sub_category_id: formData.sub_category_id || null,
      image_url: formData.image_url || null,
      images: formData.images || [],
      storage_asset_id: formData.storage_asset_id || null,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
      product_code: formData.product_code || undefined,
      stock_quantity: formData.stock_quantity,
      order_num: formData.order_num,
      meta_title: formData.meta_title || undefined,
      meta_description: formData.meta_description || undefined,
      item_type: isNew ? 'product' as const : undefined,
      botanical_name: formData.botanical_name || undefined,
      planting_seasons: formData.planting_seasons,
      harvest_days: formData.harvest_days === '' ? null : Number(formData.harvest_days),
      climate_zones: formData.climate_zones,
      soil_types: formData.soil_types,
      water_need: formData.water_need || null,
      sun_exposure: formData.sun_exposure || null,
      min_temp: formData.min_temp === '' ? null : Number(formData.min_temp),
      max_temp: formData.max_temp === '' ? null : Number(formData.max_temp),
      germination_days: formData.germination_days === '' ? null : Number(formData.germination_days),
      seed_depth_cm: formData.seed_depth_cm === '' ? null : Number(formData.seed_depth_cm),
      row_spacing_cm: formData.row_spacing_cm === '' ? null : Number(formData.row_spacing_cm),
      plant_spacing_cm: formData.plant_spacing_cm === '' ? null : Number(formData.plant_spacing_cm),
      yield_per_sqm: formData.yield_per_sqm || undefined,
      ...buildAgPayload(formData),
    };
    try {
      if (isNew) {
        const result = await createProduct(payload).unwrap();
        toast.success(t('messages.created'));
        if ((result as any)?.id) router.push(`/admin/products/${(result as any).id}`);
      } else {
        await updateProduct({ id, patch: payload }).unwrap();
        formInitRef.current = null; // refetch sonrasi yeni data'yi al
        toast.success(t('messages.updated'));
      }
    } catch (error: any) {
      toast.error(`${t('messages.errorPrefix')}: ${error?.data?.error?.message || error?.message || t('messages.unknownError')}`);
    }
  };

  const isLoading = isCreating || isUpdating || isFetching;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/admin/products')}>
            <ArrowLeft className="mr-1 h-4 w-4" />{t('actions.back')}
          </Button>
          <h1 className="text-lg font-semibold">{isNew ? t('detail.newTitle') : t('detail.editTitle')}</h1>
        </div>
        <div className="flex items-center gap-3">
          {localeOptions && localeOptions.length > 0 && (
            <AdminLocaleSelect value={activeLocale} onChange={(v: string) => { setActiveLocale(v); setFormData((p) => ({ ...p, locale: v })); }} options={localeOptions as any} />
          )}
          <Button size="sm" onClick={handleSubmit} disabled={isLoading}>
            <Save className="mr-1 h-4 w-4" />{t('actions.save')}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ProductDetailTabKey)}>
        <TabsList>
          <TabsTrigger value="content">{t('tabs.content')}</TabsTrigger>
          <TabsTrigger value="agriculture">{t('tabs.agriculture') || 'Tarimsal'}</TabsTrigger>
          <TabsTrigger value="seo">{t('tabs.seo')}</TabsTrigger>
          <TabsTrigger value="images">{t('tabs.images')}</TabsTrigger>
          <TabsTrigger value="faqs">{t('tabs.faqs')}</TabsTrigger>
          <TabsTrigger value="specs">{t('tabs.specs')}</TabsTrigger>
          <TabsTrigger value="reviews">{t('tabs.reviews')}</TabsTrigger>
        </TabsList>

        {/* CONTENT */}
        <TabsContent value="content">
          <Card><CardHeader><CardTitle className="text-base">{t('tabs.content')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>{t('form.title')}</Label><Input value={formData.title} onChange={(e) => handleChange('title', e.target.value)} /></div>
                <div className="space-y-2"><Label>{t('form.slug')}</Label><Input value={formData.slug} onChange={(e) => handleChange('slug', e.target.value)} /></div>
              </div>
              <div className="space-y-2"><Label>{t('form.description')}</Label><Textarea value={formData.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>{t('form.price')}</Label><Input type="number" step="0.01" value={formData.price || ''} onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)} /></div>
                <div className="space-y-2"><Label>{t('form.productCode')}</Label><Input value={formData.product_code} onChange={(e) => handleChange('product_code', e.target.value)} /></div>
                <div className="space-y-2"><Label>{t('form.displayOrder')}</Label><Input type="number" value={formData.order_num || ''} onChange={(e) => handleChange('order_num', parseInt(e.target.value) || 0)} /></div>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2"><Switch checked={formData.is_active} onCheckedChange={(v) => handleChange('is_active', v)} /><Label>{t('form.isActive')}</Label></div>
                <div className="flex items-center gap-2"><Switch checked={formData.is_featured} onCheckedChange={(v) => handleChange('is_featured', v)} /><Label>{t('form.isFeatured')}</Label></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card><CardHeader><CardTitle className="text-base">{t('tabs.seo')}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><Label>{t('form.metaTitle')}</Label><Input value={formData.meta_title} onChange={(e) => handleChange('meta_title', e.target.value)} /></div>
              <div className="space-y-2"><Label>{t('form.metaDescription')}</Label><Textarea value={formData.meta_description} onChange={(e) => handleChange('meta_description', e.target.value)} rows={3} /></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IMAGES — Ensotek ImagesGalleryTab birebir */}
        <TabsContent value="images">
          <Card>
            <CardHeader><CardTitle className="text-base">Ürün Görselleri</CardTitle></CardHeader>
            <CardContent>
              <ImagesGalleryTab
                coverUrl={formData.image_url}
                images={formData.images}
                onCoverChange={(url) => setFormData((p) => ({ ...p, image_url: url }))}
                onImagesChange={(urls) => {
                  setFormData((p) => {
                    const cover = p.image_url;
                    const merged = cover && !urls.includes(cover) ? [cover, ...urls] : urls;
                    return { ...p, images: merged, image_url: cover || (urls.length > 0 ? urls[0] : '') };
                  });
                }}
                disabled={isLoading}
                folder="uploads/products"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQS */}
        <TabsContent value="faqs">
          {!isNew ? <FaqsTab productId={id} locale={activeLocale} /> : <EmptyTab message="Ürün oluşturulduktan sonra SSS ekleyebilirsiniz." />}
        </TabsContent>

        {/* SPECS */}
        <TabsContent value="specs">
          {!isNew ? <SpecsTab productId={id} locale={activeLocale} /> : <EmptyTab message="Ürün oluşturulduktan sonra özellik ekleyebilirsiniz." />}
        </TabsContent>

        {/* REVIEWS */}
        <TabsContent value="reviews">
          {!isNew ? <ReviewsTab productId={id} /> : <EmptyTab message="Ürün oluşturulduktan sonra değerlendirme ekleyebilirsiniz." />}
        </TabsContent>

        <TabsContent value="agriculture">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('tabs.agriculture')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t('form.botanicalName')}</Label>
                <Input
                  value={formData.botanical_name}
                  onChange={(e) => handleChange('botanical_name', e.target.value)}
                  placeholder="Solanum lycopersicum"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('form.plantingSeasons')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PLANTING_SEASON_OPTIONS.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={formData.planting_seasons.includes(s)}
                        onCheckedChange={() =>
                          setFormData((p) => ({
                            ...p,
                            planting_seasons: toggleEnum(p.planting_seasons, s),
                          }))
                        }
                      />
                      <span>{t(`form.agEnum.season.${s}` as 'form.agEnum.season.ilkbahar')}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t('form.harvestDays')}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.harvest_days === '' ? '' : formData.harvest_days}
                    onChange={(e) =>
                      handleChange('harvest_days', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('form.germinationDays')}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.germination_days === '' ? '' : formData.germination_days}
                    onChange={(e) =>
                      handleChange('germination_days', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('form.seedDepth')}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.seed_depth_cm === '' ? '' : formData.seed_depth_cm}
                    onChange={(e) =>
                      handleChange('seed_depth_cm', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('form.climateZones')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {CLIMATE_ZONE_OPTIONS.map((z) => (
                    <label key={z} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={formData.climate_zones.includes(z)}
                        onCheckedChange={() =>
                          setFormData((p) => ({
                            ...p,
                            climate_zones: toggleEnum(p.climate_zones, z),
                          }))
                        }
                      />
                      <span>{t(`form.agEnum.climate.${z}` as 'form.agEnum.climate.akdeniz')}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('form.soilTypes')}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {SOIL_TYPE_OPTIONS.map((soil) => (
                    <label key={soil} className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox
                        checked={formData.soil_types.includes(soil)}
                        onCheckedChange={() =>
                          setFormData((p) => ({
                            ...p,
                            soil_types: toggleEnum(p.soil_types, soil),
                          }))
                        }
                      />
                      <span>{t(`form.agEnum.soil.${soil}` as 'form.agEnum.soil.kumlu')}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('form.waterNeed')}</Label>
                  <Select
                    value={formData.water_need || '_none_'}
                    onValueChange={(v) => handleChange('water_need', v === '_none_' ? '' : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none_">{t('form.none')}</SelectItem>
                      {WATER_NEED_OPTIONS.map((w) => (
                        <SelectItem key={w} value={w}>
                          {t(`form.agEnum.water.${w}` as 'form.agEnum.water.low')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{t('form.sunExposure')}</Label>
                  <Select
                    value={formData.sun_exposure || '_none_'}
                    onValueChange={(v) => handleChange('sun_exposure', v === '_none_' ? '' : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('form.selectPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="_none_">{t('form.none')}</SelectItem>
                      {SUN_EXPOSURE_OPTIONS.map((sun) => (
                        <SelectItem key={sun} value={sun}>
                          {t(`form.agEnum.sun.${sun}` as 'form.agEnum.sun.full')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>{t('form.minTemp')}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.min_temp === '' ? '' : formData.min_temp}
                    onChange={(e) =>
                      handleChange('min_temp', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('form.maxTemp')}</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={formData.max_temp === '' ? '' : formData.max_temp}
                    onChange={(e) =>
                      handleChange('max_temp', e.target.value === '' ? '' : parseFloat(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('form.rowSpacing')}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.row_spacing_cm === '' ? '' : formData.row_spacing_cm}
                    onChange={(e) =>
                      handleChange('row_spacing_cm', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('form.plantSpacing')}</Label>
                  <Input
                    type="number"
                    min={0}
                    value={formData.plant_spacing_cm === '' ? '' : formData.plant_spacing_cm}
                    onChange={(e) =>
                      handleChange('plant_spacing_cm', e.target.value === '' ? '' : parseInt(e.target.value, 10) || 0)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t('form.yieldPerSqm')}</Label>
                <Input
                  value={formData.yield_per_sqm}
                  onChange={(e) => handleChange('yield_per_sqm', e.target.value)}
                  placeholder="örn. 3–5 kg"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyTab({ message }: { message: string }) {
  return <Card><CardContent className="py-8 text-center text-muted-foreground text-sm">{message}</CardContent></Card>;
}

/* ============ FAQS TAB ============ */
function FaqsTab({ productId, locale }: { productId: string; locale: string }) {
  const { data: faqs = [], refetch } = useListProductFaqsAdminQuery({ productId, locale });
  const [createFaq] = useCreateProductFaqAdminMutation();
  const [updateFaq] = useUpdateProductFaqAdminMutation();
  const [deleteFaq] = useDeleteProductFaqAdminMutation();
  const [newQ, setNewQ] = React.useState('');
  const [newA, setNewA] = React.useState('');
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editQ, setEditQ] = React.useState('');
  const [editA, setEditA] = React.useState('');

  return (
    <Card><CardHeader><CardTitle className="text-base">Sıkça Sorulan Sorular</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {(faqs as any[]).map((faq) => (
          <div key={faq.id} className="border rounded-lg p-3">
            {editId === faq.id ? (
              <div className="space-y-2">
                <Input value={editQ} onChange={(e) => setEditQ(e.target.value)} />
                <Textarea value={editA} onChange={(e) => setEditA(e.target.value)} rows={2} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={async () => { await updateFaq({ productId, faqId: faq.id, body: { question: editQ, answer: editA } }).unwrap(); setEditId(null); refetch(); toast.success('Güncellendi'); }}>Kaydet</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>İptal</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between gap-2">
                <div><p className="font-medium text-sm">{faq.question}</p><p className="text-sm text-muted-foreground mt-1">{faq.answer}</p></div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => { setEditId(faq.id); setEditQ(faq.question); setEditA(faq.answer); }}>Düzenle</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={async () => { if (!confirm('Silmek istediğinize emin misiniz?')) return; await deleteFaq({ productId, faqId: faq.id }).unwrap(); refetch(); toast.success('Silindi'); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="border-2 border-dashed rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">Yeni Soru Ekle</p>
          <Input value={newQ} onChange={(e) => setNewQ(e.target.value)} placeholder="Soru" />
          <Textarea value={newA} onChange={(e) => setNewA(e.target.value)} placeholder="Cevap" rows={2} />
          <Button size="sm" disabled={!newQ.trim() || !newA.trim()} onClick={async () => { await createFaq({ productId, body: { question: newQ, answer: newA, locale } }).unwrap(); setNewQ(''); setNewA(''); refetch(); toast.success('Eklendi'); }}>
            <Plus className="mr-1 h-4 w-4" />Ekle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============ SPECS TAB ============ */
function SpecsTab({ productId, locale }: { productId: string; locale: string }) {
  const { data: specs = [], refetch } = useListProductSpecsAdminQuery({ productId, locale });
  const [createSpec] = useCreateProductSpecAdminMutation();
  const [updateSpec] = useUpdateProductSpecAdminMutation();
  const [deleteSpec] = useDeleteProductSpecAdminMutation();
  
  const [newName, setNewName] = React.useState('');
  const [newValue, setNewValue] = React.useState('');
  const [newCat, setNewCat] = React.useState<'physical' | 'material' | 'service' | 'custom'>('custom');
  
  const [editId, setEditId] = React.useState<string | null>(null);
  const [editName, setEditName] = React.useState('');
  const [editValue, setEditValue] = React.useState('');
  const [editCat, setEditCat] = React.useState<'physical' | 'material' | 'service' | 'custom'>('custom');

  const CATEGORIES = [
    { value: 'physical', label: 'Fiziksel' },
    { value: 'material', label: 'Materyal' },
    { value: 'service', label: 'Servis' },
    { value: 'custom', label: 'Ozel' },
  ];

  return (
    <Card><CardHeader><CardTitle className="text-base">Teknik Özellikler</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {(specs as any[]).map((spec) => (
          <div key={spec.id} className="border rounded-lg p-3">
            {editId === spec.id ? (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Ad" />
                  <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} placeholder="Değer" />
                  <Select value={editCat} onValueChange={(v: any) => setEditCat(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={async () => { await updateSpec({ productId, specId: spec.id, body: { name: editName, value: editValue, category: editCat } }).unwrap(); setEditId(null); refetch(); toast.success('Güncellendi'); }}>Kaydet</Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditId(null)}>İptal</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand bg-brand/5 px-2 py-0.5 rounded w-20 text-center shrink-0 self-center">
                    {spec.category}
                  </span>
                  <span className="text-sm font-medium w-32">{spec.name}</span>
                  <span className="text-sm text-muted-foreground">{spec.value}</span>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button size="sm" variant="ghost" onClick={() => { setEditId(spec.id); setEditName(spec.name); setEditValue(spec.value); setEditCat(spec.category || 'custom'); }}>Düzenle</Button>
                  <Button size="sm" variant="ghost" className="text-destructive" onClick={async () => { if (!confirm('Silmek istediğinize emin misiniz?')) return; await deleteSpec({ productId, specId: spec.id }).unwrap(); refetch(); toast.success('Silindi'); }}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="border-2 border-dashed rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">Yeni Özellik Ekle</p>
          <div className="grid grid-cols-3 gap-2">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Özellik Adı" />
            <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} placeholder="Değer" />
            <Select value={newCat} onValueChange={(v: any) => setNewCat(v)}>
               <SelectTrigger><SelectValue /></SelectTrigger>
               <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
               </SelectContent>
            </Select>
          </div>
          <Button size="sm" disabled={!newName.trim() || !newValue.trim()} onClick={async () => { await createSpec({ productId, body: { name: newName, value: newValue, category: newCat, locale } }).unwrap(); setNewName(''); setNewValue(''); setNewCat('custom'); refetch(); toast.success('Eklendi'); }}>
            <Plus className="mr-1 h-4 w-4" />Ekle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============ REVIEWS TAB ============ */
function ReviewsTab({ productId }: { productId: string }) {
  const { data: reviews = [], refetch } = useListProductReviewsAdminQuery({ productId });
  const [createReview] = useCreateProductReviewAdminMutation();
  const [deleteReview] = useDeleteProductReviewAdminMutation();
  const [newName, setNewName] = React.useState('');
  const [newComment, setNewComment] = React.useState('');
  const [newRating, setNewRating] = React.useState(5);

  return (
    <Card><CardHeader><CardTitle className="text-base">Değerlendirmeler</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {(reviews as any[]).map((r) => (
          <div key={r.id} className="border rounded-lg p-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - (r.rating || 0))}</span>
                  <span className="text-xs text-muted-foreground">{r.customer_name || 'Anonim'}</span>
                </div>
                {r.comment && <p className="text-sm mt-1">{r.comment}</p>}
              </div>
              <Button size="sm" variant="ghost" className="text-destructive shrink-0" onClick={async () => { if (!confirm('Silmek istediğinize emin misiniz?')) return; await deleteReview({ productId, reviewId: r.id }).unwrap(); refetch(); toast.success('Silindi'); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <div className="border-2 border-dashed rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium">Yeni Değerlendirme Ekle</p>
          <div className="grid grid-cols-2 gap-2">
            <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Müşteri Adı (opsiyonel)" />
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button key={r} type="button" onClick={() => setNewRating(r)} className={`text-lg ${r <= newRating ? 'text-yellow-500' : 'text-muted-foreground/30'}`}>★</button>
              ))}
            </div>
          </div>
          <Textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Yorum" rows={2} />
          <Button size="sm" disabled={!newComment.trim()} onClick={async () => { await createReview({ productId, body: { rating: newRating, comment: newComment, customer_name: newName || null } }).unwrap(); setNewName(''); setNewComment(''); setNewRating(5); refetch(); toast.success('Eklendi'); }}>
            <Plus className="mr-1 h-4 w-4" />Ekle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
