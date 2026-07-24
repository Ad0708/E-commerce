"use client";

import { useDiscountAnalytics } from "@/hooks/admin/analytics/useSalesAnalytics";
import { Tag } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function DiscountAnalytics() {
  const { data, isLoading, error } = useDiscountAnalytics();
  const items = data
    ? [
        {
          label: "Total Discount",
          value: fmt(data.totalDiscount),
          sub: "All discounts combined",
          accent: "text-amber-500",
        },
        {
          label: "Product Discount",
          value: fmt(data.productDiscount),
          sub: "Direct product markdowns",
          accent: "text-orange-500",
        },
        {
          label: "Coupon Discount",
          value: fmt(data.couponDiscount),
          sub: "Coupon code savings",
          accent: "text-yellow-500",
        },
        {
          label: "Coupon Usage Rate",
          value: `${data.couponUsageRate}%`,
          sub: "Orders using a coupon",
          accent: "text-lime-500",
        },
      ]
    : [];

  return (
    /* Outer card styling completely preserved per your request, added max-w-md to control width stretching */
    <div className="bg-card p-6 border border-slate-200 bg-white rounded-2xl dark:border-slate-800 dark:bg-slate-900 max-w-md min-w-full">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2">
        <Tag className="h-4 w-4 text-amber-500" />
        <div>
          <h2 className="text-sm font-semibold text-foreground">Discounts</h2>
          <p className="text-xs text-muted-foreground">
            Savings and coupon performance
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-6 w-20 animate-pulse rounded bg-muted/60" />
              <div className="h-3 w-24 animate-pulse rounded bg-muted/40" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-muted/30" />
            </div>
          ))}
        </div>
      ) : error || !data ? (
        <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
          No data available.
        </div>
      ) : (
        /* The Layout Fix: Inner borders removed, structural spacing and a elegant divider added */
        <div className="relative grid grid-cols-2 gap-x-12 gap-y-5">
          {/* Subtle Vertical Center Divider Line */}
          <div className="absolute inset-y-0 left-1/2 w-px bg-border/40 dark:bg-zinc-800/60 -translate-x-1/2 hidden sm:block" />

          {items.map(({ label, value, sub, accent }) => (
            <div key={label} className="flex flex-col min-w-0">
              {/* Clean text sizing hierarchy without internal container boxes */}
              <p className={`text-xl font-bold tracking-tight ${accent}`}>
                {value}
              </p>
              <p className="text-xs font-semibold text-foreground mt-0.5">
                {label}
              </p>
              <p className="text-[11px] text-muted-foreground tracking-normal truncate">
                {sub}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
