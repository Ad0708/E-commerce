import CampaignPerformanceTable from "./CampaignPerformanceTable";
import InfluencerPerformanceTable from "./InfluencerPerformanceTable";
import MarketingChannelChart from "./MarketingChannelChart";
import MarketingMediumChart from "./MarketingMediumChart";
import MarketingOverviewCards from "./MarketingOverviewCards";

export const metadata = {
  title: "Marketing Analytics Dashboard | Admin Panel",
  description:
    "Monitor campaign ROI, multi-channel performance distributions, and influencer impact tracking.",
};

export default function MarketingAnalyticsPage() {
  return (
    <div className="bg-slate-50/50 dark:bg-slate-950/50 ">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Marketing Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Real-time tracking of capital allocation, conversion funnels, and
            performance across acquisition vectors.
          </p>
        </div>

        {/* Overview Metric Grid */}
        <MarketingOverviewCards />

        {/* Visual Channel & Medium Analytics Layer */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MarketingChannelChart />
          <MarketingMediumChart />
        </div>

        {/* Campaigns Performance View */}
        <CampaignPerformanceTable />

        {/* Influencer Attribution Matrix */}
        <InfluencerPerformanceTable />
      </div>
    </div>
  );
}
