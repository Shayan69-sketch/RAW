import { api } from './api';

export const cartApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/cart',
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation({
      query: (data) => ({ url: '/cart/items', method: 'POST', body: data }),
      invalidatesTags: ['Cart'],
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, quantity }) => ({
        url: `/cart/items/${itemId}`,
        method: 'PUT',
        body: { quantity },
      }),
      invalidatesTags: ['Cart'],
    }),
    removeCartItem: builder.mutation({
      query: (itemId) => ({ url: `/cart/items/${itemId}`, method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
    applyCoupon: builder.mutation({
      query: (data) => ({ url: '/cart/coupon', method: 'POST', body: data }),
      invalidatesTags: ['Cart'],
    }),
    removeCoupon: builder.mutation({
      query: () => ({ url: '/cart/coupon', method: 'DELETE' }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useApplyCouponMutation,
  useRemoveCouponMutation,
} = cartApi;
