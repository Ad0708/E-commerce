// hooks/product/useProductsByIds.ts

import { useQuery } from "@tanstack/react-query";
import { getProductsByIdsApi } from "@/api/product";

export const useProductsByIds = (ids: string[]) => {
  return useQuery({
    queryKey: ["products-by-ids", ids],
    queryFn: () => getProductsByIdsApi(ids),
    enabled: ids.length > 0,
    placeholderData: (prev) => prev,
  });
};
