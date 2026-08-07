"use client";

import CouponModal from "@/components/cart/CouponModal";
import { categories } from "@/constants/categories";
import { useCart } from "@/hooks/cart/useCart";
import { useRemoveCoupon } from "@/hooks/coupon/useCoupon";
import { useCartStore } from "@/store/cart.store";
import { AnimatePresence, motion, Variants } from "framer-motion";
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
      <div className="flex flex-col bg-background pt-20 min-h-screen">
        <main className="flex-1">
          <CartSkeleton />
        </main>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <main className="flex w-full flex-1 items-center justify-center px-4 py-12">
          <EmptyCart />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-background pt-18 min-h-screen">
      <main className="flex-1">
        <div className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Link
                href="/products"
                className="my-4 flex items-center gap-1.5 text-sm text-secondary hover:text-foreground transition-colors font-bold uppercase tracking-widest"
              >
                <ArrowLeft size={15} />
                Continue shopping
              </Link>
              <h1 className="text-4xl font-extrabold text-foreground font-heading tracking-tighter">
                My Cart
                <span className="ml-3 text-2xl font-medium text-muted">
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
                {items.map((item) => {
                  // ── Safe Discount & Price Computations ──
                  const hasValidDiscount =
                    typeof item.discountPrice === "number" &&
                    item.discountPrice > 0 &&
                    item.discountPrice < item.price;

                  const displayPrice = hasValidDiscount
                    ? item.discountPrice!
                    : item.price;

                  const discountPct = hasValidDiscount
                    ? Math.round(
                        ((item.price - item.discountPrice!) / item.price) * 100,
                      )
                    : 0;

                  return (
                    <motion.div
                      key={item.productId}
                      variants={itemVariants}
                      layout
                      exit="exit"
                      className="group flex gap-4 rounded-3xl border border-[var(--glass-border)] bg-background p-4 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 sm:gap-5 sm:p-5"
                    >
                      {/* Image */}
                      <Link
                        href={`/product/${item.productId}`}
                        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-secondary/10 sm:h-28 sm:w-28"
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
                            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent-mid)]">
                              {categories.find((c) => c.value === item.category)
                                ?.label ?? item.category}
                            </p>
                            <Link href={`/product/${item.productId}`}>
                              <h3 className="mt-1 line-clamp-2 text-base font-bold text-foreground hover:text-[var(--accent-start)] transition-colors font-heading">
                                {item.name}
                              </h3>
                            </Link>
                          </div>

                          {/* Remove */}
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            disabled={isRemoving}
                            className="shrink-0 rounded-xl bg-secondary/5 border border-transparent p-2 text-muted hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-500/20 transition-all disabled:opacity-50"
                            aria-label="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Price + Qty row */}
                        <div className="mt-3 flex items-center justify-between">
                          {/* Price Block */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-extrabold text-foreground font-heading">
                              ₹{displayPrice.toLocaleString("en-IN")}
                            </span>

                            {hasValidDiscount && (
                              <span className="text-xs text-muted line-through font-bold">
                                ₹{item.price.toLocaleString("en-IN")}
                              </span>
                            )}

                            {hasValidDiscount && discountPct > 0 && (
                              <span className="rounded-full bg-[var(--accent-start)]/10 px-2 py-0.5 text-xs font-bold text-[var(--accent-start)] border border-[var(--accent-start)]/20">
                                {discountPct}% off
                              </span>
                            )}
                          </div>

                          {/* Quantity stepper */}
                          <div className="flex items-center gap-1 rounded-xl border border-[var(--glass-border)] bg-secondary/5 p-1">
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
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-secondary hover:bg-background hover:text-foreground hover:shadow-sm transition-all disabled:opacity-40"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-foreground">
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
                              className="flex h-7 w-7 items-center justify-center rounded-lg text-secondary hover:bg-background hover:text-foreground hover:shadow-sm transition-all disabled:opacity-40"
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
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* ── Order Summary ── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
              className="h-fit lg:sticky lg:top-24"
            >
              <div className="glass-panel rounded-3xl border-[var(--glass-border)] p-6 sm:p-8">
                <h2 className="mb-6 text-2xl font-extrabold text-foreground font-heading">
                  Order Summary
                </h2>

                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between text-secondary">
                    <span>
                      Price ({summary?.itemCount}{" "}
                      {summary?.itemCount === 1 ? "item" : "items"})
                    </span>
                    <span>₹{summary?.subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {summary?.discount > 0 && (
                    <div className="flex justify-between text-[var(--accent-start)]">
                      <span>Product Discount</span>
                      <span className="font-bold">
                        − ₹{summary?.discount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-2">
                    <span className="text-secondary font-semibold">
                      Coupon
                    </span>

                    {appliedCoupon ? (
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-xl border border-[var(--accent-mid)]/20 bg-[var(--accent-mid)]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-mid)]">
                          <Ticket className="h-3.5 w-3.5" />
                          {appliedCoupon.code}
                        </div>

                        <button
                          onClick={() => removeCouponMutation.mutate(undefined)}
                          disabled={removeCouponMutation.isPending}
                          className="rounded-xl p-1.5 text-muted hover:bg-red-500/10 hover:text-red-500 transition-colors disabled:opacity-50"
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
                        className="text-sm font-bold text-[var(--accent-mid)] hover:text-[var(--accent-start)] transition-colors"
                      >
                        Apply Coupon
                      </button>
                    )}
                  </div>

                  {summary?.couponDiscount > 0 && (
                    <div className="flex justify-between text-[var(--accent-start)]">
                      <span>Coupon Discount ({appliedCoupon?.code})</span>
                      <span className="font-bold">
                        − ₹{summary?.couponDiscount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-secondary">
                    <span>Delivery</span>

                    {summary?.deliveryCharge > 0 ? (
                      <span className="font-bold text-foreground">
                        ₹{summary.deliveryCharge.toLocaleString("en-IN")}
                      </span>
                    ) : (
                      <span className="font-bold text-emerald-500">
                        FREE
                      </span>
                    )}
                  </div>

                  <div className="my-4 border-t border-[var(--glass-border)]" />

                  <div className="flex justify-between text-xl font-extrabold text-foreground font-heading">
                    <span>Total</span>
                    <span>₹{summary?.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {summary?.savings > 0 && (
                  <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[var(--accent-start)]/10 px-5 py-4 border border-[var(--accent-start)]/20">
                    <Tag
                      size={18}
                      className="text-[var(--accent-start)]"
                    />
                    <p className="text-sm font-bold text-[var(--accent-start)]">
                      You save ₹{summary?.savings.toLocaleString("en-IN")} on
                      this order
                    </p>
                  </div>
                )}

                <Link
                  href="/checkout"
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[var(--accent-start)] to-[var(--accent-end)] py-4 text-sm font-bold text-white uppercase tracking-widest transition-transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--accent-mid)]/20 active:scale-95"
                >
                  Go to checkout
                </Link>

                <p className="mt-4 text-center text-xs text-muted font-medium">
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
      className="flex flex-col items-center justify-center gap-6 text-center"
    >
      <div className="flex h-32 w-32 items-center justify-center rounded-full bg-secondary/10">
        <ShoppingBag size={48} className="text-muted" />
      </div>

      <div>
        <h2 className="text-3xl font-extrabold text-foreground font-heading">
          Your cart is empty
        </h2>
        <p className="mt-3 text-secondary text-lg">
          Looks like you haven&apos;t added anything yet.
        </p>
      </div>

      <Link
        href="/products"
        className="mt-4 rounded-full bg-linear-to-r from-[var(--accent-start)] to-[var(--accent-end)] px-10 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:shadow-lg hover:shadow-[var(--accent-mid)]/20 hover:-translate-y-1 active:scale-95"
      >
        Start shopping
      </Link>
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CartSkeleton() {
  return (
    <div className="mx-auto max-w-370 px-4 py-8 sm:px-6 lg:px-8">
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
