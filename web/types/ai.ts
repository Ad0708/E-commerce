export interface ProductDescriptionRequest {
  productName: string;
  category: string;
  brand?: string;
  features?: string[];
  tone?: string;
}

export interface ProductDescriptionResponse {
  description: string;
}

export interface SeoTitleRequest {
  productName: string;
  category: string;
  brand?: string;
  keywords?: string[];
}

export interface SeoTitleResponse {
  titles: string;
}

export interface KeywordGeneratorRequest {
  productName: string;
  category: string;
  description?: string;
}

export interface KeywordGeneratorResponse {
  primary: string[];
  secondary: string[];
  longTail: string[];
  tags: string[];
}

export interface BackgroundRemovalResponse {
  originalUrl: string;
  processedUrl: string;
}

export type SalesAnalyticsType = "daily" | "monthly" | "yearly";

export interface SalesAnalytics {
  type: SalesAnalyticsType;
  labels: string[];
  revenue: number[];
  orders: number[];
}

export interface SalesInsightsResponse {
  analytics: SalesAnalytics;
  insights: string;
}

export interface InventorySalesHistory {
  date: string;
  quantitySold: number;
  orders: number;
}

export interface InventoryForecastProduct {
  id: string;
  name: string;
  stock: number;
}

export interface InventoryForecastResponse {
  product: InventoryForecastProduct;
  salesHistory: InventorySalesHistory[];
  forecast: string;
}

export interface CustomerSupportMessage {
  role: "user" | "assistant";
  content: string;
}

export interface CustomerSupportRequest {
  message: string;
  orderId?: string;
  conversationHistory?: CustomerSupportMessage[];
}

export interface CustomerSupportResponse {
  response: string;
}
