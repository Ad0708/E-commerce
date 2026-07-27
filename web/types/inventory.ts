export type StockFilter = "all" | "in" | "low" | "out";

export type UseInventoryParams = {
  search?: string;
  stockFilter?: StockFilter;
  category?: string;
  page?: number;
  limit?: number;
};

export type InventoryProduct = {
  _id: string;
  name: string;
  brand: string;
  sku?: string;
  category?: string;
  images: string[];
  stock: number;
  price: number;
  discountPrice?: number;
  updatedAt: string;
};

export type InventorySummary = {
  total: number;
  in: number;
  low: number;
  out: number;
};

export type InventoryPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type InventoryResponse = {
  products: InventoryProduct[];
  pagination: InventoryPagination;
  summary: InventorySummary;
  categories: string[];
};

export type UpdateStockPayload = {
  productId: string;
  stock: number;
};

export type UpdateStockResponse = {
  product: Pick<InventoryProduct, "_id" | "name" | "stock" | "updatedAt">;
  message: string;
};
