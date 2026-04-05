// src/modules/orders/payment.repository.ts
import { and, eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { orders, orderItems } from './schema';
import { products, productI18n } from '@agro/shared-backend/modules/products/schema';

export type OrderIyzicoLine = {
  product_id: string;
  quantity: number;
  total_price: string;
  title: string | null;
};

export async function repoListOrderItemsForIyzico(orderId: string, locale: string): Promise<OrderIyzicoLine[]> {
  const rows = await db
    .select({
      product_id: orderItems.product_id,
      quantity: orderItems.quantity,
      total_price: orderItems.total_price,
      title: productI18n.title,
    })
    .from(orderItems)
    .innerJoin(products, eq(products.id, orderItems.product_id))
    .leftJoin(
      productI18n,
      and(eq(productI18n.product_id, products.id), eq(productI18n.locale, locale)),
    )
    .where(eq(orderItems.order_id, orderId));

  return rows.map((r) => ({
    ...r,
    title: r.title ?? r.product_id,
  }));
}

export async function repoGetOrderRowById(id: string) {
  const [row] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return row ?? null;
}

export async function repoGetOrderByPaymentRef(ref: string) {
  const [row] = await db.select().from(orders).where(eq(orders.payment_ref, ref)).limit(1);
  return row ?? null;
}

export async function repoSetOrderPaymentPending(orderId: string, paymentRef: string, method: string) {
  await db
    .update(orders)
    .set({
      payment_ref: paymentRef,
      payment_method: method,
      payment_status: 'pending',
      updated_at: new Date(),
    })
    .where(eq(orders.id, orderId));
}

export async function repoFailOrderPaymentInit(orderId: string) {
  await db
    .update(orders)
    .set({
      payment_status: 'failed',
      payment_ref: null,
      updated_at: new Date(),
    })
    .where(eq(orders.id, orderId));
}

export async function repoMarkOrderIyzicoPaid(orderId: string) {
  await db
    .update(orders)
    .set({
      payment_status: 'paid',
      payment_method: 'iyzico',
      status: 'confirmed',
      updated_at: new Date(),
    })
    .where(eq(orders.id, orderId));
}

export async function repoMarkOrderPaymentFailed(orderId: string) {
  await db
    .update(orders)
    .set({
      payment_status: 'failed',
      updated_at: new Date(),
    })
    .where(eq(orders.id, orderId));
}

export async function repoSetOrderBankTransfer(orderId: string) {
  await db
    .update(orders)
    .set({
      payment_method: 'bank_transfer',
      payment_status: 'pending',
      updated_at: new Date(),
    })
    .where(eq(orders.id, orderId));
}
