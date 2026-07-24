import { z } from "zod";

export const productSchema = z
  .object({
    name: z
      .string()
      .min(3, "Product name is required and should be at least 3 characters long"),
    category: z.string().min(1, "Category is required"),
    description: z
      .string()
      .min(
        10,
        "Description is required and should be at least 10 characters long"
      ),
    price: z.number().min(1, "Price is required"),
    stock: z.number().min(0),
    images: z
      .array(z.union([z.instanceof(File), z.string()]))
      .min(1, "Please upload at least one image"),
    brand: z.string().optional(),
    sku: z.string().optional(),
    discountPrice: z.number().optional(),
    featured: z.boolean(),
    status: z.enum(["active", "draft", "out_of_stock"]),
  })
  .superRefine((data, ctx) => {
    if (
      data.discountPrice !== undefined &&
      data.discountPrice > data.price
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["discountPrice"],
        message: "Discount price cannot be greater than the price",
      });
    }
  });

export type ProductFormValues = z.infer<typeof productSchema>;