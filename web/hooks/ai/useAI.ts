import { useMutation, useQuery } from "@tanstack/react-query";

import {
  generateProductDescription,
  generateSeoTitle,
  generateKeywords,
  removeBackground,
  getSalesInsights,
  askCustomerSupportAI,
  generateInventoryForecast,
} from "@/api/ai";

import {
  ProductDescriptionRequest,
  SeoTitleRequest,
  KeywordGeneratorRequest,
  CustomerSupportRequest,
  SalesAnalyticsType,
} from "@/types/ai";

// ─────────────────────────────────────────────
// Product Description Generator
// ─────────────────────────────────────────────

export const useGenerateProductDescription = () => {
  return useMutation({
    mutationFn: (data: ProductDescriptionRequest) =>
      generateProductDescription(data),
  });
};

// ─────────────────────────────────────────────
// SEO Title Generator
// ─────────────────────────────────────────────

export const useGenerateSeoTitle = () => {
  return useMutation({
    mutationFn: (data: SeoTitleRequest) => generateSeoTitle(data),
  });
};

// ─────────────────────────────────────────────
// Keyword Generator
// ─────────────────────────────────────────────

export const useGenerateKeywords = () => {
  return useMutation({
    mutationFn: (data: KeywordGeneratorRequest) => generateKeywords(data),
  });
};

// ─────────────────────────────────────────────
// Image Background Removal
// ─────────────────────────────────────────────

export const useRemoveBackground = () => {
  return useMutation({
    mutationFn: (formData: FormData) => removeBackground(formData),
  });
};

// ─────────────────────────────────────────────
// Sales Insights
// ─────────────────────────────────────────────

export const useSalesInsights = (type: SalesAnalyticsType = "monthly") => {
  return useQuery({
    queryKey: ["sales-insights", type],
    queryFn: () => getSalesInsights(type),
  });
};

// ─────────────────────────────────────────────
// Inventory Forecasting
// ─────────────────────────────────────────────

export const useInventoryForecast = () => {
  return useMutation({
    mutationFn: ({ productId }: { productId: string }) =>
      generateInventoryForecast(productId),
  });
};
// ─────────────────────────────────────────────
// Customer Support AI
// ─────────────────────────────────────────────

export const useCustomerSupportAI = () => {
  return useMutation({
    mutationFn: (data: CustomerSupportRequest) => askCustomerSupportAI(data),
  });
};
