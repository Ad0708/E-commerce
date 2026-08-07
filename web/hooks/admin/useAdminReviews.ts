import { AxiosError } from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminReviewedProducts,
  getProductReviews,
  deleteAdminReview,
  AdminReviewedProductsResponse,
  AdminReviewsResponse
} from "@/api/admin/reviews";
import toast from "react-hot-toast";

export const useGetAdminReviewedProducts = (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery<AdminReviewedProductsResponse>({
    queryKey: ["admin-reviewed-products", params],
    queryFn: () => getAdminReviewedProducts(params),
  });
};

export const useGetProductReviews = (
  productId: string,
  params: {
    page?: number;
    limit?: number;
    rating?: string;
    search?: string;
  }
) => {
  return useQuery<AdminReviewsResponse>({
    queryKey: ["admin-product-reviews", productId, params],
    queryFn: () => getProductReviews(productId, params),
    enabled: !!productId,
  });
};

export const useDeleteAdminReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => deleteAdminReview(reviewId),
    onSuccess: () => {
      toast.success("Review deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-product-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["admin-reviewed-products"] });
    },
    onError: (error: unknown) => {
      toast.error((error as AxiosError<{message?: string}>)?.response?.data?.message ?? "Failed to delete review.");
    },
  });
};
