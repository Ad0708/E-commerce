"use client";

import ProductCard from "@/components/products/ProductCard";
import { useFeaturedProducts } from "@/hooks/product/useFeaturedProducts";
import { useWishlistStore } from "@/store/wishlist.store";
import { Wishlist } from "@/types/wishlist";
import Link from "next/link";
import { useMemo } from "react";
import { motion, Variants } from "framer-motion";

// Container variant to coordinate children staggering
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Item variant for smooth fade-and-rise
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function FeaturedProducts() {
  const { data, isLoading, isError } = useFeaturedProducts();

  const wishlist = useWishlistStore((state) => state.wishlist);
  const wishlistSet = useMemo<Set<string>>(
    () => new Set((wishlist ?? []).map((item: Wishlist) => item.product._id)),
    [wishlist],
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  if (isError || !data?.products?.length) {
    return null;
  }

  return (
    <motion.div
      className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      // Set once to false so it animates every time it enters the viewport
      viewport={{ once: false, margin: "-50px" }}
    >
      {data.products.map((product: any) => (
        <motion.div key={product._id} variants={itemVariants}>
          <Link href={`/product/${product._id}`} className="block">
            <ProductCard
              product={product}
              view="grid"
              mode="customer"
              wishlisted={wishlistSet.has(product._id)}
            />
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
