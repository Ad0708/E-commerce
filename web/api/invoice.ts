import api from "@/lib/axios/axios";

export const downloadInvoice = async (orderId: string): Promise<Blob> => {
  const { data } = await api.get(`/invoices/${orderId}`, {
    responseType: "blob",
  });

  return data;
};

export const downloadAdminInvoice = async (orderId: string): Promise<Blob> => {
  const { data } = await api.get(`/invoices/admin/${orderId}`, {
    responseType: "blob",
  });

  return data;
};
