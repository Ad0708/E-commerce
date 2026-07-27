// components/analytics/customers/StateViews.tsx
import { AlertTriangle, RefreshCw, UserX } from "lucide-react";

interface ViewProps {
  error?: Error | null;
  onRetry?: () => void;
  message?: string;
}

export function ErrorStateView({ error, onRetry }: ViewProps) {
  return (
    <div className="flex min-h-80 w-full flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50/50 p-6 text-center dark:border-red-900/30 dark:bg-red-950/10">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-50">
        Failed to fetch customer metrics
      </h3>
      <p className="mt-1 max-w-xs text-xs text-slate-500 dark:text-slate-400">
        {error?.message ||
          "An unexpected error occurred while connecting to the analytics engine data stream."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white shadow transition-all hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          <RefreshCw className="h-3 w-3" />
          Retry Connection
        </button>
      )}
    </div>
  );
}

export function EmptyStateView({
  message = "No customer analytics available",
}: ViewProps) {
  return (
    <div className="flex min-h-80 w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-slate-900">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <UserX className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-medium text-slate-900 dark:text-slate-50">
        {message}
      </h3>
      <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
        No active user actions match the analytical tracking filters at this
        window.
      </p>
    </div>
  );
}

export function ChartSkeletonHeader({ title }: { title: string }) {
  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-5 space-y-6 dark:border-slate-800 dark:bg-slate-900 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 w-44 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3 w-64 rounded bg-slate-100 dark:bg-slate-800/60" />
      </div>
      <div className="h-64 w-full rounded-lg bg-slate-50 dark:bg-slate-800/30" />
    </div>
  );
}
