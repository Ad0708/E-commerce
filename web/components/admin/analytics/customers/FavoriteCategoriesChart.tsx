"use client";

import { useFavoriteCategories } from "@/hooks/admin/analytics/useCustomerAnalytics";
import { Flame } from "lucide-react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartSkeletonHeader, EmptyStateView } from "./StateViews";

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function FavoriteCategoriesChart() {
  const { data, isLoading } = useFavoriteCategories();

  if (isLoading)
    return <ChartSkeletonHeader title="Favorite Categories Volume" />;
  if (!data || data.length === 0)
    return (
      <EmptyStateView message="No target product interaction history logs" />
    );

  const COLORS = ["#6366f1", "#0ea5e9", "#f59e0b", "#ec4899", "#10b981"];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex items-center gap-2">
        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400">
          <Flame className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Favorite Categories
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Gross revenue generated across item parameters
          </p>
        </div>
      </div>

      <div className="h-80 w-full text-xs flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="45%"
              outerRadius={85}
              dataKey="revenue"
              nameKey="category"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any, props: any) => [
                `${formatINR(Number(value))} (${props.payload.percentage.toFixed(1)}%)`,
                `Rev: ${name}`,
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
