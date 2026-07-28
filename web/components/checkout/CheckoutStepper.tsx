"use client";

import clsx from "clsx";
import { Check } from "lucide-react";

interface CheckoutStepperProps {
  currentStep: 1 | 2 | 3;
}

const steps = [
  {
    id: 1,
    title: "Address",
    description: "Shipping address",
  },
  {
    id: 2,
    title: "Payment",
    description: "Choose payment",
  },
  {
    id: 3,
    title: "Review",
    description: "Review & place order",
  },
] as const;

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const completed = currentStep > step.id;
          const active = currentStep === step.id;

          return (
            <div
              key={step.id}
              className={clsx(
                "flex flex-1 items-center",
                index === steps.length - 1 && "flex-none",
              )}
            >
              {/* Step */}
              <div className="flex flex-col items-center text-center">
                <div
                  className={clsx(
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
                    completed && "border-blue-600 bg-blue-600 text-white",
                    active &&
                      "border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950",
                    !completed &&
                      !active &&
                      "border-gray-300 bg-white text-gray-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-400",
                  )}
                >
                  {completed ? <Check className="h-5 w-5" /> : step.id}
                </div>

                <span
                  className={clsx(
                    "mt-3 text-sm font-semibold",
                    active
                      ? "text-blue-600"
                      : "text-gray-700 dark:text-gray-300",
                  )}
                >
                  {step.title}
                </span>

                <span className="mt-1 hidden text-xs text-gray-500 md:block">
                  {step.description}
                </span>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="mx-4 mt-[-28px] flex-1">
                  <div className="relative h-1 rounded-full bg-gray-200 dark:bg-zinc-700">
                    <div
                      className={clsx(
                        "absolute left-0 top-0 h-full rounded-full bg-blue-600 transition-all duration-500",
                        currentStep > step.id ? "w-full" : "w-0",
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
