import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createReview,
  deleteReview,
  getProductReviews,
  getReviewableOrder,
  updateReview,
} from "@/api/review";
import { UpdateReviewPayload } from "@/types/review";

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReview,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", variables.productId],
      });

      queryClient.invalidateQueries({
        queryKey: ["reviewable-order", variables.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

export const useProductReviews = (
  productId: string,
  page = 1,
  limit = 10,
  sort = "latest",
) => {
  return useQuery({
    queryKey: ["product-reviews", productId, page, limit, sort],

    queryFn: () => getProductReviews(productId, page, limit, sort),

    enabled: !!productId,
  });
};

export const useReviewableOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["reviewable-order", orderId],

    queryFn: () => getReviewableOrder(orderId),

    enabled: !!orderId,
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
      data,
    }: {
      reviewId: string;
      productId: string;
      data: UpdateReviewPayload;
    }) => updateReview(reviewId, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", variables.productId],
      });

      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      reviewId,
    }: {
      reviewId: string;
      productId: string;
    }) => deleteReview(reviewId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["product-reviews", variables.productId],
      });

      queryClient.invalidateQueries({
        queryKey: ["product", variables.productId],
      });

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};
