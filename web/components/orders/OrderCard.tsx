"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Layers } from "lucide-react";
import clsx from "clsx";
import { Order } from "@/types/order";

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getStatusBadgeStyle = (status: Order["status"]) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700 ring-green-600/10 dark:bg-green-500/10 dark:text-green-400";
      case "Cancelled":
        return "bg-red-50 text-red-700 ring-red-600/10 dark:bg-red-500/10 dark:text-red-400";
      case "Pending":
      case "Confirmed":
      case "Processing":
        return "bg-amber-50 text-amber-700 ring-amber-600/10 dark:bg-amber-500/10 dark:text-amber-400";
      default:
        return "bg-blue-50 text-blue-700 ring-blue-600/10 dark:bg-blue-500/10 dark:text-blue-400";
    }
  };

  return (
    <div className="group border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/40">
        <div className="space-y-0.5">
          <p className="text-[10px] font-mono tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
            Order Reference
          </p>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-mono">
            #{order.orderNumber}
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
            <Calendar size={13} className="text-zinc-400" />
            {formattedDate}
          </div>
          <span
            className={clsx(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
              getStatusBadgeStyle(order.status)
            )}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Main Content Preview */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-[240px] sm:max-w-xs">
            {order.items.slice(0, 3).map((item, idx) => (
              <div
                key={`${item.productId}-${idx}`}
                className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="h-14 w-14 shrink-0 flex items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-400">
                +{order.items.length - 3}
              </div>
            )}
          </div>

          <div className="space-y-0.5 pl-3 border-l border-zinc-100 dark:border-zinc-800">
            <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1 font-medium">
              <Layers size={12} />
              {order.summary.itemCount} {order.summary.itemCount === 1 ? "Item" : "Items"}
            </div>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              via <span className="font-semibold text-zinc-700 dark:text-zinc-300">{order.payment.method}</span>
            </p>
          </div>
        </div>

        <div className="flex sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 dark:border-zinc-800">
          <div className="text-left sm:text-right">
            <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Total Price</p>
            <p className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 mt-0.5">
              ${order.summary.total.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Button Action */}
      <div className="px-5 pb-5 pt-1 flex justify-end">
        <Link
          href={`/orders/${order._id}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-zinc-900 font-semibold text-xs transition duration-200 dark:bg-zinc-800/40 dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-100"
        >
          View Details
          <ArrowRight size={13} className="text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}