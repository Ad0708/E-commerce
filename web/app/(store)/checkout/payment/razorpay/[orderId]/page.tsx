"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

import { useCreateRazorpayOrder } from "@/hooks/payment/usePayment";

import RazorpayCheckout from "@/components/checkout/payment/razorpay/RazorpayCheckout";

export default function RazorpayPaymentPage() {
  const params = useParams();

  const orderId = params.orderId as string;

  const createRazorpayOrder = useCreateRazorpayOrder();

  useEffect(() => {
    if (!orderId) return;

    createRazorpayOrder.mutate(orderId);
  }, [orderId]);

  if (createRazorpayOrder.isPending) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Initializing Razorpay...
      </div>
    );
  }

  if (createRazorpayOrder.isError || !createRazorpayOrder.data) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Failed to initialize Razorpay payment.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Complete Payment</h1>

        <p className="mt-2 text-muted-foreground">
          Your order has been created successfully.
        </p>
      </div>

      <RazorpayCheckout
        orderId={orderId}
        razorpayOrder={createRazorpayOrder.data.order}
        keyId={createRazorpayOrder.data.key}
      />
    </div>
  );
}