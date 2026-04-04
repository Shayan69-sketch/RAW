import { api } from './api';

export const reviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProductReviews: builder.query({
      query: ({ productId, ...params }) => ({ url: `/reviews/product/${productId}`, params }),
      providesTags: ['Review'],
    }),
    createReview: builder.mutation({
      query: ({ productId, ...data }) => ({
        url: `/reviews/product/${productId}`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Review', 'Product'],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({ url: `/reviews/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Review', 'Product'],
    }),
  }),
});

export const {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
