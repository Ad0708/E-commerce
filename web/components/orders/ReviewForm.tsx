"use client";
import { AxiosError } from "axios";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateReview } from "@/hooks/review/useReview";
import toast from "react-hot-toast";

interface ReviewFormProps {
  orderId: string;
  productId: string;
}

export default function ReviewForm({ orderId, productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const { mutate: createReview, isPending } = useCreateReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a review");
      return;
    }

    createReview(
      { orderId, productId, rating, comment },
      {
        onSuccess: () => {
          toast.success("Review submitted successfully");
        },
        onError: (err: unknown) => {
          toast.error((err as AxiosError<{message?: string}>)?.response?.data?.message || "Failed to submit review");
        },
      }
    );
  };

  const currentDisplayRating = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isActive = star <= currentDisplayRating;
          return (
            <button
              key={star}
              type="button"
              className="p-1 focus:outline-none transition-transform hover:scale-110 active:scale-95"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                size={22}
                className={isActive ? "fill-yellow-400 text-yellow-400" : "text-zinc-300 dark:text-zinc-600"}
              />
            </button>
          );
        })}
      </div>

      <Textarea
        placeholder="Write your review here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px] resize-none text-sm"
      />

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={isPending || rating === 0 || !comment.trim()}
          className="w-full sm:w-auto"
        >
          {isPending ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}
