"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getStoreBasic,
  getStoreContact,
  getStoreAddress,
  getStoreBusiness,
  getStoreTax,
  getStoreShipping,
  getStoreCurrency,
  getStoreSocialLinks,
  getStoreSeo,
  getStoreMaintenance,
  getStoreReturns,
  getStoreBanners,
} from "@/api/store";

/* -------------------------------------------------------------------------- */
/* Query Keys                                                                 */
/* -------------------------------------------------------------------------- */

export const STORE_QUERY_KEYS = {
  basic: ["store", "basic"],
  contact: ["store", "contact"],
  address: ["store", "address"],
  business: ["store", "business"],
  tax: ["store", "tax"],
  shipping: ["store", "shipping"],
  currency: ["store", "currency"],
  socialLinks: ["store", "social-links"],
  seo: ["store", "seo"],
  maintenance: ["store", "maintenance"],
  returns: ["store", "returns"],
  banners: ["store", "banners"],
} as const;

/* -------------------------------------------------------------------------- */
/* Basic Store Information                                                    */
/* -------------------------------------------------------------------------- */

export const useStoreBasic = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.basic,
    queryFn: getStoreBasic,
    staleTime: 5 * 60 * 1000,
  });
};

/* -------------------------------------------------------------------------- */
/* Contact                                                                    */
/* -------------------------------------------------------------------------- */

export const useStoreContact = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.contact,
    queryFn: getStoreContact,
    staleTime: 5 * 60 * 1000,
  });
};

/* -------------------------------------------------------------------------- */
/* Address                                                                    */
/* -------------------------------------------------------------------------- */

export const useStoreAddress = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.address,
    queryFn: getStoreAddress,
    staleTime: 5 * 60 * 1000,
  });
};

/* -------------------------------------------------------------------------- */
/* Business                                                                   */
/* -------------------------------------------------------------------------- */

export const useStoreBusiness = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.business,
    queryFn: getStoreBusiness,
    staleTime: 5 * 60 * 1000,
  });
};

/* -------------------------------------------------------------------------- */
/* Tax                                                                        */
/* -------------------------------------------------------------------------- */

export const useStoreTax = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.tax,
    queryFn: getStoreTax,
    staleTime: 5 * 60 * 1000,
  });
};

/* -------------------------------------------------------------------------- */
/* Shipping                                                                   */
/* -------------------------------------------------------------------------- */

export const useStoreShipping = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.shipping,
    queryFn: getStoreShipping,
    staleTime: 5 * 60 * 1000,
  });
};

/* -------------------------------------------------------------------------- */
/* Currency                                                                   */
/* -------------------------------------------------------------------------- */

export const useStoreCurrency = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.currency,
    queryFn: getStoreCurrency,
    staleTime: 5 * 60 * 1000,
  });
};

/* -------------------------------------------------------------------------- */
/* Social Links                                                               */
/* -------------------------------------------------------------------------- */

export const useStoreSocialLinks = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.socialLinks,
    queryFn: getStoreSocialLinks,
    staleTime: 5 * 60 * 1000,
  });
};

/* -------------------------------------------------------------------------- */
/* SEO                                                                        */
/* -------------------------------------------------------------------------- */

export const useStoreSeo = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.seo,
    queryFn: getStoreSeo,
    staleTime: 5 * 60 * 1000,
  });
};

/* -------------------------------------------------------------------------- */
/* Maintenance                                                                */
/* -------------------------------------------------------------------------- */

export const useStoreMaintenance = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.maintenance,
    queryFn: getStoreMaintenance,
  });
};

/* -------------------------------------------------------------------------- */
/* Returns                                                                    */
/* -------------------------------------------------------------------------- */

export const useStoreReturns = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.returns,
    queryFn: getStoreReturns,
    staleTime: 5 * 60 * 1000,
  });
};

/* -------------------------------------------------------------------------- */
/* Banners                                                                    */
/* -------------------------------------------------------------------------- */

export const useStoreBanners = () => {
  return useQuery({
    queryKey: STORE_QUERY_KEYS.banners,
    queryFn: getStoreBanners,
  });
};
