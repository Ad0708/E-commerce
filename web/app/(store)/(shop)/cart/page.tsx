"use client";

import CouponModal from "@/components/cart/CouponModal";
import { categories } from "@/constants/categories";
import { useCart } from "@/hooks/cart/useCart";
import { useRemoveCoupon } from "@/hooks/coupon/useCoupon";
import { useCartStore } from "@/store/cart.store";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Ticket,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Stagger container variant
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// Item variant with enter/exit transitions
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    height: 0,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
    transition: { duration: 0.2, ease: "easeInOut" },
  },
};

export default function CartPage() {
  // 1. ALL HOOKS MUST BE DECLARED AT THE VERY TOP
  const {
    isLoading,
    removeFromCart,
    updateQuantity,
    clearCart,
    isRemoving,
    isUpdating,
    isClearing,
  } = useCart();

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const appliedCoupon = useCartStore((s) => s.appliedCoupon);
  const summary = useCartStore((s) => s.summary);
  const removeCouponMutation = useRemoveCoupon();

  // 2. EARLY RETURNS AND CONDITIONAL CHECKS GO HERE
  if (isLoading) {
    return (
      <div className="flex flex-col bg-slate-50 dark:bg-slate-950">
        <main className="flex-1">
          <CartSkeleton />
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-28rem)] flex-col bg-slate-50 dark:bg-slate-950">
        <main className="flex 1 items-center justify-center">
          <EmptyCart />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-slate-50 dark:bg-slate-950">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link
                href="/products"
                className="my-4 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={15} />
                Continue shopping
              </Link>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                My Cart
                <span className="ml-2 text-lg font-normal text-slate-400">
                  ({summary?.itemCount}{" "}
                  {summary?.itemCount === 1 ? "item" : "items"})
                </span>
              </h1>
            </div>

            <button
              onClick={() => clearCart()}
              disabled={isClearing}
              className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors disabled:opacity-50"
            >
              Clear cart
            </button>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* ── Cart Items ── */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="lg:col-span-2 space-y-3"
            >
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.productId}
                    variants={itemVariants}
                    layout
                    exit="exit"
                    className="group flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:gap-5 sm:p-5"
                  >
                    {/* Image */}
                    <Link
                      href={`/product/${item.productId}`}
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800 sm:h-28 sm:w-28"
                    >
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        fill
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                        sizes="112px"
                      />
                    </Link>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-blue-500 dark:text-blue-400">
                            {categories.find((c) => c.value === item.category)
                              ?.label ?? item.category}
                          </p>
                          <Link href={`/product/${item.productId}`}>
                            <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors sm:text-base">
                              {item.name}
                            </h3>
                          </Link>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          disabled={isRemoving}
                          className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Price + Qty row */}
                      <div className="mt-3 flex items-center justify-between">
                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-bold text-slate-900 dark:text-white sm:text-lg">
                            ₹
                            {(item.discountPrice ?? item.price).toLocaleString(
                              "en-IN",
                            )}
                          </span>
                          {item.discountPrice && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{item.price.toLocaleString("en-IN")}
                            </span>
                          )}
                          {item.discountPrice && (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-400">
                              {Math.round(
                                ((item.price - item.discountPrice) /
                                  item.price) *
                                  100,
                              )}
                              % off
                            </span>
                          )}
                        </div>

                        {/* Quantity stepper */}
                        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                          <button
                            onClick={() =>
                              item.quantity === 1
                                ? removeFromCart(item.productId)
                                : updateQuantity({
                                    productId: item.productId,
                                    quantity: item.quantity - 1,
                                  })
                            }
                            disabled={isUpdating || isRemoving}
                            className="flex h-8 w-8 items-center justify-center rounded-l-xl text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity({
                                productId: item.productId,
                                quantity: item.quantity + 1,
                              })
                            }
                            disabled={
                              item.quantity >= item.stock || isUpdating
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-r-xl text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Stock warning */}
                      {item.stock <= 5 && (
                        <p className="mt-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                          Only {item.stock} left!
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* ── Order Summary ── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="h-fit lg:sticky lg:top-24"
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-5 text-lg font-bold text-slate-900 dark:text-white">
                  Order Summary
                </h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>
                      Price ({summary?.itemCount}{" "}
                      {summary?.itemCount === 1 ? "item" : "items"})
                    </span>
                    <span>₹{summary?.subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {summary?.discount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Product Discount</span>
                      <span>
                        − ₹{summary?.discount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      Coupon
                    </span>

                    {appliedCoupon ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-lg border border-green-200 bg-green-50/50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-green-700 dark:border-green-900/40 dark:bg-green-950/20 dark:text-green-400">
                          <Ticket className="h-3.5 w-3.5" />
                          {appliedCoupon.code}
                        </div>

                        <button
                          onClick={() => removeCouponMutation.mutate(undefined)}
                          disabled={removeCouponMutation.isPending}
                          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
                          title="Remove Coupon"
                        >
                          {removeCouponMutation.isPending ? (
                            <span className="text-xs font-medium text-slate-400">
                              ...
                            </span>
                          ) : (
                            <X className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setCouponModalOpen(true)}
                        className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      >
                        Apply Coupon
                      </button>
                    )}
                  </div>

                  {summary?.couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Coupon Discount ({appliedCoupon?.code})</span>
                      <span>
                        − ₹{summary?.couponDiscount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Delivery</span>

                    {summary?.deliveryCharge > 0 ? (
                      <span className="font-medium text-slate-900 dark:text-white">
                        ₹{summary.deliveryCharge.toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span className="font-medium text-green-600 dark:text-green-400">
                        FREE
                      </span>
                    )}
                  </div>

                  <div className="my-3 border-t border-dashed border-slate-200 dark:border-slate-700" />

                  <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white">
                    <span>Total</span>
                    <span>₹{summary?.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {summary?.savings > 0 && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 dark:bg-green-900/20">
                    <Tag
                      size={15}
                      className="text-green-600 dark:text-green-400"
                    />
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      You save ₹{summary?.savings.toLocaleString("en-IN")} on
                      this order
                    </p>
                  </div>
                )}

                <Link
                  href="/checkout"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Go to checkout
                </Link>

                <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
                  Secure checkout · Free returns
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <CouponModal
        open={couponModalOpen}
        onClose={() => setCouponModalOpen(false)}
      />
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center justify-center gap-6 px-4 text-center min-h-full"
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
        <ShoppingBag size={40} className="text-slate-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Your cart is empty
        </h2>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Looks like you haven&apos;t added anything yet.
        </p>
      </div>
      <Link
        href="/products"
        className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
      >
        Start shopping
      </Link>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CartSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 h-8 w-48 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="h-28 w-28 shrink-0 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="flex-1 space-y-3 py-1">
                <div className="h-3 w-1/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}