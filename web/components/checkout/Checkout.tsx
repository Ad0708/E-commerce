"use client";

import { useState } from "react";
import CheckoutStepper from "./CheckoutStepper";
import AddressStep from "../address/AddressStep";
import PaymentStep from "./PaymentStep";
import ReviewStep from "./ReviewStep";
import NavigationButtons from "./NavigationButtons";
import OrderSummary from "./OrderSummary";
import { Address } from "@/types/address";
import { PaymentMethod } from "@/types/order";

export default function Checkout() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  const nextStep = () => {
    if (step < 3) setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const previousStep = () => {
    if (step > 1) setStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  return (
    <section className="min-h-screen bg-slate-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Checkout
          </h1>

          <p className="mt-2 text-slate-500">
            Complete your purchase in three simple steps.
          </p>
        </div>

        <CheckoutStepper currentStep={step} />

        <div className="mt-10 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-2xl border bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {step === 1 && (
                <AddressStep
                  selectedAddress={selectedAddress}
                  setSelectedAddress={setSelectedAddress}
                />
              )}

              {step === 2 && (
                <PaymentStep
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
              )}

              {step === 3 && (
                <ReviewStep
                  address= {selectedAddress || null}
                  paymentMethod={paymentMethod}
                />
              )}
            </div>

            <NavigationButtons
              step={step}
              nextStep={nextStep}
              previousStep={previousStep}
              canContinue={
                step === 1 ? !!selectedAddress : true
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}