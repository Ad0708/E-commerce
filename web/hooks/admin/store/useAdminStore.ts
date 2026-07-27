import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addBanner,
  deleteBanner,
  getAdminStore,
  updateAdminStore,
  updateBanner,
  uploadInvoiceSignature,
  uploadInvoiceStamp,
  uploadStoreLogo,
} from "@/api/admin/adminstore";

import type {
  AddBannerPayload,
  UpdateBannerPayload,
} from "@/api/admin/adminstore";

import type { AdminStore } from "@/types/adminStore";

const STORE_QUERY_KEY = ["admin-store"];

/* -------------------------------------------------------------------------- */
/* Get Store                                                                  */
/* -------------------------------------------------------------------------- */

export const useAdminStore = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEY,
    queryFn: getAdminStore,
    staleTime: 3 * 60 * 1000,
  });
};

/* -------------------------------------------------------------------------- */
/* Update Store                                                               */
/* -------------------------------------------------------------------------- */

export const useUpdateAdminStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<AdminStore>) => updateAdminStore(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STORE_QUERY_KEY,
      });
    },
  });
};

/* -------------------------------------------------------------------------- */
/* Upload Logo                                                                */
/* -------------------------------------------------------------------------- */

export const useUploadStoreLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadStoreLogo,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STORE_QUERY_KEY,
      });
    },
  });
};

/* -------------------------------------------------------------------------- */
/* Upload Invoice Signature                                                   */
/* -------------------------------------------------------------------------- */

export const useUploadInvoiceSignature = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadInvoiceSignature,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STORE_QUERY_KEY,
      });
    },
  });
};

/* -------------------------------------------------------------------------- */
/* Upload Invoice Stamp                                                       */
/* -------------------------------------------------------------------------- */

export const useUploadInvoiceStamp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadInvoiceStamp,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STORE_QUERY_KEY,
      });
    },
  });
};
/* -------------------------------------------------------------------------- */
/* Add Banner                                                                  */
/* -------------------------------------------------------------------------- */

export const useAddBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddBannerPayload) => addBanner(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STORE_QUERY_KEY,
      });
    },
  });
};

/* -------------------------------------------------------------------------- */
/* Update Banner                                                               */
/* -------------------------------------------------------------------------- */

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBannerPayload) => updateBanner(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STORE_QUERY_KEY,
      });
    },
  });
};

/* -------------------------------------------------------------------------- */
/* Delete Banner                                                               */
/* -------------------------------------------------------------------------- */

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bannerId: string) => deleteBanner(bannerId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: STORE_QUERY_KEY,
      });
    },
  });
};
