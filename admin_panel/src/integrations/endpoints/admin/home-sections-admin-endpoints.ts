// =============================================================
// FILE: src/integrations/endpoints/admin/home-sections-admin-endpoints.ts
// =============================================================
import { baseApi } from '@/integrations/base-api';
import type {
  HomeSectionDto,
  HomeSectionCreatePayload,
  HomeSectionUpdatePayload,
  HomeSectionReorderPayload,
} from '@/integrations/shared';

const B = '/admin/home/sections';

export const homeSectionsAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // GET /admin/home/sections
    listHomeSectionsAdmin: b.query<HomeSectionDto[], void>({
      query: () => ({ url: B }),
      providesTags: (result) =>
        result
          ? [
              { type: 'HomeSection' as const, id: 'LIST' },
              ...result.map((s) => ({ type: 'HomeSection' as const, id: s.id })),
            ]
          : [{ type: 'HomeSection' as const, id: 'LIST' }],
    }),

    // GET /admin/home/sections/:id
    getHomeSectionAdmin: b.query<HomeSectionDto, string>({
      query: (id) => ({ url: `${B}/${encodeURIComponent(id)}` }),
      providesTags: (_r, _e, id) => [{ type: 'HomeSection' as const, id }],
    }),

    // POST /admin/home/sections
    createHomeSectionAdmin: b.mutation<HomeSectionDto, HomeSectionCreatePayload>({
      query: (body) => ({ url: B, method: 'POST', body }),
      invalidatesTags: [{ type: 'HomeSection' as const, id: 'LIST' }],
    }),

    // PATCH /admin/home/sections/:id
    updateHomeSectionAdmin: b.mutation<HomeSectionDto, { id: string; patch: HomeSectionUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `${B}/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'HomeSection' as const, id },
        { type: 'HomeSection' as const, id: 'LIST' },
      ],
    }),

    // DELETE /admin/home/sections/:id
    deleteHomeSectionAdmin: b.mutation<void, string>({
      query: (id) => ({ url: `${B}/${encodeURIComponent(id)}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'HomeSection' as const, id: 'LIST' }],
    }),

    // POST /admin/home/sections/reorder
    reorderHomeSectionsAdmin: b.mutation<{ ok: boolean; count: number }, HomeSectionReorderPayload>({
      query: (body) => ({ url: `${B}/reorder`, method: 'POST', body }),
      invalidatesTags: [{ type: 'HomeSection' as const, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListHomeSectionsAdminQuery,
  useGetHomeSectionAdminQuery,
  useCreateHomeSectionAdminMutation,
  useUpdateHomeSectionAdminMutation,
  useDeleteHomeSectionAdminMutation,
  useReorderHomeSectionsAdminMutation,
} = homeSectionsAdminApi;
