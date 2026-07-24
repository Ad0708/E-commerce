export interface ProductSummary {
  totalProducts: number;
  activeProducts: number;
  draftProducts: number;
  outOfStockProducts: number;
  lowStockProducts: number;
  productsSold: number;
  totalRevenue: number;
  estimatedProfit: number;
}

export interface ProductSummaryResponse {
  success: boolean;
  productSummary: ProductSummary;
}

export interface ProductSales {
  _id: string;
  name: string;
  image: string;
  category: string;
  unitsSold: number;
  revenue: number;
  orders: number;
  stock: number;
  status: string;
  price: number;
  discountPrice: number;
}

export interface TopSellingProductsResponse {
  success: boolean;
  topSellingProducts: ProductSales[];
}

export interface ProductAnalytics {
  _id: string;
  name: string;
  image: string;
  category: string;
  unitsSold: number;
  revenue: number;
  orders: number;
  stock: number;
  status: "draft" | "active" | "out_of_stock" | "deleted";
  price: number;
  discountPrice: number;
}

export interface ProductProfitAnalytics extends ProductAnalytics {
  estimatedProfit: number;
}

export interface LeastSellingProductsResponse {
  success: boolean;
  leastSellingProducts: ProductAnalytics[];
}

export interface RevenueByProductResponse {
  success: boolean;
  revenueByProduct: ProductAnalytics[];
}

export interface ProfitByProductResponse {
  success: boolean;
  profitByProduct: ProductProfitAnalytics[];
}
