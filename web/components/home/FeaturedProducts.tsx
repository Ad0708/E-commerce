"use client";

import ProductCard from "@/components/products/ProductCard";
import { useFeaturedProducts } from "@/hooks/product/useFeaturedProducts";
import { useWishlistStore } from "@/store/wishlist.store";
import { Wishlist } from "@/types/wishlist";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";


export default function FeaturedProducts() {
  const { data, isLoading, isError } = useFeaturedProducts();
  const router = useRouter();

  const wishlist = useWishlistStore((state) => state.wishlist);
  const wishlistSet = useMemo<Set<string>>(
    () => new Set((wishlist ?? []).map((item: Wishlist) => item.product._id)),
    [wishlist],
  );

  if (isLoading || isError || !data?.products?.length) {
    return null;
  }

  // Split into columns for a masonry-like effect without external libraries
  const columns = [[], [], []] as any[][];
  data.products.forEach((product: any, idx: number) => {
      columns[idx % 3].push(product);
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
      {columns.map((column, colIdx) => (
        <div key={colIdx} className={`flex flex-col gap-8 ${colIdx === 1 ? 'lg:mt-24' : ''} ${colIdx === 2 ? 'lg:mt-12' : ''}`}>
          {column.map((product: any) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => {router.push(`/product/${product._id}`) ,window.scrollTo(0, 0)}}
            >
                <div className="group transition-transform duration-700 hover:-translate-y-4">
                    <ProductCard
                        product={product}
                        view="grid"
                        mode="customer"
                        wishlisted={wishlistSet.has(product._id)}
                    />
                </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}
