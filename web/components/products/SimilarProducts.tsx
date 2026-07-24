import { useMemo } from "react";
import { useSimilarProducts } from "@/hooks/product/useProduct";
import { useWishlistStore } from "@/store/wishlist.store";
import { Wishlist } from "@/types/wishlist";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { Sparkle } from "lucide-react";
import Link from "next/link";

export const SimilarProducts = ({ productId }: { productId: string }) => {
  const { data: similarProducts, isLoading: isSimilarLoading } =
    useSimilarProducts(productId);

  const wishlist = useWishlistStore((state) => state.wishlist);

  const wishlistSet = useMemo(
    () => new Set((wishlist ?? []).map((item: Wishlist) => item.product._id)),
    [wishlist],
  );

  if (!isSimilarLoading && !similarProducts?.products?.length) {
    return null;
  }

  return (
    <section className="mt-16">
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Sparkle className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Recommendations
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-2xl">
            Similar Products
          </h2>
        </div>

        {/* Optional: Simple inline counter or subtle context element */}
        {!isSimilarLoading && similarProducts?.products?.length > 0 && (
          <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
            {similarProducts.products.length} items found
          </span>
        )}
      </div>

      {isSimilarLoading ? (
        <div className="py-10 text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {similarProducts.products.map((product: Product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="block"
            >
              <ProductCard
                key={product._id}
                product={product}
                mode="customer"
                wishlisted={wishlistSet.has(product._id)}
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};
