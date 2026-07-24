import { z } from "zod";

export const addressSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters"),

  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid phone number"),

  address1: z
    .string()
    .min(5, "Address is required"),

  address2: z.string().optional(),

  city: z
    .string()
    .min(2, "City is required"),

  state: z
    .string()
    .min(2, "State is required"),

  country: z
    .string()
    .min(2, "Country is required"),

  pincode: z
    .string()
    .regex(/^\d{6}$/, "Enter a valid pincode"),
});

export type AddressFormValues = z.infer<typeof addressSchema>;