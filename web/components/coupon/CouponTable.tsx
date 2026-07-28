import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table"; // Replace with your actual import path
import { Coupon } from "@/types/coupon";
import { Edit3, Trash2 } from "lucide-react";
import React from "react";
import { CouponStatusBadge } from "./CouponStatusBadge";

interface TableProps {
  coupons: Coupon[];
  updatingId: string | null;
  onStatusToggle: (coupon: Coupon) => void;
  onEdit: (id: string) => void;
  onDeleteRequest: (coupon: Coupon) => void;
}

export const CouponTable: React.FC<TableProps> = ({
  coupons,
  updatingId,
  onStatusToggle,
  onEdit,
  onDeleteRequest,
}) => {
  return (
    <Table className="min-w-full min-h-40"  containerClassName="max-h-[calc(100vh-23.7rem)]">
      <TableHeader className="sticky top-0 z-10 bg-white dark:bg-zinc-950">
        <TableRow>
          <TableHead>Code</TableHead>
          <TableHead>Type & Value</TableHead>
          <TableHead>Applies To</TableHead>
          <TableHead>Usage</TableHead>
          <TableHead>Valid Until</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {coupons.map((coupon) => {
          const isExpired = new Date(coupon.expiryDate) < new Date();

          return (
            <TableRow key={coupon._id}>
              {/* Code */}
              <TableCell>
                <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50 bg-zinc-50/40 dark:bg-zinc-900 px-3 py-1.5 rounded border border-zinc-200 dark:border-zinc-800 inline-block">
                  {coupon.code}
                </span>
              </TableCell>

              {/* Type & Value */}
              <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                {coupon.type === "percentage"
                  ? `${coupon.value}% off`
                  : `₹${coupon.value} off`}
              </TableCell>

              {/* Applies To */}
              <TableCell className="capitalize">{coupon.appliesTo}</TableCell>

              {/* Usage */}
              <TableCell>
                {coupon.usedCount} / {coupon.usageLimit ?? "∞"}
              </TableCell>

              {/* Valid Until */}
              <TableCell
                className={isExpired ? "text-red-500 font-semibold" : ""}
              >
                {new Date(coupon.expiryDate).toLocaleDateString()}
              </TableCell>

              {/* Status */}
              <TableCell>
                <CouponStatusBadge
                  status={coupon.status}
                  expiryDate={coupon.expiryDate}
                  isUpdating={updatingId === coupon._id}
                  onClick={() => onStatusToggle(coupon)}
                />
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="inline-flex gap-3">
                  <button
                    onClick={() => onEdit(coupon._id)}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteRequest(coupon)}
                    className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400 font-medium transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
