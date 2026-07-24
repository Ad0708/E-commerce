import api from "@/lib/axios/axios";

import type {
  CustomerSummaryResponse,
  TopCustomersResponse,
  CustomerTrend,
  RepeatCustomersResponse,
  OrderFrequencyResponse,
  FavoriteCategoriesResponse,
  TrendType,
} from "@/types/analytics/customers";

export const getCustomerSummary =
  async (): Promise<CustomerSummaryResponse> => {
    const { data } = await api.get<CustomerSummaryResponse>(
      "/admin/analytics/customers/summary",
    );

    return data;
  };

export const getTopCustomers = async (): Promise<TopCustomersResponse> => {
  const { data } = await api.get<TopCustomersResponse>(
    "/admin/analytics/customers/top-customers",
  );

  return data;
};

export const getCustomerTrend = async (
  type: TrendType,
): Promise<CustomerTrend> => {
  const { data } = await api.get<CustomerTrend>(
    "/admin/analytics/customers/trend",
    {
      params: { type },
    },
  );

  return data;
};

export const getRepeatCustomers =
  async (): Promise<RepeatCustomersResponse> => {
    const { data } = await api.get<RepeatCustomersResponse>(
      "/admin/analytics/customers/repeat-vs-new",
    );

    return data;
  };

export const getOrderFrequency = async (): Promise<OrderFrequencyResponse> => {
  const { data } = await api.get<OrderFrequencyResponse>(
    "/admin/analytics/customers/order-frequency",
  );

  return data;
};

export const getFavoriteCategories =
  async (): Promise<FavoriteCategoriesResponse> => {
    const { data } = await api.get<FavoriteCategoriesResponse>(
      "/admin/analytics/customers/favorite-categories",
    );

    return data;
  };
