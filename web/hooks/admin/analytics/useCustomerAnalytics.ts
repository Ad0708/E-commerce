import { useQuery } from "@tanstack/react-query";

import {
  getCustomerSummary,
  getTopCustomers,
  getCustomerTrend,
  getRepeatCustomers,
  getOrderFrequency,
  getFavoriteCategories,
} from "@/api/admin/analytics/customers";

import type { TrendType } from "@/types/analytics/customers";

export const customerKeys = {
  summary: ["customer-summary"] as const,
  topCustomers: ["customer-top-customers"] as const,
  trend: (type: TrendType) => ["customer-trend", type] as const,
  repeat: ["customer-repeat"] as const,
  frequency: ["customer-frequency"] as const,
  categories: ["customer-categories"] as const,
};

export const useCustomerSummary = () =>
  useQuery({
    queryKey: customerKeys.summary,
    queryFn: async () => {
      const data = await getCustomerSummary();
      return data.customerSummary;
    },
  });

export const useTopCustomers = () =>
  useQuery({
    queryKey: customerKeys.topCustomers,
    queryFn: async () => {
      const data = await getTopCustomers();
      return data.topCustomers;
    },
  });

export const useCustomerTrend = (type: TrendType) =>
  useQuery({
    queryKey: customerKeys.trend(type),
    queryFn: () => getCustomerTrend(type),
  });

export const useRepeatCustomers = () =>
  useQuery({
    queryKey: customerKeys.repeat,
    queryFn: async () => {
      const data = await getRepeatCustomers();
      return data.repeatCustomers;
    },
  });

export const useOrderFrequency = () =>
  useQuery({
    queryKey: customerKeys.frequency,
    queryFn: async () => {
      const data = await getOrderFrequency();
      return data.orderFrequency;
    },
  });

export const useFavoriteCategories = () =>
  useQuery({
    queryKey: customerKeys.categories,
    queryFn: async () => {
      const data = await getFavoriteCategories();
      return data.favoriteCategories;
    },
  });
