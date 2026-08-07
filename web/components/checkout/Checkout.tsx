"use client";

import { Address } from "@/types/address";
import { PaymentMethod } from "@/types/order";
import { useState } from "react";
import AddressStep from "../address/AddressStep";
import CheckoutStepper from "./CheckoutStepper";
import NavigationButtons from "./NavigationButtons";
import PaymentStep from "./PaymentStep";
import ReviewStep from "./ReviewStep";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function Checkout() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  const nextStep = () => {
    if (step < 3) setStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const previousStep = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
    } else {
      router.push("/cart");
    }
  };

  return (
    <section className="min-h-screen bg-background">
      <div className="mx-auto max-w-370 px-4 py-6">
        <div className="mb-6">
          <button
            type="button"
            onClick={previousStep}
            className="mb-6 flex w-fit items-center gap-2 rounded-xl border border-[var(--glass-border)] px-5 py-2.5 font-bold uppercase tracking-widest transition-all hover:bg-secondary/10 hover:-translate-x-1"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div>
            <h1 className="text-4xl font-extrabold text-foreground font-heading">
              Checkout
            </h1>
            <p className="mt-2 text-base text-secondary font-medium">
              Complete your purchase in three simple steps.
            </p>
          </div>
        </div>

        <CheckoutStepper currentStep={step} />

        <div className="mt-6 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="glass-panel rounded-3xl border-[var(--glass-border)] p-6 md:p-8 shadow-sm">
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
                  address={selectedAddress || null}
                  paymentMethod={paymentMethod}
                />
              )}
            </div>

            <NavigationButtons
              step={step}
              nextStep={nextStep}
              canContinue={step === 1 ? !!selectedAddress : true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
