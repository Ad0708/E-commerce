import { OrderSummaryType } from "@/types/order";

interface OrderSummaryProps {
  summary: OrderSummaryType;
}

export default function OrderSummary({ summary }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-3.5">
      <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight pb-2 border-b border-zinc-100 dark:border-zinc-800/60">
        Price Summary
      </h4>

      <div className="flex justify-between items-center text-sm text-zinc-500 dark:text-zinc-400">
        <span>Subtotal ({summary.itemCount} items)</span>
        <span className="font-medium text-zinc-800 dark:text-zinc-200">
          ₹{summary.subtotal.toFixed(2)}
        </span>
      </div>

      {summary.discount > 0 && (
        <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-500">
          <span>Discount Applied</span>
          <span className="font-medium">-₹{summary.discount.toFixed(2)}</span>
        </div>
      )}

      {summary.couponDiscount > 0 && (
        <div className="flex justify-between items-center text-sm text-green-600 dark:text-green-500">
          <span>Coupon Discount</span>
          <span className="font-medium">
            -₹{summary.couponDiscount.toFixed(2)}
          </span>
        </div>
      )}

      {summary.deliveryCharge > 0 ? (
        <div className="flex justify-between items-center text-sm text-zinc-900 dark:text-zinc-100">
          <span>Delivery Charge</span>
          <span className="font-medium">
            ₹{summary.deliveryCharge.toFixed(2)}
          </span>
        </div>
      ) : (
        <div className="flex justify-between items-center text-sm text-zinc-900 dark:text-zinc-100">
          <span>Delivery Charge</span>
          <span className="font-medium">Free</span>
        </div>
      )}

      {summary.savings > 0 && (
        <div className="flex justify-between items-center text-xs bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-3 py-1.5 rounded-lg font-medium">
          <span>Your Total Savings</span>
          <span>-₹{summary.savings.toFixed(2)}</span>
        </div>
      )}

      <div className="flex justify-between items-center pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-base font-bold text-zinc-900 dark:text-zinc-100">
        <span>Grand Total</span>
        <span className="text-lg font-extrabold text-blue-600 dark:text-blue-500">
          ₹{summary.total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
