import api from "@/lib/axios/axios";

export type SalesReportType = "daily" | "monthly" | "yearly";

export interface SalesAnalyticsResponse {
  labels: string[];
  revenue: number[];
  orders: number[];
}

export const getSalesAnalytics = async (
  type: SalesReportType = "daily",
): Promise<SalesAnalyticsResponse> => {
  const { data } = await api.get("/admin/reports/sales", {
    params: {
      type,
    },
  });

  return {
    labels: data.labels,
    revenue: data.revenue,
    orders: data.orders,
  };
};
