import api from "@/lib/axios/axios";

import {
  ProductDescriptionRequest,
  ProductDescriptionResponse,
  SeoTitleRequest,
  SeoTitleResponse,
  KeywordGeneratorRequest,
  KeywordGeneratorResponse,
  BackgroundRemovalResponse,
  SalesInsightsResponse,
  InventoryForecastResponse,
  CustomerSupportRequest,
  CustomerSupportResponse,
  SalesAnalyticsType,
} from "@/types/ai";

export const generateProductDescription = async (
  data: ProductDescriptionRequest,
): Promise<ProductDescriptionResponse> => {
  console.log(data);
  const response = await api.post("/admin/ai/product-description", data);

  return response.data.data;
};

export const generateSeoTitle = async (
  data: SeoTitleRequest,
): Promise<SeoTitleResponse> => {
  const response = await api.post("/admin/ai/seo-title", data);

  return response.data.data;
};

export const generateKeywords = async (
  data: KeywordGeneratorRequest,
): Promise<KeywordGeneratorResponse> => {
  const response = await api.post("/admin/ai/keywords", data);

  return JSON.parse(response.data.data);
};

export const removeBackground = async (formData: FormData) => {
  const response = await api.post("/admin/ai/remove-background", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};

export const getSalesInsights = async (
  type: SalesAnalyticsType = "monthly",
): Promise<SalesInsightsResponse> => {
  const response = await api.get(`/admin/ai/sales-insights?type=${type}`);

  return response.data.data;
};

// Customer Support AI
export const generateInventoryForecast = async (productId: string) => {
  const response = await api.get("/admin/ai/inventory-forecast", {
    params: {
      productId,
    },
  });

  return response.data.data;
};

export const askCustomerSupportAI = async (
  data: CustomerSupportRequest,
): Promise<CustomerSupportResponse> => {
  const response = await api.post("/admin/ai/customer-support", data);

  return response.data.data;
};
