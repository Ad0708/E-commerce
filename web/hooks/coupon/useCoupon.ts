import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import {
  applyCouponApi,
  createCouponApi,
  deleteCouponApi,
  getCouponApi,
  getCouponsApi,
  getAdminCouponsApi,
  removeCouponApi,
  updateCouponApi,
  updateCouponStatusApi,
} from "@/api/coupon";

import { CouponFormValues } from "@/lib/validators/coupon.schema";
import { Coupon, CouponsResponse } from "@/types/coupon";

/* -------------------------------------------------------------------------- */
/*                                  Queries                                   */
/* -------------------------------------------------------------------------- */

export interface GetCouponsProps {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "inactive" | "scheduled" | "expired" | "all";
  type?: "percentage" | "fixed";
  appliesTo?: "all" | "products" | "categories";
}

interface InfiniteCouponsProps extends Omit<GetCouponsProps, "page"> {}

export const useCoupons = ({
  page,
  limit,
  search,
  status,
  type,
  appliesTo,
}: GetCouponsProps) => {
  return useQuery<CouponsResponse>({
    queryKey: ["coupons", page, limit, search, status, type, appliesTo],

    queryFn: () =>
      getAdminCouponsApi({
        page,
        limit,
        search,
        status,
        type,
        appliesTo,
      }),

    placeholderData: (previousData) => previousData,
  });
};

export const useInfiniteCoupons = ({
  limit = 10,
  search = "",
  status,
  type,
  appliesTo,
}: InfiniteCouponsProps = {}) => {
  return useInfiniteQuery<CouponsResponse>({
    queryKey: ["infinite-coupons", limit, search, status, type, appliesTo],

    queryFn: ({ pageParam = 1 }) =>
      getCouponsApi({
        page: pageParam as number,
        limit,
        search,
        status,
        type,
        appliesTo,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNextPage) {
        return lastPage.pagination.page + 1;
      }

      return undefined;
    },

    staleTime: 1000 * 60 * 5,
  });
};

export const useCoupon = (id: string) => {
  return useQuery({
    queryKey: ["coupon", id],

    queryFn: () => getCouponApi(id),

    enabled: !!id,
  });
};

export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCouponApi,

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["coupons"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to create coupon.");
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CouponFormValues }) =>
      updateCouponApi({ id, data }),

    onSuccess: (data, variables) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["coupons"],
      });

      queryClient.invalidateQueries({
        queryKey: ["coupon", variables.id],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to update coupon.");
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCouponApi,

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["coupons"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to delete coupon.");
    },
  });
};

export const useUpdateCouponStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "active" | "inactive" | "scheduled";
    }) => updateCouponStatusApi({ id, status }),

    onSuccess: (data, variables) => {
      toast.success(data.message);

      queryClient.invalidateQueries({
        queryKey: ["coupons"],
      });

      queryClient.invalidateQueries({
        queryKey: ["coupon", variables.id],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to update coupon status.",
      );
    },
  });
};

export const useApplyCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: applyCouponApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      toast.success("Coupon applied successfully.");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to apply coupon.");
    },
  });
};

export const useRemoveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCouponApi,

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });

      toast.success(data?.message || "Coupon removed successfully.");
    },

    onError: (error: any) => {
      toast.error(error?.response?.data?.message ?? "Failed to remove coupon.");
    },
  });
};
