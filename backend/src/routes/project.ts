import type { FastifyInstance } from 'fastify';

import { registerMail } from '@agro/shared-backend/modules/mail-api';
import { registerSupport, registerSupportAdmin } from '@agro/shared-backend/modules/support';
import { registerJobListings, registerJobListingsAdmin } from '@agro/shared-backend/modules/jobListings';
import { registerJobApplications, registerJobApplicationsAdmin } from '@agro/shared-backend/modules/jobApplications';
import { registerSlider, registerSliderAdmin } from '@agro/shared-backend/modules/slider';
import { registerReviews, registerReviewsAdmin } from '@agro/shared-backend/modules/review';
import { registerPopups, registerPopupsAdmin } from '@agro/shared-backend/modules/popups';
import { registerOffersPublic, registerOffersAdmin } from '@agro/shared-backend/modules/offers';
import { registerDbAdmin } from '@/modules/db_admin/admin.routes';
import { registerOrders, registerSellerOrders, registerOrdersAdmin } from '@agro/shared-backend/modules/orders';
import { registerDealerFinance, registerDealerFinanceAdmin } from '@agro/shared-backend/modules/dealerFinance';
import { registerDashboardAdmin } from '@/modules/dashboard/admin.routes';
import { registerWallet, registerWalletAdmin } from '@agro/shared-backend/modules/wallet';
import { registerBlog, registerBlogAdmin } from '@agro/shared-backend/modules/blog';
import { registerEcosystem } from '@/modules/ecosystem';
import { registerSellers } from '@agro/shared-backend/modules/sellers';

export async function registerProjectPublic(api: FastifyInstance) {
  await registerMail(api);
  await registerSupport(api);
  await registerBlog(api);
  await registerOffersPublic(api);
  await registerJobListings(api);
  await registerJobApplications(api);
  await registerSlider(api);
  await registerReviews(api);
  await registerPopups(api);
  await registerOrders(api);
  await registerSellerOrders(api);
  await registerDealerFinance(api);
  await registerWallet(api);
  await registerSellers(api);
  await api.register(registerEcosystem);
}

export async function registerProjectAdmin(adminApi: FastifyInstance) {
  for (const reg of [
    registerDashboardAdmin, registerSupportAdmin, registerBlogAdmin, registerJobListingsAdmin,
    registerJobApplicationsAdmin, registerSliderAdmin, registerReviewsAdmin,
    registerPopupsAdmin, registerOffersAdmin, registerDbAdmin,
    registerOrdersAdmin, registerDealerFinanceAdmin, registerWalletAdmin,
  ]) {
    await adminApi.register(reg);
  }
}
