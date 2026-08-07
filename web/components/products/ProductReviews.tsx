"use client";

import { useProductReviews } from "@/hooks/review/useReview";
import { Star, Loader2, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  // Fetch only the top 3 reviews for the product page summary
  const { data, isLoading, isError } = useProductReviews(productId, 1, 3, "latest");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (isError || !data) {
    return null;
  }

  const { rating, reviews } = data;
  const averageRating = rating?.averageRating || 0;
  const totalReviews = rating?.totalReviews || 0;

  return (
    <div className="max-w-370 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* ── LEFT: REVIEWS SUMMARY (4/12 Width) ── */}
        <div className="md:col-span-4 flex flex-col items-center text-center pt-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
            Customer reviews
          </h2>

          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="flex items-center text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={24}
                  className={star <= Math.round(averageRating) ? "fill-amber-500 text-amber-500" : "text-zinc-200 dark:text-zinc-800"}
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-zinc-900 dark:text-white">
              {averageRating.toFixed(1)} <span className="text-lg font-medium text-zinc-500 dark:text-zinc-400">out of 5</span>
            </span>
          </div>

          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mt-2">
            Based on {totalReviews.toLocaleString()} global ratings
          </p>
        </div>

        {/* ── RIGHT: REVIEWS LIST (8/12 Width) ── */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {reviews && reviews.length > 0 ? (
            <div className="flex flex-col gap-6">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
                Top reviews from India
              </h3>

              <div className="flex flex-col gap-4">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
                          <User size={18} className="text-zinc-500 dark:text-zinc-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                            {review.user?.name || "Amazon Customer"}
                          </span>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Reviewed on {new Date(review.createdAt).toLocaleDateString('en-IN', {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={16}
                            className={star <= review.rating ? "fill-amber-500 text-amber-500" : "text-zinc-200 dark:text-zinc-800"}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full">
                        Verified Purchase
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>

              {/* Link to view all reviews */}
              {totalReviews > 3 && (
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-center">
                  <Link href={`/product/${productId}/reviews`} className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto mt-2 font-semibold text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                      See all reviews
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
              <Star size={48} className="text-zinc-300 dark:text-zinc-700 mb-4" />
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No reviews yet</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-sm">
                Be the first to review this product and help other customers make informed decisions.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
