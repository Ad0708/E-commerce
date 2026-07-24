"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  DollarSign,
  Loader2,
  Package,
  RefreshCcw,
  ShoppingCart,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useSalesInsights } from "@/hooks/ai/useAI";
import { SalesAnalyticsType } from "@/types/ai";

const periods: {
  label: string;
  value: SalesAnalyticsType;
}[] = [
  {
    label: "Daily",
    value: "daily",
  },
  {
    label: "Monthly",
    value: "monthly",
  },
  {
    label: "Yearly",
    value: "yearly",
  },
];

export default function SalesAnalyticsPage() {
  const [type, setType] = useState<SalesAnalyticsType>("monthly");

  const { data, isLoading, isError, error, refetch } = useSalesInsights(type);

  const analytics = data?.analytics;

  const totalRevenue = useMemo(() => {
    return (
      analytics?.revenue.reduce(
        (total, value) => total + value,
        0,
      ) ?? 0
    );
  }, [analytics]);

  const totalOrders = useMemo(() => {
    return (
      analytics?.orders.reduce(
        (total, value) => total + value,
        0,
      ) ?? 0
    );
  }, [analytics]);

  const averageOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const revenueChartData =
    analytics?.labels.map((label, index) => ({
      label,
      revenue: analytics.revenue[index] ?? 0,
    })) ?? [];

  const ordersChartData =
    analytics?.labels.map((label, index) => ({
      label,
      orders: analytics.orders[index] ?? 0,
    })) ?? [];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-IN").format(value);
  };

  return (
    <main className="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <section className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            href="/admin/ai"
            className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to AI Tools
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <BarChart3 className="h-5 w-5" />
            </div>

            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
              Sales Analytics
            </h1>
          </div>

          <p className="mt-2 max-w-2xl text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Monitor revenue, orders, performance trends, and AI-powered business insights.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex w-full items-center rounded-lg border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900/60 sm:w-fit">
          {periods.map((period) => (
            <button
              key={period.value}
              type="button"
              onClick={() => setType(period.value)}
              className={`flex-1 rounded-md px-3.5 py-1.5 text-xs font-medium transition sm:flex-none ${
                type === period.value
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </section>

      {/* Error State */}
      {isError && (
        <section className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/50 dark:bg-red-950/30">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-red-600 dark:text-red-400">
              {error instanceof Error
                ? error.message
                : "Failed to load sales analytics."}
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex w-fit items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/50 dark:bg-slate-900 dark:text-red-400 dark:hover:bg-red-950/50"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </section>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex min-h-[480px] items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex flex-col items-center gap-2.5 text-center">
            <Loader2 className="h-6 w-6 animate-spin text-slate-600 dark:text-slate-400" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Loading sales analytics...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <SummaryCard
              title="Total Revenue"
              value={formatCurrency(totalRevenue)}
              description={`For ${type} period`}
              icon={DollarSign}
              iconBg="bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
            />

            <SummaryCard
              title="Total Orders"
              value={formatNumber(totalOrders)}
              description="Orders in selected period"
              icon={ShoppingCart}
              iconBg="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
            />

            <SummaryCard
              title="Average Order Value"
              value={formatCurrency(averageOrderValue)}
              description="Revenue per order"
              icon={TrendingUp}
              iconBg="bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400"
            />
          </section>

          {/* Charts Grid */}
          <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Revenue Chart */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Revenue Trend
                  </h2>

                  <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Revenue performance over time.
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>

              <div className="h-[300px] w-full">
                {revenueChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData}>
                      <defs>
                        <linearGradient
                          id="revenueGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6366f1"
                            stopOpacity={0.35}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-slate-100 dark:stroke-slate-800"
                      />

                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        className="fill-slate-400 dark:fill-slate-500"
                      />

                      <YAxis
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        className="fill-slate-400 dark:fill-slate-500"
                        tickFormatter={(value) => `₹${value}`}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#1e293b",
                          borderRadius: "0.5rem",
                          color: "#f8fafc",
                          fontSize: "12px",
                        }}
                        formatter={(value) => formatCurrency(Number(value))}
                      />

                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366f1"
                        strokeWidth={2}
                        fill="url(#revenueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="No revenue data available." />
                )}
              </div>
            </div>

            {/* Orders Chart */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Orders Trend
                  </h2>

                  <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Number of orders over time.
                  </p>
                </div>

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <ShoppingCart className="h-4 w-4" />
                </div>
              </div>

              <div className="h-[300px] w-full">
                {ordersChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ordersChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-slate-100 dark:stroke-slate-800"
                      />

                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        className="fill-slate-400 dark:fill-slate-500"
                      />

                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        className="fill-slate-400 dark:fill-slate-500"
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#0f172a",
                          borderColor: "#1e293b",
                          borderRadius: "0.5rem",
                          color: "#f8fafc",
                          fontSize: "12px",
                        }}
                      />

                      <Bar
                        dataKey="orders"
                        radius={[4, 4, 0, 0]}
                        fill="#10b981"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyChart message="No order data available." />
                )}
              </div>
            </div>
          </section>

          {/* AI Insights Section */}
          <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Sparkles className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  AI Business Insights
                </h2>

                <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  AI-powered analysis of your sales performance.
                </p>
              </div>
            </div>

            {data?.insights ? (
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-900/30">
                <div className="space-y-3">
                  {data.insights.split("\n").map((line, index) => {
                    const trimmedLine = line.trim();

                    if (!trimmedLine) {
                      return <div key={index} className="h-1" />;
                    }

                    if (trimmedLine.startsWith("###")) {
                      return (
                        <h3
                          key={index}
                          className="pt-2 text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-100"
                        >
                          {trimmedLine.replace(/^###\s*/, "")}
                        </h3>
                      );
                    }

                    if (trimmedLine.startsWith("##")) {
                      return (
                        <h3
                          key={index}
                          className="pt-2 text-sm font-semibold text-slate-900 dark:text-slate-100"
                        >
                          {trimmedLine.replace(/^##\s*/, "")}
                        </h3>
                      );
                    }

                    if (trimmedLine.startsWith("- ")) {
                      return (
                        <div
                          key={index}
                          className="flex gap-2.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                          <p>{trimmedLine.replace(/^-\s*/, "")}</p>
                        </div>
                      );
                    }

                    return (
                      <p
                        key={index}
                        className="text-xs leading-relaxed text-slate-600 dark:text-slate-300"
                      >
                        {trimmedLine}
                      </p>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No AI insights available.
              </p>
            )}
          </section>
        </>
      )}
    </main>
  );
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconBg,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/60">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </p>

          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <Package className="mx-auto h-7 w-7 text-slate-400 dark:text-slate-600" />
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {message}
        </p>
      </div>
    </div>
  );
}