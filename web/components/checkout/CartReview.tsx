"use client";

import { useCartStore } from "@/store/cart.store";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";

export default function CartReview() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 p-10 text-center dark:border-zinc-700">
        <ShoppingBag size={60} className="mx-auto text-gray-400" />

        <h3 className="mt-4 text-xl font-semibold">Your cart is empty</h3>

        <p className="mt-2 text-gray-500">
          Add some products before placing an order.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-6 text-xl font-semibold">Order Items</h2>

      <div className="space-y-5">
        {items.map((item) => {
          // 1. Strict boolean check for valid discounts
          const hasValidDiscount =
            typeof item.discountPrice === "number" &&
            item.discountPrice > 0 &&
            item.discountPrice < item.price;

          // 2. Safe active unit price determination
          const activePrice: number = hasValidDiscount
            ? (item.discountPrice ?? item.price)
            : item.price;

          // 3. Line total calculations
          const lineTotal = activePrice * item.quantity;
          const originalLineTotal = item.price * item.quantity;

          return (
            <div
              key={item.productId}
              className="flex flex-col gap-5 rounded-xl border border-gray-200 p-4 md:flex-row md:items-center dark:border-zinc-700"
            >
              {/* Product Image */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted p-2">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {item.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Category : {item.category}
                </p>

                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  Quantity :
                  <span className="ml-2 font-semibold">{item.quantity}</span>
                </p>
              </div>

              {/* Price Block */}
              <div className="text-left md:text-right">
                {hasValidDiscount && (
                  <p className="text-sm text-gray-400 line-through">
                    ₹{item.price.toLocaleString("en-IN")} each
                  </p>
                )}

                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ₹{activePrice.toLocaleString("en-IN")}
                  <span className="text-xs font-normal text-gray-500 ml-1">
                    each
                  </span>
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Total ₹{lineTotal.toLocaleString("en-IN")}
                </p>

                {hasValidDiscount && (
                  <p className="text-xs font-medium text-green-600 dark:text-green-400 mt-0.5">
                    Save ₹
                    {(originalLineTotal - lineTotal).toLocaleString("en-IN")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
