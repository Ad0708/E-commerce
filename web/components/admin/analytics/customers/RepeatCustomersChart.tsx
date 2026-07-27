"use client";

import { useRepeatCustomers } from "@/hooks/admin/analytics/useCustomerAnalytics";
import { RefreshCw } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartSkeletonHeader, EmptyStateView } from "./StateViews";

export default function RepeatCustomersChart() {
  const { data, isLoading } = useRepeatCustomers();

  if (isLoading)
    return <ChartSkeletonHeader title="Repeat vs Returning Breakdown" />;
  if (!data || data.totalCustomers === 0) {
    return <EmptyStateView message="No metrics on cohort retention" />;
  }

  const chartData = [
    {
      name: "New Customers",
      value: data.newCustomers,
      percentage: data.newPercentage,
    },
    {
      name: "Returning Customers",
      value: data.returningCustomers,
      percentage: data.returningPercentage,
    },
  ];

  const COLORS = ["#0ea5e9", "#10b981"];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
          <RefreshCw className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Repeat vs Returning
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Consumer retention ratios
          </p>
        </div>
      </div>

      <div className="h-80 w-full text-xs flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any, props: any) => [
                `${Number(value).toLocaleString("en-IN")} (${props.payload.percentage.toFixed(1)}%)`,
                name,
              ]}
              contentStyle={{
                background: "#0f172a",
                borderRadius: "8px",
                border: "none",
                color: "#f8fafc",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
