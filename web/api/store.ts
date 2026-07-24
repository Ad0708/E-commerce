import api from "@/lib/axios/axios";

import type {
  StoreBasic,
  StoreContact,
  StoreAddress,
  StoreBusiness,
  StoreTax,
  StoreShipping,
  StoreCurrency,
  StoreSocialLinks,
  StoreSEO,
  StoreMaintenance,
  StoreReturns,
  StoreBanner,
} from "@/types/store";

/* -------------------------------------------------------------------------- */
/* Basic Store Information                                                    */
/* -------------------------------------------------------------------------- */

export const getStoreBasic = async (): Promise<StoreBasic> => {
  const { data } = await api.get("/store/basic");

  return data.store;
};

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export const getStoreContact = async (): Promise<StoreContact> => {
  const { data } = await api.get("/store/contact");

  return data.contact;
};

/* -------------------------------------------------------------------------- */
/* Address                                                                    */
/* -------------------------------------------------------------------------- */

export const getStoreAddress = async (): Promise<StoreAddress> => {
  const { data } = await api.get("/store/address");

  return data.address;
};

/* -------------------------------------------------------------------------- */
/* Business                                                                   */
/* -------------------------------------------------------------------------- */

export const getStoreBusiness = async (): Promise<StoreBusiness> => {
  const { data } = await api.get("/store/business");

  return data.business;
};

/* -------------------------------------------------------------------------- */
/* Tax                                                                        */
/* -------------------------------------------------------------------------- */

export const getStoreTax = async (): Promise<StoreTax> => {
  const { data } = await api.get("/store/tax");

  return data.tax;
};

/* -------------------------------------------------------------------------- */
/* Shipping                                                                   */
/* -------------------------------------------------------------------------- */

export const getStoreShipping = async (): Promise<StoreShipping> => {
  const { data } = await api.get("/store/shipping");

  return data.shipping;
};

/* -------------------------------------------------------------------------- */
/* Currency                                                                   */
/* -------------------------------------------------------------------------- */

export const getStoreCurrency = async (): Promise<StoreCurrency> => {
  const { data } = await api.get("/store/currency");

  return {
    currency: data.currency,
    timezone: data.timezone,
  };
};

/* -------------------------------------------------------------------------- */
/* Social Links                                                               */
/* -------------------------------------------------------------------------- */

export const getStoreSocialLinks = async (): Promise<StoreSocialLinks> => {
  const { data } = await api.get("/store/social-links");

  return data.socialLinks;
};

/* -------------------------------------------------------------------------- */
/* SEO                                                                        */
/* -------------------------------------------------------------------------- */

export const getStoreSeo = async (): Promise<StoreSEO> => {
  const { data } = await api.get("/store/seo");

  return data.seo;
};

/* -------------------------------------------------------------------------- */
/* Maintenance                                                                */
/* -------------------------------------------------------------------------- */

export const getStoreMaintenance = async (): Promise<StoreMaintenance> => {
  const { data } = await api.get("/store/maintenance");

  return {
    maintenance: data.maintenance,
    acceptOrders: data.acceptOrders,
  };
};

/* -------------------------------------------------------------------------- */
/* Returns                                                                    */
/* -------------------------------------------------------------------------- */

export const getStoreReturns = async (): Promise<StoreReturns> => {
  const { data } = await api.get("/store/returns");

  return data.returns;
};

/* -------------------------------------------------------------------------- */
/* Banners                                                                    */
/* -------------------------------------------------------------------------- */

export const getStoreBanners = async (): Promise<StoreBanner[]> => {
  const { data } = await api.get("/store/banners");

  return data.banners;
};
