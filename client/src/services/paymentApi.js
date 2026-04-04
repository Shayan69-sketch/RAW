import { api } from './api';

export const paymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createStripeIntent: builder.mutation({
      query: (data) => ({ url: '/payment/stripe/create-intent', method: 'POST', body: data }),
    }),
    createPaypalOrder: builder.mutation({
      query: (data) => ({ url: '/payment/paypal/create-order', method: 'POST', body: data }),
    }),
    capturePaypalOrder: builder.mutation({
      query: (data) => ({ url: '/payment/paypal/capture-order', method: 'POST', body: data }),
    }),
  }),
});

export const {
  useCreateStripeIntentMutation,
  useCreatePaypalOrderMutation,
  useCapturePaypalOrderMutation,
} = paymentApi;
