"use client";

import { useMarketingOverview } from "@/hooks/admin/analytics/useMarketingAnalytics";
import {
  DollarSign,
  Megaphone,
  RefreshCw,
  Share2,
  ShoppingBag,
} from "lucide-react";

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function MarketingOverviewCards() {
  const { data, isLoading, error, refetch } = useMarketingOverview();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-30 items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-5 dark:border-red-900/30 dark:bg-red-950/10">
        <div className="text-center space-y-2">
          <p className="text-sm font-medium text-red-800 dark:text-red-400">
            Failed to fetch marketing overview metrics
          </p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold underline text-red-600 dark:text-red-400"
          >
            <RefreshCw className="h-3 w-3" /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Exact type cast mapping to API keys
  const overview = data as {
    totalCampaigns: number;
    totalOrders: number;
    totalRevenue: number;
    totalSources: number;
  };

  const cards = [
    {
      title: "Total Marketing Revenue",
      value: formatINR(overview.totalRevenue || 0),
      icon: DollarSign,
      style:
        "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      title: "Attributed Orders",
      value: (overview.totalOrders || 0).toLocaleString("en-IN"),
      icon: ShoppingBag,
      style: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      title: "Active Campaigns",
      value: (overview.totalCampaigns || 0).toLocaleString("en-IN"),
      icon: Megaphone,
      style:
        "text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400",
    },
    {
      title: "Marketing Channels",
      value: (overview.totalSources || 0).toLocaleString("en-IN"),
      icon: Share2,
      style:
        "text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
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
