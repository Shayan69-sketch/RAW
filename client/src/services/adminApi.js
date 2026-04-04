import { api } from './api';

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminStats: builder.query({
      query: (params) => ({ url: '/admin/stats', params }),
      providesTags: ['Admin'],
    }),
  }),
});

export const { useGetAdminStatsQuery } = adminApi;
