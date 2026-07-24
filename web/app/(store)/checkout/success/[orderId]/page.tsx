"use client";

import { useParams, useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params.orderId;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">
        Payment Successful 🎉
      </h1>

      <p className="mt-3">
        Your order has been placed successfully.
      </p>

      <button
        className="mt-6 rounded bg-black px-5 py-2 text-white cursor-pointer"
        onClick={() =>
          router.push(`/orders/${orderId}`)
        }
      >
        View Order
      </button>
    </div>
  );
}