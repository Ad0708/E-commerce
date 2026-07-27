export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  type: "percentage" | "fixed";
  value: number;
  minimumOrderAmount: number;
  maximumDiscount: number;
  usageLimit: number;
  usedCount: number;
  status: "active" | "inactive" | "scheduled";
  appliesTo: "all" | "products" | "categories";
  products: string[];
  categories: string[];
  startDate: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CouponsResponse {
  success: boolean;
  message?: string;
  coupons: Coupon[];
  pagination: Pagination;
}

export interface CouponResponse {
  success: boolean;
  coupon: Coupon;
}

export interface FilterState {
  search: string;
  type: "all" | "percentage" | "fixed";
  status: "all" | "active" | "inactive" | "scheduled" | "expired";
  page: number;
  limit: number;
}
