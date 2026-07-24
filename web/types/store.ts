export interface StoreBasic {
  storeName: string;
  description: string;
  logo: string;
}

export interface StoreContact {
  email: string;
  phone: string;
  whatsapp: string;
}

export interface StoreAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface StoreBusiness {
  businessName: string;
  supportEmail: string;
  supportPhone: string;
}

export interface StoreTax {
  gstNumber: string;
  vatNumber: string;
  taxEnabled: boolean;
  taxRate: number;
}

export interface StoreShipping {
  enabled: boolean;
  defaultCharge: number;
  freeShipping: boolean;
  freeShippingAmount: number;
  estimatedDeliveryDays: number;
}

export interface StoreCurrency {
  currency: {
    code: string;
    symbol: string;
  };
  timezone: string;
}

export interface StoreSocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}

export interface StoreSEO {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
}

export interface StoreMaintenance {
  maintenance: {
    enabled: boolean;
    message: string;
  };
  acceptOrders: boolean;
}

export interface StoreReturns {
  returnDays: number;
  replacementDays: number;
}

export interface StoreBanner {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
  order: number;
}