// =============================================================
// FILE: src/integrations/endpoints/admin/references-admin-endpoints.ts
// =============================================================
import { baseApi } from '@/integrations/base-api';
import { cleanParams } from '@/integrations/shared';
import type {
  ReferenceCreatePayload,
  ReferenceDto,
  ReferenceImageCreatePayload,
  ReferenceImageDto,
  ReferenceListQueryParams,
  ReferenceUpdatePayload,
} from '@/integrations/shared';

export const referencesAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // GET /admin/references
    listReferencesAdmin: b.query<ReferenceDto[], ReferenceListQueryParams | void>({
      query: (params) => ({
        url: '/admin/references',
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
      providesTags: [{ type: 'AdminReferences' as const, id: 'LIST' }],
    }),

    // GET /admin/references/:id
    getReferenceAdmin: b.query<ReferenceDto, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/admin/references/${encodeURIComponent(id)}`,
        params: cleanParams(locale ? { locale } : undefined),
      }),
      providesTags: (_r, _e, { id }) => [{ type: 'AdminReferences' as const, id }],
    }),

    // POST /admin/references
    createReferenceAdmin: b.mutation<ReferenceDto, ReferenceCreatePayload>({
      query: (body) => ({ url: '/admin/references', method: 'POST', body }),
      invalidatesTags: [{ type: 'AdminReferences' as const, id: 'LIST' }],
    }),

    // PATCH /admin/references/:id
    updateReferenceAdmin: b.mutation<ReferenceDto, { id: string; patch: ReferenceUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `/admin/references/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'AdminReferences' as const, id: 'LIST' },
        { type: 'AdminReferences' as const, id },
      ],
    }),

    // DELETE /admin/references/:id
    deleteReferenceAdmin: b.mutation<void, string>({
      query: (id) => ({
        url: `/admin/references/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AdminReferences' as const, id: 'LIST' }],
    }),

    // --- Images ---

    // GET /admin/references/:id/images
    listReferenceImagesAdmin: b.query<ReferenceImageDto[], { referenceId: string; locale?: string }>({
      query: ({ referenceId, locale }) => ({
        url: `/admin/references/${encodeURIComponent(referenceId)}/images`,
        params: cleanParams(locale ? { locale } : undefined),
      }),
      providesTags: (_r, _e, { referenceId }) => [{ type: 'AdminReferenceImages' as const, id: referenceId }],
    }),

    // POST /admin/references/:id/images
    addReferenceImageAdmin: b.mutation<ReferenceImageDto[], { referenceId: string; body: ReferenceImageCreatePayload }>({
      query: ({ referenceId, body }) => ({
        url: `/admin/references/${encodeURIComponent(referenceId)}/images`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { referenceId }) => [{ type: 'AdminReferenceImages' as const, id: referenceId }],
    }),

    // DELETE /admin/references/:id/images/:imageId
    deleteReferenceImageAdmin: b.mutation<void, { referenceId: string; imageId: string }>({
      query: ({ referenceId, imageId }) => ({
        url: `/admin/references/${encodeURIComponent(referenceId)}/images/${encodeURIComponent(imageId)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { referenceId }) => [{ type: 'AdminReferenceImages' as const, id: referenceId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListReferencesAdminQuery,
  useGetReferenceAdminQuery,
  useCreateReferenceAdminMutation,
  useUpdateReferenceAdminMutation,
  useDeleteReferenceAdminMutation,
  useListReferenceImagesAdminQuery,
  useAddReferenceImageAdminMutation,
  useDeleteReferenceImageAdminMutation,
} = referencesAdminApi;
