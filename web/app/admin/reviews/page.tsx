"use client";

import { useState } from "react";
import { useGetAdminReviewedProducts } from "@/hooks/admin/useAdminReviews";
import SearchInput from "@/components/common/Search";
import Pagination from "@/components/common/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import ReviewsTable from "@/components/admin/reviews/ReviewsTable";

export default function AdminReviewsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useGetAdminReviewedProducts({
    page,
    limit,
    search: debouncedSearch,
  });

  const apiData = data || {
    pagination: {
      total: 0,
      totalPages: 1,
      page: 1,
      limit: 10,
      hasNext: false,
      hasPrevious: false,
    },
  };

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center text-sm font-medium text-red-500">
        Failed to load reviewed products. Please check server connections.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-10rem)] min-h-124 text-slate-900 dark:text-slate-50">
        {/* ============ FIXED TOP WRAPPER (Header + Filters) ============ */}
        <div className="shrink-0 space-y-4 pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Manage your store products and reviews
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 w-full md:max-w-md">
              <SearchInput
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
                placeholder="Search products by name..."
              />
            </div>
          </div>
        </div>

        {/* ============ SCROLLABLE MAIN CONTENT (Table) ============ */}
        <ReviewsTable data={data} isLoading={isLoading} />

        {/* ============ FIXED BOTTOM WRAPPER (Pagination) ============ */}
        <div className="shrink-0 pt-4">
          <Pagination
            page={apiData.pagination.page}
            totalPages={apiData.pagination.totalPages}
            limit={apiData.pagination.limit}
            total={apiData.pagination.total}
            hasNextPage={apiData.pagination.hasNext}
            hasPreviousPage={apiData.pagination.hasPrevious}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
      </div>
    </>
  );
}
