"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, FileText, Mail, Save, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useAdminT } from "@/app/(main)/admin/_components/common/use-admin-t";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateOfferAdminMutation,
  useDeleteOfferAdminMutation,
  useGenerateOfferPdfAdminMutation,
  useGetOfferAdminQuery,
  useListProductsAdminQuery,
  useSendOfferAdminMutation,
  useSendOfferEmailAdminMutation,
  useUpdateOfferAdminMutation,
} from "@/integrations/hooks";
import {
  buildOfferPayload,
  createEmptyOfferDetailForm,
  mapOfferToDetailForm,
  OFFER_STATUSES,
  type OfferDetailFormState,
  type OfferDetailTabKey,
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
  const [sendOffer, { isLoading: isSendingOffer }] = useSendOfferAdminMutation();

  const [formData, setFormData] = React.useState<OfferDetailFormState>(() => createEmptyOfferDetailForm());
  const [activeTab, setActiveTab] = React.useState<OfferDetailTabKey>("customer");
  const previewUrl = React.useMemo(() => {
    const value = formData.pdf_url.trim();
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return `http://localhost:8083${value.startsWith("/") ? value : `/${value}`}`;
  }, [formData.pdf_url]);

  React.useEffect(() => {
    if (!data || isNew) return;
    setFormData(mapOfferToDetailForm(data));
  }, [data, isNew]);

  const handleChange = (field: keyof OfferDetailFormState, value: boolean | string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    try {
      const row = await sendEmail({ id }).unwrap();
      setFormData(mapOfferToDetailForm(row));
      toast.success(t("messages.emailSent"));
    } catch (error) {
      toast.error(`${t("messages.errorPrefix")}: ${error}`);
    }
  };

  const handleSendAll = async () => {
    try {
      const row = await sendOffer({ id }).unwrap();
      setFormData(mapOfferToDetailForm(row));
      toast.success(t("messages.sendCompleted"));
    } catch (error) {
      toast.error(`${t("messages.errorPrefix")}: ${error}`);
    }
  };

  const isSaving = isCreating || isUpdating;
  const isBusy = isSaving || isFetching || isGeneratingPdf || isSendingEmail || isSendingOffer;

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
              <Button variant="outline" size="sm" onClick={handleSendAll} disabled={isBusy}>
                <Send className="mr-1 h-4 w-4" />
                {t("actions.sendAll")}
              </Button>
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
                  <Input value={formData.vat_total} onChange={(e) => handleChange("vat_total", e.target.value)} />
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
                  <Input value={formData.gross_total} onChange={(e) => handleChange("gross_total", e.target.value)} />
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
