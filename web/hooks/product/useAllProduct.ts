import { useQuery } from "@tanstack/react-query";
import { getallProductsApi } from "@/api/product";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
};

export const useallProducts = ({
  page,
  limit,
  search,
  category,
  status,
}: Props) => {
  return useQuery({
    queryKey: ["products", page, limit, search, category, status],
    queryFn: () =>
      getallProductsApi({
        page,
        limit,
        search,
        category,
        status,
      }),
    placeholderData: (previousData) => previousData,
  });
};
