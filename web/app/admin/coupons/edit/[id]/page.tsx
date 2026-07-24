"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { CouponForm } from "@/components/coupon/CouponForm"; // adjust path
import type { CouponFormValues } from "@/lib/validators/coupon.schema"; // adjust path
import { useCoupon, useUpdateCoupon } from "@/hooks/coupon/useCoupon"; // adjust path

// Skeleton loader for the edit page while data loads
function EditPageSkeleton() {
  return (
    <div className="space-y-5 animate-pulse max-w-7xl mx-auto">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
        >
          <div className="px-6 pt-5 pb-4 border-b border-gray-100 dark:border-gray-800">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-3 w-56 bg-gray-100 dark:bg-gray-800 rounded mt-2" />
          </div>
          <div className="px-6 py-5 grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="space-y-2">
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EditCouponPage() {
  const { id } = useParams<{ id: string }>();
  // console.log(id);
  const router = useRouter();

  const { data: coupon, isLoading, isError } = useCoupon(id);
  const { mutate: updateCoupon, isPending } = useUpdateCoupon();

  const handleSubmit = (data: CouponFormValues) => {
    updateCoupon(
      { id, data },
      {
        onSuccess: () => {
          router.push("/admin/coupons");
        },
        onError: (error: Error) => {
          toast.error(error?.message ?? "Failed to update coupon.");
        },
      },
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-950 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="">
        {/* Page header */}
        <div className="mb-7 ">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Coupons
          </button>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Edit Coupon
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Update the coupon details and save your changes.
          </p>
        </div>

        {/* States */}
        {isLoading && <EditPageSkeleton />}

        {isError && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              Failed to load coupon details.
            </p>
            <button
              type="button"
              onClick={() => router.push("/admin/coupons")}
              className="mt-3 text-sm text-red-500 underline"
            >
              Go back
            </button>
          </div>
        )}

        {!isLoading && !isError && coupon && (
          <CouponForm
            defaultValues={{
              code: coupon.coupon.code,
              description: coupon.coupon.description,
              type: coupon.coupon.type,
              value: coupon.coupon.value,
              minimumOrderAmount: coupon.coupon.minimumOrderAmount,
              maximumDiscount: coupon.coupon.maximumDiscount,
              usageLimit: coupon.coupon.usageLimit,
              appliesTo: coupon.coupon.appliesTo,
              products: coupon.coupon.products ?? [],
              categories: coupon.coupon.categories ?? [],
              startDate: coupon.coupon.startDate?.split("T")[0] ?? "",
              expiryDate: coupon.coupon.expiryDate?.split("T")[0] ?? "",
              status: coupon.coupon.status,
            }}
            onSubmit={handleSubmit}
            loading={isPending}
            isEdit
            onCancel={() => router.push("/admin/coupons")}
          />
        )}
      </div>
    </div>
  );
}
