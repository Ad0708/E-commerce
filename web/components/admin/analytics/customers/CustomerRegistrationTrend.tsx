"use client";

import { useCustomerTrend } from "@/hooks/admin/analytics/useCustomerAnalytics";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartSkeletonHeader, EmptyStateView } from "./StateViews";

type TrendType = "daily" | "monthly" | "yearly";

export default function CustomerRegistrationTrend() {
  const [type, setType] = useState<TrendType>("daily");
  const { data, isLoading } = useCustomerTrend(type);

  if (isLoading)
    return <ChartSkeletonHeader title="Customer Registration Trend" />;
  if (!data || !data.labels || data.labels.length === 0) {
    return <EmptyStateView message="No acquisition history logs found" />;
  }

  const chartData = data.labels.map((label, idx) => ({
    name: label,
    customers: data.customers[idx] || 0,
  }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
            <UserPlus className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Customer Registration Trend
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Inbound velocity variations of target traffic
            </p>
          </div>
        </div>

        <div className="flex rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800">
          {(["daily", "monthly", "yearly"] as TrendType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-all ${
                type === t
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-50"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -15, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
              className="dark:stroke-slate-800"
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
            />
            <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" />
            <Tooltip
              formatter={(value: any) => [
                Number(value).toLocaleString("en-IN"),
                "Acquisitions",
              ]}
              contentStyle={{
                background: "#0f172a",
                borderRadius: "8px",
                border: "none",
                color: "#f8fafc",
              }}
            />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#0ea5e9"
              strokeWidth={2.5}
              activeDot={{ r: 6 }}
              dot={{ r: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
