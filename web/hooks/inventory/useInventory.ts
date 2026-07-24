import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios/axios"; // your axios instance with baseURL
import { InventoryResponse, StockFilter } from "@/types/inventory";

type UseInventoryParams = {
  search?: string;
  stockFilter?: StockFilter;
  category?: string;
  page?: number;
  limit?: number;
};

const fetchInventory = async (
  params: UseInventoryParams
): Promise<InventoryResponse> => {
  const query = new URLSearchParams();

  if (params.search) query.set("search", params.search);
  if (params.stockFilter && params.stockFilter !== "all")
    query.set("stockFilter", params.stockFilter);
  if (params.category && params.category !== "all")
    query.set("category", params.category);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const { data } = await api.get<InventoryResponse>(
    `/inventory?${query.toString()}`
  );
  return data;
};

export const useInventory = (params: UseInventoryParams = {}) => {
  return useQuery({
    queryKey: ["inventory", params],
    queryFn: () => fetchInventory(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
};