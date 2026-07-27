"use client";

import { useTopSellingProducts } from "@/hooks/admin/analytics/useProductsAnalytics";
import { TrendingUp } from "lucide-react";
import {
  ProductPerformanceTable,
  TableSkeletonHeader,
} from "./ProductPerformanceTable";
import { EmptyStateView, ErrorStateView } from "./StateViews";

export default function TopSellingProducts() {
  const { data, isLoading, error, refetch } = useTopSellingProducts();

  if (isLoading) {
    return (
      <TableSkeletonHeader
        title="Top Selling Products"
        description="Highest volume performers by units sold"
      />
    );
  }
  if (error) return <ErrorStateView error={error} onRetry={refetch} />;
  if (!data || data.length === 0) {
    return <EmptyStateView message="No high volume product trends detected" />;
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 p-5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Top Selling Products
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Highest volume performers by units sold
            </p>
          </div>
        </div>
      </div>
      <ProductPerformanceTable listing={data} />
    </div>
  );
}
