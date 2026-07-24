import api from "@/lib/axios/axios";

import type { AdminStore } from "@/types/adminStore";

/* -------------------------------------------------------------------------- */
/* Store Settings                                                             */
/* -------------------------------------------------------------------------- */

export const getAdminStore = async (): Promise<AdminStore> => {
  const { data } = await api.get("/admin/store");

  return data.store;
};

export const updateAdminStore = async (
  payload: Partial<AdminStore>,
): Promise<AdminStore> => {
  const { data } = await api.put("/admin/store", payload);

  return data.store;
};

/* -------------------------------------------------------------------------- */
/* Logo                                                                       */
/* -------------------------------------------------------------------------- */

export const uploadStoreLogo = async (file: File): Promise<string> => {
  const formData = new FormData();

  formData.append("logo", file);

  const { data } = await api.post("/admin/store/logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.logo;
};

/* -------------------------------------------------------------------------- */
/* Invoice Signature                                                          */
/* -------------------------------------------------------------------------- */

export const uploadInvoiceSignature = async (file: File): Promise<string> => {
  const formData = new FormData();

  formData.append("signature", file);

  const { data } = await api.post("/admin/store/invoice/signature", formData);

  return data.signature;
};

/* -------------------------------------------------------------------------- */
/* Invoice Stamp                                                              */
/* -------------------------------------------------------------------------- */

export const uploadInvoiceStamp = async (file: File): Promise<string> => {
  const formData = new FormData();

  formData.append("stamp", file);

  const { data } = await api.post("/admin/store/invoice/stamp", formData);

  return data.stamp;
};
/* -------------------------------------------------------------------------- */
/* Banner                                                                     */
/* -------------------------------------------------------------------------- */

export interface AddBannerPayload {
  image: File;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  active?: boolean;
  order?: number;
}

export interface UpdateBannerPayload {
  _id?: string;
  bannerId: string;
  image?: File;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  active?: boolean;
  order?: number;
}
export const addBanner = async (payload: AddBannerPayload) => {
  const formData = new FormData();

  formData.append("image", payload.image);

  if (payload.title) {
    formData.append("title", payload.title);
  }

  if (payload.subtitle) {
    formData.append("subtitle", payload.subtitle);
  }

  if (payload.buttonText) {
    formData.append("buttonText", payload.buttonText);
  }

  if (payload.buttonLink) {
    formData.append("buttonLink", payload.buttonLink);
  }

  formData.append("active", String(payload.active ?? true));
  formData.append("order", String(payload.order ?? 1));

  // console.log("FormData values:");

  // for (const [key, value] of formData.entries()) {
  //   console.log(key, value);
  // }

  const { data } = await api.post("/admin/store/banner", formData);

  return data.banners;
};

export const updateBanner = async ({
  bannerId,
  ...payload
}: UpdateBannerPayload) => {
  const formData = new FormData();

  if (payload.image) formData.append("image", payload.image);

  if (payload.title !== undefined) formData.append("title", payload.title);

  if (payload.subtitle !== undefined)
    formData.append("subtitle", payload.subtitle);

  if (payload.buttonText !== undefined)
    formData.append("buttonText", payload.buttonText);

  if (payload.buttonLink !== undefined)
    formData.append("buttonLink", payload.buttonLink);

  if (payload.active !== undefined)
    formData.append("active", String(payload.active));

  if (payload.order !== undefined)
    formData.append("order", String(payload.order));

  const { data } = await api.put(`/admin/store/banner/${bannerId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.banner;
};

export const deleteBanner = async (
  bannerId: string,
): Promise<AdminStore["banners"]> => {
  const { data } = await api.delete(`/admin/store/banner/${bannerId}`);

  return data.banners;
};
