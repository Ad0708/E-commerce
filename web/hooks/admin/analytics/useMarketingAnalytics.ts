import { useQuery } from "@tanstack/react-query";

import {
  getMarketingOverview,
  getMarketingChannels,
  getCampaignPerformance,
  getMarketingMediumPerformance,
  getInfluencerPerformance,
} from "@/api/admin/analytics/market";

export const useMarketingOverview = () => {
  return useQuery({
    queryKey: ["marketing-overview"],
    queryFn: getMarketingOverview,
  });
};

export const useMarketingChannels = () => {
  return useQuery({
    queryKey: ["marketing-channels"],
    queryFn: getMarketingChannels,
  });
};

export const useCampaignPerformance = () => {
  return useQuery({
    queryKey: ["marketing-campaigns"],
    queryFn: getCampaignPerformance,
  });
};

export const useMarketingMediumPerformance = () => {
  return useQuery({
    queryKey: ["marketing-mediums"],
    queryFn: getMarketingMediumPerformance,
  });
};

export const useInfluencerPerformance = () => {
  return useQuery({
    queryKey: ["marketing-influencers"],
    queryFn: getInfluencerPerformance,
  });
};
