import { baseApi } from "@/integrations/base-api";
import type {
  JobApplicationDto,
  JobApplicationListQueryParams,
  JobApplicationStatusPayload,
} from "@/integrations/shared";
import { cleanParams } from "@/integrations/shared";

export const jobApplicationsAdminApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    listJobApplicationsAdmin: b.query<JobApplicationDto[], JobApplicationListQueryParams | undefined>({
      query: (params) => ({
        url: "/admin/job-applications",
        params: cleanParams(params as Record<string, unknown> | undefined),
      }),
      providesTags: [{ type: "JobApplications" as const, id: "LIST" }],
    }),

    getJobApplicationAdmin: b.query<JobApplicationDto, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/admin/job-applications/${encodeURIComponent(id)}`,
        params: cleanParams(locale ? { locale } : undefined),
      }),
      providesTags: (_r, _e, { id }) => [{ type: "JobApplications" as const, id }],
    }),

    updateJobApplicationStatusAdmin: b.mutation<
      JobApplicationDto,
      { id: string; locale?: string; patch: JobApplicationStatusPayload }
    >({
      query: ({ id, locale, patch }) => ({
        url: `/admin/job-applications/${encodeURIComponent(id)}/status`,
        method: "PATCH",
        params: cleanParams(locale ? { locale } : undefined),
        body: patch,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "JobApplications" as const, id: "LIST" },
        { type: "JobApplications" as const, id },
      ],
    }),

    deleteJobApplicationAdmin: b.mutation<{ ok: boolean }, { id: string; locale?: string }>({
      query: ({ id, locale }) => ({
        url: `/admin/job-applications/${encodeURIComponent(id)}`,
        method: "DELETE",
        params: cleanParams(locale ? { locale } : undefined),
      }),
      invalidatesTags: [{ type: "JobApplications" as const, id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useListJobApplicationsAdminQuery,
  useGetJobApplicationAdminQuery,
  useUpdateJobApplicationStatusAdminMutation,
  useDeleteJobApplicationAdminMutation,
} = jobApplicationsAdminApi;
