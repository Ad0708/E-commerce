"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import { useDownloadAdminInvoice } from "@/hooks/invoices/useInvoices";
import { Order } from "@/types/order";
import { Edit3, Eye, FileText, Layers, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import OrderStatusBadge from "./OrderStatusBadge";

interface OrdersTableProps {
  orders: (Order & { customerEmail?: string })[];
  onOpenUpdateStatusModal: (order: Order) => void;
}

export default function OrdersTable({
  orders,
  onOpenUpdateStatusModal,
}: OrdersTableProps) {
  const { mutateAsync: downloadInvoice } = useDownloadAdminInvoice();

  const [downloadingOrderId, setDownloadingOrderId] = useState<string | null>(
    null,
  );

  const downloadInvoicebtn = async (orderId: string) => {
    try {
      setDownloadingOrderId(orderId);

      await downloadInvoice(orderId);
    } catch (error) {
      console.error("Failed to download invoice:", error);
    } finally {
      setDownloadingOrderId(null);
    }
  };

  return (
    <Table containerClassName="min-h-50 md:min-h-0 max-h-[calc(100vh-25rem)]">
      <TableHeader>
        <TableRow>
          <TableHead>Order Reference</TableHead>
          <TableHead>Customer info</TableHead>
          <TableHead className="text-center">Items</TableHead>
          <TableHead>Total Amount</TableHead>
          <TableHead>Payment Strategy</TableHead>
          <TableHead>Order Status</TableHead>
          <TableHead>Created Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {orders.map((order) => {
          const formattedDate = new Date(order.createdAt).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            },
          );

          return (
            <TableRow key={order._id}>
              {/* Order Reference */}
              <TableCell className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                #{order.orderNumber}
              </TableCell>

              {/* Customer Info */}
              <TableCell>
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 max-w-45 truncate">
                  {order.customerEmail || "no-email@platform.com"}
                </p>
              </TableCell>

              {/* Items Counter Badge */}
              <TableCell className="text-center font-medium text-zinc-600 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md text-xs">
                  <Layers size={11} /> {order.summary.itemCount}
                </span>
              </TableCell>

              {/* Total Amount */}
              <TableCell className="font-extrabold text-zinc-900 dark:text-zinc-100">
                ₹{order.summary.total.toFixed(2)}
              </TableCell>

              {/* Payment Details */}
              <TableCell>
                <span className="font-medium text-zinc-800 dark:text-zinc-200 text-xs">
                  {order.payment.method}
                </span>
                <span className="block text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wide mt-0.5">
                  {order.payment.status}
                </span>
              </TableCell>

              {/* Milestone Status */}
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>

              {/* Created Date */}
              <TableCell className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                {formattedDate}
              </TableCell>

              {/* Action Operations Block */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {/* View Order */}
                  <Link
                    href={`/admin/orders/${order._id}`}
                    className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    title="View Order"
                  >
                    <Eye size={14} />
                  </Link>

                  {/* Download Invoice */}
                  <button
                    type="button"
                    onClick={() => downloadInvoicebtn(order._id)}
                    disabled={downloadingOrderId === order._id}
                    className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Download Invoice"
                  >
                    {downloadingOrderId === order._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <FileText size={14} />
                    )}
                  </button>

                  {/* Update Status */}
                  <button
                    type="button"
                    onClick={() => onOpenUpdateStatusModal(order)}
                    disabled={
                      order.status === "Delivered" ||
                      order.status === "Cancelled"
                    }
                    className="rounded-lg border border-zinc-200 p-1.5 text-zinc-600 transition hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 disabled:pointer-events-none disabled:opacity-30"
                    title="Modify Milestone Status"
                  >
                    <Edit3 size={14} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
