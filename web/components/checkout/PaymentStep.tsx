"use client";

import { Banknote, CreditCard, Landmark, Smartphone } from "lucide-react";

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
  // {
  //   id: "UPI",
  //   title: "UPI",
  //   description: "Pay using Google Pay, PhonePe, Paytm, BHIM, etc.",
  //   icon: Smartphone,
  // },
  // {
  //   id: "CARD",
  //   title: "Credit / Debit Card",
  //   description: "Visa, MasterCard, RuPay and more.",
  //   icon: CreditCard,
  // },
  // {
  //   id: "NET_BANKING",
  //   title: "Net Banking",
  //   description: "Pay securely using your bank account.",
  //   icon: Landmark,
  // },
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Payment Method
        </h2>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
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
              className={`w-full rounded-2xl border p-5 transition-all duration-300 ${
                selected
                  ? "border-blue-600 bg-blue-50 shadow-md dark:border-blue-500 dark:bg-blue-950/20"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
              }`}
            >
              <div className="flex items-center justify-between">
                {/* Left */}
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      selected
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-300"
                    }`}
                  >
                    <Icon size={24} />
                  </div>

                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {method.title}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {method.description}
                    </p>
                  </div>
                </div>

                {/* Radio */}
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
                    selected
                      ? "border-blue-600"
                      : "border-gray-300 dark:border-zinc-600"
                  }`}
                >
                  {selected && (
                    <div className="h-3 w-3 rounded-full bg-blue-600" />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Payment Info */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/20">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <span className="font-semibold">Selected:</span>{" "}
          {paymentMethods.find((m) => m.id === paymentMethod)?.title}
        </p>
      </div>
    </div>
  );
}
