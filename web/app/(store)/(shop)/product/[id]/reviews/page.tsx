"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProductReviews } from "@/hooks/review/useReview";
import { Star, Loader2, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Review } from "@/types/review";

export default function AllReviewsPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [page, setPage] = useState(1);
  const limit = 10;

  // Local state to accumulate reviews for infinite scrolling
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isError, isFetching } = useProductReviews(productId, page, limit, "latest");

  // Accumulate reviews when new data arrives
  useEffect(() => {
    if (data?.reviews) {
      if (page === 1) {
        setAllReviews(data.reviews);
      } else {
        setAllReviews(prev => {
          // Prevent duplicates just in case
          const newReviews = data.reviews.filter(
            r1 => !prev.some(r2 => r2._id === r1._id)
          );
          return [...prev, ...newReviews];
        });
      }

      if (data.pagination) {
        setHasMore(page < data.pagination.totalPages);
      }
    }
  }, [data, page]);

  // Infinite scroll observer setup
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !isFetching) {
      setPage(prev => prev + 1);
    }
  }, [hasMore, isFetching]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const option = { threshold: 0.1 };
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);

    return () => observer.unobserve(element);
  }, [handleObserver, observerTarget]);

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-lg text-zinc-600 dark:text-zinc-400">Failed to load reviews.</p>
        <Button variant="outline" onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const averageRating = data?.rating?.averageRating || 0;
  const totalReviews = data?.rating?.totalReviews || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 min-h-screen">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-12"
      >
        <ArrowLeft size={14} />
        Back to Product
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* ── LEFT: REVIEWS SUMMARY (4/12 Width - Sticky) ── */}
        <div className="lg:col-span-4 lg:sticky lg:top-32 flex flex-col items-start text-left pt-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-8">
            Customer Reviews
          </p>

          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-6xl sm:text-7xl font-light tracking-tighter text-foreground font-heading leading-none">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-lg font-medium text-muted-foreground">
              / 5
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-500 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={22}
                className={star <= Math.round(averageRating) ? "fill-amber-500 text-amber-500" : "text-zinc-200 dark:text-zinc-800"}
              />
            ))}
          </div>

          <div className="h-px w-full bg-zinc-200 dark:bg-zinc-800 mb-6"></div>

          <p className="text-xs font-medium text-muted-foreground leading-relaxed">
            Based on <span className="text-foreground font-bold">{totalReviews.toLocaleString()}</span> ratings from verified buyers worldwide.
          </p>
        </div>

        {/* ── RIGHT: REVIEWS LIST (8/12 Width) ── */}
        <div className="lg:col-span-8">
          {allReviews.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 px-4 border-y border-zinc-200 dark:border-zinc-800">
              <Star size={48} className="text-zinc-300 dark:text-zinc-700 mb-6" strokeWidth={1} />
              <h3 className="text-xl font-medium text-foreground mb-3">No reviews yet</h3>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Check back later to see what other customers think about this product.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {allReviews.map((review) => (
                <div key={review._id} className="group flex flex-col sm:flex-row gap-6 sm:gap-12 py-10 border-b border-zinc-200 dark:border-zinc-800 last:border-0 transition-opacity">
                  
                  {/* Left: Reviewer Meta */}
                  <div className="sm:w-1/3 flex flex-col gap-3 shrink-0">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                        <User size={16} className="text-zinc-500" />
                      </div>
                      <span className="text-sm font-bold text-foreground capitalize">
                        {review.user?.name || "Anonymous"}
                      </span>
                    </div>
                    
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </p>
                    
                    <div className="flex items-center gap-1.5 text-amber-500 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={star <= review.rating ? "fill-amber-500 text-amber-500" : "text-zinc-200 dark:text-zinc-800"}
                        />
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
                        Verified Buyer
                      </span>
                    </div>
                  </div>

                  {/* Right: Review Content */}
                  <div className="sm:w-2/3 sm:pt-2">
                    <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed font-medium">
                      {review.comment}
                    </p>
                  </div>
                </div>
              ))}

              {/* Infinite Scroll Sentinel */}
              <div ref={observerTarget} className="py-4 flex justify-center h-16">
                {isFetching && (
                  <Loader2 className="animate-spin text-blue-600" size={24} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
