"use client";

import { useLeastSellingProducts } from "@/hooks/admin/analytics/useProductsAnalytics";
import { ShoppingBag } from "lucide-react";
import { ProductPerformanceTable, TableSkeletonHeader } from "./ProductPerformanceTable";
import { EmptyStateView, ErrorStateView } from "./StateViews";

export default function LeastSellingProducts() {
  const { data, isLoading, error, refetch } = useLeastSellingProducts();

  if (isLoading) {
    return (
      <TableSkeletonHeader
        title="Least Selling Products"
        description="Stagnant or low volume storefront units"
      />
    );
  }
  if (error) return <ErrorStateView error={error} onRetry={refetch} />;
  if (!data || data.length === 0) {
    return <EmptyStateView message="No inventory performance degradation logs" />;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 p-5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Least Selling Products
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Stagnant or low volume storefront units
            </p>
          </div>
        </div>
      </div>
      <ProductPerformanceTable listing={data} />
    </div>
  );
}