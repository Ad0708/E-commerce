import api from "@/lib/axios/axios";

import {
  CreateReviewPayload,
  ProductReviewsResponse,
  ReviewResponse,
  ReviewableOrderResponse,
  UpdateReviewPayload,
} from "@/types/review";

export const createReview = async (
  data: CreateReviewPayload,
): Promise<ReviewResponse> => {
  const response = await api.post("/reviews", data);

  return response.data;
};

export const getProductReviews = async (
  productId: string,
  page = 1,
  limit = 10,
  sort = "latest",
): Promise<ProductReviewsResponse> => {
  const response = await api.get(`/reviews/product/${productId}`, {
    params: {
      page,
      limit,
      sort,
    },
  });

  return response.data;
};

export const getReviewableOrder = async (
  orderId: string,
): Promise<ReviewableOrderResponse> => {
  const response = await api.get(`/reviews/order/${orderId}`);

  return response.data;
};

export const updateReview = async (
  reviewId: string,
  data: UpdateReviewPayload,
): Promise<ReviewResponse> => {
  const response = await api.put(`/reviews/${reviewId}`, data);

  return response.data;
};

export const deleteReview = async (
  reviewId: string,
): Promise<ReviewResponse> => {
  const response = await api.delete(`/reviews/${reviewId}`);

  return response.data;
};
