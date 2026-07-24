"use client";

import React from "react";
import type { Product } from "@/types/product";

interface SelectedProductsProps {
  products: Product[];
  onRemove: (productId: string) => void;
}

export function SelectedProducts({
  products,
  onRemove,
}: SelectedProductsProps) {
  if (!products || products.length === 0) return null;

  console.log("products", products);

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {products.map((product) => {
        const image = product?.images?.[0];

        return (
          <div
            key={product._id}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg group"
          >
            {/* Thumbnail */}
            <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-200 dark:bg-gray-700">
              {image ? (
                <img
                  src={image}
                  alt={product?.name || "Product"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="px-1 text-center text-[8px] font-medium leading-none text-gray-700 dark:text-gray-200">
                  {product?.name}
                </span>
              )}
            </div>

            {/* Name */}
            <span className="text-xs font-medium text-blue-800 dark:text-blue-200 max-w-[120px] truncate">
              {product?.name || "Unknown Product"}
            </span>

            {/* Remove */}
            <button
              type="button"
              onClick={() => onRemove(product._id)}
              className="ml-0.5 text-blue-400 hover:text-red-500 dark:text-blue-500 dark:hover:text-red-400 transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              aria-label={`Remove ${product?.name || "product"}`}
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
