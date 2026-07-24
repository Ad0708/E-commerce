"use client";

import {
  useInfiniteCoupons,
  useApplyCoupon,
  useRemoveCoupon,
} from "@/hooks/coupon/useCoupon";
import { useCartStore } from "@/store/cart.store";
import { useMemo, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  X,
  Ticket,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CouponModal({ open, onClose }: Props) {
  // ALL HOOKS FIRST
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCoupons({
      limit: 10,
      status: "active",
    });

  const applyCouponMutation = useApplyCoupon();
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const removeCouponMutation = useRemoveCoupon();

  // Infinite scroll intersection trigger
  const { ref, inView } = useInView({
    threshold: 0,
  });

  // Fetch next page when bottom spinner comes into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten infinite scroll data safely
  const coupons = useMemo(() => {
    return data?.pages.flatMap((page) => page.coupons) ?? [];
  }, [data]);

  // Early return rule after hooks execution
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      {/* Modal Content Card */}
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Available Coupons
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Select a coupon code to apply to your order
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Coupons Container */}
        <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          {coupons.length === 0 && !isFetchingNextPage ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-8 w-8 text-zinc-400 mb-2" />
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                No coupons available right now.
              </p>
            </div>
          ) : (
            <>
              {coupons.map((coupon) => {
                const isApplied = appliedCoupon?.code === coupon.code;

                return (
                  <div
                    key={coupon._id}
                    className={`relative overflow-hidden rounded-xl border p-4 transition-all duration-200 ${
                      isApplied
                        ? "border-green-500 bg-green-50/50 dark:border-green-500/60 dark:bg-green-950/20 shadow-sm"
                        : "border-zinc-200 bg-zinc-50/30 hover:bg-white hover:shadow-md hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:bg-zinc-900 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left Side: Details */}
                      <div className="space-y-1.5">
                        <div className="flex items-center flex-wrap gap-2">
                          <span
                            className={`inline-block font-mono text-sm font-bold tracking-wider px-2 py-0.5 rounded border uppercase ${
                              isApplied
                                ? "bg-green-100 border-green-300 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300"
                                : "bg-zinc-100 border-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
                            }`}
                          >
                            {coupon.code}
                          </span>

                          {isApplied && (
                            <span className="flex items-center gap-1 rounded-full bg-green-600 px-2 py-0.5 text-xs font-medium text-white shadow-sm">
                              <CheckCircle2 className="h-3 w-3" />
                              Applied
                            </span>
                          )}
                        </div>

                        <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
                          {coupon.type === "percentage"
                            ? `${coupon.value}% OFF your order`
                            : `Flat ₹${coupon.value} OFF`}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                          {coupon.minimumOrderAmount > 0 && (
                            <span className="flex items-center gap-1">
                              Min. order:{" "}
                              <strong className="text-zinc-700 dark:text-zinc-300">
                                ₹{coupon.minimumOrderAmount}
                              </strong>
                            </span>
                          )}
                          {coupon.minimumOrderAmount > 0 && (
                            <span className="text-zinc-300 dark:text-zinc-700">
                              •
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 inline" />
                            Expires{" "}
                            {new Date(coupon.expiryDate).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Right Side: Action Button */}
                      <div className="sm:self-center w-full sm:w-auto">
                        {isApplied ? (
                          <button
                            onClick={() =>
                              removeCouponMutation.mutate(undefined, {
                                onSuccess: onClose,
                              })
                            }
                            disabled={
                              removeCouponMutation.isPending ||
                              applyCouponMutation.isPending
                            }
                            className="w-full sm:w-auto rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 dark:border-red-900/50 dark:bg-zinc-900 dark:text-red-400 dark:hover:bg-red-950/30 transition-all"
                          >
                            {removeCouponMutation.isPending
                              ? "Removing..."
                              : "Remove"}
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              applyCouponMutation.mutate(
                                { code: coupon.code },
                                { onSuccess: onClose },
                              )
                            }
                            disabled={
                              applyCouponMutation.isPending ||
                              removeCouponMutation.isPending
                            }
                            className="w-full sm:w-auto rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm focus:ring-2 focus:ring-zinc-500/20 disabled:opacity-50 transition-all"
                          >
                            {applyCouponMutation.isPending &&
                            applyCouponMutation.variables?.code === coupon.code
                              ? "Applying..."
                              : "Apply"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Infinite Scroll Anchor Trigger */}
              <div ref={ref} className="flex justify-center py-2">
                {isFetchingNextPage && (
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-400 dark:text-zinc-500" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
