"use client";

import { useProductSummary } from "@/hooks/admin/analytics/useProductsAnalytics";
import {
  AlertTriangle,
  Boxes,
  DollarSign,
  Package,
  PackageCheck,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import { ErrorStateView } from "./StateViews";

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function ProductSummaryCards() {
  const { data, isLoading, error, refetch } = useProductSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
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
      title: "Total Products",
      value: data.totalProducts.toLocaleString("en-IN"),
      icon: Package,
      style: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: "Active Products",
      value: data.activeProducts.toLocaleString("en-IN"),
      icon: PackageCheck,
      style:
        "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      title: "Draft Products",
      value: data.draftProducts.toLocaleString("en-IN"),
      icon: Boxes,
      style:
        "text-slate-600 bg-slate-100 dark:bg-slate-800/60 dark:text-slate-400",
    },
    {
      title: "Out Of Stock",
      value: data.outOfStockProducts.toLocaleString("en-IN"),
      icon: AlertTriangle,
      style: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400",
    },
    {
      title: "Low Stock Alert",
      value: data.lowStockProducts.toLocaleString("en-IN"),
      icon: AlertTriangle,
      style:
        "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400",
    },
    {
      title: "Products Sold",
      value: data.productsSold.toLocaleString("en-IN"),
      icon: ShoppingBag,
      style:
        "text-violet-600 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-400",
    },
    {
      title: "Total Revenue",
      value: formatINR(data.totalRevenue),
      icon: DollarSign,
      style: "text-teal-600 bg-teal-50 dark:bg-teal-950/40 dark:text-teal-400",
    },
    {
      title: "Estimated Profit",
      value: formatINR(data.estimatedProfit),
      icon: TrendingUp,
      style:
        "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 dark:text-indigo-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
