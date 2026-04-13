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
import { registerDashboardAdmin } from '@/modules/dashboard/admin.routes';
import { registerPaymentAttemptsAdmin } from '@/modules/payment_attempts/admin.routes';
import { registerWallet, registerWalletAdmin } from '@agro/shared-backend/modules/wallet';
import { registerBlog, registerBlogAdmin } from '@agro/shared-backend/modules/blog';
import { registerEcosystem } from '@/modules/ecosystem';
import { registerSellers } from '@agro/shared-backend/modules/sellers';
import { registerWeather } from '@/modules/weather/router';

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
  await registerWallet(api);
  await registerSellers(api);
  await registerWeather(api);
  await api.register(registerEcosystem);
}

export async function registerProjectAdmin(adminApi: FastifyInstance) {
  for (const reg of [
    registerDashboardAdmin, registerSupportAdmin, registerBlogAdmin, registerJobListingsAdmin,
    registerJobApplicationsAdmin, registerSliderAdmin, registerReviewsAdmin,
    registerPopupsAdmin, registerOffersAdmin, registerPaymentAttemptsAdmin, registerDbAdmin,
    registerWalletAdmin,
  ]) {
    await adminApi.register(reg);
  }
}
