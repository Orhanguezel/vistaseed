import type { FastifyReply, FastifyRequest } from "fastify";
import { sql } from "drizzle-orm";

import { db } from "@/db/client";
import { users } from "@agro/shared-backend/modules/auth/schema";
import { categories } from "@agro/shared-backend/modules/categories/schema";
import { contact_messages } from "@agro/shared-backend/modules/contact/schema";
import { customPages } from "@agro/shared-backend/modules/customPages/schema";
import { emailTemplates } from "@agro/shared-backend/modules/emailTemplates/schema";
import { galleries } from "@agro/shared-backend/modules/gallery/schema";
import { library } from "@agro/shared-backend/modules/library/schema";
import { popups } from "@agro/shared-backend/modules/popups/schema";
import { products } from "@agro/shared-backend/modules/products/schema";
import { referencesTable } from "@agro/shared-backend/modules/references/schema";
import { siteSettings } from "@agro/shared-backend/modules/siteSettings/schema";
import { storageAssets } from "@agro/shared-backend/modules/storage/schema";
import { supportFaqs } from "@agro/shared-backend/modules/support/schema";
import { auditRequestLogs } from "@agro/shared-backend/modules/audit/schema";
import { handleRouteError } from "@agro/shared-backend/modules/_shared";

type DashboardSummaryResponse = {
  items: Array<{
    key: string;
    label: string;
    count: number;
  }>;
};

async function countRows(table: unknown): Promise<number> {
  const [{ total }] = await db
    .select({ total: sql<number>`COUNT(*)` })
    .from(table as never);
  return Number(total ?? 0);
}

export async function adminDashboardSummary(_req: FastifyRequest, reply: FastifyReply) {
  try {
    const [
      productsTotal,
      categoriesTotal,
      contactsTotal,
      usersTotal,
      siteSettingsTotal,
      storageTotal,
      emailTemplatesTotal,
      auditTotal,
      customPagesTotal,
      faqsTotal,
      referencesTotal,
      libraryTotal,
      galleryTotal,
      popupsTotal,
    ] = await Promise.all([
      countRows(products),
      countRows(categories),
      countRows(contact_messages),
      countRows(users),
      countRows(siteSettings),
      countRows(storageAssets),
      countRows(emailTemplates),
      countRows(auditRequestLogs),
      countRows(customPages),
      countRows(supportFaqs),
      countRows(referencesTable),
      countRows(library),
      countRows(galleries),
      countRows(popups),
    ]);

    const payload: DashboardSummaryResponse = {
      items: [
        { key: "products", label: "products", count: productsTotal },
        { key: "categories", label: "categories", count: categoriesTotal },
        { key: "contacts", label: "contacts", count: contactsTotal },
        { key: "users", label: "users", count: usersTotal },
        { key: "site_settings", label: "site_settings", count: siteSettingsTotal },
        { key: "storage", label: "storage", count: storageTotal },
        { key: "email_templates", label: "email_templates", count: emailTemplatesTotal },
        { key: "audit", label: "audit", count: auditTotal },
        { key: "custom_pages", label: "custom_pages", count: customPagesTotal },
        { key: "faqs", label: "faqs", count: faqsTotal },
        { key: "references", label: "references", count: referencesTotal },
        { key: "library", label: "library", count: libraryTotal },
        { key: "gallery", label: "gallery", count: galleryTotal },
        { key: "popups", label: "popups", count: popupsTotal },
      ],
    };

    return reply.send(payload);
  } catch (err) {
    return handleRouteError(reply, _req, err, "dashboard_summary_failed");
  }
}
