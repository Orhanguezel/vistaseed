import type { FastifyInstance } from 'fastify';

import { registerMail } from '@/modules/mail';
import { registerSupport, registerSupportAdmin } from '@/modules/support';
import { registerJobListings } from '@/modules/jobListings/router';
import { registerJobListingsAdmin } from '@/modules/jobListings/admin.routes';
import { registerJobApplications } from '@/modules/jobApplications/router';
import { registerJobApplicationsAdmin } from '@/modules/jobApplications/admin.routes';
import { registerSlider } from '@/modules/slider/router';
import { registerSliderAdmin } from '@/modules/slider/admin.routes';
import { registerReviews } from '@/modules/review/router';
import { registerReviewsAdmin } from '@/modules/review/admin.routes';
import { registerPopups } from '@/modules/popups/router';
import { registerPopupsAdmin } from '@/modules/popups/admin.routes';
import { registerOffersAdmin } from '@/modules/offers/admin.routes';
import { registerOffersPublic } from '@/modules/offers/router';
import { registerDbAdmin } from '@/modules/db_admin/admin.routes';
import { registerOrders } from '@/modules/orders/router';
import { registerSellerOrders } from '@/modules/orders/seller.routes';
import { registerOrdersAdmin } from '@/modules/orders/admin.routes';
import { registerDealerFinance } from '@/modules/dealerFinance/router';
import { registerDealerFinanceAdmin } from '@/modules/dealerFinance/admin.routes';
import { registerDashboardAdmin } from '@/modules/dashboard/admin.routes';
import { registerWallet, registerWalletAdmin } from '@/modules/wallet';
import { registerBlog, registerBlogAdmin } from '@/modules/blog';
import { registerEcosystem } from '@/modules/ecosystem';
import { registerSellers } from '@/modules/sellers/router';

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
