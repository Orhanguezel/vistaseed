import { baseApi } from "@/integrations/base-api";
import type { OfferCreatePayload, OfferDto, OfferListQueryParams, OfferUpdatePayload } from "@/integrations/shared";
import { cleanParams } from "@/integrations/shared";

const B = "/admin/offers";

export const offersAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listOffersAdmin: b.query<OfferDto[], OfferListQueryParams | undefined>({
      query: (params) => ({
        url: B,
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
      providesTags: [{ type: "Offers" as const, id: "LIST" }],
    }),

    getOfferAdmin: b.query<OfferDto, { id: string }>({
      query: ({ id }) => ({
        url: `${B}/${encodeURIComponent(id)}`,
      }),
      providesTags: (_r, _e, { id }) => [{ type: "Offer" as const, id }],
    }),

    createOfferAdmin: b.mutation<OfferDto, OfferCreatePayload>({
      query: (body) => ({
        url: B,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Offers" as const, id: "LIST" }],
    }),

    updateOfferAdmin: b.mutation<OfferDto, { id: string; patch: OfferUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `${B}/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Offers" as const, id: "LIST" },
        { type: "Offer" as const, id },
      ],
    }),

    deleteOfferAdmin: b.mutation<void, { id: string }>({
      query: ({ id }) => ({
        url: `${B}/${encodeURIComponent(id)}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Offers" as const, id: "LIST" },
        { type: "Offer" as const, id },
      ],
    }),

    generateOfferPdfAdmin: b.mutation<OfferDto, { id: string }>({
      query: ({ id }) => ({
        url: `${B}/${encodeURIComponent(id)}/pdf`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Offers" as const, id: "LIST" },
        { type: "Offer" as const, id },
      ],
    }),

    sendOfferEmailAdmin: b.mutation<OfferDto, { id: string }>({
      query: ({ id }) => ({
        url: `${B}/${encodeURIComponent(id)}/email`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Offers" as const, id: "LIST" },
        { type: "Offer" as const, id },
      ],
    }),

    sendOfferAdmin: b.mutation<OfferDto, { id: string }>({
      query: ({ id }) => ({
        url: `${B}/${encodeURIComponent(id)}/send`,
        method: "POST",
        body: {},
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "Offers" as const, id: "LIST" },
        { type: "Offer" as const, id },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListOffersAdminQuery,
  useGetOfferAdminQuery,
  useCreateOfferAdminMutation,
  useUpdateOfferAdminMutation,
  useDeleteOfferAdminMutation,
  useGenerateOfferPdfAdminMutation,
  useSendOfferEmailAdminMutation,
  useSendOfferAdminMutation,
} = offersAdminApi;
