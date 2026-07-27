"use client";

import { useCampaignPerformance } from "@/hooks/admin/analytics/useMarketingAnalytics";
import { Megaphone, RefreshCw } from "lucide-react";

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function CampaignPerformanceTable() {
  const { data, isLoading, error, refetch } = useCampaignPerformance();

  if (isLoading)
    return <TableSkeletonView title="Active Campaigns Attribution Matrix" />;

  if (error || !data) {
    return (
      <div className="flex min-h-65 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Error rendering database campaign assets logs
        </p>
        <button
          onClick={() => refetch()}
          className="mt-2 text-xs font-semibold underline text-slate-900 dark:text-slate-100 flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 p-5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
            <Megaphone className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Active Campaigns Attribution Matrix
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Financial conversion diagnostics grouped by marketing campaign
              identifiers
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto max-h-110 overflow-y-auto">
        <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Campaign Name
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Orders Driven
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Average Order Value
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Gross Revenue Yield
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {data.map((row: any, idx: number) => (
              <tr
                key={row.campaign || idx}
                className="bg-white hover:bg-slate-50/70 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800/50"
              >
                <td className="whitespace-nowrap px-6 py-4 font-mono font-semibold text-slate-950 dark:text-slate-50">
                  {row.campaign || "Unassigned / General"}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-900 dark:text-slate-100">
                  {Number(row.orders || 0).toLocaleString("en-IN")}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  {formatINR(row.averageOrderValue || 0)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                  {formatINR(row.revenue || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TableSkeletonView({ title }: { title: string }) {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 space-y-4 dark:border-slate-800 dark:bg-slate-900 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-4 w-48 rounded bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="space-y-2 pt-2">
        <div className="h-10 w-full rounded bg-slate-50 dark:bg-slate-800/20" />
        <div className="h-10 w-full rounded bg-slate-50 dark:bg-slate-800/20" />
      </div>
    </div>
  );
}
