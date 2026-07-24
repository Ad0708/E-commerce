"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-hot-toast";

import { useVerifyRazorpayPayment } from "@/hooks/payment/usePayment";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

interface Props {
  orderId: string;
  keyId: string;
  razorpayOrder: RazorpayOrder;
}

export default function RazorpayCheckout({
  orderId,
  keyId,
  razorpayOrder,
}: Props) {
  const router = useRouter();

  const opened = useRef(false);

  const verifyPayment = useVerifyRazorpayPayment();

  useEffect(() => {
    if (opened.current) return;

    opened.current = true;

    const loadCheckout = async () => {
      if (!window.Razorpay) {
        const script = document.createElement("script");

        script.src = "https://checkout.razorpay.com/v1/checkout.js";

        script.async = true;

        document.body.appendChild(script);

        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject();
        });
      }

      const razorpay = new window.Razorpay({
        key: keyId,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        order_id: razorpayOrder.id,

        name: "Your Store",

        description: "Order Payment",

        handler: async (response: any) => {
          verifyPayment.mutate(
            {
              orderId,

              razorpay_order_id: response.razorpay_order_id,

              razorpay_payment_id: response.razorpay_payment_id,

              razorpay_signature: response.razorpay_signature,
            },
            {
              onSuccess: () => {
                toast.success("Payment successful.");

                router.replace(`/checkout/success/${orderId}`);
              },

              onError: (error: any) => {
                toast.error(
                  error?.response?.data?.message ||
                    "Payment verification failed.",
                );
              },
            },
          );
        },

        modal: {
          ondismiss: () => {
            router.back();
          },
        },

        theme: {
          color: "#000000",
        },
      });

      razorpay.open();
    };

    loadCheckout().catch(() => {
      toast.error("Failed to load Razorpay Checkout.");
    });
  }, []);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="space-y-4 text-center">
        <h2 className="text-xl font-semibold">
          Redirecting to Razorpay...
        </h2>

        <p className="text-muted-foreground">
          Please wait while we open the secure payment window.
        </p>
      </div>
    </div>
  );
}