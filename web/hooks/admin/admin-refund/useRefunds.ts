import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getRefunds,
  approveRefund,
  rejectRefund,
  GetRefundsParams,
} from "@/api/admin/refund";

export const useRefunds = ({
  page = 1,
  limit = 10,
  status,
  refundMethod,
  search,
}: GetRefundsParams) => {
  return useQuery({
    queryKey: ["admin-refunds", page, limit, status, refundMethod, search],
    queryFn: () =>
      getRefunds({
        page,
        limit,
        status,
        refundMethod,
        search,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 3 * 60 * 1000,
  });
};
export const useApproveRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: approveRefund,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-refunds"],
      });
    },
  });
};
export const useRejectRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: rejectRefund,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-refunds"],
      });
    },
  });
};
