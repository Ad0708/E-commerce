export interface ReviewUser {
  _id: string;
  name: string;
}

export interface Review {
  _id: string;
  user: ReviewUser;
  product: string;
  order: string;
  rating: number;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRatingSummary {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ProductReviewsResponse {
  success: boolean;
  rating: ReviewRatingSummary;
  reviews: Review[];
  pagination: ReviewPagination;
}

export interface ReviewableProduct {
  productId: string;
  name: string;
  image: string;
  category: string;
  quantity: number;
  alreadyReviewed: boolean;
}

export interface ReviewableOrderResponse {
  success: boolean;
  orderId: string;
  orderNumber: string;
  products: ReviewableProduct[];
}

export interface CreateReviewPayload {
  orderId: string;
  productId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewPayload {
  rating: number;
  comment: string;
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  review?: Review;
}