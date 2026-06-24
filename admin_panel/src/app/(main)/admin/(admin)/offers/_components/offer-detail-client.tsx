"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, FileText, Mail, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { buildUploadUrl } from "@/lib/media-url";
import {
  useCreateOfferAdminMutation,
  useDeleteOfferAdminMutation,
  useGenerateOfferPdfAdminMutation,
  useGetOfferAdminQuery,
  useListProductsAdminQuery,
  useSendOfferDirectEmailAdminMutation,
  useSendOfferEmailAdminMutation,
  useUpdateOfferAdminMutation,
} from "@/integrations/hooks";
import {
  buildOfferPayload,
  computeOfferItemsTotal,
  createEmptyOfferDetailForm,
  deriveOfferPricing,
  EMPTY_OFFER_LINE_ITEM,
  lineTotal,
  mapOfferToDetailForm,
  OFFER_STATUSES,
  recalcItemTotals,
  type OfferBilling,
  type OfferDetailFormState,
  type OfferDetailTabKey,
  type OfferLineItem,
} from "@/integrations/shared";

interface Props {
  id: string;
}

export default function OfferDetailClient({ id }: Props) {
  const t = useAdminT("admin.offers");
  const router = useRouter();
  const isNew = id === "new";

  const { data, isFetching } = useGetOfferAdminQuery({ id }, { skip: isNew });
  const { data: products = [] } = useListProductsAdminQuery({ limit: 100, offset: 0, sort: "order_num", order: "asc" });

  const [createOffer, { isLoading: isCreating }] = useCreateOfferAdminMutation();
  const [updateOffer, { isLoading: isUpdating }] = useUpdateOfferAdminMutation();
  const [deleteOffer, { isLoading: isDeleting }] = useDeleteOfferAdminMutation();
  const [generatePdf, { isLoading: isGeneratingPdf }] = useGenerateOfferPdfAdminMutation();
  const [sendEmail, { isLoading: isSendingEmail }] = useSendOfferEmailAdminMutation();

  const [formData, setFormData] = React.useState<OfferDetailFormState>(() => createEmptyOfferDetailForm());
  const [activeTab, setActiveTab] = React.useState<OfferDetailTabKey>("customer");
  const orderTotal = React.useMemo(() => computeOfferItemsTotal(formData.items), [formData.items]);
  const pricing = React.useMemo(
    () => deriveOfferPricing(formData.net_total, formData.vat_rate, formData.shipping_total),
    [formData.net_total, formData.vat_rate, formData.shipping_total],
  );
  const money2 = (value: number | null) => (value == null ? "" : value.toFixed(2));
  const previewUrl = React.useMemo(() => {
    const value = formData.pdf_url.trim();
    if (!value) return "";
    const base =
      value.startsWith("http://") || value.startsWith("https://")
        ? value
        : buildUploadUrl(value.startsWith("/") ? value : `/${value}`);
    // CF/tarayıcı cache'ini kır: her yeniden üretimde updated_at değişir → taze PDF.
    const stamp = data?.updated_at ? `?v=${encodeURIComponent(data.updated_at)}` : "";
    return `${base}${stamp}`;
  }, [formData.pdf_url, data?.updated_at]);

  React.useEffect(() => {
    if (!data || isNew) return;
    setFormData(mapOfferToDetailForm(data));
  }, [data, isNew]);

  const handleChange = (field: keyof OfferDetailFormState, value: boolean | string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const syncItems = (items: OfferLineItem[]) => {
    const recalculatedItems = recalcItemTotals(items);
    const total = computeOfferItemsTotal(recalculatedItems);
    // Net Tutar kalemlerden otomatik; KDV/Genel Toplam türetilir (read-only).
    setFormData((prev) => ({
      ...prev,
      items: recalculatedItems,
      net_total: total == null ? prev.net_total : total.toFixed(2),
    }));
  };

  const handleBillingChange = (field: keyof OfferBilling, value: string) => {
    setFormData((prev) => ({ ...prev, billing: { ...prev.billing, [field]: value } }));
  };

  const handleItemChange = (index: number, field: keyof OfferLineItem, value: string) => {
    const next = formData.items.map((item, itemIndex) => (
      itemIndex === index ? { ...item, [field]: value } : item
    ));
    syncItems(next);
  };

  const handleAddItem = () => {
    syncItems([...formData.items, { ...EMPTY_OFFER_LINE_ITEM }]);
  };

  const handleRemoveItem = (index: number) => {
    syncItems(formData.items.filter((_item, itemIndex) => itemIndex !== index));
  };

  const handleSubmit = async () => {
    if (!formData.customer_name.trim() || !formData.email.trim()) {
      toast.error(t("messages.requiredError"));
      return;
    }

    try {
      JSON.parse(formData.form_data_text || "{}");
    } catch {
      toast.error(t("messages.jsonError"));
      return;
    }

    const payload = buildOfferPayload(formData);

    try {
      if (isNew) {
        const created = await createOffer(payload).unwrap();
        toast.success(t("messages.created"));
        if (created?.id) router.push(`/admin/offers/${created.id}`);
      } else {
        await updateOffer({ id, patch: payload }).unwrap();
        toast.success(t("messages.updated"));
      }
    } catch (error) {
      toast.error(`${t("messages.errorPrefix")}: ${error}`);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("messages.confirmDelete", { title: formData.offer_no || formData.customer_name || id }))) return;
    try {
      await deleteOffer({ id }).unwrap();
      toast.success(t("messages.deleted"));
      router.push("/admin/offers");
    } catch (error) {
      toast.error(`${t("messages.errorPrefix")}: ${error}`);
    }
  };

  const handleGeneratePdf = async () => {
    try {
      const row = await generatePdf({ id }).unwrap();
      setFormData(mapOfferToDetailForm(row));
      toast.success(t("messages.pdfGenerated"));
    } catch (error) {
      toast.error(`${t("messages.errorPrefix")}: ${error}`);
    }
  };

  const handleSendEmail = async () => {
    if (!formData.pdf_url.trim()) {
      toast.error(t("messages.previewBeforeSend"));
      setActiveTab("meta");
      return;
    }

    try {
      const row = await sendEmail({ id }).unwrap();
      setFormData(mapOfferToDetailForm(row));
      toast.success(t("messages.emailSent"));
    } catch (error) {
      toast.error(`${t("messages.errorPrefix")}: ${error}`);
    }
  };

  const isSaving = isCreating || isUpdating;
  const isBusy = isSaving || isFetching || isGeneratingPdf || isSendingEmail;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin/offers")}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t("actions.back")}
          </Button>
          <h1 className="font-semibold text-lg">{isNew ? t("detail.newTitle") : t("detail.editTitle")}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isNew && (
            <>
              <Button variant="outline" size="sm" onClick={handleGeneratePdf} disabled={isBusy}>
                <FileText className="mr-1 h-4 w-4" />
                {t("actions.generatePdf")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleSendEmail} disabled={isBusy}>
                <Mail className="mr-1 h-4 w-4" />
                {t("actions.sendEmail")}
              </Button>
              <OfferDirectEmailButton offerId={id} email={formData.email} disabled={isBusy} />
              <Button variant="outline" size="sm" onClick={handleDelete} disabled={isBusy || isDeleting}>
                <Trash2 className="mr-1 h-4 w-4" />
                {t("actions.delete")}
              </Button>
            </>
          )}
          <Button size="sm" onClick={handleSubmit} disabled={isBusy}>
            <Save className="mr-1 h-4 w-4" />
            {t("actions.save")}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as OfferDetailTabKey)}>
        <TabsList>
          <TabsTrigger value="customer">{t("tabs.customer")}</TabsTrigger>
          <TabsTrigger value="orderForm">{t("tabs.orderForm")}</TabsTrigger>
          <TabsTrigger value="pricing">{t("tabs.pricing")}</TabsTrigger>
          <TabsTrigger value="meta">{t("tabs.meta")}</TabsTrigger>
          <TabsTrigger value="json">{t("tabs.json")}</TabsTrigger>
        </TabsList>

        <TabsContent value="customer">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.customerTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.customerName")}</Label>
                  <Input
                    value={formData.customer_name}
                    onChange={(e) => handleChange("customer_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.companyName")}</Label>
                  <Input value={formData.company_name} onChange={(e) => handleChange("company_name", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.email")}</Label>
                  <Input type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.phone")}</Label>
                  <Input value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.locale")}</Label>
                  <Input value={formData.locale} onChange={(e) => handleChange("locale", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.countryCode")}</Label>
                  <Input value={formData.country_code} onChange={(e) => handleChange("country_code", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.source")}</Label>
                  <Input value={formData.source} onChange={(e) => handleChange("source", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.status")}</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                  >
                    {OFFER_STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {t(`statuses.${item}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.product")}</Label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                    value={formData.product_id}
                    onChange={(e) => handleChange("product_id", e.target.value)}
                  >
                    <option value="">{t("form.productPlaceholder")}</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>{t("form.serviceId")}</Label>
                  <Input value={formData.service_id} onChange={(e) => handleChange("service_id", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("form.subject")}</Label>
                <Input value={formData.subject} onChange={(e) => handleChange("subject", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>{t("form.message")}</Label>
                <Textarea rows={8} value={formData.message} onChange={(e) => handleChange("message", e.target.value)} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orderForm">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("orderForm.billingTitle")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div className="space-y-2">
                    <Label>{t("orderForm.billing.ticariAd")}</Label>
                    <Input value={formData.billing.ticariAd} onChange={(e) => handleBillingChange("ticariAd", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("orderForm.billing.vergiDairesi")}</Label>
                    <Input value={formData.billing.vergiDairesi} onChange={(e) => handleBillingChange("vergiDairesi", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("orderForm.billing.vergiNo")}</Label>
                    <Input value={formData.billing.vergiNo} onChange={(e) => handleBillingChange("vergiNo", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("orderForm.billing.mersisNo")}</Label>
                    <Input value={formData.billing.mersisNo} onChange={(e) => handleBillingChange("mersisNo", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("orderForm.billing.telFax")}</Label>
                    <Input value={formData.billing.telFax} onChange={(e) => handleBillingChange("telFax", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("orderForm.billing.gsm")}</Label>
                    <Input value={formData.billing.gsm} onChange={(e) => handleBillingChange("gsm", e.target.value)} />
                  </div>
                  <div className="space-y-2 xl:col-span-3">
                    <Label>{t("orderForm.billing.eposta")}</Label>
                    <Input value={formData.billing.eposta} onChange={(e) => handleBillingChange("eposta", e.target.value)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("orderForm.billing.adres")}</Label>
                    <Textarea rows={4} value={formData.billing.adres} onChange={(e) => handleBillingChange("adres", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("orderForm.billing.sevkAdresi")}</Label>
                    <Textarea rows={4} value={formData.billing.sevkAdresi} onChange={(e) => handleBillingChange("sevkAdresi", e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{t("orderForm.itemsTitle")}</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="h-4 w-4" />
                  {t("orderForm.addItem")}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-x-auto rounded-md border">
                  <table className="w-full min-w-[1120px] border-collapse text-sm">
                    <thead className="bg-muted/60 text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">{t("orderForm.items.urun")}</th>
                        <th className="px-3 py-2 text-left font-medium">{t("orderForm.items.formulasyon")}</th>
                        <th className="px-3 py-2 text-left font-medium">{t("orderForm.items.ambalaj")}</th>
                        <th className="px-3 py-2 text-left font-medium">{t("orderForm.items.miktar")}</th>
                        <th className="px-3 py-2 text-left font-medium">{t("orderForm.items.birim")}</th>
                        <th className="px-3 py-2 text-left font-medium">{t("orderForm.items.birimFiyat")}</th>
                        <th className="px-3 py-2 text-left font-medium">{t("orderForm.items.toplam")}</th>
                        <th className="px-3 py-2 text-left font-medium">{t("orderForm.items.vadeGun")}</th>
                        <th className="px-3 py-2 text-left font-medium">{t("orderForm.items.odemeTarihi")}</th>
                        <th className="w-16 px-3 py-2 text-right font-medium">{t("table.actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.length === 0 ? (
                        <tr>
                          <td colSpan={10} className="px-3 py-8 text-center text-muted-foreground">
                            {t("orderForm.emptyItems")}
                          </td>
                        </tr>
                      ) : (
                        formData.items.map((item, index) => {
                          const itemTotal = lineTotal(item);
                          return (
                            <tr key={index} className="border-t">
                              <td className="p-2">
                                <Input value={item.urun} onChange={(e) => handleItemChange(index, "urun", e.target.value)} />
                              </td>
                              <td className="p-2">
                                <Input value={item.formulasyon} onChange={(e) => handleItemChange(index, "formulasyon", e.target.value)} />
                              </td>
                              <td className="p-2">
                                <Input value={item.ambalaj} onChange={(e) => handleItemChange(index, "ambalaj", e.target.value)} />
                              </td>
                              <td className="p-2">
                                <Input inputMode="decimal" value={item.miktar} onChange={(e) => handleItemChange(index, "miktar", e.target.value)} />
                              </td>
                              <td className="p-2">
                                <Input value={item.birim} onChange={(e) => handleItemChange(index, "birim", e.target.value)} />
                              </td>
                              <td className="p-2">
                                <Input inputMode="decimal" value={item.birimFiyat} onChange={(e) => handleItemChange(index, "birimFiyat", e.target.value)} />
                              </td>
                              <td className="p-2">
                                <Input value={itemTotal == null ? "" : itemTotal.toFixed(2)} readOnly className="bg-muted/40" />
                              </td>
                              <td className="p-2">
                                <Input inputMode="numeric" value={item.vadeGun} onChange={(e) => handleItemChange(index, "vadeGun", e.target.value)} />
                              </td>
                              <td className="p-2">
                                <Input value={item.odemeTarihi} onChange={(e) => handleItemChange(index, "odemeTarihi", e.target.value)} />
                              </td>
                              <td className="p-2 text-right">
                                <Button type="button" variant="ghost" size="icon-sm" onClick={() => handleRemoveItem(index)} aria-label={t("orderForm.removeItem")}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("orderForm.aciklama")}</Label>
                    <Textarea rows={5} value={formData.aciklama} onChange={(e) => handleChange("aciklama", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("orderForm.siparisAlan")}</Label>
                    <Input value={formData.siparisAlan} onChange={(e) => handleChange("siparisAlan", e.target.value)} />
                    <div className="rounded-lg border bg-muted/40 p-4">
                      <div className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                        {t("orderForm.orderTotal")}
                      </div>
                      <div className="mt-1 text-2xl font-semibold">
                        {orderTotal == null ? "-" : `${orderTotal.toFixed(2)} ${formData.currency || "TRY"}`}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.pricingTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.offerNo")}</Label>
                  <Input value={formData.offer_no} onChange={(e) => handleChange("offer_no", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.currency")}</Label>
                  <Input value={formData.currency} onChange={(e) => handleChange("currency", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.validUntil")}</Label>
                  <Input
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => handleChange("valid_until", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>{t("form.netTotal")}</Label>
                  <Input value={formData.net_total} onChange={(e) => handleChange("net_total", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.vatRate")}</Label>
                  <Input value={formData.vat_rate} onChange={(e) => handleChange("vat_rate", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.vatTotal")}</Label>
                  <Input value={money2(pricing.vat)} readOnly tabIndex={-1} className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.shippingTotal")}</Label>
                  <Input
                    value={formData.shipping_total}
                    onChange={(e) => handleChange("shipping_total", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.grossTotal")}</Label>
                  <Input value={money2(pricing.gross)} readOnly tabIndex={-1} className="bg-muted/50 font-semibold" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-6">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.consent_marketing}
                      onCheckedChange={(value) => handleChange("consent_marketing", value)}
                    />
                    <Label>{t("form.consentMarketing")}</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.consent_terms}
                      onCheckedChange={(value) => handleChange("consent_terms", value)}
                    />
                    <Label>{t("form.consentTerms")}</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meta">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.metaTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("form.adminNotes")}</Label>
                <Textarea
                  rows={6}
                  value={formData.admin_notes}
                  onChange={(e) => handleChange("admin_notes", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("form.pdfUrl")}</Label>
                  <Input value={formData.pdf_url} onChange={(e) => handleChange("pdf_url", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>{t("form.pdfAssetId")}</Label>
                  <Input value={formData.pdf_asset_id} onChange={(e) => handleChange("pdf_asset_id", e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t("form.emailSentAt")}</Label>
                <Input value={formData.email_sent_at} onChange={(e) => handleChange("email_sent_at", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">{t("detail.previewTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("detail.previewPath")}</Label>
                <Input value={formData.pdf_url} readOnly placeholder="/uploads/offers/..." />
                <p className="text-muted-foreground text-sm">{t("detail.previewHelp")}</p>
              </div>

              {previewUrl ? (
                <div className="space-y-3">
                  <div className="flex justify-end">
                    <Button asChild variant="outline" size="sm">
                      <a href={previewUrl} target="_blank" rel="noreferrer">
                        <FileText className="mr-1 h-4 w-4" />
                        {t("detail.openPreview")}
                      </a>
                    </Button>
                  </div>
                  <div className="overflow-hidden rounded-lg border bg-white">
                    <iframe title="offer-preview" src={previewUrl} className="h-[720px] w-full" />
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground text-sm">
                  {t("detail.previewEmpty")}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("detail.jsonTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>{t("form.formData")}</Label>
              <p className="text-muted-foreground text-sm">{t("detail.jsonHelp")}</p>
              <Textarea
                rows={18}
                value={formData.form_data_text}
                onChange={(e) => handleChange("form_data_text", e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OfferDirectEmailButton({ offerId, email, disabled }: { offerId: string; email: string; disabled: boolean }) {
  const t = useAdminT("admin.offers");
  const [sendDirect, { isLoading }] = useSendOfferDirectEmailAdminMutation();
  const [open, setOpen] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSend = async () => {
    if (!email) {
      toast.error(t("directEmail.emailRequired"));
      return;
    }
    if (!message.trim()) {
      toast.error(t("directEmail.messageRequired"));
      return;
    }
    try {
      const res = await sendDirect({
        id: offerId,
        body: { subject: subject.trim() || undefined, message: message.trim() },
      }).unwrap();
      toast.success(res?.message || t("directEmail.sent"));
      setOpen(false);
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      const e = err as { data?: { error?: { message?: string } } };
      toast.error(e?.data?.error?.message || t("directEmail.sendError"));
    }
  };

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} disabled={disabled || !email}>
        <Mail className="mr-1 h-4 w-4" />
        {t("directEmail.button")}
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md space-y-3 rounded-lg border bg-background p-4 shadow-lg">
        <h3 className="font-medium text-sm">{t("directEmail.title")}</h3>
        <p className="text-muted-foreground text-xs">{t("directEmail.recipient", { email })}</p>
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs">{t("directEmail.subject")}</Label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t("directEmail.subjectPlaceholder")}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-muted-foreground text-xs">{t("directEmail.message")}</Label>
          <Textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("directEmail.messagePlaceholder")}
            disabled={isLoading}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={isLoading}>
            {t("directEmail.cancel")}
          </Button>
          <Button size="sm" onClick={handleSend} disabled={isLoading || !message.trim()}>
            {isLoading ? t("directEmail.sending") : t("directEmail.send")}
          </Button>
        </div>
      </div>
    </div>
  );
}
