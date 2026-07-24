import { useMutation } from "@tanstack/react-query";

import {
  createStripePaymentIntent,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "@/api/payment";

export const usecreateStripePaymentIntent = () => {
  return useMutation({
    mutationFn: createStripePaymentIntent,
  });
};

export const useCreateRazorpayOrder = () => {
  return useMutation({
    mutationFn: createRazorpayOrder,
  });
};

export const useVerifyRazorpayPayment = () => {
  return useMutation({
    mutationFn: verifyRazorpayPayment,
  });
};
