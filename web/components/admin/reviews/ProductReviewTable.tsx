import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/common/Table";
import { AdminReview } from "@/api/admin/reviews";
import { Loader2, Star, Eye, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface ProductReviewTableProps {
  data: any;
  isLoading: boolean;
  isDeleting: boolean;
  handleViewClick: (review: AdminReview) => void;
  handleDeleteClick: (id: string) => void;
}

export default function ProductReviewTable({
  data,
  isLoading,
  isDeleting,
  handleViewClick,
  handleDeleteClick,
}: ProductReviewTableProps) {
  return (
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
            data?.reviews?.map((review: AdminReview) => (
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
  );
}
