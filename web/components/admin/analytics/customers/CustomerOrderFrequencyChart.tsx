"use client";

import { useOrderFrequency } from "@/hooks/admin/analytics/useCustomerAnalytics";
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
import { ChartSkeletonHeader, EmptyStateView } from "./StateViews";

export default function CustomerOrderFrequencyChart() {
  const { data, isLoading } = useOrderFrequency();

  if (isLoading)
    return <ChartSkeletonHeader title="Order Frequency Distribution" />;
  if (!data || data.length === 0)
    return <EmptyStateView message="No distribution metrics available" />;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg bg-violet-50 p-2 text-violet-600 dark:bg-violet-950/30 dark:text-violet-400">
          <BarChart3 className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Order Frequency Distribution
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Customer breakdown by transaction velocity density
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
            <XAxis
              dataKey="range"
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
            />
            <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" />
            <Tooltip
              formatter={(value: any, _: any, props: any) => [
                `${Number(value).toLocaleString("en-IN")} (${props.payload.percentage.toFixed(1)}%)`,
                "Volume",
              ]}
              contentStyle={{
                background: "#0f172a",
                borderRadius: "8px",
                border: "none",
                color: "#f8fafc",
              }}
            />
            <Bar
              dataKey="customers"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              maxBarSize={45}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
