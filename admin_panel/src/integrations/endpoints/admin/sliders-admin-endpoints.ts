// =============================================================
// FILE: src/integrations/endpoints/admin/sliders-admin-endpoints.ts
// =============================================================
import type { FetchArgs } from '@reduxjs/toolkit/query';
import { baseApi } from '@/integrations/base-api';
import type {
  SliderAdminListQueryParams,
  SliderAdminRow,
  SliderAdminView,
  SliderCreatePayload,
  SliderReorderPayload,
  SliderRow,
  SliderSetImagePayload,
  SliderSetStatusPayload,
  SliderUpdatePayload,
} from '@/integrations/shared';
import { buildSliderParams, toAdminSliderView } from '@/integrations/shared';

const ADMIN_BASE = '/admin/sliders';

export const slidersAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    adminListSlides: b.query<SliderAdminView[], void | SliderAdminListQueryParams>({
      query: (params): FetchArgs | string => {
        const qp = buildSliderParams(params as SliderAdminListQueryParams | undefined);
        return qp ? { url: ADMIN_BASE, params: qp } : ADMIN_BASE;
      },
      transformResponse: (res: unknown): SliderAdminView[] => {
        const arr = Array.isArray(res) ? (res as SliderAdminRow[]) : [];
        return arr.map(toAdminSliderView);
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'Slider' as const, id: 'LIST' },
              ...result.map((x) => ({ type: 'Slider' as const, id: x.id })),
            ]
          : [{ type: 'Slider' as const, id: 'LIST' }],
    }),

    adminGetSlide: b.query<SliderAdminView, string | number>({
      query: (id): string => `${ADMIN_BASE}/${encodeURIComponent(String(id))}`,
      transformResponse: (res: unknown): SliderAdminView =>
        toAdminSliderView(res as SliderAdminRow),
      providesTags: (_r, _e, id) => [{ type: 'Slider' as const, id: String(id) }],
    }),

    adminCreateSlide: b.mutation<SliderAdminView, SliderCreatePayload>({
      query: (body): FetchArgs => ({ url: ADMIN_BASE, method: 'POST', body }),
      transformResponse: (res: unknown): SliderAdminView => {
        const row = res as SliderRow & { image_effective_url?: string | null };
        const withUrl: SliderAdminRow = {
          ...row,
          image_effective_url:
            row.image_effective_url ??
            (row as { asset_url?: string | null }).asset_url ??
            row.image_url ??
            null,
        };
        return toAdminSliderView(withUrl);
      },
      invalidatesTags: [{ type: 'Slider' as const, id: 'LIST' }],
    }),

    adminUpdateSlide: b.mutation<
      SliderAdminView,
      { id: string | number; body: SliderUpdatePayload }
    >({
      query: ({ id, body }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(String(id))}`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (res: unknown): SliderAdminView => {
        const row = res as SliderRow & { image_effective_url?: string | null };
        const withUrl: SliderAdminRow = {
          ...row,
          image_effective_url:
            row.image_effective_url ??
            (row as { asset_url?: string | null }).asset_url ??
            row.image_url ??
            null,
        };
        return toAdminSliderView(withUrl);
      },
      invalidatesTags: (_r, _e, arg) => [
        { type: 'Slider' as const, id: String(arg.id) },
        { type: 'Slider' as const, id: 'LIST' },
      ],
    }),

    adminDeleteSlide: b.mutation<{ ok: true }, string | number>({
      query: (id): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(String(id))}`,
        method: 'DELETE',
      }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'Slider' as const, id: String(id) },
        { type: 'Slider' as const, id: 'LIST' },
      ],
    }),

    adminReorderSlides: b.mutation<{ ok: true }, SliderReorderPayload>({
      query: (body): FetchArgs => ({
        url: `${ADMIN_BASE}/reorder`,
        method: 'POST',
        body,
      }),
      transformResponse: (): { ok: true } => ({ ok: true }),
      invalidatesTags: [{ type: 'Slider' as const, id: 'LIST' }],
    }),

    adminSetSlideStatus: b.mutation<
      SliderAdminView,
      { id: string | number; body: SliderSetStatusPayload }
    >({
      query: ({ id, body }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(String(id))}/status`,
        method: 'POST',
        body,
      }),
      transformResponse: (res: unknown): SliderAdminView =>
        toAdminSliderView(res as SliderAdminRow),
      invalidatesTags: (_r, _e, arg) => [
        { type: 'Slider' as const, id: String(arg.id) },
        { type: 'Slider' as const, id: 'LIST' },
      ],
    }),

    adminSetSlideImage: b.mutation<
      SliderAdminView,
      { id: string | number; body: SliderSetImagePayload }
    >({
      query: ({ id, body }): FetchArgs => ({
        url: `${ADMIN_BASE}/${encodeURIComponent(String(id))}/image`,
        method: 'PATCH',
        body,
      }),
      transformResponse: (res: unknown): SliderAdminView =>
        toAdminSliderView(res as SliderAdminRow),
      invalidatesTags: (_r, _e, arg) => [
        { type: 'Slider' as const, id: String(arg.id) },
        { type: 'Slider' as const, id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAdminListSlidesQuery,
  useAdminGetSlideQuery,
  useAdminCreateSlideMutation,
  useAdminUpdateSlideMutation,
  useAdminDeleteSlideMutation,
  useAdminReorderSlidesMutation,
  useAdminSetSlideStatusMutation,
  useAdminSetSlideImageMutation,
} = slidersAdminApi;
