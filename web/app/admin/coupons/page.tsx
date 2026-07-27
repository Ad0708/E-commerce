"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { CouponCard } from "@/components/coupon/CouponCard";
import { CouponStatsRow } from "@/components/coupon/CouponStatsRow";
import { CouponTable } from "@/components/coupon/CouponTable";

import Modal from "@/components/common/Modal";
import Pagination from "@/components/common/Pagination";
import SearchInput from "@/components/common/Search";
import {
  useCoupons,
  useDeleteCoupon,
  useUpdateCouponStatus,
} from "@/hooks/coupon/useCoupon";
import { useDebounce } from "@/hooks/useDebounce";
import { Coupon, FilterState } from "@/types/coupon";

export default function CouponListPage() {
  const router = useRouter();

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "all",
    status: "all",
    page: 1,
    limit: 5,
  });

  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [selectedDeleteCoupon, setSelectedDeleteCoupon] =
    useState<Coupon | null>(null);

  const debouncedSearch = useDebounce(filters.search, 500);

  // Data fetching
  const { data, isLoading, isError } = useCoupons({
    page: filters.page,
    search: debouncedSearch,
    type: filters.type !== "all" ? filters.type : undefined,
    status: filters.status !== "all" ? filters.status : undefined,
    limit: filters.limit,
  });

  // Mutations
  const updateStatusMutation = useUpdateCouponStatus();
  const deleteMutation = useDeleteCoupon();

  const handleStatusToggle = (coupon: Coupon) => {
    const nextStatusMap: Record<Coupon["status"], Coupon["status"]> = {
      active: "inactive",
      inactive: "active",
      scheduled: "active",
    };
    const newStatus = nextStatusMap[coupon.status];
    setUpdatingStatusId(coupon._id);

    updateStatusMutation.mutate(
      { id: coupon._id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Coupon status updated to ${newStatus}`);
          setUpdatingStatusId(null);
        },
        onError: () => {
          toast.error("Failed to alter status code");
          setUpdatingStatusId(null);
        },
      },
    );
  };

  const handleDeleteConfirm = () => {
    if (!selectedDeleteCoupon) return;

    deleteMutation.mutate(selectedDeleteCoupon._id, {
      onSuccess: () => {
        toast.success(
          `Coupon "${selectedDeleteCoupon.code}" deleted successfully`,
        );
        setSelectedDeleteCoupon(null);
      },
      onError: () => {
        toast.error("Failed to delete the voucher");
      },
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-125 text-slate-900 dark:text-slate-50 space-y-6">
      {/* Header element row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Vouchers & Coupons
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Create, manage, and audit localized discounts codes across your
            workspace stores.
          </p>
        </div>
        <button
          onClick={() => router.push("/admin/coupons/create")}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 rounded-lg shadow-sm active:scale-[0.98] transition-all"
        >
          + Create Coupon
        </button>
      </div>

      {/* Analytics stats metrics context */}
      <div className="shrink-0">
        <CouponStatsRow coupons={data?.coupons} />
      </div>

      {/* Filter interface elements line */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search stays left-aligned, full width on mobile */}
        <div className="w-full sm:w-auto">
          <SearchInput
            value={filters.search}
            onChange={(e) => setFilters((p) => ({ ...p, search: e }))}
          />
        </div>

        {/* Actions container pushed to the right on desktop, grid/wrap on mobile */}
        <div className="grid grid-cols-2 gap-3 items-center sm:flex sm:flex-wrap sm:ml-auto sm:w-auto">
          <select
            value={filters.type}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                type: e.target.value as any,
                page: 1,
              }))
            }
            className="w-full sm:w-auto px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-zinc-700 dark:text-zinc-300"
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters((p) => ({
                ...p,
                status: e.target.value as any,
                page: 1,
              }))
            }
            className="w-full sm:w-auto px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-zinc-700 dark:text-zinc-300"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="scheduled">Scheduled</option>
            <option value="expired">Expired</option>
          </select>

          {(filters.search ||
            filters.type !== "all" ||
            filters.status !== "all") && (
            <button
              onClick={() =>
                setFilters({
                  search: "",
                  type: "all",
                  status: "all",
                  page: 1,
                  limit: 5,
                })
              }
              className="col-span-2 text-center sm:text-left px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Core Content Node UI Rendering Flow */}
      {isLoading ? (
        <div className="space-y-4 flex-1 overflow-y-auto">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="p-8 text-center border border-dashed border-red-200 dark:border-red-900/50 rounded-xl bg-red-50/50 dark:bg-red-950/10 flex-1 flex items-center justify-center">
          <p className="text-red-600 dark:text-red-400 font-medium">
            Failed to retrieve data from service stream.
          </p>
        </div>
      ) : !data?.coupons || data.coupons.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 flex-1 flex items-center justify-center">
          <p className="text-zinc-500 dark:text-zinc-400 font-medium">
            No coupons matched your selected query filters.
          </p>
        </div>
      ) : (
        // This wrapper handles separating table layout and locking pagination down
        <div className="flex-1 flex flex-col justify-between min-h-100 space-y-4">
          {/* Desktop Table View */}
          <CouponTable
            coupons={data.coupons}
            updatingId={updatingStatusId}
            onStatusToggle={handleStatusToggle}
            onEdit={(id) => router.push(`/admin/coupons/edit/${id}`)}
            onDeleteRequest={(coupon) => setSelectedDeleteCoupon(coupon)}
          />
          {/* Mobile Grid/Stack View cards stack */}
          <div className="flex flex-col gap-4 md:hidden">
            {data.coupons.map((coupon) => (
              <CouponCard
                key={coupon._id}
                coupon={coupon}
                updatingId={updatingStatusId}
                onStatusToggle={handleStatusToggle}
                onEdit={(id) => router.push(`/admin/coupons/${id}/edit`)}
                onDeleteRequest={(coupon) => setSelectedDeleteCoupon(coupon)}
              />
            ))}
          </div>

          {/* Pagination bar container fixed to the bottom edge */}
          <div className="shrink-0">
            {data?.pagination && (
              <Pagination
                total={data.pagination.total ?? 0}
                page={filters.page}
                limit={filters.limit}
                totalPages={data.pagination.totalPages ?? 1}
                hasNextPage={data.pagination.hasNextPage ?? false}
                hasPreviousPage={data.pagination.hasPreviousPage ?? false}
                onPageChange={(newPage) =>
                  setFilters((p) => ({ ...p, page: newPage }))
                }
                onLimitChange={(newLimit) =>
                  setFilters((p) => ({ ...p, limit: newLimit, page: 1 }))
                }
              />
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={!!selectedDeleteCoupon}
        title="Delete Coupon"
        description="Are you sure you want to delete this voucher?"
        onClose={() => setSelectedDeleteCoupon(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
