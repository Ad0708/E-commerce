"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { useOrderStatusAnalytics } from "@/hooks/admin/analytics/useSalesAnalytics";
import React from "react";

const STATUS_COLORS: Record<string, string> = {
  Pending: "hsl(45 90% 55%)",
  Confirmed: "hsl(220 80% 60%)",
  Processing: "hsl(262 75% 60%)",
  Shipped: "hsl(190 70% 50%)",
  "Out For Delivery": "hsl(25 90% 55%)",
  Delivered: "hsl(150 65% 45%)",
  Cancelled: "hsl(0 75% 55%)",
};

const FALLBACK_COLORS: string[] = [
  "hsl(220 80% 60%)",
  "hsl(150 65% 45%)",
  "hsl(45 90% 55%)",
  "hsl(0 75% 55%)",
  "hsl(262 75% 60%)",
  "hsl(190 70% 50%)",
  "hsl(25 90% 55%)",
];

const getColor = (status: string, i: number): string =>
  STATUS_COLORS[status] ??
  FALLBACK_COLORS[i % FALLBACK_COLORS.length] ??
  FALLBACK_COLORS[0];
export function OrderStatusChart() {
  const { data = [], isLoading, error } = useOrderStatusAnalytics();

  const chartData = React.useMemo(() => {
    const total = data.reduce((sum, item) => sum + item.orders, 0);

    return data.map((item) => ({
      ...item,
      percentage:
        total === 0 ? 0 : Number(((item.orders / total) * 100).toFixed(1)),
    }));
  }, [data]);

  return (
    <div className="bg-card p-6 border border-slate-200 bg-white rounded-2xl dark:border-slate-800 dark:bg-slate-900 max-w-md min-w-full">
      <h2 className="mb-1 text-sm font-semibold text-foreground">
        Order Status
      </h2>

      <p className="mb-5 text-xs text-muted-foreground">
        Distribution across all statuses
      </p>

      {isLoading ? (
        <div className="h-56 w-full animate-pulse rounded-lg bg-muted" />
      ) : error ? (
        <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
          No data available.
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
          No order status data yet.
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="orders"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
              >
                {chartData.map((item, index) => (
                  <Cell key={item.status} fill={getColor(item.status, index)} />
                ))}
              </Pie>

              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {chartData.map((item, index) => (
              <div
                key={item.status}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: getColor(item.status, index),
                    }}
                  />

                  <span className="text-muted-foreground">{item.status}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">
                    {item.orders.toLocaleString()}
                  </span>

                  <span className="w-10 text-right text-muted-foreground">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
