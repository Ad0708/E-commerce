import api from "@/lib/axios/axios";
import { CouponFormValues } from "@/lib/validators/coupon.schema";

interface GetCouponsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  type?: string;
  appliesTo?: string;
}

export const createCouponApi = async (
  data: CouponFormValues,
) => {
  const response = await api.post("/coupons", data);
  return response.data;
};

export const getAdminCouponsApi = async ({
  page,
  limit,
  search,
  status,
  type,
  appliesTo,
}: GetCouponsParams) => {
  const response = await api.get("/coupons/admin", {
    params: {
      page,
      limit,
      search,
      status,
      type,
      appliesTo,
    },
  });

  return response.data;
};

export const getCouponsApi = async ({
  page,
  limit,
  search,
  status,
  type,
  appliesTo,
}: GetCouponsParams) => {
  const response = await api.get("/coupons", {
    params: {
      page,
      limit,
      search,
      status,
      type,
      appliesTo,
    },
  });

  return response.data;
};

export const getCouponApi = async (id: string) => {
  const response = await api.get(`/coupons/${id}`);
  return response.data;
};

export const updateCouponApi = async ({
  id,
  data,
}: {
  id: string;
  data: CouponFormValues;
}) => {
  const response = await api.put(`/coupons/${id}`, data);
  return response.data;
};

export const deleteCouponApi = async (id: string) => {
  const response = await api.delete(`/coupons/${id}`);
  return response.data;
};

export const updateCouponStatusApi = async ({
  id,
  status,
}: {
  id: string;
  status: "active" | "inactive" | "scheduled";
}) => {
  const response = await api.patch(
    `/coupons/${id}/status`,
    {
      status,
    },
  );

  return response.data;
};

export const applyCouponApi = async ({
  code,
}: {
  code: string;
}) => {
  const response = await api.post("/coupons/apply", {
    code,
  });

  return response.data;
};

export const removeCouponApi = async () => {
  const response = await api.delete("/coupons/remove");

  return response.data;
};