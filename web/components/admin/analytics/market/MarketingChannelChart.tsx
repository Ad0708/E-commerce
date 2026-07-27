"use client";

import { useMarketingChannels } from "@/hooks/admin/analytics/useMarketingAnalytics";
import { Layers, RefreshCw } from "lucide-react";
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

export default function MarketingChannelChart() {
  const { data, isLoading, error, refetch } = useMarketingChannels();

  if (isLoading)
    return (
      <ChartSkeletonHeader
        title="Acquisition Channels Performance"
        description="Attribution overview grouped by marketing channel"
      />
    );

  if (error || !data) {
    return (
      <div className="h-100 flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-5 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Could not retrieve channel conversion records
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
        <div className="rounded-lg bg-teal-50 p-2 text-teal-600 dark:bg-teal-950/30 dark:text-teal-400">
          <Layers className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Acquisition Channels Performance
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Cross-compare budget investment value alongside performance returns
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
            <XAxis dataKey="channel" tickLine={false} stroke="#94a3b8" />
            <YAxis
              tickLine={false}
              axisLine={false}
              stroke="#94a3b8"
              tickFormatter={formatINR}
            />
            <Tooltip
              formatter={(value: any) => [formatINR(Number(value)), "Value"]}
              contentStyle={{
                background: "#0f172a",
                borderRadius: "8px",
                border: "none",
                color: "#f8fafc",
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar
              name="Capital Spend"
              dataKey="spend"
              fill="#0ea5e9"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
            <Bar
              name="Attributed Revenue"
              dataKey="revenue"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChartSkeletonHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 space-y-6 dark:border-slate-800 dark:bg-slate-900 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-52 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-72 rounded bg-slate-100 dark:bg-slate-800/60" />
      </div>
      <div className="h-64 w-full rounded-lg bg-slate-50 dark:bg-slate-800/30" />
    </div>
  );
}
