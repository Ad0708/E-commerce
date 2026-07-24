"use client";

import { useQuery } from "@tanstack/react-query";
import { Product } from "@/types/product";
import { fetchProduct, getSimilarProductsApi } from "@/api/product";

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}

export const useSimilarProducts = (id: string) => {
  return useQuery({
    queryKey: ["similar-products", id],
    queryFn: () => getSimilarProductsApi(id),
    enabled: !!id,
  });
};
