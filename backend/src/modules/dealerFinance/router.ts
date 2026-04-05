// src/modules/dealerFinance/router.ts
import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@agro/shared-backend/middleware/auth';
import { requireDealer } from '@agro/shared-backend/middleware/roles';
import {
  dealerGetMyProfile,
  dealerUpdateMyProfile,
  dealerGetMyBalance,
  dealerGetFinanceSummary,
  dealerPostFinanceSendAlerts,
  dealerGetFinanceStatementPdf,
  dealerListMyTransactions,
} from './controller';
import { dealerListCatalogProducts } from './dealer-catalog.controller';
import { listPublicDealers } from './public.controller';

const dealerOnly = { preHandler: [requireAuth, requireDealer] };

export async function registerDealerFinance(app: FastifyInstance) {
  app.get('/dealers/public', { config: { public: true } }, listPublicDealers);

  app.get('/dealer/products', dealerOnly, dealerListCatalogProducts);

  app.get('/dealer/profile', dealerOnly, dealerGetMyProfile);
  app.put('/dealer/profile', dealerOnly, dealerUpdateMyProfile);
  app.get('/dealer/balance', dealerOnly, dealerGetMyBalance);
  app.get('/dealer/finance/statement.pdf', dealerOnly, dealerGetFinanceStatementPdf);
  app.post('/dealer/finance/send-alerts', dealerOnly, dealerPostFinanceSendAlerts);
  app.get('/dealer/finance/summary', dealerOnly, dealerGetFinanceSummary);
  app.get('/dealer/transactions', dealerOnly, dealerListMyTransactions);
}
