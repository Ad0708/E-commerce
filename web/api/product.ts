import api from "@/lib/axios/axios";
import axiosInstance from "@/lib/axios/axios";
import { Product } from "@/types/product";

export const createProductApi = async (data: FormData) => {
  const response = await axiosInstance.post("/products", data);

  return response.data;
};

export const fetchProduct = async (id: string): Promise<Product> => {
  const res = await axiosInstance.get(`/products/${id}`);
  return res.data.product;
};

export const updateProductApi = async ({
  id,
  data,
}: {
  id: string;
  data: FormData | Partial<Product> | Record<string, any>;
}) => {
  // Axios/Fetch automatically sets 'application/json' for plain objects
  // or 'multipart/form-data' for FormData instances
  const response = await api.put(`/products/${id}`, data);
  return response.data;
};
export const getProductsApi = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) => {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("limit", limit.toString());

  if (search) params.set("search", search);
  if (category) params.set("category", category);

  const response = await api.get(`/products?${params.toString()}`);

  return response.data;
};

export const getallProductsApi = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  status = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}) => {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("limit", limit.toString());

  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (status) params.set("status", status);

  const response = await api.get(`/products/a/?${params.toString()}`);

  return response.data;
};

export const getFeaturedProducts = async ({
  page = 1,
  limit = 10,
  featured = true,
}: {
  page?: number;
  limit?: number;
  featured?: boolean;
}) => {
  const params = new URLSearchParams();

  params.set("page", page.toString());
  params.set("limit", limit.toString());
  if (featured) params.set("featured", featured.toString());

  const { data } = await api.get(`/products/?${params.toString()}`);

  return data;
};

export const getProductsByIdsApi = async (
  ids: string[],
): Promise<Product[]> => {
  const { data } = await api.post("/products/by-ids", {
    ids,
  });

  return data.products;
};

export const deleteProduct = async (id: string) => {
  const res = await axiosInstance.delete(`/products/${id}`);
  return res.data;
};

export const getSimilarProductsApi = async (id: string) => {
  const response = await api.get(`/products/${id}/similar`);
  return response.data;
};
