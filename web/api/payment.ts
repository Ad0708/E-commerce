import api from "@/lib/axios/axios";

export const createStripePaymentIntent = async (orderId: string) => {
  const { data } = await api.post("/payment/create-payment-intent", {
    orderId,
  });

  return data;
};

export const createRazorpayOrder = async (orderId: string) => {
  const { data } = await api.post("/payment/create-razorpay-order", {
    orderId,
  });

  return data;
};

export const verifyRazorpayPayment = async (payload: {
  orderId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const { data } = await api.post("/payment/verify-razorpay", payload);

  return data;
};
