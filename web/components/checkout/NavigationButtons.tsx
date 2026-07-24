"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  step: 1 | 2 | 3;
  nextStep: () => void;
  previousStep: () => void;
  canContinue?: boolean;
}

export default function NavigationButtons({
  step,
  nextStep,
  previousStep,
  canContinue = true,
}: NavigationButtonsProps) {
  return (
    <div className="mt-8 flex items-center justify-between">
      {/* Back Button */}
      <button
        type="button"
        onClick={previousStep}
        disabled={step === 1}
        className="flex items-center gap-2 rounded-xl border border-gray-300 px-6 py-3 font-medium transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Continue Button */}
      {step < 3 && (
        <button
          type="button"
          onClick={nextStep}
          disabled={!canContinue}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {step === 2 ? "Review Order" : "Continue"}
          <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
}