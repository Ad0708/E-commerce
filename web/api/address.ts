import api from "@/lib/axios/axios";
import { Address } from "@/types/address";

export interface AddressResponse {
  success: boolean;
  message: string;
  data: Address[];
}

export type CreateAddressPayload = Omit<Address, "_id" | "isDefault">;

export const getAddresses = async (): Promise<Address[]> => {
  const { data } = await api.get<AddressResponse>("/address");
  return data.data;
};

export const createAddress = async (
  payload: CreateAddressPayload
): Promise<Address[]> => {
  const { data } = await api.post<AddressResponse>("/address", payload);
  return data.data;
};

export const updateAddress = async ({
  addressId,
  payload,
}: {
  addressId: string;
  payload: CreateAddressPayload;
}): Promise<Address[]> => {
  const { data } = await api.put<AddressResponse>(
    `/address/${addressId}`,
    payload
  );

  return data.data;
};

export const deleteAddress = async (
  addressId: string
): Promise<Address[]> => {
  const { data } = await api.delete<AddressResponse>(
    `/address/${addressId}`
  );

  return data.data;
};

export const setDefaultAddress = async (
  addressId: string
): Promise<Address[]> => {
  const { data } = await api.patch<AddressResponse>(
    `/address/${addressId}/default`
  );

  return data.data;
};