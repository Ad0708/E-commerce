"use client";

import { useState, use } from "react";
import { useGetProductReviews, useDeleteAdminReview } from "@/hooks/admin/useAdminReviews";
import { AdminReview } from "@/api/admin/reviews";
import { Loader2, Star, Eye, ArrowLeft, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import SearchInput from "@/components/common/Search";
import Pagination from "@/components/common/Pagination";
import Modal from "@/components/common/Modal";
import { useDebounce } from "@/hooks/useDebounce";

export default function AdminProductReviewsPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const unwrappedParams = use(params);
  const productId = unwrappedParams.productId;

  const [page, setPage] = useState(1);
  const [rating, setRating] = useState("all");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(10);
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, error } = useGetProductReviews(productId, {
    page,
    limit,
    rating,
    search: debouncedSearch,
  });

  const { mutate: deleteReview, isPending: isDeleting } = useDeleteAdminReview();

  const apiData = data || {
    pagination: {
      total: 0,
      totalPages: 1,
      page: 1,
      limit: 10,
      hasNext: false,
      hasPrevious: false,
    },
  };

  const handleViewClick = (review: AdminReview) => {
    setSelectedReview(review);
  };

  const handleDeleteClick = (id: string) => {
    setReviewToDelete(id);
  };

  const handleConfirmModal = () => {
    if (selectedReview) {
      deleteReview(selectedReview._id);
      setSelectedReview(null);
    } else if (reviewToDelete) {
      deleteReview(reviewToDelete);
      setReviewToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setSelectedReview(null);
    setReviewToDelete(null);
  };

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center text-sm font-medium text-red-500">
        Failed to load product reviews. Please check server connections.
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-10rem)] min-h-124 text-slate-900 dark:text-slate-50">
        {/* ============ FIXED TOP WRAPPER (Header + Filters) ============ */}
        <div className="shrink-0 space-y-4 pb-4">
          <div className="flex flex-col gap-4">
            <Link
              href="/admin/reviews"
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Products
            </Link>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Product Reviews</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Manage reviews for the selected product
                </p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1 w-full md:max-w-md">
              <SearchInput
                value={search}
                onChange={(val) => {
                  setSearch(val);
                  setPage(1);
                }}
                placeholder="Search reviews by comment..."
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:min-w-40 md:flex-initial">
                <select
                  value={rating}
                  onChange={(e) => {
                    setRating(e.target.value);
                    setPage(1);
                  }}
                  className="h-11 w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-2 pr-10 text-sm text-zinc-900 outline-none transition-all focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:focus:border-blue-600"
                >
                  <option value="all">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <svg className="h-4 w-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ SCROLLABLE MAIN CONTENT (Table) ============ */}
        <div className="flex-1 overflow-hidden">
          <Table containerClassName="max-h-[calc(100vh-25rem)]">
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-500" />
                  </TableCell>
                </TableRow>
              ) : data?.reviews?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-64 text-center text-slate-500 dark:text-slate-400"
                  >
                    No reviews found for this product.
                  </TableCell>
                </TableRow>
              ) : (
                data?.reviews?.map((review) => (
                  <TableRow key={review._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 dark:text-white">
                          {review.user?.name || "Unknown User"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {review.user?.email || ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                            }
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p
                        className="line-clamp-2 max-w-sm text-sm text-slate-600 dark:text-slate-300"
                        title={review.comment}
                      >
                        {review.comment}
                      </p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm text-slate-500">
                      {format(new Date(review.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewClick(review)}
                          disabled={isDeleting}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                          title="View Full Review"
                        >
                          <Eye size={16} />
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteClick(review._id)}
                          disabled={isDeleting}
                          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
                          title="Delete Review"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ============ FIXED BOTTOM WRAPPER (Pagination) ============ */}
        <div className="shrink-0 pt-4">
          <Pagination
            page={apiData.pagination.page}
            totalPages={apiData.pagination.totalPages}
            limit={apiData.pagination.limit}
            total={apiData.pagination.total}
            hasNextPage={apiData.pagination.hasNext}
            hasPreviousPage={apiData.pagination.hasPrevious}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
      </div>

      <Modal
        isOpen={Boolean(selectedReview) || Boolean(reviewToDelete)}
        onClose={handleCloseModal}
        onConfirm={handleConfirmModal}
        title={selectedReview ? `Review from ${selectedReview.user?.name || "Unknown"}` : "Delete Review"}
        description={reviewToDelete ? "Are you sure you want to delete this review? This action cannot be undone." : ""}
        confirmText="Delete Review"
        cancelText={selectedReview ? "Close" : "Cancel"}
        variant="danger"
      >
        {selectedReview && (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < selectedReview.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {format(new Date(selectedReview.createdAt), "PPP")}
              </span>
            </div>

            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 break-words whitespace-pre-wrap">
              {selectedReview.comment}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
