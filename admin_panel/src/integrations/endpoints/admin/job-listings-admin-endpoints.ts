import { baseApi } from "@/integrations/base-api";
import type {
  JobListingCreatePayload,
  JobListingDto,
  JobListingListQueryParams,
  JobListingReorderPayload,
  JobListingUpdatePayload,
} from "@/integrations/shared";
import { cleanParams } from "@/integrations/shared";

export const jobListingsAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listJobListingsAdmin: b.query<JobListingDto[], JobListingListQueryParams | undefined>({
      query: (params) => ({
        url: "/admin/jobs",
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
      providesTags: [{ type: "JobListings" as const, id: "LIST" }],
    }),

    getJobListingAdmin: b.query<JobListingDto, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/admin/jobs/${encodeURIComponent(id)}`,
        params: cleanParams(locale ? { locale } : undefined),
      }),
      providesTags: (_r, _e, { id }) => [{ type: "JobListings" as const, id }],
    }),

    createJobListingAdmin: b.mutation<JobListingDto, JobListingCreatePayload>({
      query: (body) => ({
        url: "/admin/jobs",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "JobListings" as const, id: "LIST" }],
    }),

    updateJobListingAdmin: b.mutation<JobListingDto, { id: string; patch: JobListingUpdatePayload }>({
      query: ({ id, patch }) => ({
        url: `/admin/jobs/${encodeURIComponent(id)}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "JobListings" as const, id: "LIST" },
        { type: "JobListings" as const, id },
      ],
    }),

    deleteJobListingAdmin: b.mutation<{ ok: boolean }, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/admin/jobs/${encodeURIComponent(id)}`,
        method: "DELETE",
        params: cleanParams(locale ? { locale } : undefined),
      }),
      invalidatesTags: [{ type: "JobListings" as const, id: "LIST" }],
    }),

    toggleJobListingActiveAdmin: b.mutation<{ ok: boolean; is_active: number }, { id: string; is_active: boolean }>({
      query: ({ id, is_active }) => ({
        url: `/admin/jobs/${encodeURIComponent(id)}/active`,
        method: "PATCH",
        body: { is_active },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "JobListings" as const, id: "LIST" },
        { type: "JobListings" as const, id },
      ],
    }),

    reorderJobListingsAdmin: b.mutation<{ ok: boolean }, JobListingReorderPayload>({
      query: (body) => ({
        url: "/admin/jobs/reorder",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "JobListings" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListJobListingsAdminQuery,
  useGetJobListingAdminQuery,
  useCreateJobListingAdminMutation,
  useUpdateJobListingAdminMutation,
  useDeleteJobListingAdminMutation,
  useToggleJobListingActiveAdminMutation,
  useReorderJobListingsAdminMutation,
} = jobListingsAdminApi;
