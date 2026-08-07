"use client";

import { useProducts } from "@/hooks/product/useProducts";
import ProductCard from "@/components/products/ProductCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist.store";
import { useMemo } from "react";
import { Wishlist } from "@/types/wishlist";
import { Button } from "@/components/ui/button";

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
    <section className="py-32 bg-background transition-colors duration-300">
      <div className="max-w-370 mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted mb-4 font-heading">
              Trending Now
            </h2>
            <h3 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground font-heading leading-[1.1]">
              The cutting edge of connectivity.
            </h3>
          </div>
          <Link href="/products?category=smartphones" className="inline-flex items-center gap-2 pb-2 border-b-2 border-foreground font-bold uppercase tracking-widest text-sm text-foreground hover:text-muted transition-colors group">
            Shop Smartphones
            <ArrowUpRight className="w-5 h-5 transform group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
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
                <p className="text-muted font-mono tracking-widest uppercase text-sm font-bold">
                  0{index + 1} / Featured
                </p>
                <h4 className="text-4xl md:text-5xl font-extrabold text-foreground font-heading">
                  {product.name}
                </h4>
                <p className="text-lg text-secondary line-clamp-3">
                  {product.description}
                </p>

                {/* Simulated product specs as pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="glass-panel text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-foreground border-[var(--glass-border)] bg-background/50">
                    Latest Tech
                  </span>
                  <span className="glass-panel text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full text-foreground border-[var(--glass-border)] bg-background/50">
                    Premium Quality
                  </span>
                </div>

                <div className="pt-8">
                  <Link href={`/product/${product._id}`}>
                    <Button size="lg" className="px-8 uppercase tracking-widest text-sm font-bold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Product Card / Image (Takes up 1/2 width) */}
              <div className="w-full md:w-1/2">
                <div className="aspect-[4/5] w-full max-w-md mx-auto relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-start)]/20 to-[var(--accent-end)]/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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
