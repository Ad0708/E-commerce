import React from "react";
import { Coupon } from "@/types/coupon";
import { CouponStatusBadge } from "./CouponStatusBadge";

interface CardProps {
  coupon: Coupon;
  updatingId: string | null;
  onStatusToggle: (coupon: Coupon) => void;
  onEdit: (id: string) => void;
  onDeleteRequest: (coupon: Coupon) => void;
}

export const CouponCard: React.FC<CardProps> = ({
  coupon,
  updatingId,
  onStatusToggle,
  onEdit,
  onDeleteRequest,
}) => {
  const isExpired = new Date(coupon.expiryDate) < new Date();

  return (
    <div className="md:hidden p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-50 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm border border-zinc-200 dark:border-zinc-700">
          {coupon.code}
        </span>
        <CouponStatusBadge
          status={coupon.status}
          expiryDate={coupon.expiryDate}
          isUpdating={updatingId === coupon._id}
          onClick={() => onStatusToggle(coupon)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <div>
          <span className="text-zinc-400 block">Value</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
            {coupon.type === "percentage" ? `${coupon.value}% off` : `$${coupon.value} off`}
          </span>
        </div>
        <div>
          <span className="text-zinc-400 block">Applies To</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100 capitalize">{coupon.appliesTo}</span>
        </div>
        <div className="mt-2">
          <span className="text-zinc-400 block">Usage Limit</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {coupon.usedCount} / {coupon.usageLimit ?? "∞"}
          </span>
        </div>
        <div className="mt-2">
          <span className="text-zinc-400 block">Valid Until</span>
          <span className={`font-medium ${isExpired ? "text-red-500 font-bold" : "text-zinc-900 dark:text-zinc-100"}`}>
            {new Date(coupon.expiryDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2 w-full pt-1">
        <button onClick={() => onEdit(coupon._id)} className="w-1/2 py-2 text-center text-sm font-medium border border-zinc-200 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors">
          Edit
        </button>
        <button onClick={() => onDeleteRequest(coupon)} className="w-1/2 py-2 text-center text-sm font-medium border border-red-200 dark:border-red-900/50 rounded-lg bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
};