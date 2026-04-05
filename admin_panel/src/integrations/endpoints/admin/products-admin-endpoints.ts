// =============================================================
// FILE: src/integrations/endpoints/admin/products-admin-endpoints.ts
// =============================================================
import { baseApi } from '@/integrations/base-api';
import { cleanParams } from '@/integrations/shared';
import type {
  ProductCreatePayload,
  ProductDto,
  ProductFaqCreatePayload,
  ProductFaqDto,
  ProductFaqUpdatePayload,
  ProductImageCreatePayload,
  ProductImageDto,
  ProductListQueryParams,
  ProductReorderPayload,
  ProductReviewCreatePayload,
  ProductReviewDto,
  ProductReviewUpdatePayload,
  ProductSpecCreatePayload,
  ProductSpecDto,
  ProductSpecUpdatePayload,
  ProductUpdatePayload,
} from '@/integrations/shared';

export const productsAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    // --- Products CRUD ---

    // GET /admin/products
    listProductsAdmin: b.query<ProductDto[], ProductListQueryParams | void>({
      query: (params) => ({
        url: '/admin/products',
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
      providesTags: [{ type: 'AdminProducts' as const, id: 'LIST' }],
    }),

    // GET /admin/products/:id
    getProductAdmin: b.query<ProductDto, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/admin/products/${encodeURIComponent(id)}`,
        params: cleanParams(locale ? { locale } : undefined),
      }),
      providesTags: (_r, _e, { id }) => [{ type: 'AdminProducts' as const, id }],
    }),

    // POST /admin/products
    createProductAdmin: b.mutation<ProductDto, ProductCreatePayload>({
      query: (body) => ({ url: '/admin/products', method: 'POST', body }),
      invalidatesTags: [{ type: 'AdminProducts' as const, id: 'LIST' }],
    }),

    // PATCH /admin/products/:id
    updateProductAdmin: b.mutation<ProductDto, { id: string; patch: ProductUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `/admin/products/${encodeURIComponent(id)}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: 'AdminProducts' as const, id: 'LIST' },
        { type: 'AdminProducts' as const, id },
      ],
    }),

    // DELETE /admin/products/:id
    deleteProductAdmin: b.mutation<void, string>({
      query: (id) => ({
        url: `/admin/products/${encodeURIComponent(id)}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'AdminProducts' as const, id: 'LIST' }],
    }),

    // POST /admin/products/reorder
    reorderProductsAdmin: b.mutation<{ ok: boolean }, ProductReorderPayload>({
      query: (body) => ({ url: '/admin/products/reorder', method: 'POST', body }),
      invalidatesTags: [{ type: 'AdminProducts' as const, id: 'LIST' }],
    }),

    // --- Images ---

    // GET /admin/products/:id/images
    listProductImagesAdmin: b.query<ProductImageDto[], { productId: string; locale?: string }>({
      query: ({ productId, locale }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/images`,
        params: cleanParams(locale ? { locale } : undefined),
      }),
      providesTags: (_r, _e, { productId }) => [{ type: 'AdminProductImages' as const, id: productId }],
    }),

    // POST /admin/products/:id/images
    addProductImageAdmin: b.mutation<ProductImageDto[], { productId: string; body: ProductImageCreatePayload }>({
      query: ({ productId, body }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/images`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_r, _e, { productId }) => [{ type: 'AdminProductImages' as const, id: productId }],
    }),

    // DELETE /admin/products/:id/images/:imageId
    deleteProductImageAdmin: b.mutation<ProductImageDto[], { productId: string; imageId: string; locale?: string }>({
      query: ({ productId, imageId, locale }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/images/${encodeURIComponent(imageId)}`,
        method: 'DELETE',
        params: cleanParams(locale ? { locale } : undefined),
      }),
      invalidatesTags: (_r, _e, { productId }) => [{ type: 'AdminProductImages' as const, id: productId }],
    }),

    // --- FAQs ---

    // GET /admin/products/:id/faqs
    listProductFaqsAdmin: b.query<ProductFaqDto[], { productId: string; locale?: string }>({
      query: ({ productId, locale }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/faqs`,
        params: cleanParams(locale ? { locale } : undefined),
      }),
    }),

    // POST /admin/products/:id/faqs
    createProductFaqAdmin: b.mutation<ProductFaqDto, { productId: string; body: ProductFaqCreatePayload }>({
      query: ({ productId, body }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/faqs`,
        method: 'POST',
        body,
      }),
    }),

    // PATCH /admin/products/:id/faqs/:faqId
    updateProductFaqAdmin: b.mutation<ProductFaqDto, { productId: string; faqId: string; body: ProductFaqUpdatePayload }>({
      query: ({ productId, faqId, body }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/faqs/${encodeURIComponent(faqId)}`,
        method: 'PATCH',
        body,
      }),
    }),

    // DELETE /admin/products/:id/faqs/:faqId
    deleteProductFaqAdmin: b.mutation<{ ok: boolean }, { productId: string; faqId: string }>({
      query: ({ productId, faqId }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/faqs/${encodeURIComponent(faqId)}`,
        method: 'DELETE',
      }),
    }),

    // --- Specs ---

    // GET /admin/products/:id/specs
    listProductSpecsAdmin: b.query<ProductSpecDto[], { productId: string; locale?: string }>({
      query: ({ productId, locale }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/specs`,
        params: cleanParams(locale ? { locale } : undefined),
      }),
    }),

    // POST /admin/products/:id/specs
    createProductSpecAdmin: b.mutation<ProductSpecDto, { productId: string; body: ProductSpecCreatePayload }>({
      query: ({ productId, body }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/specs`,
        method: 'POST',
        body,
      }),
    }),

    // PATCH /admin/products/:id/specs/:specId
    updateProductSpecAdmin: b.mutation<ProductSpecDto, { productId: string; specId: string; body: ProductSpecUpdatePayload }>({
      query: ({ productId, specId, body }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/specs/${encodeURIComponent(specId)}`,
        method: 'PATCH',
        body,
      }),
    }),

    // DELETE /admin/products/:id/specs/:specId
    deleteProductSpecAdmin: b.mutation<{ ok: boolean }, { productId: string; specId: string }>({
      query: ({ productId, specId }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/specs/${encodeURIComponent(specId)}`,
        method: 'DELETE',
      }),
    }),

    // --- Reviews ---

    // GET /admin/products/:id/reviews
    listProductReviewsAdmin: b.query<ProductReviewDto[], { productId: string; onlyActive?: boolean }>({
      query: ({ productId, onlyActive }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/reviews`,
        params: cleanParams(onlyActive != null ? { only_active: onlyActive } : undefined),
      }),
    }),

    // POST /admin/products/:id/reviews
    createProductReviewAdmin: b.mutation<ProductReviewDto, { productId: string; body: ProductReviewCreatePayload }>({
      query: ({ productId, body }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/reviews`,
        method: 'POST',
        body,
      }),
    }),

    // PATCH /admin/products/:id/reviews/:reviewId
    updateProductReviewAdmin: b.mutation<ProductReviewDto, { productId: string; reviewId: string; body: ProductReviewUpdatePayload }>({
      query: ({ productId, reviewId, body }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/reviews/${encodeURIComponent(reviewId)}`,
        method: 'PATCH',
        body,
      }),
    }),

    // PATCH /admin/products/:id/reviews/:reviewId/active
    toggleProductReviewActiveAdmin: b.mutation<{ ok: boolean }, { productId: string; reviewId: string; is_active: boolean }>({
      query: ({ productId, reviewId, is_active }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/reviews/${encodeURIComponent(reviewId)}/active`,
        method: 'PATCH',
        body: { is_active },
      }),
    }),

    // DELETE /admin/products/:id/reviews/:reviewId
    deleteProductReviewAdmin: b.mutation<{ ok: boolean }, { productId: string; reviewId: string }>({
      query: ({ productId, reviewId }) => ({
        url: `/admin/products/${encodeURIComponent(productId)}/reviews/${encodeURIComponent(reviewId)}`,
        method: 'DELETE',
      }),
    }),

    // --- Category helpers ---

    // GET /admin/products/categories
    listProductCategoriesAdmin: b.query<Array<{ id: string; name: string }>, void>({
      query: () => ({ url: '/admin/products/categories' }),
    }),

    // GET /admin/products/subcategories
    listProductSubcategoriesAdmin: b.query<Array<{ id: string; name: string }>, void>({
      query: () => ({ url: '/admin/products/subcategories' }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useListProductsAdminQuery,
  useGetProductAdminQuery,
  useCreateProductAdminMutation,
  useUpdateProductAdminMutation,
  useDeleteProductAdminMutation,
  useReorderProductsAdminMutation,
  useListProductImagesAdminQuery,
  useAddProductImageAdminMutation,
  useDeleteProductImageAdminMutation,
  useListProductFaqsAdminQuery,
  useCreateProductFaqAdminMutation,
  useUpdateProductFaqAdminMutation,
  useDeleteProductFaqAdminMutation,
  useListProductSpecsAdminQuery,
  useCreateProductSpecAdminMutation,
  useUpdateProductSpecAdminMutation,
  useDeleteProductSpecAdminMutation,
  useListProductReviewsAdminQuery,
  useCreateProductReviewAdminMutation,
  useUpdateProductReviewAdminMutation,
  useToggleProductReviewActiveAdminMutation,
  useDeleteProductReviewAdminMutation,
  useListProductCategoriesAdminQuery,
  useListProductSubcategoriesAdminQuery,
} = productsAdminApi;
