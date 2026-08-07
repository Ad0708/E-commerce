"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface NavigationButtonsProps {
  step: 1 | 2 | 3;
  nextStep: () => void;
  canContinue?: boolean;
}

export default function NavigationButtons({
  step,
  nextStep,
  canContinue = true,
}: NavigationButtonsProps) {
  return (
    <div className="mt-4 flex items-center justify-end">
      {/* Continue Button */}
      {step < 3 && (
        <button
          type="button"
          onClick={nextStep}
          disabled={!canContinue}
          className="flex items-center gap-2 rounded-full bg-linear-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-8 py-4 font-bold uppercase tracking-widest text-white transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--accent-mid)]/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {step === 2 ? "Review Order" : "Continue"}
          <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
}
