import api from "@/lib/axios/axios";
import {
  InventoryResponse,
  UpdateStockPayload,
  UpdateStockResponse,
  UseInventoryParams,
} from "@/types/inventory";

export const fetchInventory = async (
  params: UseInventoryParams,
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
    `/inventory?${query.toString()}`,
  );
  return data;
};

export const updateStock = async ({
  productId,
  stock,
}: UpdateStockPayload): Promise<UpdateStockResponse> => {
  const { data } = await api.patch<UpdateStockResponse>(
    `/inventory/${productId}/stock`,
    { stock },
  );
  return data;
};
