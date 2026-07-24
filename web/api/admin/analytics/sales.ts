import api from "@/lib/axios/axios";

import type {
  SalesSummaryResponse,
  PaymentAnalyticsResponse,
  OrderStatusAnalytics,
  RefundAnalyticsResopnse,
  DiscountAnalyticsResponse,
  CategoryAnalyticsResponse,
  RevenueTrendResponse,
  TrendType,
} from "@/types/analytics/sales";

export const getSalesSummary = async (): Promise<SalesSummaryResponse> => {
  const { data } = await api.get<SalesSummaryResponse>(
    "/admin/analytics/sales/summary",
  );

  return data;
};

export const getPaymentAnalytics =
  async (): Promise<PaymentAnalyticsResponse> => {
    const { data } = await api.get<PaymentAnalyticsResponse>(
      "/admin/analytics/sales/payment-methods",
    );

    return data;
  };

export const getOrderStatusAnalytics =
  async (): Promise<OrderStatusAnalytics> => {
    const { data } = await api.get<OrderStatusAnalytics>(
      "/admin/analytics/sales/order-status",
    );

    return data;
  };

export const getRefundAnalytics =
  async (): Promise<RefundAnalyticsResopnse> => {
    const { data } = await api.get<RefundAnalyticsResopnse>(
      "/admin/analytics/sales/refunds",
    );

    return data;
  };

export const getDiscountAnalytics =
  async (): Promise<DiscountAnalyticsResponse> => {
    const { data } = await api.get<DiscountAnalyticsResponse>(
      "/admin/analytics/sales/discounts",
    );

    return data;
  };

export const getCategoryRevenueAnalytics =
  async (): Promise<CategoryAnalyticsResponse> => {
    const { data } = await api.get<CategoryAnalyticsResponse>(
      "/admin/analytics/sales/categories",
    );

    return data;
  };

export const getRevenueTrend = async (
  type: TrendType,
): Promise<RevenueTrendResponse> => {
  const { data } = await api.get<RevenueTrendResponse>(
    "/admin/analytics/sales/salesanalytics",
    {
      params: {
        type,
      },
    },
  );

  return data;
};
