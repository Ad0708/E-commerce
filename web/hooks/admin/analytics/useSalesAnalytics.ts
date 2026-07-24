import { useQuery } from "@tanstack/react-query";

import {
  getSalesSummary,
  getPaymentAnalytics,
  getOrderStatusAnalytics,
  getRefundAnalytics,
  getDiscountAnalytics,
  getCategoryRevenueAnalytics,
  getRevenueTrend,
} from "@/api/admin/analytics/sales";

import type { TrendType } from "@/types/analytics/sales";


export const salesKeys = {
  summary: ["sales-summary"] as const,

  payment: ["sales-payment"] as const,

  status: ["sales-status"] as const,

  refunds: ["sales-refunds"] as const,

  discounts: ["sales-discounts"] as const,

  categories: ["sales-categories"] as const,

  trend: (type: TrendType) =>
    ["sales-trend", type] as const,
};



export const useSalesSummary = () =>
  useQuery({
    queryKey: salesKeys.summary,

    queryFn: async () => {
      const data = await getSalesSummary();

      return data.summary;
    },
  });



export const usePaymentAnalytics = () =>
  useQuery({
    queryKey: salesKeys.payment,

    queryFn: async () => {
      const data = await getPaymentAnalytics();

      return data.paymentAnalytics;
    },
  });



export const useOrderStatusAnalytics = () =>
  useQuery({
    queryKey: salesKeys.status,

    queryFn: async () => {
      const data = await getOrderStatusAnalytics();

      return data.orderStatusAnalytics;
    },
  });



export const useRefundAnalytics = () =>
  useQuery({
    queryKey: salesKeys.refunds,

    queryFn: async () => {
      const data = await getRefundAnalytics();

      return data;
    },
  });



export const useDiscountAnalytics = () =>
  useQuery({
    queryKey: salesKeys.discounts,

    queryFn: async () => {
      const data = await getDiscountAnalytics();

      return data.discountAnalytics;
    },
  });



export const useCategoryRevenueAnalytics = () =>
  useQuery({
    queryKey: salesKeys.categories,

    queryFn: async () => {
      const data = await getCategoryRevenueAnalytics();

      return data.categoryAnalytics;
    },
  });



export const useRevenueTrend = (type: TrendType) =>
  useQuery({
    queryKey: salesKeys.trend(type),

    queryFn: async () => {
      const data = await getRevenueTrend(type);

      return data;
    },
  });