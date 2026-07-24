"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast"; // or your preferred toast lib

import { CouponForm } from "@/components/coupon/CouponForm"; // adjust path
import { useCreateCoupon } from "@/hooks/coupon/useCoupon"; // adjust path
import type { CouponFormValues } from "@/lib/validators/coupon.schema"; // adjust path

export default function CreateCouponPage() {
  const router = useRouter();
  const { mutate: createCoupon, isPending } = useCreateCoupon();

  const handleSubmit = (data: CouponFormValues) => {
    createCoupon(data, {
      onSuccess: () => {
        toast.success("Coupon created successfully!");
        router.push("/admin/coupons");
      },
      onError: (error: Error) => {
        toast.error(
          error?.message ?? "Failed to create coupon. Please try again.",
        );
      },
    });
  };

  return (
    // FIX 1: Change w-full to max-w-full and add min-w-0 to anchor viewport width constraints
    <div className="w-full max-w-7xl mx-auto min-w-0 overflow-x-hidden p-4 sm:p-6">
      <div className=" w-full min-w-0">
        {/* Page header */}
        <div className="mb-7 w-full min-w-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-colors mb-4"
          >
            <svg
              className="w-4 h-4 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span className="truncate">Back to Coupons</span>
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 truncate">
            Create Coupon
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 wrap-break-words">
            Define a discount code and configure how it applies to orders.
          </p>
        </div>

        {/* Form Container */}
        {/* FIX 2: Force container isolation so internal inputs can never push layout walls outward */}
        <div className="w-full min-w-0 overflow-x-hidden">
          <CouponForm
            onSubmit={handleSubmit}
            loading={isPending}
            onCancel={() => router.push("/admin/coupons")}
          />
        </div>
      </div>
    </div>
  );
}
