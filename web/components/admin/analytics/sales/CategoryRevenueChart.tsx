"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useCategoryRevenueAnalytics } from "@/hooks/admin/analytics/useSalesAnalytics";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

// Custom Tooltip with explicit Tailwind background & border styles
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-2.5 shadow-md">
        <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-50">
          {payload[0].payload.category}
        </p>
        <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">
          {fmt(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function CategoryRevenueChart() {
  const { data, isLoading, error } = useCategoryRevenueAnalytics();

  const chartData = (data ?? []).map((item) => ({
    ...item,
    revenue: item.revenue ?? 0,
    orders: item.orders ?? 0,
    productsSold: item.productsSold ?? 0,
    percentage: item.percentage ?? 0,
  }));

  return (
    <div className="rounded-xl border border-neutral-200 dark:border-slate-800 dark:bg-slate-900 bg-white p-5 text-neutral-900 dark:text-neutral-50 shadow-sm">
      <h2 className="mb-1 text-sm font-semibold">Category Revenue</h2>
      <p className="mb-5 text-xs text-neutral-500 dark:text-neutral-400">
        Top performing product categories
      </p>

      {isLoading ? (
        <div className="space-y-4">
          <CategoryRevenueSkeleton />
        </div>
      ) : error || chartData.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
          No data available.
        </div>
      ) : (
        <>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              {/* Added a custom class name "dark" context hook wrapper just in case */}
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                {/* Instead of CSS variables, we use explicit dark-mode hex fallback strings.
                  Grid line: #e5e5e5 (light) or #262626 (dark)
                */}
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  className="text-neutral-200 dark:text-neutral-800"
                  vertical={false}
                />

                {/* Tick text: #737373 (light) or #a3a3a3 (dark) */}
                <XAxis
                  dataKey="category"
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  className="text-neutral-500 dark:text-neutral-400"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tickFormatter={fmt}
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  className="text-neutral-500 dark:text-neutral-400"
                  tickLine={false}
                  axisLine={false}
                  width={60}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: "currentColor",
                    className: "text-neutral-100/30 dark:text-neutral-800/30",
                  }}
                />
                <Bar
                  dataKey="revenue"
                  className="fill-indigo-600 dark:fill-indigo-400"
                  radius={[4, 4, 0, 0]}
                  minPointSize={4}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-left text-neutral-500 dark:text-neutral-400">
                  <th className="pb-2.5 font-medium text-left">Category</th>
                  <th className="pb-2.5 font-medium text-right">Revenue</th>
                  <th className="pb-2.5 font-medium text-right">Orders</th>
                  <th className="pb-2.5 font-medium text-right">Sold</th>
                  <th className="pb-2.5 font-medium text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/60 dark:divide-neutral-800/60">
                {chartData.map((c) => (
                  <tr
                    key={c.category}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="py-2.5 font-medium text-neutral-900 dark:text-neutral-100 text-left">
                      {c.category}
                    </td>
                    <td className="py-2.5 text-neutral-900 dark:text-neutral-100 text-right">
                      {fmt(c.revenue)}
                    </td>
                    <td className="py-2.5 text-neutral-500 dark:text-neutral-400 text-right">
                      {c.orders.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-neutral-500 dark:text-neutral-400 text-right">
                      {c.productsSold.toLocaleString()}
                    </td>
                    <td className="py-2.5 text-neutral-500 dark:text-neutral-400 text-right">
                      {c.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export function CategoryRevenueSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Simulated Bar Chart Area */}
      <div className="h-48 w-full flex flex-col justify-between pt-2">
        {/* Bar Columns Container */}
        <div className="flex-1 flex items-end justify-between gap-3 px-6 pb-4">
          {[45, 80, 60, 95, 35, 70].map((height, i) => (
            <div key={i} className="w-full flex flex-col items-center gap-2 h-full justify-end">
              <div
                className="w-full max-w-[38px] bg-slate-200 dark:bg-slate-800 rounded-t-md"
                style={{ height: `${height}%` }}
              />
            </div>
          ))}
        </div>

        {/* X-Axis Border & Label Skeletons */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between px-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-2.5 w-10 rounded bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>

      {/* Simulated Table Breakdown */}
      <div className="space-y-3 pt-2">
        {/* Table Header Row Skeleton */}
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2.5">
          <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="flex gap-8">
            <div className="h-3 w-12 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-10 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-8 rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-3 w-10 rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>

        {/* Table Data Rows Skeletons */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/50"
          >
            <div className="h-3 w-24 rounded bg-slate-100 dark:bg-slate-800/60" />
            <div className="flex gap-8">
              <div className="h-3 w-12 rounded bg-slate-100 dark:bg-slate-800/60" />
              <div className="h-3 w-10 rounded bg-slate-100 dark:bg-slate-800/60" />
              <div className="h-3 w-8 rounded bg-slate-100 dark:bg-slate-800/60" />
              <div className="h-3 w-10 rounded bg-slate-100 dark:bg-slate-800/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
