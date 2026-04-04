// src/modules/dealerFinance/validation.ts
import { z } from 'zod';
import { TRANSACTION_TYPES } from './schema';

/** Dealer profile create — dealer self-registration fields */
export const dealerProfileCreateSchema = z.object({
  company_name: z.string().min(1).max(255).optional(),
  tax_number: z.string().max(50).optional(),
  tax_office: z.string().max(255).optional(),
});
export type DealerProfileCreateInput = z.infer<typeof dealerProfileCreateSchema>;

/** Dealer profile update — admin-only fields included */
export const dealerProfileUpdateSchema = z.object({
  company_name: z.string().min(1).max(255).optional(),
  tax_number: z.string().max(50).optional(),
  tax_office: z.string().max(255).optional(),
  credit_limit: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  risk_limit: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  discount_rate: z.string().regex(/^\d+(\.\d{1,2})?$/).optional(),
  ecosystem_id: z.string().max(128).nullable().optional(),
  is_approved: z.union([z.literal(0), z.literal(1)]).optional(),
});
export type DealerProfileUpdateInput = z.infer<typeof dealerProfileUpdateSchema>;

/** Dealer self-update — only company info, no financial fields */
export const dealerSelfUpdateSchema = z.object({
  company_name: z.string().min(1).max(255).optional(),
  tax_number: z.string().max(50).optional(),
  tax_office: z.string().max(255).optional(),
});
export type DealerSelfUpdateInput = z.infer<typeof dealerSelfUpdateSchema>;

/** Transaction create — admin manual entry (dealer URL path'ten) */
export const adminTransactionCreateSchema = z.object({
  type: z.enum(TRANSACTION_TYPES),
  amount: z.string().regex(/^-?\d+(\.\d{1,2})?$/),
  description: z.string().max(500).optional(),
  order_id: z.string().uuid().optional(),
  due_date: z.string().min(1).optional(),
});
export type AdminTransactionCreateInput = z.infer<typeof adminTransactionCreateSchema>;

/** Transaction list query */
export const transactionListQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  type: z.enum(TRANSACTION_TYPES).optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
  due_from: z.string().optional(),
  due_to: z.string().optional(),
});
export type TransactionListQueryInput = z.infer<typeof transactionListQuerySchema>;

/** GET /dealers/public — liste + filtre */
export const publicDealersQuerySchema = z.object({
  q: z.string().max(128).optional(),
  city: z.string().max(128).optional(),
  region: z.string().max(128).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(50).optional(),
});
export type PublicDealersQueryInput = z.infer<typeof publicDealersQuerySchema>;

/** GET /dealer/products — katalog */
export const dealerCatalogQuerySchema = z.object({
  locale: z.string().min(2).max(8).default('tr'),
  limit: z.coerce.number().int().min(1).max(200).default(100),
  offset: z.coerce.number().int().min(0).default(0),
  q: z.string().max(200).optional(),
});
export type DealerCatalogQueryInput = z.infer<typeof dealerCatalogQuerySchema>;
