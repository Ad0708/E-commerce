"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Elements } from "@stripe/react-stripe-js";

import { stripePromise } from "@/lib/stripe/stripe";
import { usecreateStripePaymentIntent } from "@/hooks/payment/usePayment";

import StripeCheckout from "@/components/checkout/payment/stripe/StripeCheckout";

export default function PaymentPage() {
  const params = useParams();

  const orderId = params.orderId as string;

  const [clientSecret, setClientSecret] = useState("");

  const createStripePaymentIntent = usecreateStripePaymentIntent();

  useEffect(() => {
    if (!orderId) return;

    createStripePaymentIntent.mutate(orderId, {
      onSuccess: (data) => {
        setClientSecret(data.clientSecret);
      },
    });
  }, [orderId]);

  if (createStripePaymentIntent.isPending) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Creating secure payment...
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        Unable to initialize payment.
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

      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: "stripe",
          },
        }}
      >
        <StripeCheckout orderId={orderId} />
      </Elements>
    </div>
  );
}