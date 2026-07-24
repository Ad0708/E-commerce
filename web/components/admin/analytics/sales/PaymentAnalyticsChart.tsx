"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { usePaymentAnalytics } from "@/hooks/admin/analytics/useSalesAnalytics";

const COLORS = [
  "hsl(var(--chart-2, 195 85% 45%))", // Ocean Blue / Deep Cyan
  "hsl(var(--chart-3, 325 75% 55%))", // Vibrant Rose / Pink
  "hsl(var(--chart-4, 155 70% 40%))", // Emerald Green
  "hsl(var(--chart-5, 275 75% 55%))", // Deep Amethyst Purple
  "hsl(var(--chart-6, 42 95% 50%))", // Golden Honey / Amber
  "hsl(var(--chart-7, 175 80% 38%))", // Rich Teal
  "hsl(var(--chart-8, 215 90% 55%))", // Vivid Electric Royal Blue
  "hsl(var(--chart-1, 14 90% 55%))", // Coral / Warm Terracotta
];

const getColor = (i: number) => COLORS[i % COLORS.length] ?? COLORS[0];

const LABELS: Record<string, string> = {
  STRIPE: "Stripe",
  RAZORPAY: "Razorpay",
  COD: "Cash on Delivery",
  "": "Others",
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

export function PaymentAnalyticsChart() {
  const { data = [], isLoading, error } = usePaymentAnalytics();
  const chartData = data.map((item) => ({
    ...item,
    method: item.method && item.method.trim() !== "" ? item.method : "Others",
  }));
  return (
    <div className="bg-card p-6 border border-slate-200 bg-white rounded-2xl dark:border-slate-800 dark:bg-slate-900 max-w-md min-w-full">
      <h2 className="mb-1 text-sm font-semibold text-foreground">
        Payment Methods
      </h2>

      <p className="mb-5 text-xs text-muted-foreground">
        Revenue by payment gateway
      </p>

      {isLoading ? (
        <div className="h-56 w-full animate-pulse rounded-lg bg-muted" />
      ) : error ? (
        <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
          No data available.
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
          No payment data yet.
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="revenue"
                nameKey="method"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
              >
                {chartData.map((item, index) => (
                  <Cell key={item.method} fill={getColor(index)} />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => fmt(Number(value))}
                contentStyle={{ fontSize: 12 }}
              />

              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-4 space-y-2">
            {data.map((item, index) => (
              <div
                key={item.method}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      background: getColor(index),
                    }}
                  />

                  <span className="text-muted-foreground">
                    {LABELS[item.method] ?? item.method ?? "Others"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">
                    {fmt(item.revenue)}
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
