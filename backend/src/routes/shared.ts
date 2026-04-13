import type { FastifyInstance } from 'fastify';

import { registerAuth, registerUserAdmin } from '@agro/shared-backend/modules/auth';
import { registerStorage, registerStorageAdmin } from '@agro/shared-backend/modules/storage';
import { registerProfiles } from '@agro/shared-backend/modules/profiles';
import { registerSiteSettings, registerSiteSettingsAdmin } from '@agro/shared-backend/modules/siteSettings';
import { registerUserRoles } from '@agro/shared-backend/modules/userRoles';
import { registerHealth } from '@agro/shared-backend/modules/health';
import { registerNotifications } from '@agro/shared-backend/modules/notifications';
import { registerAudit, registerAuditAdmin, registerAuditStream } from '@agro/shared-backend/modules/audit';
import { registerContacts, registerContactsAdmin } from '@agro/shared-backend/modules/contact';
import { registerCustomPages, registerCustomPagesAdmin } from '@agro/shared-backend/modules/customPages';
import { registerCategoriesAdmin } from '@agro/shared-backend/modules/categories';
import { registerTheme, registerThemeAdmin } from '@agro/shared-backend/modules/theme';
import { registerTelegram, registerTelegramAdmin } from '@agro/shared-backend/modules/telegram';
import { registerEmailTemplatesAdmin } from '@agro/shared-backend/modules/emailTemplates/admin.routes';
import { registerProducts } from '@agro/shared-backend/modules/products/router';
import { registerProductsAdmin } from '@agro/shared-backend/modules/products/admin.routes';
import { registerGallery } from '@agro/shared-backend/modules/gallery/router';
import { registerGalleryAdmin } from '@agro/shared-backend/modules/gallery/admin.routes';
import { registerReferences } from '@agro/shared-backend/modules/references/router';
import { registerReferencesAdmin } from '@agro/shared-backend/modules/references/admin.routes';
import { registerLibrary } from '@agro/shared-backend/modules/library/router';
import { registerLibraryAdmin } from '@agro/shared-backend/modules/library/admin.routes';
import { registerOrders } from '@agro/shared-backend/modules/orders/router';
import { registerOrdersAdmin } from '@agro/shared-backend/modules/orders/admin.routes';
import { registerSellerOrders } from '@agro/shared-backend/modules/orders/seller.routes';
import { registerDealerFinance } from '@agro/shared-backend/modules/dealerFinance/router';
import { registerDealerFinanceAdmin } from '@agro/shared-backend/modules/dealerFinance/admin.routes';

export async function registerSharedPublic(api: FastifyInstance) {
  await registerAuth(api);
  await registerHealth(api);
  await registerStorage(api);
  await registerProfiles(api);
  await registerSiteSettings(api);
  await registerUserRoles(api);
  await registerNotifications(api);
  await registerAudit(api);
  await registerContacts(api);
  await registerCustomPages(api);
  await registerTheme(api);
  await registerTelegram(api);
  await registerProducts(api);
  await registerGallery(api);
  await registerReferences(api);
  await registerLibrary(api);
  await registerOrders(api);
  await registerSellerOrders(api);
  await registerDealerFinance(api);
}

export async function registerSharedAdmin(adminApi: FastifyInstance) {
  for (const reg of [
    registerSiteSettingsAdmin, registerUserAdmin, registerStorageAdmin,
    registerContactsAdmin, registerCustomPagesAdmin, registerCategoriesAdmin,
    registerThemeAdmin, registerEmailTemplatesAdmin, registerAuditAdmin,
    registerAuditStream, registerTelegramAdmin, registerProductsAdmin,
    registerGalleryAdmin, registerReferencesAdmin, registerLibraryAdmin,
    registerOrdersAdmin, registerDealerFinanceAdmin,
  ]) {
    await adminApi.register(reg);
  }

  const { aiContentAssist } = await import('@agro/shared-backend/modules/ai/content');
  adminApi.post('/ai/content', aiContentAssist);
}
