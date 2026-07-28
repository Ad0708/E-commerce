"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  orderId: string;
}

export default function StripeCheckout({ orderId }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    const { error } = await stripe.confirmPayment({
      elements,

      confirmParams: {
        return_url: `${window.location.origin}/checkout/success/${orderId}`,
      },

      redirect: "if_required",
    });

    if (error) {
      setError(error.message || "Payment failed.");
      setLoading(false);
      return;
    }

    router.push(`/checkout/success/${orderId}`);
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <form onSubmit={handleSubmit} className="space-y-6">
        <PaymentElement />

        {error && (
          <div className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full rounded-lg bg-black px-5 py-3 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {loading ? "Processing Payment..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}
