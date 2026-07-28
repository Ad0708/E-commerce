"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table"; // Adjust path as needed
import { Refund } from "@/types/refund"; // Adjust path as needed

interface RefundTableProps {
  refunds: Refund[];
}

export function RefundTable({ refunds }: RefundTableProps) {
  // Helper to style status badges
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case "REQUESTED":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (!refunds || refunds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-500 dark:text-slate-400 border border-dashed rounded-2xl border-blue-100 dark:border-slate-800">
        <p className="text-sm font-medium">No refunds found.</p>
      </div>
    );
  }

  return (
    <Table className="w-full" containerClassName="max-h-[calc(100vh-23.7rem)]">
      <TableHeader>
        <TableRow>
          <TableHead>Refund ID</TableHead>
          <TableHead>Order</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {refunds.map((refund) => (
          <TableRow key={refund._id}>
            {/* Refund ID */}
            <TableCell className="font-mono text-xs text-slate-500 dark:text-slate-400">
              #{refund._id.substring(0, 8)}...
            </TableCell>

            {/* Order Number */}
            <TableCell className="font-medium text-slate-900 dark:text-white">
              {refund.orderId?.orderNumber || "N/A"}
            </TableCell>

            {/* Customer Info */}
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium text-slate-900 dark:text-white">
                  {refund.userId?.name || "Unknown User"}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500">
                  {refund.userId?.email || ""}
                </span>
              </div>
            </TableCell>

            {/* Refund Method */}
            <TableCell className="capitalize text-slate-600 dark:text-slate-300">
              {refund.refundMethod.toLowerCase().replace("_", " ")}
            </TableCell>

            {/* Amount */}
            <TableCell className="font-semibold text-slate-900 dark:text-white">
              {formatCurrency(refund.amount)}
            </TableCell>

            {/* Status Badge */}
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors ${getStatusBadgeClass(
                  refund.status,
                )}`}
              >
                {refund.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
