"use client";

import { useRefunds } from "@/hooks/admin/admin-refund/useRefunds";
import { RefundTable } from "@/components/admin/refunds/RefundsTable";
import { RefundTableSkeleton } from "@/components/admin/refunds/RefundsTableSkeleton";
import Pagination from "@/components/common/Pagination";
import { useState } from "react";
import SearchInput from "@/components/common/Search";
import { useDebounce } from "@/hooks/useDebounce";

export default function RefundsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [refundMethod, setRefundMethod] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useRefunds({
    page,
    limit,
    search: debouncedSearch,
    status,
    refundMethod,
  });

  const refunds = data?.refunds || [];
  const pagination = data?.pagination || {};

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-124 text-slate-900 dark:text-slate-50 overflow-hidden">
      {/* Page Header */}
      <div className="shrink-0 pb-5">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Refund Management
        </h1>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Review, approve, or decline incoming customer wallet and payment
          refund requests.
        </p>
      </div>

      {/* Controls Area: Search & Filters (Responsive Layout) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 pb-5">
        {/* Search Input takes full width on mobile, auto width on desktop */}
        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e)}
            placeholder="Search refunds..."
          />
        </div>

        {/* Filters Section: Stacks vertically on mobile, rows up on desktop */}
        <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
          <select
            value={refundMethod}
            onChange={(e) => setRefundMethod(e.target.value)}
            className="w-full sm:w-40 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="">All Methods</option>
            <option value="WALLET">Wallet</option>
            <option value="STRIPE">Stripe</option>
            <option value="RAZORPAY">Razorpay</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-40 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="">All Statuses</option>
            <option value="REQUESTED">Requested</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Content Area (Clean White Background) */}
      <div className="flex-1 min-h-0 flex flex-col rounded-xl">
        {isLoading ? (
          <div className="flex-1 overflow-hidden">
            <RefundTableSkeleton />
          </div>
        ) : (
          <>
            {/* Scrollable table container */}
            <div className="flex-1">
              <RefundTable refunds={refunds} />
            </div>

            {/* Sticky Pagination Panel */}
            {pagination && (
              <div className="shrink-0 border-t border-zinc-100 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 z-10">
                <Pagination
                  page={pagination.page}
                  total={pagination.total}
                  totalPages={pagination.totalPages}
                  limit={pagination.limit}
                  hasNextPage={pagination.hasNextPage}
                  hasPreviousPage={pagination.hasPreviousPage}
                  onPageChange={(page) => setPage(page)}
                  onLimitChange={(limit) => setLimit(limit)}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
