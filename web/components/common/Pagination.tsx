"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  limit,
  total,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  // Safe numbers to prevent NaN rendering
  const safePage = Number(page) || 1;
  const safeLimit = Number(limit) || 5;
  const safeTotalEntries = Number(total) || 0;
  const safeTotalPages = Number(totalPages) || 1;

  // Middle Summary Logic: Calculate Start & End Entry Counts
  const startEntry =
    safeTotalEntries === 0 ? 0 : (safePage - 1) * safeLimit + 1;
  const endEntry = Math.min(safePage * safeLimit, safeTotalEntries);

  // Pagination Truncation Logic
  const getVisiblePages = () => {
    if (safeTotalPages <= 5) {
      return Array.from({ length: safeTotalPages }, (_, index) => index + 1);
    }

    if (safePage <= 3) {
      return [1, 2, 3, 4, "...", safeTotalPages];
    }

    if (safePage >= safeTotalPages - 2) {
      return [
        1,
        "...",
        safeTotalPages - 3,
        safeTotalPages - 2,
        safeTotalPages - 1,
        safeTotalPages,
      ];
    }

    return [
      1,
      "...",
      safePage - 1,
      safePage,
      safePage + 1,
      "...",
      safeTotalPages,
    ];
  };

  const visiblePages = getVisiblePages();

return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900/60 md:flex-row md:items-center md:justify-between">
      {/* Left: Show Result Selector */}
      {onLimitChange ? (
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Show result:
          </span>

          <div className="relative">
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="h-8 appearance-none rounded-lg border border-slate-200 bg-slate-50/80 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none transition hover:bg-slate-100 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:focus:border-indigo-500"
            >
              {[2, 5, 10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      ) : (
        <div />
      )}

      {/* Middle: Entry Summary Counter */}
      {total !== undefined && (
        <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">
          Showing{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {startEntry}
          </span>{" "}
          to{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {endEntry}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {safeTotalEntries}
          </span>{" "}
          entries
        </p>
      )}

      {/* Right: Soft Highlighted Pagination Buttons */}
      <div className="flex items-center justify-center gap-1">
        {/* First Page */}
        <button
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(1)}
          title="First Page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-35 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          disabled={!hasPreviousPage}
          onClick={() => onPageChange(safePage - 1)}
          title="Previous Page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-35 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {visiblePages.map((pageNumber, index) => {
            if (pageNumber === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-8 w-7 items-center justify-center text-xs text-slate-400 dark:text-slate-500"
                >
                  ...
                </span>
              );
            }

            const isCurrent = safePage === pageNumber;

            return (
              <button
                key={`page-${pageNumber}`}
                type="button"
                onClick={() => onPageChange(pageNumber as number)}
                className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg px-2 text-xs transition ${
                  isCurrent
                    ? "border border-indigo-500/80 bg-indigo-50 font-bold text-indigo-600 shadow-xs dark:border-indigo-500/80 dark:bg-indigo-950/40 dark:text-indigo-400"
                    : "border border-slate-200 bg-white font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(safePage + 1)}
          title="Next Page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-35 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          disabled={!hasNextPage}
          onClick={() => onPageChange(safeTotalPages)}
          title="Last Page"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-35 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
