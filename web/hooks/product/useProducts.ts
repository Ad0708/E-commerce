import { useQuery } from "@tanstack/react-query";
import { getProductsApi } from "@/api/product";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  enabled?: boolean;
};

export const useProducts = ({
  page,
  limit,
  search,
  category,
  enabled = true,
}: Props) => {
  return useQuery({
    queryKey: [
      "products",
      page,
      limit,
      search,
      category,
      enabled,
    ],

    queryFn: () =>
      getProductsApi({
        page,
        limit,
        search,
        category,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 3 * 60 * 1000,
  });
};