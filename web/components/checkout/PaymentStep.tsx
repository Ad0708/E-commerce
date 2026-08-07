"use client";

import { Banknote, CreditCard, Landmark } from "lucide-react";

import { PaymentMethod } from "@/types/order";

interface PaymentStepProps {
  paymentMethod: PaymentMethod;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod>>;
}

const paymentMethods = [
  {
    id: "COD",
    title: "Cash on Delivery",
    description: "Pay when your order is delivered.",
    icon: Banknote,
  },
  {
    id: "STRIPE",
    title: "Stripe",
    description: "Pay using Stripe.",
    icon: CreditCard,
  },
  {
    id: "RAZORPAY",
    title: "Razorpay",
    description: "Pay using Razorpay.",
    icon: Landmark,
  },
] as const;

export default function PaymentStep({
  paymentMethod,
  setPaymentMethod,
}: PaymentStepProps) {
  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h2 className="text-3xl font-extrabold text-foreground font-heading">
          Payment Method
        </h2>

        <p className="mt-2 text-base font-medium text-secondary">
          Choose your preferred payment method.
        </p>
      </div>

      {/* Payment Options */}
      <div className="space-y-4">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          const selected = paymentMethod === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => setPaymentMethod(method.id)}
              className={`w-full rounded-3xl border p-5 transition-all duration-300 ${
                selected
                  ? "border-[var(--accent-start)] bg-[var(--accent-start)]/5 shadow-md shadow-[var(--accent-mid)]/10"
                  : "border-[var(--glass-border)] bg-background hover:border-muted hover:shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Left */}
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
                      selected
                        ? "bg-linear-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-white shadow-lg shadow-[var(--accent-mid)]/20"
                        : "bg-secondary/10 text-secondary"
                    }`}
                  >
                    <Icon size={24} />
                  </div>

                  <div className="text-left">
                    <h3 className="text-lg font-bold text-foreground font-heading">
                      {method.title}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-secondary">
                      {method.description}
                    </p>
                  </div>
                </div>

                {/* Radio */}
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                    selected
                      ? "border-[var(--accent-start)]"
                      : "border-[var(--glass-border)]"
                  }`}
                >
                  {selected && (
                    <div className="h-3 w-3 rounded-full bg-[var(--accent-start)]" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Payment Info */}
      <div className="rounded-2xl border border-[var(--accent-start)]/20 bg-[var(--accent-start)]/5 p-4">
        <p className="text-sm font-medium text-[var(--accent-start)]">
          <span className="font-bold">Selected:</span>{" "}
          {paymentMethods.find((m) => m.id === paymentMethod)?.title}
        </p>
      </div>
    </div>
  );
}
