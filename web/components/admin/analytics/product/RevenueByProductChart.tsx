"use client";

import { useRevenueByProduct } from "@/hooks/admin/analytics/useProductsAnalytics";
import { BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EmptyStateView, ErrorStateView } from "./StateViews";

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function RevenueByProductChart() {
  const { data, isLoading, error, refetch } = useRevenueByProduct();

  if (isLoading)
    return <ChartSkeletonHeader title="Revenue Volume By Product" />;
  if (error) return <ErrorStateView error={error} onRetry={refetch} />;
  if (!data || data.length === 0)
    return <EmptyStateView message="No commercial sales ledger logs" />;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg bg-teal-50 p-2 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400">
          <BarChart3 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Revenue Volume By Product
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Gross transaction distributions per variant
          </p>
        </div>
      </div>

      <div className="h-80 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
              className="dark:stroke-slate-800"
            />
            <XAxis dataKey="name" tickLine={false} stroke="#94a3b8" />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              tickFormatter={formatINR}
            />
            <Tooltip
              formatter={(value: any) => {
                const numValue =
                  typeof value === "number" ? value : Number(value) || 0;
                return [formatINR(numValue), "Gross Revenue"] as [
                  string,
                  string,
                ];
              }}
              contentStyle={{
                background: "#0f172a",
                borderRadius: "8px",
                border: "none",
                color: "#f8fafc",
              }}
            />
            <Bar
              dataKey="revenue"
              fill="#0ea5e9"
              radius={[4, 4, 0, 0]}
              maxBarSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ChartSkeletonHeader({ title }: { title: string }) {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 space-y-6 dark:border-slate-800 dark:bg-slate-900 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-44 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-64 rounded bg-slate-100 dark:bg-slate-800/60" />
      </div>
      <div className="h-64 w-full rounded-lg bg-slate-50 dark:bg-slate-800/30" />
    </div>
  );
}
