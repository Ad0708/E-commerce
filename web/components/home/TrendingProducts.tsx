"use client";

import { useProducts } from "@/hooks/product/useProducts";
import ProductCard from "@/components/products/ProductCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist.store";
import { useMemo } from "react";
import { Wishlist } from "@/types/wishlist";

export default function TrendingProducts() {
  const { data, isLoading, isError } = useProducts({
    category: "smartphones",
    limit: 4,
    page: 1,
  });

  const wishlist = useWishlistStore((state) => state.wishlist);
  const wishlistSet = useMemo<Set<string>>(
    () => new Set((wishlist ?? []).map((item: Wishlist) => item.product._id)),
    [wishlist]
  );

  if (isLoading || isError || !data?.products?.length) {
    return null; // For high-end design, we might prefer to hide loading states on scroll sections if they are fast enough, or use skeletons.
  }

  return (
    <section className="py-32 bg-white dark:bg-slate-950">
      <div className="max-w-370 mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Trending Now</h2>
            <h3 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white leading-[1.1]">
              The cutting edge of connectivity.
            </h3>
          </div>
          <Link href="/products?category=smartphones" className="inline-flex items-center gap-2 pb-2 border-b-2 border-slate-900 dark:border-white font-bold uppercase tracking-widest text-sm hover:text-slate-500 transition-colors">
            Shop Smartphones <ArrowUpRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="space-y-32">
          {data.products.slice(0, 3).map((product: any, index: number) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.33, 1, 0.68, 1] }}
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-24`}
            >
              {/* Product Info (Takes up 1/2 width) */}
              <div className="w-full md:w-1/2 space-y-6">
                <p className="text-slate-500 font-mono tracking-widest uppercase text-sm">0{index + 1} / Featured</p>
                <h4 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">{product.name}</h4>
                <p className="text-lg text-slate-600 dark:text-slate-400 line-clamp-3">
                  {product.description}
                </p>
                <div className="pt-8">
                   <Link href={`/product/${product._id}`} className="group inline-flex items-center gap-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-8 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
                      View Details
                   </Link>
                </div>
              </div>

              {/* Product Card / Image (Takes up 1/2 width) */}
              <div className="w-full md:w-1/2">
                <div className="aspect-[4/5] w-full max-w-md mx-auto">
                    <ProductCard
                        product={product}
                        view="grid"
                        mode="customer"
                        wishlisted={wishlistSet.has(product._id)}
                    />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
