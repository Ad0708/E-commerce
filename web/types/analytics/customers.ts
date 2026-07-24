export type TrendType = "daily" | "monthly" | "yearly";

export interface CustomerSummary {
  totalCustomers: number;
  activeCustomers: number;
  newCustomersToday: number;
  newCustomersThisWeek: number;
  newCustomersThisMonth: number;
  returningCustomers: number;
  averageSpend: number;
  averageCLV: number;
  averageOrderFrequency: number;
}

export interface CustomerSummaryResponse {
  success: boolean;
  customerSummary: CustomerSummary;
}

export interface TopCustomer {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  joinedAt: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastPurchase: string;
}

export interface TopCustomersResponse {
  success: boolean;
  topCustomers: TopCustomer[];
}

export interface CustomerTrend {
  success: boolean;
  type: TrendType;
  labels: string[];
  customers: number[];
}

export interface RepeatCustomers {
  newCustomers: number;
  returningCustomers: number;
  totalCustomers: number;
  newPercentage: number;
  returningPercentage: number;
}

export interface RepeatCustomersResponse {
  success: boolean;
  repeatCustomers: RepeatCustomers;
}

export interface OrderFrequency {
  range: string;
  customers: number;
  percentage: number;
}

export interface OrderFrequencyResponse {
  success: boolean;
  orderFrequency: OrderFrequency[];
}

export interface FavoriteCategory {
  category: string;
  orders: number;
  quantitySold: number;
  revenue: number;
  percentage: number;
}

export interface FavoriteCategoriesResponse {
  success: boolean;
  favoriteCategories: FavoriteCategory[];
}