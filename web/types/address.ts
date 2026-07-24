export interface Address {
  _id: string;
  fullName: string;
  phone: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
}