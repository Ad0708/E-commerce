"use client";

import { useQuery } from "@tanstack/react-query";
import { getFeaturedProducts } from "@/api/product";

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ["products"],

    queryFn: () =>
      getFeaturedProducts({
        page: 1,
        limit: 4,
      }),

    placeholderData: (previousData) => previousData,
  });
};
