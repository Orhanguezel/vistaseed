// src/modules/orders/payment.validation.ts
import { z } from 'zod';

export const orderPaymentLocaleQuerySchema = z.object({
  locale: z.string().min(2).max(8).optional(),
});
