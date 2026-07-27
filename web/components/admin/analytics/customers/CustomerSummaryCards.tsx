"use client";

import { useCustomerSummary } from "@/hooks/admin/analytics/useCustomerAnalytics";
import {
  Activity,
  Award,
  Calendar,
  DollarSign,
  UserCheck,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { ErrorStateView } from "./StateViews";

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function CustomerSummaryCards() {
  const { data, isLoading, error, refetch } = useCustomerSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) return <ErrorStateView error={error} onRetry={refetch} />;
  if (!data) return null;

  const cardConfig = [
    {
      title: "Total Customers",
      value: data.totalCustomers.toLocaleString("en-IN"),
      icon: Users,
      style: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: "Active Customers",
      value: data.activeCustomers.toLocaleString("en-IN"),
      icon: UserCheck,
      style:
        "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      title: "New Customers Today",
      value: data.newCustomersToday.toLocaleString("en-IN"),
      icon: Zap,
      style:
        "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400",
    },
    {
      title: "New This Week",
      value: data.newCustomersThisWeek.toLocaleString("en-IN"),
      icon: Calendar,
      style:
        "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400",
    },
    {
      title: "New This Month",
      value: data.newCustomersThisMonth.toLocaleString("en-IN"),
      icon: Calendar,
      style:
        "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400",
    },
    {
      title: "Returning Cohort",
      value: data.returningCustomers.toLocaleString("en-IN"),
      icon: UserPlus,
      style: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400",
    },
    {
      title: "Average Spend",
      value: formatINR(data.averageSpend),
      icon: DollarSign,
      style: "text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400",
    },
    {
      title: "Average CLV",
      value: formatINR(data.averageCLV),
      icon: Award,
      style: "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40 dark:text-cyan-400",
    },
    {
      title: "Avg Order Frequency",
      value: `${data.averageOrderFrequency.toFixed(1)} items`,
      icon: Activity,
      style:
        "text-violet-600 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cardConfig.map((card, i) => {
        const IconComponent = card.icon;
        return (
          <div
            key={i}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div
                className={`rounded-lg p-2 transition-transform group-hover:scale-110 ${card.style}`}
              >
                <IconComponent className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                {card.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
