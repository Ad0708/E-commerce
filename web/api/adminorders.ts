import api from "@/lib/axios/axios";
import { Order, OrderStatusType } from "@/types/order";
import { AxiosResponse } from "axios";

export interface AdminOrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  year?: string;
  month?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetAdminOrdersResponse {
  orders: (Order & { customerEmail?: string })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface GetAdminOrderResponse {
  order: Order & { customerEmail?: string };
}

export interface UpdateOrderStatusResponse {
  message: string;
  order: Order;
}

/**
 * Fetch All Orders for Admin with Filters & Pagination
 */
export const getAdminOrders = async (
  filters: AdminOrderFilters
): Promise<GetAdminOrdersResponse> => {
  const response: AxiosResponse<GetAdminOrdersResponse> = await api.get(
    "/admin/orders",
    { params: filters }
  );
  return response.data;
};

/**
 * Fetch Single Order Details for Admin
 */
// export const getAdminOrderById = async (
//   orderId: string
// ): Promise<GetAdminOrderResponse> => {
//   const response: AxiosResponse<GetAdminOrderResponse> = await api.get(
//     `/admin/orders/${orderId}`
//   );
//   console.log("getAdminOrderById response:", response);
//   return response.data;
// };

/**
 * Update Order Status
 */
export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatusType
): Promise<UpdateOrderStatusResponse> => {
  const response: AxiosResponse<UpdateOrderStatusResponse> = await api.patch(
    `/admin/orders/${orderId}/status`,
    { status }
  );
  return response.data;
};