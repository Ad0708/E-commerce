"use client";

import { useProduct } from "@/hooks/product/useProduct";
import { Product } from "@/types/product";
import { SimilarProducts } from "./SimilarProducts";

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

  if (!product) {
    return (
      <div className="flex items-center justify-center h-96 gap-3 text-sm text-gray-400 dark:text-gray-500">
        <span className="w-4 h-4 border-2 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin" />
        Loading product…
      </div>
    );
  }

  const images = product.images || [];
  const hasDiscount = (product.discountPrice ?? 0) > 0;
  const savings = product.price - (product.discountPrice ?? 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
      {/* Main layout container split using a 12-column system */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* ── LEFT: MYNTRA-STYLE MULTI-IMAGE GRID (7/12 Width) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:col-span-7">
          {images.length > 0 ? (
            images.map((img: string, i: number) => (
              <div
                key={i}
                className="relative aspect-[3/4] overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 group"
              >
                <img
                  src={img}
                  alt={`${product.name} view ${i + 1}`}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            ))
          ) : (
            <div className="col-span-2 aspect-[3/4] flex items-center justify-center border border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-400">
              No images available
            </div>
          )}
        </div>

        {/* ── RIGHT: STICKY PRODUCT DETAILS PANEL (5/12 Width) ── */}
        <div className="md:col-span-5 md:sticky md:top-8 flex flex-col gap-5 self-start pb-10">
          {/* Brand & Admin Badging */}
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white uppercase">
                {product.brand}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.name}
              </p>
            </div>

            {isAdmin && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-800">
                Admin View
              </span>
            )}
          </div>

          {/* Ratings Panel Wrapper */}
          <div className="flex items-center gap-2 text-sm border border-gray-100 dark:border-gray-800 w-fit px-3 py-1.5 rounded bg-gray-50/50 dark:bg-gray-900/30">
            <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
              4.3 <span className="text-emerald-500 text-xs">★</span>
            </span>
            <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              1.2k Ratings
            </span>
          </div>

          {/* Pricing Matrix */}
          <div className="flex flex-col gap-0.5 pt-1">
            {hasDiscount ? (
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₹{product.discountPrice?.toLocaleString("en-IN")}
                </span>
                <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                  M.R.P. ₹{product.price.toLocaleString("en-IN")}
                </span>
                <span className="text-lg font-bold text-orange-500 dark:text-orange-400">
                  ({Math.round((savings / product.price) * 100)}% OFF)
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            )}
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              inclusive of all taxes
            </p>
          </div>

          {/* Stock Availability */}
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <span
              className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
            />
            <span
              className={
                product.stock > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-500 dark:text-rose-400"
              }
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* Product Long Description Header */}
          <div className="flex flex-col gap-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white">
              Product Details
            </h4>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800" />

          {/* Primary Conversion Actions */}
          <div className="flex flex-col gap-3 pt-2">{actions(product)}</div>
        </div>
      </div>
      {!isAdmin && (
        <>
        <div className="my-9 h-px w-full bg-slate-200 dark:bg-slate-700" />
        <div>
          <SimilarProducts productId={product._id} />
        </div>
        </>
      )}
    </div>
  );
}
