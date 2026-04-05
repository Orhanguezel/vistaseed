// src/modules/orders/admin.routes.ts
import type { FastifyInstance } from 'fastify';
import {
  adminListOrders,
  adminGetOrder,
  adminAssignOrderSeller,
  adminUpdateOrderStatus,
  adminDeleteOrder,
} from './admin.controller';

export async function registerOrdersAdmin(app: FastifyInstance) {
  const B = '/orders';
  app.get(B, adminListOrders);
  app.get(`${B}/:id`, adminGetOrder);
  app.patch(`${B}/:id/seller`, adminAssignOrderSeller);
  app.patch(`${B}/:id/status`, adminUpdateOrderStatus);
  app.delete(`${B}/:id`, adminDeleteOrder);
}
