"use client";

import { useState } from "react";
import Image from "next/image";
import { useProduct } from "@/hooks/product/useProduct";
import { Product } from "@/types/product";
import { SimilarProducts } from "./SimilarProducts";
import ProductReviews from "./ProductReviews";
import { Star } from "lucide-react";

type ProductDetailsProps = {
  id: string;
  isAdmin: boolean;
  actions: (product: Product) => React.ReactNode;
};

export default function ProductDetails({
  id,
  isAdmin,
  actions,
}: ProductDetailsProps) {
  const { data: product } = useProduct(id);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96 gap-3 text-sm text-gray-400 dark:text-gray-500">
        <span className="w-4 h-4 border-2 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin" />
        Loading product…
      </div>
    );
  }

  const images = product.images || [];
  const activeImage = images[activeImageIdx] || null;
  const hasDiscount = (product.discountPrice ?? 0) > 0;
  const savings = product.price - (product.discountPrice ?? 0);
  
  const averageRating = product.averageRating || 0;
  const totalReviews = product.totalReviews || 0;

  const handleScrollToReviews = () => {
    document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-370 mx-auto px-4 py-6 md:py-8">
      {/* Main layout container split using a 12-column system */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        
        {/* ── LEFT: AMAZON-STYLE IMAGE GALLERY (7/12 Width) ── */}
        <div className="flex flex-col-reverse md:flex-row gap-4 lg:col-span-7">
          {/* Thumbnails */}
          {images.length > 0 ? (
            <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto md:max-h-[500px] shrink-0 custom-scrollbar pb-2 md:pb-0 md:pr-1">
              {images.map((img: string, i: number) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveImageIdx(i)}
                  onClick={() => setActiveImageIdx(i)}
                  className={`relative h-16 w-16 md:h-20 md:w-20 shrink-0 rounded-md overflow-hidden bg-white dark:bg-zinc-900 border-2 transition-all ${
                    activeImageIdx === i
                      ? "border-blue-500 dark:border-blue-400 shadow-sm"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    sizes="(max-width: 768px) 64px, 80px"
                    className="object-contain p-1"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          ) : null}

          {/* Main Active Image */}
          <div className="relative flex-1 aspect-[4/5] sm:aspect-square md:aspect-[3/4] lg:aspect-square overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-center">
            {activeImage ? (
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-4 transition-transform duration-500 hover:scale-110"
                unoptimized
              />
            ) : (
              <span className="text-sm text-zinc-400">No image available</span>
            )}
          </div>
        </div>

        {/* ── RIGHT: PRODUCT DETAILS & BUY BOX (5/12 Width) ── */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Brand & Admin Badging */}
          <div className="flex flex-col gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                {product.name}
              </h1>
              {isAdmin && (
                <span className="shrink-0 inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800">
                  Admin
                </span>
              )}
            </div>
            
            {product.brand && (
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                Visit the {product.brand} Store
              </p>
            )}

            {/* Ratings Summary */}
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-1 text-amber-500">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mr-0.5">{averageRating.toFixed(1)}</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    size={16} 
                    className={star <= Math.round(averageRating) ? "fill-amber-500 text-amber-500" : "text-zinc-300 dark:text-zinc-700"} 
                  />
                ))}
              </div>
              <button 
                onClick={handleScrollToReviews}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                {totalReviews.toLocaleString()} ratings
              </button>
            </div>
          </div>

          {/* Pricing Matrix */}
          <div className="flex flex-col gap-1">
            {hasDiscount ? (
              <>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-normal text-red-600 dark:text-red-400">
                    -{Math.round((savings / product.price) * 100)}%
                  </span>
                  <span className="text-3xl font-semibold text-zinc-900 dark:text-white flex items-start">
                    <span className="text-lg mt-1 mr-0.5">₹</span>
                    {product.discountPrice?.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  M.R.P.: <span className="line-through">₹{product.price.toLocaleString("en-IN")}</span>
                </div>
              </>
            ) : (
              <span className="text-3xl font-semibold text-zinc-900 dark:text-white flex items-start">
                <span className="text-lg mt-1 mr-0.5">₹</span>
                {product.price.toLocaleString("en-IN")}
              </span>
            )}
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-200 mt-2">
              Inclusive of all taxes
            </p>
          </div>

          {/* Stock Availability */}
          <div className="mt-2">
            <h4 className={`text-lg font-medium ${product.stock > 0 ? "text-green-700 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </h4>
            {product.stock > 0 && product.stock < 10 && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Only {product.stock} left in stock - order soon.
              </p>
            )}
          </div>

          {/* Buy Box Actions (Add to Cart / Buy Now) */}
          <div className="flex flex-col gap-3 py-4 border-y border-zinc-200 dark:border-zinc-800">
            {actions(product)}
          </div>

          {/* Product Long Description */}
          <div className="flex flex-col gap-2 pt-2">
            <h4 className="text-base font-bold text-zinc-900 dark:text-white">
              About this item
            </h4>
            <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
              {product.description}
            </div>
          </div>

        </div>
      </div>

      {!isAdmin && (
        <>
          <div className="my-12 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
          <div id="reviews-section">
            <ProductReviews productId={product._id} />
          </div>
          
          <div className="my-12 h-px w-full bg-zinc-200 dark:bg-zinc-800" />
          <div>
            <SimilarProducts productId={product._id} />
          </div>
        </>
      )}
    </div>
  );
}
