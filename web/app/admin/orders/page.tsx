"use client";

import { useState } from "react";
import { useAdminOrders } from "@/hooks/adminorders/useAdminOrders";
import { AdminOrderFilters } from "@/api/adminorders";
import OrderFilters from "@/components/admin/orders/OrderFilters";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import Pagination from "@/components/common/Pagination";
import UpdateOrderStatus from "@/components/admin/orders/UpdateOrderStatus";
import OrderSkeleton from "@/components/orders/OrderSkeleton";
import { Shield, AlertTriangle, RefreshCcw, Inbox } from "lucide-react";
import { Order } from "@/types/order";

export default function AdminOrdersListingPage() {
  const [filters, setFilters] = useState<AdminOrderFilters>({
    page: 1,
    limit: 5,
    search: undefined,
    status: undefined,
    year: undefined,
    month: undefined,
    startDate: undefined,
    endDate: undefined,
  });


  const [activeUpdateModalOrder, setActiveUpdateModalOrder] =
    useState<Order | null>(null);

  const { data, isLoading, isError, error, refetch } = useAdminOrders(filters);

  const handleFilterChange = (newFilters: Partial<AdminOrderFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const ordersList = data?.orders ?? [];
  const pagination = data?.pagination;

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-125 text-slate-900 dark:text-slate-50 space-y-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-zinc-800 dark:text-zinc-200 shadow-sm shrink-0">
            <Shield size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
              Order Fulfillment Center
            </h1>
            <p className="text-md text-zinc-500 dark:text-zinc-400 mt-0.5">
              Comprehensive control station for managing system transactions,
              pipeline shifts, and tracking logistics.
            </p>
          </div>
        </div>
      </div>

      {/* Control Filter Section */}
      <OrderFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Exceptions Panel */}
      {isError && (
        <div className="max-w-md mx-auto p-6 rounded-2xl border border-red-200 bg-red-50/30 text-center space-y-4 dark:border-red-950/40 dark:bg-red-950/10 my-auto">
          <div className="h-10 w-10 mx-auto bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center text-red-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-red-900 dark:text-red-400">
              Data Fetch Interrupted
            </h4>
            <p className="text-xs text-red-600 dark:text-red-500/80 mt-1">
              {error?.message || "Internal system sync exception."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-white border border-zinc-200 rounded-xl text-zinc-700 shadow-sm hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
          >
            <RefreshCcw size={12} /> Re-establish Pipeline
          </button>
        </div>
      )}

      {/* Loading Block */}
      {isLoading && <OrderSkeleton />}

      {/* Empty State */}
      {!isLoading && !isError && ordersList.length === 0 && (
        <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-md mx-auto bg-zinc-50/40 dark:bg-zinc-900/10 my-auto">
          <Inbox
            className="mx-auto text-zinc-300 dark:text-zinc-700 mb-3"
            size={32}
          />
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-200">
            No Query Matches
          </h4>
          <p className="text-xs text-zinc-500 mt-1">
            No execution parameters match your current tracking configurations.
          </p>
        </div>
      )}

      {/* Core Table View Layer */}
      {!isLoading && !isError && ordersList.length > 0 && (
        /* flex-1 lets this content area scale fluidly to push the pagination footer neatly down */
        <div className="flex-1 flex flex-col justify-between h-full space-y-3">
          <OrdersTable
            orders={ordersList}
            onOpenUpdateStatusModal={(order) =>
              setActiveUpdateModalOrder(order)
            }
          />

          {pagination && (
            <div className="">
              <Pagination
                page={filters.page ?? 1}
                total={pagination.total ?? 0}
                totalPages={pagination.totalPages ?? 1}
                limit={filters.limit ?? 5}
                hasNextPage={pagination.hasNextPage ?? false}
                hasPreviousPage={pagination.hasPreviousPage ?? false}
                onPageChange={(newPage) =>
                  handleFilterChange({ page: newPage })
                }
                onLimitChange={(newLimit) =>
                  handleFilterChange({ limit: newLimit, page: 1 })
                }
              />
            </div>
          )}
        </div>
      )}

      {/* Status Adjustment Modal */}
      {activeUpdateModalOrder && (
        <UpdateOrderStatus
          order={activeUpdateModalOrder}
          onClose={() => setActiveUpdateModalOrder(null)}
        />
      )}
    </div>
  );
}
