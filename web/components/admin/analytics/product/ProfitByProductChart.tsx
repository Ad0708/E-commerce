"use client";

import { useProfitByProduct } from "@/hooks/admin/analytics/useProductsAnalytics";
import { DollarSign } from "lucide-react";
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

export default function ProfitByProductChart() {
  const { data, isLoading, error, refetch } = useProfitByProduct();

  if (isLoading)
    return <ChartSkeletonHeader title="Marginal Profit Profiles" />;
  if (error) return <ErrorStateView error={error} onRetry={refetch} />;
  if (!data || data.length === 0)
    return (
      <EmptyStateView message="No net returns available for optimization calculation" />
    );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
          <DollarSign className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Marginal Profit Profiles
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Estimated net yield allocations
          </p>
        </div>
      </div>

      <div className="h-80 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 5, left: 15, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#e2e8f0"
              className="dark:stroke-slate-800"
            />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              tickFormatter={formatINR}
            />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              stroke="#94a3b8"
              width={80}
            />
            <Tooltip
              formatter={(value: any) => {
                const numValue =
                  typeof value === "number" ? value : Number(value) || 0;
                return [formatINR(numValue), "Est. Profit"] as [string, string];
              }}
              contentStyle={{
                background: "#0f172a",
                borderRadius: "8px",
                border: "none",
                color: "#f8fafc",
              }}
            />
            <Bar
              dataKey="estimatedProfit"
              fill="#6366f1"
              radius={[0, 4, 4, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartSkeletonHeader({ title }: { title: string }) {
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
