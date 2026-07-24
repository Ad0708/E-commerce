import { useQuery } from "@tanstack/react-query";
import { getSalesAnalytics, SalesReportType } from "@/api/admin/report";

export const useSalesAnalytics = (type: SalesReportType) => {
  return useQuery({
    queryKey: ["sales-analytics", type],
    queryFn: () => getSalesAnalytics(type),
    staleTime: 1000 * 60 * 5,
  });
};
