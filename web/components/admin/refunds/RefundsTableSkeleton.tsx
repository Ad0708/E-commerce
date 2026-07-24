"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table"; // Adjust path as needed

interface RefundTableSkeletonProps {
  rowCount?: number;
}

export function RefundTableSkeleton({ rowCount = 5 }: RefundTableSkeletonProps) {
  // Generate an array containing row placeholders
  const skeletonRows = Array.from({ length: rowCount });

  return (
    <Table>
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
        {skeletonRows.map((_, index) => (
          <TableRow key={index} className="animate-pulse">
            {/* Refund ID Skeleton */}
            <TableCell>
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
            </TableCell>

            {/* Order Number Skeleton */}
            <TableCell>
              <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
            </TableCell>

            {/* Customer Details Skeleton */}
            <TableCell>
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded" />
                <div className="h-3 w-36 bg-slate-100 dark:bg-slate-900 rounded" />
              </div>
            </TableCell>

            {/* Refund Method Skeleton */}
            <TableCell>
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
            </TableCell>

            {/* Amount Skeleton */}
            <TableCell>
              <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded font-semibold" />
            </TableCell>

            {/* Status Badge Skeleton */}
            <TableCell>
              <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}