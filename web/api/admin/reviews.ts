import api from "@/lib/axios/axios";
import { Review, ReviewPagination } from "@/types/review";

export interface AdminReviewUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AdminReviewProduct {
  _id: string;
  name: string;
  category: string;
  images: string[];
  averageRating: number;
  totalReviews: number;
}

export interface AdminReview extends Omit<Review, 'user' | 'product'> {
  user: AdminReviewUser;
}

export interface AdminReviewedProductsResponse {
  success: boolean;
  products: AdminReviewProduct[];
  pagination: ReviewPagination;
}

export interface AdminReviewsResponse {
  success: boolean;
  reviews: AdminReview[];
  pagination: ReviewPagination;
}

export const getAdminReviewedProducts = async (params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<AdminReviewedProductsResponse> => {
  const { data } = await api.get("/admin/reviews", { params });
  return data;
};

export const getProductReviews = async (
  productId: string,
  params: {
    page?: number;
    limit?: number;
    rating?: string;
    search?: string;
  }
): Promise<AdminReviewsResponse> => {
  const { data } = await api.get(`/admin/reviews/${productId}`, { params });
  return data;
};

export const deleteAdminReview = async (
  reviewId: string,
): Promise<{ success: boolean; message: string }> => {
  const { data } = await api.delete(`/admin/reviews/${reviewId}`);
  return data;
};
