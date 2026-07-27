import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAddress,
  deleteAddress,
  getAddresses,
  setDefaultAddress,
  updateAddress,
  CreateAddressPayload,
} from "@/api/address";

const ADDRESS_KEY = ["addresses"];

export function useAddresses() {
  return useQuery({
    queryKey: ADDRESS_KEY,
    queryFn: getAddresses,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_KEY,
      });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      addressId,
      payload,
    }: {
      addressId: string;
      payload: CreateAddressPayload;
    }) => updateAddress({ addressId, payload }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_KEY,
      });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_KEY,
      });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDefaultAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ADDRESS_KEY,
      });
    },
  });
}
