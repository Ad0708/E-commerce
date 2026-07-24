export interface SalesSummaryResponse {
  success: boolean;
  summary: SalesSummary;
}

export interface SalesSummary {
  averageOrderValue: number;
  grossProfit: number;
  monthOrders: number;
  monthRevenue: number;
  netProfit: number;
  todayOrders: number;
  todayRevenue: number;
  totalDiscount: number;
  totalOrders: number;
  totalRefundAmount: number;
  totalRevenue: number;
  weekOrders: number;
  weekRevenue: number;
  yearOrders: number;
  yearRevenue: number;
  yesterdayOrders: number;
  yesterdayRevenue: number;
}

export interface PaymentAnalyticsResponse {
  success: boolean;
  paymentAnalytics: PaymentMethod[];
}

export interface PaymentMethod {
  method: "COD" | "RAZORPAY" | "STRIPE" | "OTHERS";
  revenue: number;
  orders: number;
  percentage: number;
}

export interface OrderStatus {
  status: string;
  orders: number;
}

export interface OrderStatusAnalytics {
  success: boolean;
  orderStatusAnalytics: OrderStatus[];
}

export interface RefundAnalyticsResopnse {
  success: boolean;
  summary: RefundAnalyticsSummary;
  refundAnalytics: RefundAnalytic[];
}

export interface RefundAnalytic {
  amount: number;
  count: number;
  percentage: number;
  status: string;
}

export interface RefundAnalyticsSummary {
  totalRefundAmount: number;
  totalRefunds: number;
}

export interface DiscountAnalyticsResponse {
  success: boolean;
  discountAnalytics: DiscountAnalytics;
}

export interface DiscountAnalytics {
  couponDiscount: number;
  couponUsageRate: number;
  ordersUsingCoupon: number;
  productDiscount: number;
  totalDiscount: number;
}

export interface CategoryAnalyticsResponse {
  success: boolean;
  categoryAnalytics: CategoryAnalytics[];
}

export interface CategoryAnalytics {
  category: string;
  revenue: number;
  orders: number;
  productsSold: number;
  percentage: number;
}

export interface RevenueTrendResponse {
  success: boolean;
  labels: string[];
  revenue: number[];
  orders: number[];
}

export type TrendType = "daily" | "monthly" | "yearly";
