// src/modules/orders/router.ts
import type { FastifyInstance } from 'fastify';
import { requireAuth } from '@agro/shared-backend/middleware/auth';
import {
  dealerListOrders,
  dealerGetOrder,
  dealerCreateOrder,
  dealerCancelOrder,
} from './controller';
import {
  initiateOrderIyzicoPayment,
  initiateOrderBankTransfer,
  initiateOrderCreditPayment,
} from './payment.controller';
import { orderIyzicoCallback } from './payment-callback.controller';

export async function registerOrders(app: FastifyInstance) {
  const B = '/orders';
  app.post(`${B}/payment/iyzico/callback`, orderIyzicoCallback);
  app.get(B, { preHandler: [requireAuth] }, dealerListOrders);
  app.get(`${B}/:id`, { preHandler: [requireAuth] }, dealerGetOrder);
  app.post(B, { preHandler: [requireAuth] }, dealerCreateOrder);
  app.patch(`${B}/:id/cancel`, { preHandler: [requireAuth] }, dealerCancelOrder);
  app.post(`${B}/:id/payment/iyzico/initiate`, { preHandler: [requireAuth] }, initiateOrderIyzicoPayment);
  app.post(`${B}/:id/payment/bank-transfer`, { preHandler: [requireAuth] }, initiateOrderBankTransfer);
  app.post(`${B}/:id/payment/credit`, { preHandler: [requireAuth] }, initiateOrderCreditPayment);
}
