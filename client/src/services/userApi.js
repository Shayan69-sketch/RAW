import { api } from './api';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data) => ({ url: '/users/profile', method: 'PUT', body: data }),
      invalidatesTags: ['User'],
    }),
    updatePassword: builder.mutation({
      query: (data) => ({ url: '/users/password', method: 'PUT', body: data }),
    }),
    addAddress: builder.mutation({
      query: (data) => ({ url: '/users/address', method: 'POST', body: data }),
      invalidatesTags: ['User'],
    }),
    updateAddress: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/users/address/${id}`, method: 'PUT', body: data }),
      invalidatesTags: ['User'],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({ url: `/users/address/${id}`, method: 'DELETE' }),
      invalidatesTags: ['User'],
    }),
    getWishlist: builder.query({
      query: () => '/users/wishlist',
      providesTags: ['Wishlist'],
    }),
    addToWishlist: builder.mutation({
      query: ({ productId, variantId }) => ({
        url: `/users/wishlist/${productId}`,
        method: 'POST',
        body: { variantId },
      }),
      invalidatesTags: ['Wishlist'],
    }),
    removeFromWishlist: builder.mutation({
      query: (productId) => ({ url: `/users/wishlist/${productId}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),
    getAllUsers: builder.query({
      query: (params) => ({ url: '/users', params }),
      providesTags: ['Admin'],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useGetAllUsersQuery,
} = userApi;
