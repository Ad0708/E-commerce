import api from "@/lib/axios/axios";

export interface Customer {
  _id: string;
  name: string;
  email: string;
  role: "customer";
  avatar: string;
  isBlocked: boolean;
  isVerified: boolean;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CustomerDetails {
  customer: Customer;
  addresses: any[];
  statistics: {
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string | null;
  };
  orders: any[];
}

export interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UpdateCustomerPayload {
  customerId: string;
  name: string;
  email: string;
}

export const getCustomers = async ({
  page = 1,
  limit = 10,
  search = "",
}: GetCustomersParams) => {
  const { data } = await api.get<{
    customers: Customer[];
    pagination: Pagination;
  }>("/admin/customers", {
    params: {
      page,
      limit,
      search,
    },
  });

  return data;
};

export const getCustomerById = async (customerId: string) => {
  const { data } = await api.get<CustomerDetails>(
    `/admin/customers/${customerId}`,
  );

  return data;
};

export const updateCustomer = async ({
  customerId,
  ...payload
}: UpdateCustomerPayload) => {
  const { data } = await api.patch(`/admin/customers/${customerId}`, payload);

  return data;
};

export const blockCustomer = async (customerId: string) => {
  const { data } = await api.patch(`/admin/customers/${customerId}/block`);

  return data;
};

export const unblockCustomer = async (customerId: string) => {
  const { data } = await api.patch(`/admin/customers/${customerId}/unblock`);

  return data;
};
