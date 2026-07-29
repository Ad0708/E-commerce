"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProductGrid from "@/components/products/ProductGrid";
import { useWishlistStore } from "@/store/wishlist.store";
import { Product } from "@/types/product";

export default function WishlistPage() {
  const wishlist = useWishlistStore((state) => state.wishlist);
  const isLoading = useWishlistStore((state) => state.loading);

  const wishlistSet = useMemo(
    () => new Set(wishlist.map((item) => item.product._id)),
    [wishlist]
  );

  const products = wishlist.map((item) => item.product);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-50">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pt-30">
        {/* Header */}
        <div className="mb-8 border-b border-slate-200/80 pb-6 dark:border-slate-800">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  My Wishlist
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
                  <Heart className="h-3 w-3 fill-current" />
                  {products.length}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Products you've saved for later. Add them to your cart whenever you're ready.
              </p>
            </div>

            {products.length > 0 && !isLoading && (
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <ShoppingBag className="h-3.5 w-3.5 text-slate-500" />
                Continue Browsing
              </Link>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex h-64 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-300 border-t-slate-900 dark:border-slate-700 dark:border-t-white" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-20 text-center dark:border-slate-800 dark:bg-slate-900/50"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/30">
              <Heart className="h-8 w-8 text-rose-500 dark:text-rose-400" />
            </div>

            <h2 className="text-xl font-bold">Your wishlist is empty</h2>

            <p className="mt-2 max-w-md text-xs text-slate-500 dark:text-slate-400">
              Save items you love while shopping by tapping the heart icon. They will appear here for easy access later.
            </p>

            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white"
            >
              Explore Products
            </Link>
          </motion.div>
        )}

        {/* Animated Product Grid Container */}
        {!isLoading && products.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key="wishlist-grid"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="space-y-6"
            >
              <ProductGrid
                products={products as Product[]}
                mode="customer"
                wishlist={wishlistSet}
              />
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}