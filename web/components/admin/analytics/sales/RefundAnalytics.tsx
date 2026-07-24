"use client";

import { useRefundAnalytics } from "@/hooks/admin/analytics/useSalesAnalytics";
import { Undo2 } from "lucide-react";

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

interface StatusConfig {
  dot: string;
}

const STATUS_STYLES: Record<string, StatusConfig> = {
  REQUESTED: { dot: "bg-amber-500" },
  APPROVED: { dot: "bg-blue-500" },
  REJECTED: { dot: "bg-rose-500" },
  COMPLETED: { dot: "bg-emerald-500" },
};

export function RefundAnalytics() {
  const { data, isLoading, error } = useRefundAnalytics();

  const totalCount = data?.summary.totalRefunds || 1;

  return (
    <div className="bg-card p-6 border border-slate-200 bg-white rounded-2xl dark:border-slate-800 dark:bg-slate-900 max-w-md min-w-full">
      {/* Header */}
      <div className="mb-6 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
          <Undo2 className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Refunds
          </h2>
          <p className="text-xs text-muted-foreground">Breakdown by status</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="h-12 animate-pulse rounded bg-muted/60" />
            <div className="h-12 animate-pulse rounded bg-muted/60" />
          </div>
          <div className="space-y-4 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 animate-pulse rounded bg-muted/40" />
            ))}
          </div>
        </div>
      ) : error || !data ? (
        <div className="flex h-40 items-center justify-center text-xs text-muted-foreground/80">
          No data available at the moment.
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 pb-5 border-b border-border/40">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Total Requests
              </p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-foreground">
                {data.summary.totalRefunds}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Refund Volume
              </p>
              <p className="mt-0.5 text-2xl font-bold tracking-tight text-rose-500">
                {fmt(data.summary.totalRefundAmount)}
              </p>
            </div>
          </div>

          {/* Table-aligned Breakdown List */}
          <div className="space-y-3.5">
            {Object.keys(STATUS_STYLES).map((status) => {
              const existingData = data.refundAnalytics?.find(
                (s) => s.status === status,
              );
              const count = existingData ? existingData.count : 0;
              const amount = existingData ? existingData.amount : 0;

              const percentShare = Math.min(
                Math.round((count / totalCount) * 100),
                100,
              );
              const config = STATUS_STYLES[status];

              return (
                <div key={status} className="space-y-2">
                  {/* Grid Row: Guarantees everything aligns perfectly at the exact same distance */}
                  <div className="grid grid-cols-[1fr_80px_100px] items-center gap-4 text-xs">
                    {/* Column 1: Status Name */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${config.dot}`}
                      />
                      <span className="font-medium text-muted-foreground tracking-wide text-[11px] truncate">
                        {status}
                      </span>
                    </div>

                    {/* Column 2: Order Count (Fixed width alignment) */}
                    <span className="text-left text-muted-foreground/70">
                      {count} {count === 1 ? "order" : "orders"}
                    </span>

                    {/* Column 3: Currency Amount (Right-aligned to look like a clean financial ledger) */}
                    <span className="text-right font-semibold text-foreground">
                      {fmt(amount)}
                    </span>
                  </div>

                  {/* Progress Bar underlay */}
                  <div className="h-1 w-full rounded-full bg-muted/40 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${config.dot}`}
                      style={{ width: `${percentShare}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
