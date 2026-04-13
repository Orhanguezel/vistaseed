import { baseApi } from '@/integrations/base-api';
import { cleanParams } from '@/integrations/shared';
import type {
  PaymentAttemptListQuery,
  PaymentAttemptListResponse,
} from '@/integrations/shared/payment-attempts';

export const paymentAttemptsAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listPaymentAttemptsAdmin: b.query<PaymentAttemptListResponse, PaymentAttemptListQuery | void>({
      query: (params) => ({
        url: '/admin/payment-attempts',
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
      providesTags: [{ type: 'Payments' as const, id: 'ATTEMPTS' }],
    }),
  }),
  overrideExisting: false,
});

export const { useListPaymentAttemptsAdminQuery } = paymentAttemptsAdminApi;
