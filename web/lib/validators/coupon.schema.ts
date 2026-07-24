import { z } from "zod";

// ─── Explicit form type ───────────────────────────────────────────────────────
// We declare this manually so React Hook Form always sees `products` and
// `categories` as `string[]` (never `undefined`), avoiding the Resolver
// generic mismatch that Zod v4's .default() inference causes.
export type CouponFormValues = {
  code: string;
  description?: string;
  type: "percentage" | "fixed";
  value: number;
  minimumOrderAmount?: number | null;
  maximumDiscount?: number | null;
  usageLimit?: number | null;
  appliesTo: "all" | "products" | "categories";
  products: string[];
  categories: string[];
  startDate: string;
  expiryDate: string;
  status: "active" | "inactive" | "scheduled";
};

// ─── Zod schema ───────────────────────────────────────────────────────────────
export const couponSchema: z.ZodType<CouponFormValues, CouponFormValues> = z
  .object({
    code: z
      .string()
      .min(3, "Code must be at least 3 characters")
      .max(20, "Code must be at most 20 characters")
      .regex(
        /^[A-Z0-9_-]+$/,
        "Code must be uppercase letters, numbers, _ or -",
      ),

    description: z
      .string()
      .max(300, "Description must be at most 300 characters")
      .optional(),

    type: z.enum(["percentage", "fixed"], {
      error: "Discount type is required",
    }),

    value: z
      .number({ error: "Discount value is required" })
      .positive("Value must be positive"),

    minimumOrderAmount: z
      .number({ error: "Enter a valid amount" })
      .min(0, "Cannot be negative")
      .optional()
      .nullable(),

    maximumDiscount: z
      .number({ error: "Enter a valid amount" })
      .positive("Must be positive")
      .optional()
      .nullable(),

    usageLimit: z
      .number({ error: "Enter a valid number" })
      .int("Must be a whole number")
      .positive("Must be positive")
      .optional()
      .nullable(),

    appliesTo: z.enum(["all", "products", "categories"], {
      error: "Applicability is required",
    }),

    // No .optional() — input type stays string[] so RHF resolver aligns
    products: z.array(z.string()),

    categories: z.array(z.string()),

    startDate: z.string().min(1, "Start date is required"),

    expiryDate: z.string().min(1, "Expiry date is required"),

    status: z.enum(["active", "inactive", "scheduled"], {
      error: "Status is required",
    }),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.expiryDate) return true;
      return new Date(data.expiryDate) > new Date(data.startDate);
    },
    {
      message: "Expiry date must be after start date",
      path: ["expiryDate"],
    },
  )
  .refine(
    (data) => {
      if (data.type === "percentage") {
        return data.value <= 100;
      }
      return true;
    },
    {
      message: "Percentage discount cannot exceed 100%",
      path: ["value"],
    },
  )
  .refine(
    (data) => {
      if (data.appliesTo === "products") {
        return data.products.length > 0;
      }
      return true;
    },
    {
      message: "Select at least one product",
      path: ["products"],
    },
  )
  .refine(
    (data) => {
      if (data.appliesTo === "categories") {
        return data.categories.length > 0;
      }
      return true;
    },
    {
      message: "Select at least one category",
      path: ["categories"],
    },
  );
