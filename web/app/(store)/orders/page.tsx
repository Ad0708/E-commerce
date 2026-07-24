"use client";

import { useMyOrders } from "@/hooks/order/useOrder";
import OrderCard from "@/components/orders/OrderCard";
import OrderSkeleton from "@/components/orders/OrderSkeleton";
import EmptyOrders from "@/components/orders/EmptyOrders";
import { AlertCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function OrdersListingPage() {
  // data matches GetOrdersResponse signature: { orders: Order[] }
  const { data, isLoading, isError, error, refetch } = useMyOrders();
  const ordersList = data?.orders ?? [];

  // Sort latest orders first safely client-side
  const sortedOrders = [...ordersList].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-10 sm:px-6 lg:px-8 min-h-screen">
      {/* Page Header */}
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
      >
        <ArrowLeft
          size={16}
          className="transition-transform group-hover:-translate-x-1"
        />
        Back to Home
      </Link>
      <div className="flex items-center gap-3.5 mb-8 mt-3">
        <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/10">
          <ShoppingBag size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage your recent purchases, view delivery milestones, and view
            invoice history.
          </p>
        </div>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50/40 p-5 dark:border-red-950/40 dark:bg-red-950/10 max-w-xl mx-auto text-center space-y-4">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
            <AlertCircle size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-900 dark:text-red-400">
              Failed to load orders
            </h3>
            <p className="text-xs text-red-600 dark:text-red-500/80 mt-1">
              {error?.message ||
                "An unexpected error occurred while loading your history manifest."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            className="px-4 py-2 text-xs font-semibold bg-white border rounded-xl text-zinc-700 shadow-sm hover:bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300"
          >
            Retry Sync
          </button>
        </div>
      )}

      {/* Conditional Rendering Blocks */}
      {isLoading && <OrderSkeleton />}

      {!isLoading && !isError && sortedOrders.length === 0 && <EmptyOrders />}

      {!isLoading && !isError && sortedOrders.length > 0 && (
        <div className="space-y-4">
          {sortedOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </main>
  );
}
