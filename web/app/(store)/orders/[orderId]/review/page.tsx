"use client";

import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useReviewableOrder } from "@/hooks/review/useReview";
import ReviewForm from "@/components/orders/ReviewForm";

interface ReviewPageProps {
  params: Promise<{ orderId: string }>;
}

export default function ReviewPage({ params }: ReviewPageProps) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.orderId;

  const { data, isLoading, isError, error } = useReviewableOrder(orderId);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center gap-3">
        <Loader2 className="animate-spin text-blue-600" size={32} />
        <p className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
          Loading Review Info...
        </p>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 px-4">
        <p className="text-sm font-medium text-red-600 dark:text-red-400">
          {error?.message || "Could not load reviewable products for this order."}
        </p>
        <Link
          href={`/orders/${orderId}`}
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400"
        >
          <ArrowLeft size={14} /> Back to Order Details
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-screen space-y-6">
      {/* Navigation and Top Toolbar */}
      <div>
        <Link
          href={`/orders/${orderId}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200 tracking-wide uppercase group mb-4"
        >
          <ArrowLeft
            size={13}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Back to Order
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight font-mono">
              Review Products
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 font-medium">
              Order #{data.orderNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight pb-4 border-b border-zinc-100 dark:border-zinc-800/60 mb-2">
          Products ({data.products.length})
        </h3>
        
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {data.products.map((product) => (
            <div key={product.productId} className="flex flex-col sm:flex-row gap-4 sm:gap-6 py-6 first:pt-4 last:pb-0">
              
              {/* Product Layout matches OrderItem.tsx exactly */}
              <div className="flex items-start gap-4 sm:w-1/3 shrink-0">
                <div className="relative h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-800">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 font-medium uppercase tracking-wider">
                    {product.category}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Qty:{" "}
                    <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                      {product.quantity}
                    </span>
                  </p>
                </div>
              </div>

              {/* Review Form Area */}
              <div className="flex-1 w-full sm:pl-6 sm:border-l border-zinc-100 dark:border-zinc-800/60 mt-2 sm:mt-0">
                {product.alreadyReviewed ? (
                  <div className="flex items-center gap-2 h-full text-green-600 dark:text-green-500">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-medium">Review submitted</span>
                  </div>
                ) : (
                  <ReviewForm orderId={orderId} productId={product.productId} />
                )}
              </div>
            </div>
          ))}

          {data.products.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No products to review.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
