"use client";

import { Tag, Truck } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { useCart } from "@/hooks/cart/useCart";

interface OrderSummaryProps {
  onPlaceOrder?: () => void;
  loading?: boolean;
}

export default function OrderSummary({
  onPlaceOrder,
  loading = false,
}: OrderSummaryProps) {
  useCart();

  const items = useCartStore((s) => s.items);
  const summary = useCartStore((s) => s.cart?.summary);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);

  const finalSummary = summary ?? {
    subtotal: 0,
    discount: 0,
    couponDiscount: 0,
    deliveryCharge: 0,
    total: 0,
    itemCount: 0,
    savings: 0,
  };

  const deliveryCharge = finalSummary.deliveryCharge ?? 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4">
        {/* Items */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Items</span>
          <span className="font-medium">
            {finalSummary.itemCount}
          </span>
        </div>

        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Subtotal</span>
          <span className="font-medium">
            ₹{finalSummary.subtotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Product Discount */}
        {finalSummary.discount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <Tag size={16} />
              <span>Discount</span>
            </div>

            <span className="font-medium text-green-600">
              -₹{finalSummary.discount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Coupon Discount */}
        {appliedCoupon && finalSummary.couponDiscount > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-green-600">
              <Tag size={16} />
              <span>Coupon ({appliedCoupon.code})</span>
            </div>

            <span className="font-medium text-green-600">
              -₹{finalSummary.couponDiscount.toLocaleString("en-IN")}
            </span>
          </div>
        )}

        {/* Delivery */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Truck size={16} />
            <span>Delivery</span>
          </div>

          {deliveryCharge === 0 ? (
            <span className="font-medium text-green-600">
              FREE
            </span>
          ) : (
            <span className="font-medium">
              ₹{deliveryCharge.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        <hr className="border-gray-200 dark:border-zinc-700" />

        {/* Total */}
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total</span>

          <span className="text-blue-600">
            ₹{finalSummary.total.toLocaleString("en-IN")}
          </span>
        </div>

        {/* Savings */}
        {finalSummary.savings > 0 && (
          <div className="rounded-xl bg-green-50 p-3 text-center text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
            🎉 You saved ₹
            {finalSummary.savings.toLocaleString("en-IN")} on this order
          </div>
        )}

        {/* Paid Delivery Message */}
        {deliveryCharge > 0 && (
          <div className="rounded-xl bg-yellow-50 p-3 text-center text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
            Delivery charge of ₹
            {deliveryCharge.toLocaleString("en-IN")} has been added to your
            order.
          </div>
        )}

        {/* Place Order */}
        <button
          type="button"
          disabled={items.length === 0 || loading}
          onClick={onPlaceOrder}
          className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>

        <p className="text-center text-xs text-gray-500">
          By placing your order, you agree to our Terms & Conditions.
        </p>
      </div>
    </div>
  );
}