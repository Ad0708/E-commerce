export interface Banner {
  _id: string;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
  order: number;
}

export interface AddressStore {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface BusinessInfo {
  businessName: string;
  supportEmail: string;
  supportPhone: string;
}

export interface Currency {
  symbol: string;
  code: string;
}

export interface Contact {
  email: string;
  phone: string;
  whatsapp: string;
}

export interface Invoice {
  prefix: string;
  footer: string;
  signature: string;
  stamp: string;
}

export interface Maintenance {
  enabled: boolean;
  message: string;
}

export interface SEO {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImage: string;
}

export interface Return {
  returnDays: number;
  replacementDays: number;
}

export interface Shipping {
  enabled: boolean;
  defaultCharge: number;
  freeShipping: boolean;
  freeShippingAmount: number;
  estimatedDeliveryDays: number;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}

export interface Tax {
  gstNumber: string;
  vatNumber: string;
  taxEnabled: boolean;
  taxRate: number;
}

export interface AdminStore {
  acceptOrders: boolean;

  // Business Address
  address: AddressStore;

  // Banners
  banners: Banner[];

  // Business Information
  business: BusinessInfo;

  // Contact Information
  contact: Contact;

  // Currency
  currency: Currency;

  // Store Information
  description: string;

  // Invoice
  invoice: Invoice;

  // Logo
  logo: string;

  // Maintenance
  maintenance: Maintenance;

  // Return
  returns: Return;

  // SEO
  seo: SEO;

  // Shipping
  shipping: Shipping;

  // Social Links
  socialLinks: SocialLinks;

  storeName: string;

  // Tax
  tax: Tax;

  timezone: string;

  _id: string;
  _v: number;
}

export interface UpdateBannerPayload {
  bannerId: string;
  image?: File;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  active?: boolean;
  order?: number;
}
export interface BannerFormFields {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
  order: number;
}
