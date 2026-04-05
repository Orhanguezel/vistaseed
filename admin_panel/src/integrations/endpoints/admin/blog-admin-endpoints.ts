import { baseApi } from '@/integrations/base-api';
import type {
  BlogPostCreatePayload,
  BlogPostDto,
  BlogPostListQueryParams,
  BlogPostUpdatePayload,
  BlogRssImportPayload,
  BlogRssImportResult,
} from '@/integrations/shared';
import { cleanParams } from '@/integrations/shared';

export const blogAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listBlogPostsAdmin: b.query<BlogPostDto[], BlogPostListQueryParams | undefined>({
      query: (params) => ({
        url: '/admin/blog',
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
      providesTags: [{ type: 'BlogPosts' as const, id: 'LIST' }],
    }),

    getBlogPostAdmin: b.query<BlogPostDto, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/admin/blog/${encodeURIComponent(id)}`,
        params: cleanParams(locale ? { locale } : undefined),
      }),
      providesTags: (_r, _e, { id }) => [{ type: 'BlogPosts' as const, id }],
    }),

    createBlogPostAdmin: b.mutation<BlogPostDto, BlogPostCreatePayload>({
      query: (body) => ({
        url: '/admin/blog',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'BlogPosts' as const, id: 'LIST' }],
    }),

    updateBlogPostAdmin: b.mutation<BlogPostDto, { id: string; patch: BlogPostUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `/admin/blog/${encodeURIComponent(id)}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'BlogPosts' as const, id: 'LIST' },
        { type: 'BlogPosts' as const, id },
      ],
    }),

    deleteBlogPostAdmin: b.mutation<{ ok: boolean }, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/admin/blog/${encodeURIComponent(id)}`,
        method: 'DELETE',
        params: cleanParams(locale ? { locale } : undefined),
      }),
      invalidatesTags: [{ type: 'BlogPosts' as const, id: 'LIST' }],
    }),

    importBlogRssAdmin: b.mutation<BlogRssImportResult, BlogRssImportPayload | void>({
      query: (body) => ({
        url: '/admin/blog/rss/import',
        method: 'POST',
        body: body ?? {},
      }),
      invalidatesTags: [{ type: 'BlogPosts' as const, id: 'LIST' }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListBlogPostsAdminQuery,
  useGetBlogPostAdminQuery,
  useCreateBlogPostAdminMutation,
  useUpdateBlogPostAdminMutation,
  useDeleteBlogPostAdminMutation,
  useImportBlogRssAdminMutation,
} = blogAdminApi;
