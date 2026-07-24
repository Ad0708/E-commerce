import Image from "next/image";
import OrderStatusBadge from "./OrderStatusBadge";
import { Order } from "@/types/order";
import { User, Mail, ShieldAlert } from "lucide-react";

interface OrderDetailsProps {
  order: Order & { customerEmail?: string };
}

export default function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Upper Status Cards Summary layout */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex flex-wrap justify-between items-center gap-4 shadow-sm">
        <div className="space-y-1">
          <p className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase">System ID</p>
          <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 select-all">{order._id}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-400">Current Milestone State:</span>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Grid Layout Framework */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Core Products Packaging Container columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight pb-4 border-b border-zinc-100 dark:border-zinc-800/60 mb-4">
              Order Items Breakdown ({order.items.length})
            </h3>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {order.items.map((item, idx) => {
                const itemPrice = item.discountPrice ?? item.price;
                return (
                  <div key={`${item.productId}-${idx}`} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-50">
                      <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">{item.name}</h4>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium uppercase tracking-wider">{item.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">${(itemPrice * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">${itemPrice.toFixed(2)} × {item.quantity}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* User Context & Logistics parameters right sidebar column */}
        <div className="space-y-6">
          {/* Customer profiles details box */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
              Customer Parameters
            </h4>
            <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              <p className="flex items-center gap-2 font-medium">
                <User size={14} className="text-zinc-400" /> {order.shippingAddress.fullName}
              </p>
              <p className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                <Mail size={14} className="text-zinc-400" /> {order.customerEmail || "No bound account profile"}
              </p>
            </div>
          </div>

          {/* Logistics distribution destinations shipping configurations box */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
              Logistics Destination Delivery Address
            </h4>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
              <p className="font-semibold text-zinc-900 dark:text-zinc-100">{order.shippingAddress.fullName}</p>
              <p className="text-xs font-medium pb-1">Tel: {order.shippingAddress.phone}</p>
              <p className="border-t border-zinc-50 dark:border-zinc-800/40 pt-1 text-zinc-800 dark:text-zinc-200">{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p className="text-xs font-bold tracking-wide text-zinc-400 dark:text-zinc-500 uppercase pt-0.5">
                {order.shippingAddress.country} — {order.shippingAddress.pincode}
              </p>
            </div>
          </div>

          {/* Payment gateway references box */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
              Transaction Details
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-zinc-400">Method:</span><span className="font-semibold font-mono text-xs">{order.payment.method}</span></div>
              <div className="flex justify-between"><span className="text-zinc-400">Status:</span><span className="font-semibold text-xs">{order.payment.status}</span></div>
              {order.payment.transactionId && (
                <div className="pt-2 border-t border-zinc-50 dark:border-zinc-800/40">
                  <span className="block text-[10px] text-zinc-400 uppercase">Gateway Reference ID</span>
                  <span className="block font-mono text-xs text-zinc-700 dark:text-zinc-300 truncate mt-0.5 select-all">{order.payment.transactionId}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing calculations details block summary parameters */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
              Ledger Accounting Summary
            </h4>
            <div className="space-y-2 text-sm text-zinc-500 dark:text-zinc-400">
              <div className="flex justify-between"><span>Subtotal Total</span><span className="font-medium text-zinc-800 dark:text-zinc-200">${order.summary.subtotal.toFixed(2)}</span></div>
              {order.summary.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-${order.summary.discount.toFixed(2)}</span></div>}
              {order.summary.savings > 0 && <div className="flex justify-between text-xs bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded text-green-700 dark:text-green-400 font-medium"><span>Platform Savings</span><span>-${order.summary.savings.toFixed(2)}</span></div>}
              <div className="flex justify-between items-center text-zinc-900 dark:text-zinc-100 font-bold pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-base">
                <span>Grand Total</span>
                <span className="text-lg font-extrabold text-blue-600 dark:text-blue-500">${order.summary.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}