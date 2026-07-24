"use client";

import { use } from "react";
import Link from "next/link";
import { useOrderDetails } from "@/hooks/order/useOrder";
import OrderItem from "@/components/orders/OrderItem";
import OrderStatus from "@/components/orders/OrderStatus";
import OrderSummary from "@/components/orders/OrderSummary";
import ShippingAddress from "@/components/orders/ShippingAddress";
import PaymentDetails from "@/components/orders/PaymentDetails";
import CancelOrderButton from "@/components/orders/CancelOrderButton";
import { ArrowLeft, Calendar, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDownloadInvoice } from "@/hooks/invoices/useInvoices";

interface OrderDetailsPageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.orderId;

  // data matches GetOrderResponse signature: { order: Order }
  const { data, isLoading, isError, error, refetch } = useOrderDetails(orderId);
  const order = data?.order;

  const { mutate: downloadInvoice, isPending: isDownloading } =
    useDownloadInvoice();
  const formattedDate = order
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-3">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
          Loading Order Summary Details...
        </p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 px-4">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          Failed to fetch target reference info:{" "}
          {error?.message || "Order data record unavailable."}
        </p>
        <Link
          href="/orders"
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400"
        >
          <ArrowLeft size={14} /> Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-screen space-y-6">
      {/* Navigation and Top Toolbar */}
      <div>
        <Link
          href="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 tracking-wide uppercase group mb-4"
        >
          <ArrowLeft
            size={13}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back to Orders
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-mono">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
              <Calendar size={13} />
              Placed on {formattedDate}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              onClick={() => downloadInvoice(order._id)}
              disabled={isDownloading}
            >
              {isDownloading ? "Generating Invoice..." : "Download Invoice"}
            </Button>
            <button
              type="button"
              onClick={() => refetch()}
              className="p-2.5 rounded-xl border border-zinc-200 text-zinc-500 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 transition"
              title="Refresh Data"
            >
              <RefreshCw size={15} />
            </button>
            <CancelOrderButton orderId={order._id} status={order.status} />
          </div>
        </div>
      </div>

      {/* Main Responsive Layout Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Tracking Timeline & Products Panel */}
        <div className="lg:col-span-2 space-y-6">
          <OrderStatus status={order.status} />

          <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight pb-4 border-b border-zinc-100 dark:border-zinc-800/60 mb-2">
              Products ({order.items.length})
            </h3>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {order.items.map((item, idx) => (
                <OrderItem key={`${item.productId}-${idx}`} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Details Sidebar Layout Panel */}
        <div className="space-y-6">
          <ShippingAddress address={order.shippingAddress} />
          <PaymentDetails payment={order.payment} />
          <OrderSummary summary={order.summary} />
        </div>
      </div>
    </main>
  );
}
