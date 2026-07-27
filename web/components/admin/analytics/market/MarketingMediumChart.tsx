"use client";

import { useMarketingMediumPerformance } from "@/hooks/admin/analytics/useMarketingAnalytics";
import { RefreshCw, Share2 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function MarketingMediumChart() {
  const { data, isLoading, error, refetch } = useMarketingMediumPerformance();

  if (isLoading) {
    return (
      <div className="w-full rounded-xl border border-slate-200 bg-white p-5 space-y-6 dark:border-slate-800 dark:bg-slate-900 animate-pulse">
        <div className="space-y-2">
          <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-64 rounded bg-slate-100 dark:bg-slate-800/60" />
        </div>
        <div className="h-64 w-full rounded-lg bg-slate-50 dark:bg-slate-800/30" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-100 flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Failed to render medium allocation profiles
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-xs font-semibold underline text-slate-900 dark:text-slate-100 flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
          <Share2 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Performance Mix By Medium
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Gross revenue generated across transmission mediums
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
            <XAxis dataKey="medium" tickLine={false} stroke="#94a3b8" />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              tickFormatter={formatINR}
            />
            <Tooltip
              formatter={(value: any, name: any) => [
                name === "revenue"
                  ? formatINR(Number(value))
                  : Number(value).toLocaleString("en-IN"),
                name === "revenue" ? "Revenue" : "Orders",
              ]}
              contentStyle={{
                background: "#0f172a",
                borderRadius: "8px",
                border: "none",
                color: "#f8fafc",
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar
              name="Revenue Generated"
              dataKey="revenue"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
            <Bar
              name="Orders Driven"
              dataKey="orders"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
