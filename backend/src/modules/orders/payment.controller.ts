// src/modules/orders/payment.controller.ts
// Shopo benzeri: siparis olusturulduktan sonra Iyzico Checkout Form (cüzdandaki SDK ile ayni).
import type { FastifyRequest, FastifyReply } from 'fastify';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';
import {
  getAuthUserId,
  handleRouteError,
  sendNotFound,
  sendValidationError,
} from '@agro/shared-backend/modules/_shared';
import { users } from '@agro/shared-backend/modules/auth/schema';
import { db } from '@/db/client';
import { env } from '@/core/env';
import { createCheckoutForm } from '@/modules/wallet/iyzico';
import {
  repoListOrderItemsForIyzico,
  repoGetOrderRowById,
  repoSetOrderPaymentPending,
  repoFailOrderPaymentInit,
  repoSetOrderBankTransfer,
} from './payment.repository';
import {
  CreditPaymentError,
  finalizeOrderPaymentWithDealerCredit,
} from './payment-credit.service';
import { orderPaymentLocaleQuerySchema } from './payment.validation';

export async function initiateOrderIyzicoPayment(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dealerId = getAuthUserId(req);
    const { id: orderId } = req.params as { id: string };

    const parsedQ = orderPaymentLocaleQuerySchema.safeParse(req.query ?? {});
    if (!parsedQ.success) return sendValidationError(reply, parsedQ.error.issues);
    const locale = parsedQ.data.locale ?? 'tr';

    if (!env.IYZICO_API_KEY || !env.IYZICO_SECRET_KEY) {
      return reply.code(503).send({ error: { message: 'iyzico_not_configured' } });
    }

    const order = await repoGetOrderRowById(orderId);
    if (!order || order.dealer_id !== dealerId) return sendNotFound(reply);

    if (order.status === 'cancelled') {
      return reply.code(400).send({ error: { message: 'order_cancelled' } });
    }
    if (order.payment_status === 'paid') {
      return reply.code(400).send({ error: { message: 'already_paid' } });
    }

    const lines = await repoListOrderItemsForIyzico(orderId, locale);
    if (lines.length === 0) {
      return reply.code(400).send({ error: { message: 'order_has_no_items' } });
    }

    const [user] = await db.select().from(users).where(eq(users.id, dealerId)).limit(1);
    if (!user) return sendNotFound(reply);

    const conversationId = randomUUID();
    const amountStr = parseFloat(String(order.total)).toFixed(2);

    await repoSetOrderPaymentPending(orderId, conversationId, 'iyzico');

    const rawIp = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim()
      ?? req.ip ?? '127.0.0.1';
    const buyerIp = rawIp === '::1' || rawIp === '::ffff:127.0.0.1' ? '127.0.0.1' : rawIp;

    const nameParts = (user.full_name ?? 'Bayi').trim().split(/\s+/);
    const firstName = nameParts[0] ?? 'Bayi';
    const lastName = nameParts.slice(1).join(' ') || 'Musteri';

    const callbackUrl = `${env.PUBLIC_URL}/api/v1/orders/payment/iyzico/callback`;

    const basketItems = lines.map((line) => ({
      id: line.product_id,
      name: line.title ?? line.product_id,
      category1: 'Urun',
      itemType: 'PHYSICAL' as const,
      price: parseFloat(String(line.total_price)).toFixed(2),
    }));

    const basketSum = basketItems.reduce((s, b) => s + parseFloat(b.price), 0);
    const orderTotal = parseFloat(amountStr);
    if (Math.abs(basketSum - orderTotal) > 0.05) {
      req.log.warn({ basketSum, orderTotal, orderId }, 'order_iyzico_basket_mismatch');
      await repoFailOrderPaymentInit(orderId);
      return reply.code(400).send({ error: { message: 'basket_total_mismatch' } });
    }

    const iyzicoReq = {
      locale: 'tr',
      conversationId,
      price: amountStr,
      paidPrice: amountStr,
      currency: 'TRY',
      basketId: orderId,
      paymentGroup: 'PRODUCT',
      callbackUrl,
      enabledInstallments: [1],
      buyer: {
        id: dealerId,
        name: firstName,
        surname: lastName,
        email: user.email,
        identityNumber: '11111111111',
        registrationAddress: 'Turkiye',
        city: 'Istanbul',
        country: 'Turkey',
        ip: buyerIp,
      },
      shippingAddress: {
        contactName: `${firstName} ${lastName}`,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Turkiye',
      },
      billingAddress: {
        contactName: `${firstName} ${lastName}`,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Turkiye',
      },
      basketItems,
    };

    const iyzicoRes = await createCheckoutForm(iyzicoReq);

    if (iyzicoRes.status !== 'success' || !iyzicoRes.checkoutFormContent) {
      await repoFailOrderPaymentInit(orderId);
      return reply.code(502).send({
        error: {
          message: 'iyzico_init_failed',
          details: iyzicoRes.errorMessage ?? undefined,
          errorCode: iyzicoRes.errorCode,
        },
      });
    }

    return reply.send({
      provider: 'iyzico',
      checkoutFormContent: iyzicoRes.checkoutFormContent,
      token: iyzicoRes.token,
      conversationId,
      amount: parseFloat(amountStr),
    });
  } catch (e) {
    return handleRouteError(reply, req, e, 'order_iyzico_init');
  }
}

export async function initiateOrderBankTransfer(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dealerId = getAuthUserId(req);
    const { id: orderId } = req.params as { id: string };

    const order = await repoGetOrderRowById(orderId);
    if (!order || order.dealer_id !== dealerId) return sendNotFound(reply);

    if (order.payment_status === 'paid') {
      return reply.code(400).send({ error: { message: 'already_paid' } });
    }

    await repoSetOrderBankTransfer(orderId);
    return reply.send({
      success: true,
      payment_method: 'bank_transfer',
      payment_status: 'pending',
    });
  } catch (e) {
    return handleRouteError(reply, req, e, 'order_bank_transfer');
  }
}

export async function initiateOrderCreditPayment(req: FastifyRequest, reply: FastifyReply) {
  try {
    const dealerId = getAuthUserId(req);
    const { id: orderId } = req.params as { id: string };

    await finalizeOrderPaymentWithDealerCredit({ userId: dealerId, orderId });
    return reply.send({
      success: true,
      payment_method: 'dealer_credit',
      payment_status: 'paid',
    });
  } catch (e) {
    if (e instanceof CreditPaymentError) {
      if (e.code === 'order_not_found') return sendNotFound(reply);
      return reply.code(400).send({ error: { message: e.code } });
    }
    return handleRouteError(reply, req, e, 'order_credit_payment');
  }
}
