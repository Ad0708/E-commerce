import api from "@/lib/axios/axios";
export interface GetRefundsParams {
  page?: number;
  limit?: number;
  status?: string;
  refundMethod?: string;
  search?: string;
}
// export const getRefunds = async () => {
//   const { data } = await api.get("/admin/refunds");

//   return data ;
// };

export const getRefunds = async ({
  page = 1,
  limit = 10,
  status,
  refundMethod,
  search,
}: GetRefundsParams) => {
  const { data } = await api.get("/admin/refunds", {
    params: {
      page,
      limit,
      status,
      refundMethod,
      search,
    },
  });

  return data;
};
export const approveRefund = async (id: string) => {
  const { data } = await api.patch(`/admin/refunds/${id}/approve`);

  return data;
};

export const rejectRefund = async (id: string) => {
  const { data } = await api.patch(`/admin/refunds/${id}/reject`);

  return data;
};
