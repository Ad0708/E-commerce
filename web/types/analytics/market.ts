export interface MarketingOverview {
  totalOrders: number;
  totalRevenue: number;
  totalSources: number;
  totalCampaigns: number;
}


export interface MarketingChannel {
  channel: string;
  orders: number;
  revenue: number;
}


export interface CampaignPerformance {
  campaign: string;
  orders: number;
  revenue: number;
  averageOrderValue: number;
}


export interface MarketingMedium {
  medium: string;
  orders: number;
  revenue: number;
  averageOrderValue: number;
}


export interface InfluencerPerformance {
  influencer: string;
  orders: number;
  revenue: number;
  averageOrderValue: number;
}