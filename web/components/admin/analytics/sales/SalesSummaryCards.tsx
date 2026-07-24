"use client";

import { useSalesSummary } from "@/hooks/admin/analytics/useSalesAnalytics";
import {
  TrendingUp,
  ShoppingCart,
  Tag,
  CalendarClock,
  CalendarRange,
  CalendarDays,
  RotateCcw,
  Wallet,
  ChartBar,
  IndianRupee,
  History,
  ArrowUpRight,
} from "lucide-react";

const fmtINR = (n?: number) => `₹${(n ?? 0).toLocaleString("en-IN")}`;
const fmtCount = (n?: number) => (n ?? 0).toLocaleString();

export function SalesSummaryCards() {
  const { data, isLoading, error } = useSalesSummary();

  if (isLoading) return <SkeletonLoader />;
  if (error || !data) return <ErrorState />;

  const getVal = (key: string): number => {
    const v = data[key as keyof typeof data];
    return typeof v === "number" ? v : 0;
  };

  return (
    <div className="space-y-8 select-none antialiased">
      {/* SECTION 1: HERO METRICS (Primary Focus) */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {/* Total Revenue */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-200 dark:border-slate-800/50 group hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-bl-full blur-xl pointer-events-none transition-transform group-hover:scale-110 duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase font-mono">
              Total Revenue
            </span>
            <div className="rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 p-2.5 text-emerald-600 dark:text-emerald-400 group-hover:rotate-6 transition-transform duration-300">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-5 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 break-all font-sans">
              {fmtINR(getVal("totalRevenue"))}
            </h2>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-medium">
            <span>All-time accumulated</span>
            <span className="font-mono text-[10px] uppercase bg-slate-100 dark:bg-slate-800/50 dark:text-slate-400 px-2 py-0.5 rounded-md">
              Live
            </span>
          </div>
        </div>

        {/* Total Volume */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-200 dark:border-slate-800/50 group hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-bl-full blur-xl pointer-events-none transition-transform group-hover:scale-110 duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase font-mono">
              Total Volume
            </span>
            <div className="rounded-2xl bg-blue-500/10 dark:bg-blue-500/20 p-2.5 text-blue-600 dark:text-blue-400 group-hover:rotate-6 transition-transform duration-300">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-5 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 break-all font-sans">
              {fmtCount(getVal("totalOrders"))}
            </h2>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-medium">
            <span>Successful checkouts</span>
            <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 bg-blue-500/5 dark:bg-blue-500/10 px-2 py-0.5 rounded-md">
              Orders
            </span>
          </div>
        </div>

        {/* Net Profit */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-200 dark:border-slate-800/50 group hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 dark:bg-purple-500/10 rounded-bl-full blur-xl pointer-events-none transition-transform group-hover:scale-110 duration-500" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-bold tracking-widest text-purple-600 dark:text-purple-400 uppercase font-mono">
              Net Takeaway
            </span>
            <div className="rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 p-2.5 text-purple-600 dark:text-purple-400 group-hover:rotate-6 transition-transform duration-300">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-5 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 break-all font-sans">
              {fmtINR(getVal("netProfit"))}
            </h2>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/40 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-medium">
            <span>Gross minus write-offs</span>
            <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400 bg-purple-500/5 dark:bg-purple-500/10 px-2 py-0.5 rounded-md">
              Cleared
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 2: PERFORMANCE METRIC MATRIX (Middle Tier) */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Gross Profit",
            val: getVal("grossProfit"),
            icon: TrendingUp,
            fmt: fmtINR,
            bg: "bg-emerald-500/[0.08] dark:bg-emerald-500/10",
            iconColor: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Avg. Order Value",
            val: getVal("averageOrderValue"),
            icon: ChartBar,
            fmt: fmtINR,
            bg: "bg-indigo-500/[0.08] dark:bg-indigo-500/10",
            iconColor: "text-indigo-600 dark:text-indigo-400",
          },
          {
            label: "Discounts Issued",
            val: getVal("totalDiscount"),
            icon: Tag,
            fmt: fmtINR,
            bg: "bg-amber-500/[0.08] dark:bg-amber-500/10",
            iconColor: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "Refunds Issued",
            val: getVal("totalRefundAmount"),
            icon: RotateCcw,
            fmt: fmtINR,
            bg: "bg-rose-500/[0.08] dark:bg-rose-500/10",
            iconColor: "text-rose-600 dark:text-rose-400",
          },
        ].map((c, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between rounded-2xl bg-white dark:bg-slate-900 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.02)] dark:shadow-none border border-slate-200 dark:border-slate-800/50"
          >
            <div className="space-y-1 min-w-0">
              <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono truncate">
                {c.label}
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100 font-sans truncate">
                {c.fmt(c.val)}
              </p>
            </div>
            <div className={`rounded-xl p-2.5 shrink-0 ml-2 ${c.bg}`}>
              <c.icon className={`h-4 w-4 ${c.iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 3: TIMEFRAME ANCHORED CHRONO ANALYTICS */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/50 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.04)] dark:shadow-none p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100 dark:border-slate-800/40">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Periodic Progression Matrix
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Sales velocity and operational flow tracked across core corporate
              timelines.
            </p>
          </div>
          <div className="inline-flex items-center text-xs font-mono font-bold text-slate-400 dark:text-slate-500 gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-800/40 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
            <span>UTC Sync Active</span>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {[
            {
              title: "Today",
              rev: "todayRevenue",
              ord: "todayOrders",
              icon: CalendarDays,
            },
            {
              title: "Yesterday",
              rev: "yesterdayRevenue",
              ord: "yesterdayOrders",
              icon: History,
            },
            {
              title: "This Week",
              rev: "weekRevenue",
              ord: "weekOrders",
              icon: CalendarRange,
            },
            {
              title: "This Month",
              rev: "monthRevenue",
              ord: "monthOrders",
              icon: CalendarDays,
            },
            {
              title: "This Year",
              rev: "yearRevenue",
              ord: "yearOrders",
              icon: CalendarClock,
            },
          ].map((t) => (
            <div
              key={t.title}
              className="group relative rounded-2xl bg-slate-50 dark:bg-slate-950/40 p-4 border border-slate-200/50 dark:border-slate-800/30 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-800/80 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                <div className="flex items-center gap-1.5 truncate">
                  <t.icon className="h-3.5 w-3.5 opacity-60 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors" />
                  <span className="truncate">{t.title}</span>
                </div>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />
              </div>

              <div className="mt-4 space-y-1 min-w-0">
                <div className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-slate-50 truncate font-sans">
                  {fmtINR(getVal(t.rev))}
                </div>
                <div className="text-xs text-slate-400 dark:text-slate-500 truncate font-medium flex items-center gap-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {fmtCount(getVal(t.ord))}
                  </span>
                  <span>orders</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Top 3 Cards */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        ))}
      </div>

      {/* Middle 4 Mini Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        ))}
      </div>

      {/* Bottom Large Card */}
      <div className="h-56 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800" />
    </div>
  );
}

function ErrorState() {
  return (
    <div className="rounded-3xl bg-rose-50 dark:bg-rose-950/20 p-8 text-center border border-rose-100 dark:border-rose-900/30">
      <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
        Could not load comprehensive sales analytics summary dashboard metrics.
      </p>
    </div>
  );
}
