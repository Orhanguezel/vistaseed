// =============================================================
// FILE: src/integrations/endpoints/admin/gallery-admin-endpoints.ts
// =============================================================
import { baseApi } from '@/integrations/base-api';
import { cleanParams } from '@/integrations/shared';
import type {
  GalleryCreatePayload,
  GalleryDto,
  GalleryImageCreatePayload,
  GalleryImageDto,
  GalleryListQueryParams,
  GalleryReorderPayload,
  GalleryUpdatePayload,
} from '@/integrations/shared';

export const galleryAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // GET /admin/galleries
    listGalleriesAdmin: b.query<GalleryDto[], GalleryListQueryParams | void>({
      query: (params) => ({
        url: '/admin/galleries',
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
      providesTags: [{ type: 'AdminGalleries' as const, id: 'LIST' }],
    }),

    // GET /admin/galleries/:id
    getGalleryAdmin: b.query<GalleryDto, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/admin/galleries/${encodeURIComponent(id)}`,
        params: cleanParams(locale ? { locale } : undefined),
      }),
      providesTags: (_r, _e, { id }) => [{ type: 'AdminGalleries' as const, id }],
    }),

    // POST /admin/galleries
    createGalleryAdmin: b.mutation<GalleryDto, GalleryCreatePayload>({
      query: (body) => ({ url: '/admin/galleries', method: 'POST', body }),
      invalidatesTags: [{ type: 'AdminGalleries' as const, id: 'LIST' }],
    }),

    // PATCH /admin/galleries/:id
    updateGalleryAdmin: b.mutation<GalleryDto, { id: string; patch: GalleryUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `/admin/galleries/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'AdminGalleries' as const, id: 'LIST' },
        { type: 'AdminGalleries' as const, id },
      ],
    }),

    // DELETE /admin/galleries/:id
    deleteGalleryAdmin: b.mutation<void, string>({
      query: (id) => ({
        url: `/admin/galleries/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AdminGalleries' as const, id: 'LIST' }],
    }),

    // POST /admin/galleries/reorder
    reorderGalleriesAdmin: b.mutation<{ ok: boolean }, GalleryReorderPayload>({
      query: (body) => ({ url: '/admin/galleries/reorder', method: 'POST', body }),
      invalidatesTags: [{ type: 'AdminGalleries' as const, id: 'LIST' }],
    }),

    // --- Images ---

    // GET /admin/galleries/:id/images
    listGalleryImagesAdmin: b.query<GalleryImageDto[], { galleryId: string; locale?: string }>({
      query: ({ galleryId, locale }) => ({
        url: `/admin/galleries/${encodeURIComponent(galleryId)}/images`,
        params: cleanParams(locale ? { locale } : undefined),
      }),
      providesTags: (_r, _e, { galleryId }) => [{ type: 'AdminGalleryImages' as const, id: galleryId }],
    }),

    // POST /admin/galleries/:id/images
    addGalleryImageAdmin: b.mutation<GalleryImageDto[], { galleryId: string; body: GalleryImageCreatePayload }>({
      query: ({ galleryId, body }) => ({
        url: `/admin/galleries/${encodeURIComponent(galleryId)}/images`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { galleryId }) => [{ type: 'AdminGalleryImages' as const, id: galleryId }],
    }),

    // DELETE /admin/galleries/:id/images/:imageId
    deleteGalleryImageAdmin: b.mutation<void, { galleryId: string; imageId: string }>({
      query: ({ galleryId, imageId }) => ({
        url: `/admin/galleries/${encodeURIComponent(galleryId)}/images/${encodeURIComponent(imageId)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { galleryId }) => [{ type: 'AdminGalleryImages' as const, id: galleryId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListGalleriesAdminQuery,
  useGetGalleryAdminQuery,
  useCreateGalleryAdminMutation,
  useUpdateGalleryAdminMutation,
  useDeleteGalleryAdminMutation,
  useReorderGalleriesAdminMutation,
  useListGalleryImagesAdminQuery,
  useAddGalleryImageAdminMutation,
  useDeleteGalleryImageAdminMutation,
} = galleryAdminApi;
