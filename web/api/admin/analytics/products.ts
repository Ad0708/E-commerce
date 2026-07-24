// api/admin/analytics/products.ts

import api from "@/lib/axios/axios";
import type {
  LeastSellingProductsResponse,
  ProductSummaryResponse,
  ProfitByProductResponse,
  RevenueByProductResponse,
  TopSellingProductsResponse,
} from "@/types/analytics/products";

export const getProductSummary = async (): Promise<ProductSummaryResponse> => {
  const { data } = await api.get<ProductSummaryResponse>(
    "/admin/analytics/products/summary",
  );

  return data;
};

export const getTopSellingProducts = async (
  limit = 5,
): Promise<TopSellingProductsResponse> => {
  const { data } = await api.get<TopSellingProductsResponse>(
    "/admin/analytics/products/top-selling",
    {
      params: { limit },
    },
  );

  return data;
};

export const getLeastSellingProducts = async (
  limit = 5,
): Promise<LeastSellingProductsResponse> => {
  const { data } = await api.get<LeastSellingProductsResponse>(
    "/admin/analytics/products/least-selling",
    {
      params: { limit },
    },
  );

  return data;
};

export const getRevenueByProduct = async (
  limit = 5,
): Promise<RevenueByProductResponse> => {
  const { data } = await api.get<RevenueByProductResponse>(
    "/admin/analytics/products/revenue",
    {
      params: { limit },
    },
  );

  return data;
};

export const getProfitByProduct = async (
  limit = 5,
): Promise<ProfitByProductResponse> => {
  const { data } = await api.get<ProfitByProductResponse>(
    "/admin/analytics/products/profit",
    {
      params: { limit },
    },
  );

  return data;
};
