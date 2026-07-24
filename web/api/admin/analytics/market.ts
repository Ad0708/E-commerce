import axiosInstance from "@/lib/axios/axios";

import type {
  MarketingOverview,
  MarketingChannel,
  CampaignPerformance,
  MarketingMedium,
  InfluencerPerformance,
} from "@/types/analytics/market";

export const getMarketingOverview = async (): Promise<MarketingOverview> => {
  const { data } = await axiosInstance.get(
    "/admin/analytics/marketing/overview",
  );
  // console.log("data1", data.data);
  return data.data;
};

export const getMarketingChannels = async (): Promise<MarketingChannel[]> => {
  const { data } = await axiosInstance.get(
    "/admin/analytics/marketing/channels",
  );
  // console.log("data2", data.data);
  return data.data;
};

export const getCampaignPerformance = async (): Promise<  []> => {
  const { data } = await axiosInstance.get(
    "/admin/analytics/marketing/campaigns",
  );

  // console.log("data3", data.data);

  return data.data;
};

export const getMarketingMediumPerformance = async (): Promise<
  MarketingMedium[]
> => {
  const { data } = await axiosInstance.get(
    "/admin/analytics/marketing/mediums",
  );
  console.log("data4", data.data);
  return data.data;
};

export const getInfluencerPerformance = async (): Promise<
  InfluencerPerformance[]
> => {
  const { data } = await axiosInstance.get(
    "/admin/analytics/marketing/influencers",
  );
  // console.log("data5", data.data);
  return data.data;
};
