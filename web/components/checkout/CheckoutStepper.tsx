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
    <div className="glass-panel rounded-3xl border-[var(--glass-border)] bg-background p-6 shadow-sm">
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
                    "flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold font-heading transition-all duration-500",
                    completed && "border-[var(--accent-start)] bg-linear-to-r from-[var(--accent-start)] to-[var(--accent-end)] text-white shadow-[var(--accent-mid)]/20 shadow-lg",
                    active &&
                      "border-[var(--accent-start)] bg-[var(--accent-start)]/10 text-[var(--accent-start)]",
                    !completed &&
                      !active &&
                      "border-[var(--glass-border)] bg-background text-muted",
                  )}
                >
                  {completed ? <Check className="h-5 w-5" /> : step.id}
                </div>

                <span
                  className={clsx(
                    "mt-3 text-sm font-bold uppercase tracking-widest font-heading transition-colors",
                    active
                      ? "text-[var(--accent-start)]"
                      : "text-secondary",
                  )}
                >
                  {step.title}
                </span>

                <span className="mt-1 hidden text-xs font-medium text-muted md:block">
                  {step.description}
                </span>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="mx-4 mt-[-28px] flex-1">
                  <div className="relative h-1.5 rounded-full bg-secondary/10">
                    <div
                      className={clsx(
                        "absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-[var(--accent-start)] to-[var(--accent-end)] transition-all duration-700",
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
