import api from "@/lib/axios/axios";
import { CreateOrderPayload, Order } from "@/types/order";
import { AxiosResponse } from "axios";

interface CreateOrderResponse {
  message: string;
  order: Order;
}


interface GetOrdersResponse {
  orders: Order[];
}


interface GetOrderResponse {
  order: Order;
}


/**
 * Create Order
 */
export const createOrder = async (
  data: CreateOrderPayload
): Promise<CreateOrderResponse> => {
  const response: AxiosResponse<CreateOrderResponse> =
    await api.post("/orders", data);

  return response.data;
};


/**
 * Get Logged In User Orders
 */
export const getMyOrders = async (): Promise<GetOrdersResponse> => {
  const response: AxiosResponse<GetOrdersResponse> =
    await api.get("/orders");

  return response.data;
};


/**
 * Get Single Order
 */
export const getOrderById = async (
  orderId: string
): Promise<GetOrderResponse> => {
  const response: AxiosResponse<GetOrderResponse> =
    await api.get(`/orders/${orderId}`);

  return response.data;
};


/**
 * Cancel Order
 */
export const cancelOrder = async (
  orderId: string
): Promise<CreateOrderResponse> => {
  const response: AxiosResponse<CreateOrderResponse> =
    await api.patch(`/orders/${orderId}/cancel`);

  return response.data;
};