"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; // 👇 Import the native hook
import OrderDetails from "@/components/admin/orders/OrderDetails";
import UpdateOrderStatus from "@/components/admin/orders/UpdateOrderStatus";
import { ArrowLeft, Calendar, Edit3, Loader2, RefreshCw } from "lucide-react";
import { useOrderDetails } from "@/hooks/order/useOrder";

export default function AdminOrderDetailsPage() {
  const routeParams = useParams();

  const orderId = routeParams?.orderid as string;

  const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
  
  // Now that orderId is guaranteed to exist, this query will finally trigger!
  const { data, isPending, isError, error, refetch } = useOrderDetails(orderId);

  // Safely extract order context depending on your API structure
  const order = data?.order;

  const formattedDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // Catch dynamic loading phase states
  if (isPending || !orderId) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-3">
        <Loader2 className="animate-spin text-zinc-800 dark:text-zinc-200" size={32} />
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Assembling System Documentation Context...
        </p>
      </div>
    );
  }

  // Handle genuine database resource lookup missing or api errors
  if (isError || !order || !order.createdAt) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 px-4">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Failed to fetch target system node reference parameters: {error?.message || "Resource missing from database lookup."}
        </p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100"
        >
          <ArrowLeft size={14} /> Back to Fulfillment index
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-screen space-y-6">
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 tracking-wide uppercase mb-4 transition"
        >
          <ArrowLeft size={13} /> Back to Fulfillment index
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-mono">
              Manifest #{order.orderNumber}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
              <Calendar size={13} />
              Ingested on {formattedDate}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => refetch()}
              className="p-2.5 rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 transition"
              title="Force Sync State"
            >
              <RefreshCw size={15} />
            </button>
            <button
              type="button"
              onClick={() => setShowStatusUpdateModal(true)}
              disabled={order.status === "Delivered" || order.status === "Cancelled"}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 rounded-xl transition shadow-sm disabled:opacity-40 disabled:pointer-events-none"
            >
              <Edit3 size={14} /> Update Operational Status
            </button>
          </div>
        </div>
      </div>

      <OrderDetails order={order} />

      {showStatusUpdateModal && (
        <UpdateOrderStatus
          order={order}
          onClose={() => setShowStatusUpdateModal(false)}
        />
      )}
    </main>
  );
}