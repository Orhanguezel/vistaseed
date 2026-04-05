// =============================================================
// FILE: src/integrations/endpoints/admin/library-admin-endpoints.ts
// =============================================================
import { baseApi } from '@/integrations/base-api';
import { cleanParams } from '@/integrations/shared';
import type {
  LibraryCreatePayload,
  LibraryDto,
  LibraryFileCreatePayload,
  LibraryFileDto,
  LibraryFileUpdatePayload,
  LibraryImageCreatePayload,
  LibraryImageDto,
  LibraryListQueryParams,
  LibraryUpdatePayload,
} from '@/integrations/shared';

export const libraryAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // GET /admin/library
    listLibraryAdmin: b.query<LibraryDto[], LibraryListQueryParams | void>({
      query: (params) => ({
        url: '/admin/library',
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
      providesTags: [{ type: 'AdminLibrary' as const, id: 'LIST' }],
    }),

    // GET /admin/library/:id
    getLibraryAdmin: b.query<LibraryDto, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/admin/library/${encodeURIComponent(id)}`,
        params: cleanParams(locale ? { locale } : undefined),
      }),
      providesTags: (_r, _e, { id }) => [{ type: 'AdminLibrary' as const, id }],
    }),

    // POST /admin/library
    createLibraryAdmin: b.mutation<LibraryDto, LibraryCreatePayload>({
      query: (body) => ({ url: '/admin/library', method: 'POST', body }),
      invalidatesTags: [{ type: 'AdminLibrary' as const, id: 'LIST' }],
    }),

    // PATCH /admin/library/:id
    updateLibraryAdmin: b.mutation<LibraryDto, { id: string; patch: LibraryUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `/admin/library/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'AdminLibrary' as const, id: 'LIST' },
        { type: 'AdminLibrary' as const, id },
      ],
    }),

    // DELETE /admin/library/:id
    deleteLibraryAdmin: b.mutation<void, string>({
      query: (id) => ({
        url: `/admin/library/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AdminLibrary' as const, id: 'LIST' }],
    }),

    // --- Images ---

    // GET /admin/library/:id/images
    listLibraryImagesAdmin: b.query<LibraryImageDto[], { libraryId: string; locale?: string }>({
      query: ({ libraryId, locale }) => ({
        url: `/admin/library/${encodeURIComponent(libraryId)}/images`,
        params: cleanParams(locale ? { locale } : undefined),
      }),
      providesTags: (_r, _e, { libraryId }) => [{ type: 'AdminLibraryImages' as const, id: libraryId }],
    }),

    // POST /admin/library/:id/images
    addLibraryImageAdmin: b.mutation<LibraryImageDto[], { libraryId: string; body: LibraryImageCreatePayload }>({
      query: ({ libraryId, body }) => ({
        url: `/admin/library/${encodeURIComponent(libraryId)}/images`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { libraryId }) => [{ type: 'AdminLibraryImages' as const, id: libraryId }],
    }),

    // DELETE /admin/library/:id/images/:imageId
    deleteLibraryImageAdmin: b.mutation<void, { libraryId: string; imageId: string }>({
      query: ({ libraryId, imageId }) => ({
        url: `/admin/library/${encodeURIComponent(libraryId)}/images/${encodeURIComponent(imageId)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { libraryId }) => [{ type: 'AdminLibraryImages' as const, id: libraryId }],
    }),

    // --- Files ---

    // GET /admin/library/:id/files
    listLibraryFilesAdmin: b.query<LibraryFileDto[], { libraryId: string }>({
      query: ({ libraryId }) => ({
        url: `/admin/library/${encodeURIComponent(libraryId)}/files`,
      }),
      providesTags: (_r, _e, { libraryId }) => [{ type: 'AdminLibraryFiles' as const, id: libraryId }],
    }),

    // POST /admin/library/:id/files
    addLibraryFileAdmin: b.mutation<LibraryFileDto, { libraryId: string; body: LibraryFileCreatePayload }>({
      query: ({ libraryId, body }) => ({
        url: `/admin/library/${encodeURIComponent(libraryId)}/files`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { libraryId }) => [{ type: 'AdminLibraryFiles' as const, id: libraryId }],
    }),

    // PATCH /admin/library/:id/files/:fileId
    updateLibraryFileAdmin: b.mutation<LibraryFileDto, { libraryId: string; fileId: string; body: LibraryFileUpdatePayload }>({
      query: ({ libraryId, fileId, body }) => ({
        url: `/admin/library/${encodeURIComponent(libraryId)}/files/${encodeURIComponent(fileId)}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_r, _e, { libraryId }) => [{ type: 'AdminLibraryFiles' as const, id: libraryId }],
    }),

    // DELETE /admin/library/:id/files/:fileId
    deleteLibraryFileAdmin: b.mutation<void, { libraryId: string; fileId: string }>({
      query: ({ libraryId, fileId }) => ({
        url: `/admin/library/${encodeURIComponent(libraryId)}/files/${encodeURIComponent(fileId)}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_r, _e, { libraryId }) => [{ type: 'AdminLibraryFiles' as const, id: libraryId }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListLibraryAdminQuery,
  useGetLibraryAdminQuery,
  useCreateLibraryAdminMutation,
  useUpdateLibraryAdminMutation,
  useDeleteLibraryAdminMutation,
  useListLibraryImagesAdminQuery,
  useAddLibraryImageAdminMutation,
  useDeleteLibraryImageAdminMutation,
  useListLibraryFilesAdminQuery,
  useAddLibraryFileAdminMutation,
  useUpdateLibraryFileAdminMutation,
  useDeleteLibraryFileAdminMutation,
} = libraryAdminApi;
