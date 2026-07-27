"use client";

import { useInfluencerPerformance } from "@/hooks/admin/analytics/useMarketingAnalytics";
import { Award, RefreshCw, Star } from "lucide-react";

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export default function InfluencerPerformanceTable() {
  const { data, isLoading, error, refetch } = useInfluencerPerformance();

  if (isLoading)
    return (
      <div className="h-48 rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 animate-pulse" />
    );

  if (error || !data) {
    return (
      <div className="flex min-h-60 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Failed to render influencer partner accounts metrics data
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
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-100 p-5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
              Influencer & Creator Performance Tracking
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Attribution overview tracking discount code conversions,
              impressions, and capital efficiency
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto max-h-100 overflow-y-auto">
        <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
          <thead className="sticky top-0 z-10 bg-slate-50 text-xs font-semibold uppercase text-slate-700 dark:bg-slate-800/80 dark:text-slate-300 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Creator / Handle
              </th>
              <th scope="col" className="px-6 py-3.5">
                Promo Code
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Follower Scale
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Investment Fee
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Orders Driven
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Gross Revenue
              </th>
              <th scope="col" className="px-6 py-3.5 text-center">
                ROI Factor
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {data.map((influencer: any) => {
              const roiVal =
                influencer.roi ||
                (influencer.cost > 0
                  ? influencer.revenue / influencer.cost
                  : 0);
              return (
                <tr
                  key={influencer.id || influencer._id || influencer.handle}
                  className="bg-white hover:bg-slate-50/70 transition-colors dark:bg-slate-900 dark:hover:bg-slate-800/50"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                        <Star className="h-3.5 w-3.5 fill-current text-amber-500" />
                      </div>
                      <span>{influencer.name || influencer.handle}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {influencer.code || influencer.promoCode || "N/A"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    {Number(influencer.followers || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-medium text-slate-900 dark:text-slate-100">
                    {formatINR(influencer.cost || influencer.spend || 0)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    {Number(influencer.orders || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-slate-900 dark:text-slate-50">
                    {formatINR(influencer.revenue)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        roiVal >= 3.0
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {roiVal.toFixed(1)}x ROI
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
