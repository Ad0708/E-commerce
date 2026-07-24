// hooks/admin/analytics/useProductAnalytics.ts

import { useQuery } from "@tanstack/react-query";
import {
  getLeastSellingProducts,
  getProductSummary,
  getProfitByProduct,
  getRevenueByProduct,
  getTopSellingProducts,
} from "@/api/admin/analytics/products";

export const productKeys = {
  summary: ["product-summary"] as const,
  topSelling: ["product-top-selling"] as const,
  leastSelling: ["product-least-selling"] as const,
  revenue: ["product-revenue"] as const,
  profit: ["product-profit"] as const,
};

export const useProductSummary = () =>
  useQuery({
    queryKey: productKeys.summary,
    queryFn: async () => {
      const data = await getProductSummary();

      return data.productSummary;
    },
  });

export const useTopSellingProducts = () =>
  useQuery({
    queryKey: productKeys.topSelling,
    queryFn: async () => {
      const data = await getTopSellingProducts();

      return data.topSellingProducts;
    },
  });

export const useLeastSellingProducts = () =>
  useQuery({
    queryKey: productKeys.leastSelling,
    queryFn: async () => {
      const data = await getLeastSellingProducts();

      return data.leastSellingProducts;
    },
  });

export const useRevenueByProduct = () =>
  useQuery({
    queryKey: productKeys.revenue,
    queryFn: async () => {
      const data = await getRevenueByProduct();

      return data.revenueByProduct;
    },
  });

export const useProfitByProduct = () =>
  useQuery({
    queryKey: productKeys.profit,
    queryFn: async () => {
      const data = await getProfitByProduct();

      return data.profitByProduct;
    },
  });

export const useProductsAnalytics = () => ({
  productSummary: useProductSummary(),
  topSellingProducts: useTopSellingProducts(),
  leastSellingProducts: useLeastSellingProducts(),
  revenueByProduct: useRevenueByProduct(),
  profitByProduct: useProfitByProduct(),
});
